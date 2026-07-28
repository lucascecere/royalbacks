/**
 * Program mechanics in one place so rates can be tuned without a migration.
 * The ledger stores raw point deltas, so changing these never rewrites history.
 */

/**
 * Earning rates, per whole dollar of net merchandise spend.
 *
 * Retail and wholesale are deliberately separate. Rewards come out of gross margin,
 * not revenue, and the two sides of this business have very different margins — a $35
 * hat and a $3,000 embroidery contract cannot safely pay the same percentage back.
 */
export const POINTS_PER_DOLLAR = 1

/**
 * Embroidery / draft-order rate.
 *
 * Deliberately below retail and capped per order. If Dylan nets ~$200 on a $3,000 job,
 * retail's 2% back would be $60 — nearly a third of the profit — and the cap is what
 * stops one large contract from erasing the margin on it.
 *
 * REVISIT once Dylan confirms his actual gross margin on a large job. If it's healthy
 * (40%+, which the published per-piece pricing suggests) this can go up to or past the
 * retail rate, which is the generous-to-repeat-buyers outcome we actually want.
 */
export const POINTS_PER_DOLLAR_WHOLESALE = 0.5

/** Ceiling on a single wholesale order, ≈$20 of reward value at the entry tier. */
export const WHOLESALE_POINTS_CAP_PER_ORDER = 1000

export type EarningChannel = 'retail' | 'wholesale'

/**
 * Redemption ladder. `points` buys `valueCents` off an order.
 * At 500pts = $10 on 1pt/$1 spend, that's 2% back.
 */
export const REDEMPTION_TIERS = [
  { points: 500, valueCents: 1000 },
  { points: 1000, valueCents: 2500 },
  { points: 2000, valueCents: 6000 },
] as const

export type RedemptionTier = (typeof REDEMPTION_TIERS)[number]

/** How long a minted discount code stays valid before the reclaim sweep returns the points. */
export const REDEMPTION_TTL_DAYS = 30

/** Warn the customer this many days before an issued code expires. */
export const REDEMPTION_EXPIRY_WARNING_DAYS = 3

export const SESSION_TTL_DAYS = 60
export const VERIFY_TOKEN_TTL_HOURS = 48
export const RESET_TOKEN_TTL_HOURS = 1

/** Rate limits, per window, keyed on both email and IP. */
export const RATE_LIMITS = {
  login: { max: 8, windowMinutes: 15 },
  signup: { max: 5, windowMinutes: 60 },
  reset: { max: 5, windowMinutes: 60 },
} as const

export function findTier(points: number): RedemptionTier | undefined {
  return REDEMPTION_TIERS.find((t) => t.points === points)
}

/**
 * Points for an order.
 *
 * Takes net merchandise cents — tax and shipping excluded upstream, since neither is
 * revenue Royal Backs keeps. Rounds down so we never award points that weren't earned.
 *
 * Wholesale earns at its own rate and is capped per order, so a single large embroidery
 * contract can't hand back more than the job made.
 */
export function pointsForSpend(
  netMerchandiseCents: number,
  channel: EarningChannel = 'retail'
): number {
  if (netMerchandiseCents <= 0) return 0

  const rate =
    channel === 'wholesale' ? POINTS_PER_DOLLAR_WHOLESALE : POINTS_PER_DOLLAR
  const earned = Math.floor((netMerchandiseCents / 100) * rate)

  return channel === 'wholesale'
    ? Math.min(earned, WHOLESALE_POINTS_CAP_PER_ORDER)
    : earned
}

/** The best tier a balance can afford, or undefined if it can't afford any. */
export function bestAffordableTier(balance: number): RedemptionTier | undefined {
  return [...REDEMPTION_TIERS].reverse().find((t) => t.points <= balance)
}

export function formatPoints(points: number): string {
  return points.toLocaleString('en-US')
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`
}
