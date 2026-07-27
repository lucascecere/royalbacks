/**
 * Program mechanics in one place so rates can be tuned without a migration.
 * The ledger stores raw point deltas, so changing these never rewrites history.
 */

/** Points earned per whole dollar of net merchandise spend. */
export const POINTS_PER_DOLLAR = 1

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
 */
export function pointsForSpend(netMerchandiseCents: number): number {
  if (netMerchandiseCents <= 0) return 0
  return Math.floor((netMerchandiseCents / 100) * POINTS_PER_DOLLAR)
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
