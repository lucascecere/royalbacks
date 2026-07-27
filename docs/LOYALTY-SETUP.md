# Loyalty Program — Setup

The code is built and deployed. Nothing is live until the four accounts below exist and
their env vars are set — until then `/account` renders an honest "coming soon" page and
the webhooks reject everything. The rest of the site is unaffected.

## Mechanics

- Earn **1 point per $1** of merchandise spend (tax and shipping excluded).
- Redeem **500 pts → $10**, **1000 pts → $25**, **2000 pts → $60**.
- Rewards expire after **30 days**; unused points come back automatically.
- Retail and embroidery both earn, as long as embroidery is invoiced through Shopify.

Tune any of this in `src/lib/loyalty/config.ts`. Rates are read at runtime, so changing
them never rewrites ledger history.

---

## 1. Supabase

Create a project, then run `supabase/migrations/0001_loyalty.sql` in the SQL editor.

From Settings → API, copy:
- Project URL → `SUPABASE_URL`
- **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

The service role bypasses RLS. It is only ever read in server code guarded by
`import 'server-only'` — never expose it to the browser or prefix it with `NEXT_PUBLIC_`.

## 2. Shopify custom app

Settings → Apps and sales channels → Develop apps → Create an app.

**Admin API scopes:**
`read_orders`, `read_all_orders`, `write_discounts`, `read_customers`,
`write_customers`, `write_draft_orders`

> `read_all_orders` must be requested explicitly. Without it the Admin API only returns
> the **last 60 days** of orders — order history looks fine in testing and then quietly
> truncates for anyone who's been a customer longer than that.

Install the app, then copy:
- Admin API access token → `SHOPIFY_ADMIN_ACCESS_TOKEN`

**Webhooks** (Settings → Notifications → Webhooks), all JSON:

| Topic | URL |
|---|---|
| Order payment | `https://royalbacks.com/api/shopify/webhooks/orders-paid` |
| Refund create | `https://royalbacks.com/api/shopify/webhooks/refunds-create` |
| Order cancellation | `https://royalbacks.com/api/shopify/webhooks/orders-cancelled` |

Copy the webhook signing secret → `SHOPIFY_WEBHOOK_SECRET`. Requests without a valid
signature are rejected with a 401.

## 3. Resend

Verify **royalbacks.com** as a sending domain (DKIM + SPF records). Until that's done
every email fails — including the existing quote form, which sends from
`quotes@royalbacks.com` today.

Loyalty mail sends from `hello@royalbacks.com`.

## 4. Env vars

Set in Vercel for Production **and** Preview:

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SHOPIFY_ADMIN_ACCESS_TOKEN=
SHOPIFY_WEBHOOK_SECRET=
SESSION_SECRET=          # openssl rand -base64 48   (min 32 chars)
CRON_SECRET=             # openssl rand -base64 32
```

`SHOPIFY_ADMIN_API_VERSION` defaults to `2026-01`; override only if you pin a different one.

> Adding env vars through a piped shell command has silently stored empty values before.
> Paste them in the dashboard, then confirm each one reads back correctly.

The daily reclaim cron is declared in `vercel.json` and runs at 09:00 UTC. Vercel sends
`CRON_SECRET` as a bearer token automatically.

---

## Embroidery

Dylan invoices embroidery jobs as Shopify **draft orders** with the customer's email
attached. When the invoice is paid it becomes a normal order, `orders/paid` fires, and
points are awarded through exactly the same path as a retail sale — no separate code,
no manual entry.

> At 1pt/$1 a $3,000 embroidery job earns 3,000 points ≈ $60–90 in rewards. Confirm with
> Dylan whether that's the rate he wants for B2B before launch, or set a lower rate or a
> per-order cap in `config.ts`.

---

## Verifying it works

Use a Shopify **development store** first. Webhooks need a public URL — `vercel dev`
against a preview deployment, or ngrok.

1. **Auth** — sign up, confirm the email arrives, click through, sign in. Before
   confirming, check that order history is hidden. Reset a password and confirm every
   other session is signed out.
2. **Earning** — place a test order. Confirm exactly one `points_ledger` row, and that
   the points match the subtotal, not the total-with-tax.
3. **Idempotency (the important one)** — replay the same `orders/paid` payload from the
   Shopify webhook log. Confirm **no second row** appears.
4. **Refund** — refund part of the order, confirm a proportional negative delta.
5. **Redemption** — redeem, confirm the debit, confirm the code exists in Shopify
   restricted to that customer with usage limit 1, and confirm it auto-applies to the
   cart and survives into checkout.
6. **Concurrency** — fire two redemptions at once against a balance that only covers one.
   Exactly one must succeed.
7. **Reclaim** — backdate a redemption's `expires_at`, hit the cron with the bearer
   token, confirm the points return and the Shopify code deactivates.

## Where things live

| | |
|---|---|
| Mechanics / rates | `src/lib/loyalty/config.ts` |
| Points logic | `src/services/loyalty.ts` |
| Auth | `src/lib/auth/`, `src/services/account.ts` |
| Admin API | `src/lib/shopify/admin.ts` (server-only) |
| Webhooks | `app/api/shopify/webhooks/*` |
| Reclaim cron | `app/api/cron/reclaim-redemptions/route.ts` |
| Account UI | `app/(b2c)/account/*` |
| Schema | `supabase/migrations/0001_loyalty.sql` |

## Design notes

**The ledger is append-only.** A balance is always `SUM(delta)` — there is no stored
counter to drift out of sync. `idempotency_key` is UNIQUE, which is what makes duplicate
webhooks harmless at the database level rather than depending on application logic
winning a race.

**Points accrue to an email, not just an account.** Guests and people who order before
signing up still bank points; `claim_guest_points` attaches them at signup.

**Balances may go negative.** A refund reverses the full award even if the points are
already spent. Clamping at zero would make "buy, redeem, refund" a free-money loop.

**Redemption debits before minting.** `redeem_points` takes an advisory lock and re-reads
the balance, so two concurrent redemptions can't both pass the affordability check. If
minting the Shopify discount then fails, the points are returned immediately.

**Order history requires a verified email.** It resolves by address, so an unconfirmed
account would otherwise be a way to read a stranger's purchase history.
