'use server'

import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/src/types/action'
import { hasLoyalty, hasShopifyAdmin } from '@/src/lib/env'
import { requireVerifiedCustomer } from '@/src/lib/auth/session'
import {
  redeem,
  getBalance,
  InsufficientPointsError,
} from '@/src/services/loyalty'
import { applyDiscountToCart } from '@/src/services/cart'
import { sendRedemptionEmail } from '@/src/services/loyalty-email'
import { findTier } from '@/src/lib/loyalty/config'

export interface RedeemPayload {
  discountCode: string
  valueCents: number
  newBalance: number
  appliedToCart: boolean
}

/**
 * Spend points for a discount and put it straight on the cart.
 *
 * The point cost comes from the server-side tier table keyed by the requested
 * points value — never from anything the client sends about value or balance.
 */
export async function redeemPointsAction(
  points: number,
  cartId: string | null
): Promise<ActionResult<RedeemPayload>> {
  if (!hasLoyalty || !hasShopifyAdmin) {
    return { success: false, error: 'Rewards are not available yet.' }
  }

  const tier = findTier(points)
  if (!tier) return { success: false, error: 'Pick one of the listed rewards.' }

  const customer = await requireVerifiedCustomer()
  if (!customer) {
    return { success: false, error: 'Sign in and confirm your email to redeem points.' }
  }

  try {
    const redemption = await redeem({
      customerId: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      points: tier.points,
    })

    // Attach it to the cart so the customer never has to type the code. Requires
    // buyerIdentity to be set, which applyDiscountToCart handles.
    let appliedToCart = false
    if (cartId) {
      try {
        await applyDiscountToCart(cartId, redemption.discountCode, customer.email)
        appliedToCart = true
      } catch (err) {
        // The reward is still valid and still in their account — they can enter the
        // code at checkout. Not worth failing the redemption over.
        console.error('Could not auto-apply reward to cart:', err)
      }
    }

    try {
      await sendRedemptionEmail(
        customer.email,
        redemption.discountCode,
        redemption.valueCents,
        new Date(redemption.expiresAt)
      )
    } catch (err) {
      console.error('Redemption email failed:', err)
    }

    revalidatePath('/account')
    revalidatePath('/cart')

    return {
      success: true,
      data: {
        discountCode: redemption.discountCode,
        valueCents: redemption.valueCents,
        newBalance: await getBalance(customer.id),
        appliedToCart,
      },
    }
  } catch (err) {
    if (err instanceof InsufficientPointsError) {
      return { success: false, error: "You don't have enough points for that reward." }
    }
    console.error('redeemPointsAction failed:', err)
    return { success: false, error: 'Could not redeem your points. Try again.' }
  }
}
