import { NextResponse } from 'next/server'
import {
  verifyWebhook,
  netMerchandiseCents,
  earningChannel,
} from '@/src/lib/shopify/webhook'
import { clawbackPoints } from '@/src/services/loyalty'
import { hasLoyalty } from '@/src/lib/env'

export const dynamic = 'force-dynamic'

interface OrderCancelledPayload {
  id: number
  email?: string | null
  contact_email?: string | null
  customer?: { email?: string | null } | null
  current_subtotal_price?: string | null
  subtotal_price?: string | null
  total_discounts?: string | null
  source_name?: string | null
  tags?: string | null
}

export async function POST(req: Request) {
  const verified = await verifyWebhook<OrderCancelledPayload>(req)
  if (!verified) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  if (!hasLoyalty) return NextResponse.json({ ok: true, skipped: 'not_configured' })

  const order = verified.payload
  const email = order.email ?? order.contact_email ?? order.customer?.email ?? null
  if (!email) return NextResponse.json({ ok: true, skipped: 'no_email' })

  try {
    // Distinct key from the refunds handler so a cancellation that also refunds
    // doesn't reverse the same points twice.
    const result = await clawbackPoints({
      email,
      refundedMerchandiseCents: netMerchandiseCents(order),
      shopifyOrderId: String(order.id),
      idempotencyKey: `order_cancelled:${order.id}`,
      reason: 'order_refunded',
      channel: earningChannel(order),
      note: `Order ${order.id} cancelled`,
    })

    return NextResponse.json({ ok: true, reversed: result.reversed })
  } catch (err) {
    console.error('orders/cancelled handler failed:', err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
