import 'server-only'

import { randomBytes } from 'crypto'
import { db, normalizeEmail } from '@/src/lib/db'
import { adminRequest, assertNoUserErrors } from '@/src/lib/shopify/admin'
import { ensureShopifyCustomerId } from '@/src/services/orders'
import {
  findTier,
  pointsForSpend,
  REDEMPTION_TTL_DAYS,
  type EarningChannel,
} from '@/src/lib/loyalty/config'

export interface LedgerEntry {
  id: string
  delta: number
  reason: string
  shopifyOrderId: string | null
  note: string | null
  createdAt: string
}

export interface Redemption {
  id: string
  discountCode: string
  pointsSpent: number
  valueCents: number
  status: 'issued' | 'used' | 'expired' | 'revoked'
  expiresAt: string
  createdAt: string
}

// ---------------------------------------------------------------------------
// Reading
// ---------------------------------------------------------------------------

export async function getBalance(customerId: string): Promise<number> {
  const { data, error } = await db().rpc('points_balance', { p_customer_id: customerId })
  if (error) throw new Error(`Failed to read balance: ${error.message}`)
  return data ?? 0
}

export async function getLedger(customerId: string, limit = 50): Promise<LedgerEntry[]> {
  const { data, error } = await db()
    .from('points_ledger')
    .select('id, delta, reason, shopify_order_id, note, created_at')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Failed to read ledger: ${error.message}`)

  return (data ?? []).map((r) => ({
    id: r.id,
    delta: r.delta,
    reason: r.reason,
    shopifyOrderId: r.shopify_order_id,
    note: r.note,
    createdAt: r.created_at,
  }))
}

export async function getActiveRedemptions(customerId: string): Promise<Redemption[]> {
  const { data, error } = await db()
    .from('redemptions')
    .select('id, discount_code, points_spent, value_cents, status, expires_at, created_at')
    .eq('customer_id', customerId)
    .eq('status', 'issued')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to read redemptions: ${error.message}`)

  return (data ?? []).map((r) => ({
    id: r.id,
    discountCode: r.discount_code,
    pointsSpent: r.points_spent,
    valueCents: r.value_cents,
    status: r.status,
    expiresAt: r.expires_at,
    createdAt: r.created_at,
  }))
}

// ---------------------------------------------------------------------------
// Earning
// ---------------------------------------------------------------------------

/**
 * Credit points for a paid order.
 *
 * `idempotencyKey` is enforced by a unique index, so a webhook Shopify delivers
 * twice writes exactly one row. A duplicate is a no-op, not an error — the
 * retry has done its job.
 */
export async function awardOrderPoints(params: {
  email: string
  netMerchandiseCents: number
  shopifyOrderId: string
  channel?: EarningChannel
  note?: string
}): Promise<{ awarded: number; duplicate: boolean; customerId: string | null }> {
  const email = normalizeEmail(params.email)
  const channel = params.channel ?? 'retail'
  const points = pointsForSpend(params.netMerchandiseCents, channel)

  if (points <= 0) return { awarded: 0, duplicate: false, customerId: null }

  // Nullable: guests and not-yet-registered buyers accrue against the email and
  // claim the points when they sign up.
  const { data: customer } = await db()
    .from('customers')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  const { error } = await db().from('points_ledger').insert({
    customer_id: customer?.id ?? null,
    email,
    delta: points,
    reason: 'order_earned',
    shopify_order_id: params.shopifyOrderId,
    channel,
    idempotency_key: `order_paid:${params.shopifyOrderId}`,
    note: params.note ?? null,
  })

  if (error) {
    if (error.code === '23505') {
      return { awarded: 0, duplicate: true, customerId: customer?.id ?? null }
    }
    throw new Error(`Failed to award points: ${error.message}`)
  }

  return { awarded: points, duplicate: false, customerId: customer?.id ?? null }
}

/**
 * Reverse points when money goes back to the customer.
 *
 * The delta is negative and may push a balance below zero. That's deliberate:
 * clamping at zero would let someone earn, redeem, then refund and keep the reward.
 */
