import Link from 'next/link'
import { redirect } from 'next/navigation'
import { hasLoyalty, hasShopifyAdmin } from '@/src/lib/env'
import { getSessionCustomer } from '@/src/lib/auth/session'
import { getBalance, getLedger, getActiveRedemptions } from '@/src/services/loyalty'
import { getOrdersForEmail, type CustomerOrder } from '@/src/services/orders'
import { logoutAction } from '@/src/actions/account'
import { RedeemPanel } from '@/src/components/account/redeem-panel'
import { ResendVerification } from '@/src/components/account/resend-verification'
import { AccountUnavailable } from '@/src/components/account/unavailable'
import { formatCents, formatPoints } from '@/src/lib/loyalty/config'

export const dynamic = 'force-dynamic'

const REASON_LABELS: Record<string, string> = {
  order_earned: 'Order',
  order_refunded: 'Refund',
  redeemed: 'Reward redeemed',
  redemption_expired: 'Reward returned',
  manual_adjust: 'Adjustment',
  signup_bonus: 'Welcome bonus',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function AccountPage() {
  if (!hasLoyalty) return <AccountUnavailable />

  const customer = await getSessionCustomer()
  if (!customer) redirect('/account/login')

  const [balance, ledger, redemptions] = await Promise.all([
    getBalance(customer.id),
    getLedger(customer.id, 20),
    getActiveRedemptions(customer.id),
  ])

  // Order history is gated on a verified email — it resolves by address, so an
  // unconfirmed account must never see it.
  let orders: CustomerOrder[] = []
  let ordersFailed = false
  if (customer.emailVerified && hasShopifyAdmin) {
    try {
      orders = await getOrdersForEmail(customer.email, 10)
    } catch (err) {
      console.error('Could not load order history:', err)
      ordersFailed = true
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
      <header className="flex flex-wrap items-start justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-rb-black">
            {customer.firstName ? `Hey, ${customer.firstName}` : 'Your Account'}
          </h1>
          <p className="text-rb-muted text-sm mt-1">{customer.email}</p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-rb-muted hover:text-rb-black underline">
            Sign out
          </button>
        </form>
      </header>

      {!customer.emailVerified && (
        <div className="border border-rb-gold/40 bg-rb-gold/10 rounded-[10px] px-5 py-4 mb-8">
          <p className="text-sm font-semibold text-rb-black mb-1">Confirm your email</p>
          <p className="text-sm text-rb-ink mb-3">
            You&apos;ll keep earning points on every order, but you need a confirmed email
            before you can see order history or spend them.
          </p>
          <ResendVerification />
        </div>
      )}

      <RedeemPanel balance={balance} canRedeem={customer.emailVerified && hasShopifyAdmin} />

      {redemptions.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-rb-black mb-4">
            Ready to Use
          </h2>
          <ul className="space-y-3">
            {redemptions.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 border border-rb-border rounded-[10px] px-5 py-4"
              >
                <div>
                  <p className="font-display text-lg font-bold text-rb-black">
                    {formatCents(r.valueCents)} off
                  </p>
                  <p className="text-xs text-rb-muted mt-0.5">
                    Code {r.discountCode} · expires {formatDate(r.expiresAt)}
                  </p>
                </div>
                <Link
                  href="/cart"
                  className="text-sm font-semibold text-rb-green hover:text-rb-green-dark underline"
                >
                  Go to cart
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-rb-black mb-4">Recent Orders</h2>
        {!customer.emailVerified ? (
          <p className="text-sm text-rb-muted">
            Confirm your email to see your order history.
          </p>
        ) : ordersFailed ? (
          <p className="text-sm text-rb-muted">
            We couldn&apos;t load your orders just now. Try again shortly.
          </p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-rb-muted">
            No orders yet.{' '}
            <Link href="/collections" className="underline hover:text-rb-black">
              Start shopping
            </Link>
            .
          </p>
        ) : (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="border border-rb-border rounded-[10px] px-5 py-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-rb-black">{order.name}</p>
                  <p className="text-sm text-rb-ink">
                    ${order.total} {order.currency}
                  </p>
                </div>
                <p className="text-xs text-rb-muted mt-1">
                  {formatDate(order.processedAt)}
                  {order.fulfillmentStatus && ` · ${order.fulfillmentStatus.toLowerCase()}`}
                </p>
                <p className="text-sm text-rb-muted mt-2">
                  {order.lines
                    .map((l) => `${l.quantity}× ${l.title}`)
                    .slice(0, 3)
                    .join(', ')}
                  {order.lines.length > 3 && ` +${order.lines.length - 3} more`}
                </p>
                {order.statusUrl && (
                  <a
                    href={order.statusUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-rb-green hover:text-rb-green-dark underline mt-2 inline-block"
                  >
                    Track order
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-rb-black mb-4">
          Points History
        </h2>
        {ledger.length === 0 ? (
          <p className="text-sm text-rb-muted">
            Nothing yet. Points show up here after your first order.
          </p>
        ) : (
          <ul className="divide-y divide-rb-border border-y border-rb-border">
            {ledger.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-rb-black">
                    {REASON_LABELS[entry.reason] ?? entry.reason}
                  </p>
                  <p className="text-xs text-rb-muted mt-0.5">
                    {formatDate(entry.createdAt)}
                    {entry.note && ` · ${entry.note}`}
                  </p>
                </div>
                <p
                  className={`font-semibold text-sm ${
                    entry.delta >= 0 ? 'text-rb-green' : 'text-rb-muted'
                  }`}
                >
                  {entry.delta >= 0 ? '+' : ''}
                  {formatPoints(entry.delta)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
