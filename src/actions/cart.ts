'use server'

import { addToCart, updateCartLine, removeCartLine } from '@/src/services/cart'
import type { ActionResult } from '@/src/types/action'
import type { ShopifyCart } from '@/src/types/shopify'

export async function addToCartAction(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<ActionResult<ShopifyCart>> {
  try {
    const cart = await addToCart(cartId, variantId, quantity)
    return { success: true, data: cart }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to add item to cart'
    return { success: false, error: message }
  }
}

export async function updateCartAction(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ActionResult<ShopifyCart>> {
  try {
    const cart = await updateCartLine(cartId, lineId, quantity)
    return { success: true, data: cart }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update cart'
    return { success: false, error: message }
  }
}

export async function removeFromCartAction(
  cartId: string,
  lineId: string
): Promise<ActionResult<ShopifyCart>> {
  try {
    const cart = await removeCartLine(cartId, lineId)
    return { success: true, data: cart }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to remove item from cart'
    return { success: false, error: message }
  }
}
