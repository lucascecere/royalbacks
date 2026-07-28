-- Royal Backs loyalty program: accounts, sessions, and an append-only points ledger.
--
-- All access is server-side through the service-role key. RLS is enabled with no
-- policies as a backstop: if an anon/publishable key ever reaches a client, it reads
-- nothing rather than everything.

create extension if not exists citext;
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Accounts
-- ---------------------------------------------------------------------------

create table customers (
  id                    uuid primary key default gen_random_uuid(),
  email                 citext not null unique,
  password_hash         text not null,
  first_name            text,
  last_name             text,
  email_verified_at     timestamptz,
  -- Backfilled the first time we match this account to a Shopify customer.
  shopify_customer_id   text unique,
  marketing_opt_in      boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Opaque session tokens, stored hashed so a database leak can't be replayed as logins.
create table sessions (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references customers(id) on delete cascade,
  token_hash   text not null unique,
  expires_at   timestamptz not null,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  user_agent   text,
  ip           inet
);

create index sessions_customer_idx on sessions (customer_id);
create index sessions_expires_idx on sessions (expires_at);

-- Email verification and password reset. Same table, different purpose.
create table email_tokens (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  purpose     text not null check (purpose in ('verify', 'reset')),
  token_hash  text not null unique,
  expires_at  timestamptz not null,
  consumed_at timestamptz,
  created_at  timestamptz not null default now()
);

create index email_tokens_customer_idx on email_tokens (customer_id, purpose);

-- ---------------------------------------------------------------------------
-- Points
-- ---------------------------------------------------------------------------

-- Append-only. Balance is always SUM(delta) — never a stored counter, which drifts.
--
-- `email` is required but `customer_id` is nullable on purpose: an order placed as a
-- guest, or before someone signs up, still accrues against their email address and is
-- claimed when they create an account.
create table points_ledger (
  id               uuid primary key default gen_random_uuid(),
  customer_id      uuid references customers(id) on delete set null,
  email            citext not null,
  delta            integer not null,
  reason           text not null check (reason in (
                     'order_earned', 'order_refunded', 'redeemed',
                     'redemption_expired', 'manual_adjust', 'signup_bonus'
                   )),
  shopify_order_id text,
  redemption_id    uuid,
  -- Which rate the award used. A refund has to reverse at the same rate, or a
  -- wholesale order would claw back at the higher retail rate.
  channel          text not null default 'retail'
                     check (channel in ('retail', 'wholesale')),
  -- The guardrail against double-awarding. Shopify retries webhooks; orders/paid
  -- will fire more than once. A unique key makes duplicates impossible in the
  -- database rather than hoping application logic wins the race.
  idempotency_key  text not null unique,
  note             text,
  created_at       timestamptz not null default now()
);

create index points_ledger_customer_idx on points_ledger (customer_id);
create index points_ledger_email_idx on points_ledger (email);
create index points_ledger_order_idx on points_ledger (shopify_order_id);

create table redemptions (
  id                       uuid primary key default gen_random_uuid(),
  customer_id              uuid not null references customers(id) on delete cascade,
  points_spent             integer not null check (points_spent > 0),
  value_cents              integer not null check (value_cents > 0),
  discount_code            text not null unique,
  shopify_discount_node_id text,
  status                   text not null default 'issued'
                             check (status in ('issued', 'used', 'expired', 'revoked')),
  expires_at               timestamptz not null,
  used_on_order_id         text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index redemptions_customer_idx on redemptions (customer_id);
-- Drives the daily reclaim sweep.
create index redemptions_reclaim_idx on redemptions (status, expires_at);

alter table points_ledger
  add constraint points_ledger_redemption_fk
  foreign key (redemption_id) references redemptions(id) on delete set null;

-- ---------------------------------------------------------------------------
-- Newsletter
-- ---------------------------------------------------------------------------

-- Deliberately separate from `customers`. Putting subscribers in the accounts table
-- would mean an address that signed up for the newsletter could never afterwards
-- register — the unique email constraint would reject it.
create table newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         citext not null unique,
  source        text not null default 'footer',
  unsubscribed_at timestamptz,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Rate limiting
-- ---------------------------------------------------------------------------

create table auth_attempts (
  id         bigserial primary key,
  email      citext,
  ip         inet,
  kind       text not null check (kind in ('login', 'signup', 'reset')),
  successful boolean not null default false,
  created_at timestamptz not null default now()
);

create index auth_attempts_email_idx on auth_attempts (email, kind, created_at desc);
create index auth_attempts_ip_idx on auth_attempts (ip, kind, created_at desc);

-- ---------------------------------------------------------------------------
-- Balance
-- ---------------------------------------------------------------------------

create or replace function points_balance(p_customer_id uuid)
returns integer
language sql
stable
as $$
  select coalesce(sum(delta), 0)::integer
  from points_ledger
  where customer_id = p_customer_id;
$$;

-- Redeeming: verify affordability and debit in one atomic step.
--
-- Takes a transaction-scoped advisory lock on the customer so two concurrent
-- redemptions can't both read the same balance and both succeed. Returns the new
-- balance, or raises if the account can't cover the cost.
create or replace function redeem_points(
  p_customer_id     uuid,
  p_email           citext,
  p_points          integer,
  p_redemption_id   uuid,
  p_idempotency_key text
)
returns integer
language plpgsql
as $$
declare
  v_balance integer;
begin
  if p_points <= 0 then
    raise exception 'redeem_points: points must be positive';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_customer_id::text, 0));

  select coalesce(sum(delta), 0)::integer into v_balance
  from points_ledger
  where customer_id = p_customer_id;

  if v_balance < p_points then
    raise exception 'INSUFFICIENT_POINTS: balance %, needed %', v_balance, p_points
      using errcode = 'check_violation';
  end if;

  insert into points_ledger
    (customer_id, email, delta, reason, redemption_id, idempotency_key)
  values
    (p_customer_id, p_email, -p_points, 'redeemed', p_redemption_id, p_idempotency_key);

  return v_balance - p_points;
end;
$$;

-- Signing up claims any points already accrued against that email as a guest.
create or replace function claim_guest_points(p_customer_id uuid, p_email citext)
returns integer
language plpgsql
as $$
declare
  v_claimed integer;
begin
  update points_ledger
  set customer_id = p_customer_id
  where email = p_email and customer_id is null;

  get diagnostics v_claimed = row_count;
  return v_claimed;
end;
$$;

-- ---------------------------------------------------------------------------
-- Lock everything down. Server-side service-role access only.
-- ---------------------------------------------------------------------------

alter table customers               enable row level security;
alter table newsletter_subscribers  enable row level security;
alter table sessions       enable row level security;
alter table email_tokens   enable row level security;
alter table points_ledger  enable row level security;
alter table redemptions    enable row level security;
alter table auth_attempts  enable row level security;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema public from anon, authenticated;
