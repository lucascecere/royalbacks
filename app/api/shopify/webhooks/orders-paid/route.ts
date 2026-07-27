import { NextResponse } from 'next/server'
import { verifyWebhook, netMerchandiseCents } from '@/src/lib/shopify/webhook'
import { awardOrderPoints, markRedemptionUsed, getBalance } from '@/src/services/loyalty'
import { sendPointsEarnedEmail } from '@/src/services/loyalty-email'
import { db } from '@/src/lib/db'
import { hasLoyalty } from '@/src/lib/env'

export const dynamic = 'force-dynamic'

interface OrderPaidPayload {
  id: number
  email?: string | null
  contact_email?: string | null
  customer?: { email?: string | null } | null
  current_subtotal_price?: string | null
  subtotal_price?: string | null
  total_discounts?: string | null
  discount_codes?: Array<{ code: string }>
  order_number?: number
}

export async function POST(req: Request) {
  const verified = await verifyWebhook<OrderPaidPayload>(req)
  if (!verified) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // Signature is good, so acknowledge even if we can't process — Shopify retries on
  // any non-2xx, and a retry loop won't fix a missing config or an order with no email.
  if (!hasLoyalty) return NextResponse.json({ ok: true, skipped: 'not_configured' })

  const order = verified.payload
  const email = order.email ?? order.contact_email ?? order.customer?.email ?? null

  if (!email) {
    return NextResponse.json({ ok: true, skipped: 'no_email' })
  }

  try {
    const result = await awardOrderPoints({
      email,
      netMerchandiseCents: netMerchandiseCents(order),
      shopifyOrderId: String(order.id),
      note: order.order_number ? `Order #${order.order_number}` : undefined,
    })

    // Close out any loyalty code this order consumed.
    for (const { code } of order.discount_codes ?? []) {
      if (code.startsWith('RB-')) {
        await markRedemptionUsed(code, String(order.id))
      }
    }

    if (result.duplicate) {
      return NextResponse.json({ ok: true, duplicate: true })
    }

    // Best-effort notification. A bounced email must not fail the webhook and
    // trigger a retry that re-runs everything above.
    if (result.customerId && result.awarded > 0) {
      try {
        const { data: customer } = await db()
          .from('customers')
          .select('email, marketing_opt_in, email_verified_at')
          .eq('id', result.customerId)
          .maybeSingle()

        if (customer?.marketing_opt_in && customer.email_verified_at) {
          const balance = await getBalance(result.customerId)
          await sendPointsEarnedEmail(customer.email, result.awarded, balance)
        }
      } catch (err) {
        console.error('orders/paid: points email failed', err)
      }
    }

    return NextResponse.json({ ok: true, awarded: result.awarded })
  } catch (err) {
    console.error('orders/paid handler failed:', err)
    // Genuine failure — let Shopify retry.
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
