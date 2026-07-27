'use client'

import { useState, useTransition } from 'react'
import { useCart } from '@/src/components/cart/cart-context'
import { redeemPointsAction } from '@/src/actions/loyalty'
import {
  REDEMPTION_TIERS,
  formatCents,
  formatPoints,
} from '@/src/lib/loyalty/config'

interface RedeemPanelProps {
  balance: number
  canRedeem: boolean
}

export function RedeemPanel({ balance, canRedeem }: RedeemPanelProps) {
  const { cartId } = useCart()
  const [balanceNow, setBalanceNow] = useState(balance)
  const [message, setMessage] = useState<
    { kind: 'error' | 'success'; text: string } | null
  >(null)
  const [pending, start] = useTransition()

  function onRedeem(points: number) {
    setMessage(null)
    start(async () => {
      const result = await redeemPointsAction(points, cartId)
      if (!result.success) {
        setMessage({ kind: 'error', text: result.error })
        return
      }
      setBalanceNow(result.data.newBalance)
      setMessage({
        kind: 'success',
        text: result.data.appliedToCart
          ? `${formatCents(result.data.valueCents)} applied to your cart. Code ${result.data.discountCode}.`
          : `Reward ready — use code ${result.data.discountCode} at checkout.`,
      })
    })
  }

  return (
    <section className="bg-rb-card rounded-[12px] p-6 lg:p-8">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="font-display text-xl font-bold text-rb-black">Your Points</h2>
        <p className="font-display text-3xl font-bold text-rb-green">
          {formatPoints(balanceNow)}
        </p>
      </div>
      <p className="text-sm text-rb-muted mb-6">
        Earn 1 point for every $1 you spend — hats and custom embroidery both count.
      </p>

      {message && (
        <p
          role="status"
          className={`text-sm rounded-[7px] px-3 py-2 mb-4 border ${
            message.kind === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-green-50 border-green-200 text-green-800'
          }`}
        >
          {message.text}
        </p>
      )}

      {!canRedeem && (
        <p className="text-sm text-rb-muted mb-4">
          Confirm your email address to start redeeming.
        </p>
      )}

      <div className="grid sm:grid-cols-3 gap-3">
        {REDEMPTION_TIERS.map((tier) => {
          const affordable = balanceNow >= tier.points && canRedeem
          return (
            <button
              key={tier.points}
              onClick={() => onRedeem(tier.points)}
              disabled={!affordable || pending}
              className={`rounded-[10px] border p-4 text-left transition-colors ${
                affordable
                  ? 'bg-white border-rb-border hover:border-rb-black cursor-pointer'
                  : 'bg-white/50 border-rb-border/60 cursor-not-allowed opacity-60'
              }`}
            >
              <p className="font-display text-2xl font-bold text-rb-black">
                {formatCents(tier.valueCents)}
              </p>
              <p className="text-xs text-rb-muted mt-1">
                {formatPoints(tier.points)} points
              </p>
              {!affordable && canRedeem && (
                <p className="text-xs text-rb-muted/80 mt-2">
                  {formatPoints(tier.points - balanceNow)} more
                </p>
              )}
            </button>
          )
        })}
      </div>

      <p className="text-xs text-rb-muted mt-4 leading-relaxed">
        Rewards apply to your cart automatically and last 30 days. If one expires unused,
        we put the points straight back on your balance.
      </p>
    </section>
  )
}