export async function clawbackPoints(params: {
  email: string
  refundedMerchandiseCents: number
  shopifyOrderId: string
  idempotencyKey: string
  reason: 'order_refunded'
  channel?: EarningChannel
  note?: string
}): Promise<{ reversed: number; duplicate: boolean }> {
  const email = normalizeEmail(params.email)
  // Same rate the award used, or a wholesale refund reverses more than it gave.
  const raw = pointsForSpend(params.refundedMerchandiseCents, params.channel ?? 'retail')
  if (raw <= 0) return { reversed: 0, duplicate: false }

  // Backstop against rounding, partial refunds that overlap, and a cancellation
  // following a refund: the total clawed back for an order can never exceed what
  // that order awarded in the first place.
  const { data: history } = await db()
    .from('points_ledger')
    .select('delta, reason')
    .eq('shopify_order_id', params.shopifyOrderId)

  const awarded = (history ?? [])
    .filter((r) => r.reason === 'order_earned')
    .reduce((sum, r) => sum + r.delta, 0)
  const alreadyReversed = (history ?? [])
    .filter((r) => r.reason === 'order_refunded')
    .reduce((sum, r) => sum - r.delta, 0)

  const points = Math.max(0, Math.min(raw, awarded - alreadyReversed))
  if (points <= 0) return { reversed: 0, duplicate: false }

  const { data: customer } = await db()
    .from('customers')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  const { error } = await db().from('points_ledger').insert({
    customer_id: customer?.id ?? null,
    email,
    delta: -points,
    reason: params.reason,
    shopify_order_id: params.shopifyOrderId,
    idempotency_key: params.idempotencyKey,
    note: params.note ?? null,
  })

  if (error) {
    if (error.code === '23505') return { reversed: 0, duplicate: true }
    throw new Error(`Failed to claw back points: ${error.message}`)
  }

  return { reversed: points, duplicate: false }
}

/** Staff-initiated goodwill credit or correction. */
export async function manualAdjust(params: {
  customerId: string
  email: string
  delta: number
  note: string
}): Promise<void> {
  const { error } = await db().from('points_ledger').insert({
    customer_id: params.customerId,
    email: normalizeEmail(params.email),
    delta: params.delta,
    reason: 'manual_adjust',
    idempotency_key: `manual:${randomBytes(12).toString('hex')}`,
    note: params.note,
  })
  if (error) throw new Error(`Failed to adjust points: ${error.message}`)
}

// ---------------------------------------------------------------------------
// Redemption
// ---------------------------------------------------------------------------

const DISCOUNT_CREATE_MUTATION = /* GraphQL */ `
  mutation CreateLoyaltyDiscount($basicCodeDiscount: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
      codeDiscountNode { id }
      userErrors { field message }
    }
  }
`

const DISCOUNT_DEACTIVATE_MUTATION = /* GraphQL */ `
  mutation DeactivateLoyaltyDiscount($id: ID!) {
    discountCodeDeactivate(id: $id) {
      userErrors { field message }
    }
  }
`

function generateCode(): string {
  // Unambiguous alphabet — no O/0 or I/1, since people read these off a screen.
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = randomBytes(8)
  let suffix = ''
  for (const byte of bytes) suffix += alphabet[byte % alphabet.length]
  return `RB-${suffix}`
}

export class InsufficientPointsError extends Error {
  constructor() {
    super('Not enough points')
    this.name = 'InsufficientPointsError'
  }
}

/**
 * Spend points for a discount code.
 *
 * Order matters. The debit happens first, inside `redeem_points`, which takes an
 * advisory lock on the customer and re-reads the balance from the ledger — so two
 * simultaneous redemptions can't both pass an affordability check. Only then do we
 * mint the code in Shopify. If minting fails we refund the points immediately, which
 * is a strictly better failure than issuing a discount nobody paid for.
 */
