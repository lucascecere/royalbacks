import 'server-only'

import { createHmac, timingSafeEqual } from 'crypto'
import { env, hasWebhookSecret } from '@/src/lib/env'

export interface VerifiedWebhook<T> {
  topic: string | null
  payload: T
}

/**
 * Verify and parse a Shopify webhook.
 *
 * The signature covers the exact bytes Shopify sent, so the raw body must be read
 * and verified *before* anything parses it — `await req.json()` first and the
 * signature can no longer be checked against what actually arrived.
 */
export async function verifyWebhook<T>(
  req: Request
): Promise<VerifiedWebhook<T> | null> {
  if (!hasWebhookSecret) {
    console.error('Webhook rejected: SHOPIFY_WEBHOOK_SECRET is not configured')
    return null
  }

  const signature = req.headers.get('x-shopify-hmac-sha256')
  if (!signature) return null

  const raw = await req.text()

  const expected = createHmac('sha256', env.SHOPIFY_WEBHOOK_SECRET)
    .update(raw, 'utf8')
    .digest('base64')

  const a = Buffer.from(signature, 'utf8')
  const b = Buffer.from(expected, 'utf8')
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  try {
    return {
      topic: req.headers.get('x-shopify-topic'),
      payload: JSON.parse(raw) as T,
    }
  } catch {
    return null
  }
}

/** Dollar-string to integer cents without float drift. */
export function toCents(amount: string | number | null | undefined): number {
  if (amount === null || amount === undefined) return 0
  return Math.round(Number(amount) * 100)
}

interface Orderish {
  current_subtotal_price?: string | null
  subtotal_price?: string | null
  total_discounts?: string | null
}

/**
 * The amount points are earned on: merchandise only, after discounts, before tax
 * and shipping.
 *
 * Tax is remitted to the state and shipping is paid to a carrier — neither is
 * revenue Royal Backs keeps, so neither should generate rewards. Prefers
 * `current_subtotal_price`, which already reflects any post-purchase edits.
 */
export function netMerchandiseCents(order: Orderish): number {
  if (order.current_subtotal_price != null) {
    return toCents(order.current_subtotal_price)
  }
  const subtotal = toCents(order.subtotal_price)
  const discounts = toCents(order.total_discounts)
  return Math.max(0, subtotal - discounts)
}
