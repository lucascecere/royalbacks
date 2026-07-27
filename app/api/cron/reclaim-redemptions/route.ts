import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { db } from '@/src/lib/db'
import { env, hasLoyalty } from '@/src/lib/env'
import { refundRedemption, deactivateDiscount } from '@/src/services/loyalty'
import { sendRedemptionExpiringEmail } from '@/src/services/loyalty-email'
import { REDEMPTION_EXPIRY_WARNING_DAYS } from '@/src/lib/loyalty/config'

export const dynamic = 'force-dynamic'

function authorized(req: Request): boolean {
  if (!env.CRON_SECRET) return false
  const header = req.headers.get('authorization') ?? ''
  const expected = `Bearer ${env.CRON_SECRET}`
  const a = Buffer.from(header)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

/**
 * Daily sweep.
 *
 * 1. Return points from rewards that expired unused.
 * 2. Warn about rewards expiring soon.
 *
 * Step 1 is what keeps the program trustworthy: a customer who redeems and then
 * abandons their cart would otherwise be permanently out the points with nothing
 * to show for it.
 */
export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!hasLoyalty) return NextResponse.json({ ok: true, skipped: 'not_configured' })

  const now = new Date()
  let reclaimed = 0
  let warned = 0
  const failures: string[] = []

  const { data: expired, error } = await db()
    .from('redemptions')
    .select('id, customer_id, points_spent, shopify_discount_node_id, customers ( email )')
    .eq('status', 'issued')
    .lt('expires_at', now.toISOString())
    .limit(200)

  if (error) {
    console.error('reclaim: failed to list expired redemptions', error)
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  for (const row of expired ?? []) {
    const customer = Array.isArray(row.customers) ? row.customers[0] : row.customers
    if (!customer?.email) continue
    try {
      await refundRedemption(
        row.id,
        row.customer_id,
        customer.email,
        row.points_spent,
        'expired'
      )
      if (row.shopify_discount_node_id) {
        await deactivateDiscount(row.shopify_discount_node_id)
      }
      reclaimed++
    } catch (err) {
      // Keep going — one bad row shouldn't strand every other customer's points.
      console.error(`reclaim: redemption ${row.id} failed`, err)
      failures.push(row.id)
    }
  }

  // Expiring soon.
  const warnBefore = new Date(
    now.getTime() + REDEMPTION_EXPIRY_WARNING_DAYS * 24 * 60 * 60 * 1000
  )
  const { data: expiring } = await db()
    .from('redemptions')
    .select('id, discount_code, value_cents, expires_at, customers ( email, marketing_opt_in, email_verified_at )')
    .eq('status', 'issued')
    .gt('expires_at', now.toISOString())
    .lt('expires_at', warnBefore.toISOString())
    .limit(200)

  for (const row of expiring ?? []) {
    const customer = Array.isArray(row.customers) ? row.customers[0] : row.customers
    if (!customer?.email || !customer.marketing_opt_in || !customer.email_verified_at) {
      continue
    }
    const daysLeft = Math.max(
      1,
      Math.ceil((new Date(row.expires_at).getTime() - now.getTime()) / 86_400_000)
    )
    try {
      await sendRedemptionExpiringEmail(
        customer.email,
        row.discount_code,
        row.value_cents,
        daysLeft
      )
      warned++
    } catch (err) {
      console.error(`reclaim: expiry warning for ${row.id} failed`, err)
    }
  }

  // Housekeeping: expired sessions and consumed tokens.
  await db().from('sessions').delete().lt('expires_at', now.toISOString())
  await db().from('email_tokens').delete().lt('expires_at', now.toISOString())

  return NextResponse.json({ ok: true, reclaimed, warned, failures })
}