export async function redeem(params: {
  customerId: string
  email: string
  firstName?: string | null
  lastName?: string | null
  points: number
}): Promise<Redemption> {
  const tier = findTier(params.points)
  if (!tier) throw new Error('Unknown redemption tier')

  const email = normalizeEmail(params.email)
  const shopifyCustomerGid = await ensureShopifyCustomerId(
    params.customerId,
    email,
    params.firstName,
    params.lastName
  )

  const code = generateCode()
  const expiresAt = new Date(Date.now() + REDEMPTION_TTL_DAYS * 24 * 60 * 60 * 1000)

  const { data: redemptionRow, error: insertError } = await db()
    .from('redemptions')
    .insert({
      customer_id: params.customerId,
      points_spent: tier.points,
      value_cents: tier.valueCents,
      discount_code: code,
      status: 'issued',
      expires_at: expiresAt.toISOString(),
    })
    .select('id')
    .single()

  if (insertError) throw new Error(`Failed to record redemption: ${insertError.message}`)

  // Debit atomically. Raises if the balance moved underneath us.
  const { error: debitError } = await db().rpc('redeem_points', {
    p_customer_id: params.customerId,
    p_email: email,
    p_points: tier.points,
    p_redemption_id: redemptionRow.id,
    p_idempotency_key: `redeem:${redemptionRow.id}`,
  })

  if (debitError) {
    await db().from('redemptions').delete().eq('id', redemptionRow.id)
    if (debitError.message.includes('INSUFFICIENT_POINTS')) {
      throw new InsufficientPointsError()
    }
    throw new Error(`Failed to debit points: ${debitError.message}`)
  }

  try {
    const result = await adminRequest<{
      discountCodeBasicCreate: {
        codeDiscountNode: { id: string } | null
        userErrors: Array<{ field?: string[] | null; message: string }>
      }
    }>(DISCOUNT_CREATE_MUTATION, {
      basicCodeDiscount: {
        title: `Loyalty reward — ${code}`,
        code,
        startsAt: new Date().toISOString(),
        endsAt: expiresAt.toISOString(),
        // Restricting to this customer is what stops the code being passed around.
        // It only resolves if the cart carries a matching buyerIdentity email.
        customerSelection: { customers: { add: [shopifyCustomerGid] } },
        customerGets: {
          value: {
            discountAmount: {
              amount: (tier.valueCents / 100).toFixed(2),
              appliesOnEachItem: false,
            },
          },
          items: { all: true },
        },
        appliesOncePerCustomer: true,
        usageLimit: 1,
      },
    })

    assertNoUserErrors(
      result.discountCodeBasicCreate.userErrors,
      'discountCodeBasicCreate'
    )

    const nodeId = result.discountCodeBasicCreate.codeDiscountNode?.id ?? null
    await db()
      .from('redemptions')
      .update({ shopify_discount_node_id: nodeId, updated_at: new Date().toISOString() })
      .eq('id', redemptionRow.id)

    return {
      id: redemptionRow.id,
      discountCode: code,
      pointsSpent: tier.points,
      valueCents: tier.valueCents,
      status: 'issued',
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    }
  } catch (err) {
    // Minting failed after the debit. Give the points straight back rather than
    // leaving the customer short with nothing to show for it.
    await refundRedemption(redemptionRow.id, params.customerId, email, tier.points, 'revoked')
    throw err
  }
}

/** Return points and close out a redemption. Used by both the failure path and the cron. */
export async function refundRedemption(
  redemptionId: string,
  customerId: string,
  email: string,
  points: number,
  status: 'expired' | 'revoked'
): Promise<void> {
  const { error } = await db().from('points_ledger').insert({
    customer_id: customerId,
    email: normalizeEmail(email),
    delta: points,
    reason: 'redemption_expired',
    redemption_id: redemptionId,
    // Unique per redemption, so a retried sweep can't credit the points twice.
    idempotency_key: `redemption_returned:${redemptionId}`,
    note: status === 'expired' ? 'Reward expired unused' : 'Reward could not be issued',
  })

  // A duplicate means an earlier attempt already returned them.
  if (error && error.code !== '23505') {
    throw new Error(`Failed to return points: ${error.message}`)
  }

  await db()
    .from('redemptions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', redemptionId)
}

export async function deactivateDiscount(nodeId: string): Promise<void> {
  try {
    const result = await adminRequest<{
      discountCodeDeactivate: {
        userErrors: Array<{ field?: string[] | null; message: string }>
      }
    }>(DISCOUNT_DEACTIVATE_MUTATION, { id: nodeId })
    assertNoUserErrors(result.discountCodeDeactivate.userErrors, 'discountCodeDeactivate')
  } catch (err) {
    // Already expired in Shopify is fine — the points are what matter here.
    console.error(`Could not deactivate discount ${nodeId}:`, err)
  }
}

/** Marks a redemption consumed once its code shows up on a paid order. */
export async function markRedemptionUsed(
  code: string,
  orderId: string
): Promise<void> {
  await db()
    .from('redemptions')
    .update({
      status: 'used',
      used_on_order_id: orderId,
      updated_at: new Date().toISOString(),
    })
    .eq('discount_code', code)
    .eq('status', 'issued')
}
