import { NextResponse } from 'next/server'
import { verifyWebhook, toCents } from '@/src/lib/shopify/webhook'
import { clawbackPoints } from '@/src/services/loyalty'
import { hasLoyalty } from '@/src/lib/env'

export const dynamic = 'force-dynamic'

interface RefundPayload {
  id: number
  order_id: number
  refund_line_items?: Array<{
    subtotal?: string | number | null
    subtotal_set?: { shop_money?: { amount?: string } }
  }>
  order_adjustments?: Array<{
    amount?: string | number | null
    kind?: string
  }>
}

/**
 * Only merchandise value is reversed — the same base points were earned on.
 * Refunded shipping and tax never generated points, so clawing them back would
 * take away more than was given.
 */
function refundedMerchandiseCents(refund: RefundPayload): number {
  let cents = 0

  for (const line of refund.refund_line_items ?? []) {
    const amount = line.subtotal_set?.shop_money?.amount ?? line.subtotal
    cents += toCents(amount as string | number | null)
  }

  // Discretionary refunds beyond the line items, e.g. a goodwill credit.
  for (const adj of refund.order_adjustments ?? []) {
    if (adj.kind === 'refund_discrepancy') {
      cents += Math.abs(toCents(adj.amount as string | number | null))
    }
  }

  return cents
}

export async function POST(req: Request) {
  const verified = await verifyWebhook<RefundPayload>(req)
  if (!verified) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  if (!hasLoyalty) return NextResponse.json({ ok: true, skipped: 'not_configured' })

  const refund = verified.payload

  try {
    const { db } = await import('@/src/lib/db')

    // The refund payload carries no email; find it on the original order's ledger row.
    const { data: original } = await db()
      .from('points_ledger')
      .select('email')
      .eq('shopify_order_id', String(refund.order_id))
      .eq('reason', 'order_earned')
      .maybeSingle()

    if (!original) {
      // Nothing was ever awarded for this order — nothing to reverse.
      return NextResponse.json({ ok: true, skipped: 'no_original_award' })
    }

    const result = await clawbackPoints({
      email: original.email,
      refundedMerchandiseCents: refundedMerchandiseCents(refund),
      shopifyOrderId: String(refund.order_id),
      // Keyed on the refund, not the order: partial refunds are separate events
      // and each should reverse its own share.
      idempotencyKey: `refund:${refund.id}`,
      reason: 'order_refunded',
      note: `Refund on order ${refund.order_id}`,
    })

    return NextResponse.json({ ok: true, reversed: result.reversed })
  } catch (err) {
    console.error('refunds/create handler failed:', err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
