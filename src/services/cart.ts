import { storefrontClient } from '@/src/lib/shopify/client'
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_BUYER_IDENTITY_UPDATE_MUTATION,
  CART_DISCOUNT_CODES_UPDATE_MUTATION,
} from '@/src/lib/shopify/mutations'
import { CART_QUERY } from '@/src/lib/shopify/queries'
import type {
  ShopifyCart,
  ShopifyCartLine,
  ShopifyCartCost,
} from '@/src/types/shopify'

interface RawCartEdge {
  node: ShopifyCartLine
}

interface RawCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: ShopifyCartCost
  lines: { edges: RawCartEdge[] }
}

function normalizeCart(raw: RawCart): ShopifyCart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    cost: raw.cost,
    lines: raw.lines.edges.map((e) => e.node),
  }
}

export async function createCart(): Promise<ShopifyCart> {
  const { data, errors } = await storefrontClient.request<{
    cartCreate: { cart: RawCart }
  }>(CART_CREATE_MUTATION, {
    variables: { input: {} } as Record<string, unknown>,
  })

  if (errors || !data?.cartCreate?.cart) {
    throw new Error('Failed to create cart')
  }
  return normalizeCart(data.cartCreate.cart)
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<ShopifyCart> {
  const { data, errors } = await storefrontClient.request<{
    cartLinesAdd: { cart: RawCart }
  }>(CART_LINES_ADD_MUTATION, {
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    } as Record<string, unknown>,
  })

  if (errors || !data?.cartLinesAdd?.cart) {
    throw new Error('Failed to add to cart')
  }
  return normalizeCart(data.cartLinesAdd.cart)
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const { data, errors } = await storefrontClient.request<{
    cartLinesUpdate: { cart: RawCart }
  }>(CART_LINES_UPDATE_MUTATION, {
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    } as Record<string, unknown>,
  })

  if (errors || !data?.cartLinesUpdate?.cart) {
    throw new Error('Failed to update cart line')
  }
  return normalizeCart(data.cartLinesUpdate.cart)
}

export async function removeCartLine(
  cartId: string,
  lineId: string
): Promise<ShopifyCart> {
  const { data, errors } = await storefrontClient.request<{
    cartLinesRemove: { cart: RawCart }
  }>(CART_LINES_REMOVE_MUTATION, {
    variables: {
      cartId,
      lineIds: [lineId],
    } as Record<string, unknown>,
  })

  if (errors || !data?.cartLinesRemove?.cart) {
    throw new Error('Failed to remove cart line')
  }
  return normalizeCart(data.cartLinesRemove.cart)
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  try {
    const { data, errors } = await storefrontClient.request<{
      cart: RawCart | null
    }>(CART_QUERY, {
      variables: { cartId } as Record<string, unknown>,
    })

    if (errors || !data?.cart) return null
    return normalizeCart(data.cart)
  } catch {
    return null
  }
}

/**
 * Attach a loyalty reward to the cart.
 *
 * Two steps, and the order matters. Loyalty codes are restricted to one Shopify
 * customer, and Shopify can only match that restriction if the cart says who the
 * buyer is — so buyerIdentity has to be set first. Skip it and the code is accepted
 * into the cart but discounts nothing, which looks to the customer like their points
 * vanished.
 */
export async function applyDiscountToCart(
  cartId: string,
  code: string,
  email: string
): Promise<ShopifyCart> {
  const identity = await storefrontClient.request<{
    cartBuyerIdentityUpdate: {
      cart: RawCart | null
      userErrors: Array<{ field: string[] | null; message: string }>
    }
  }>(CART_BUYER_IDENTITY_UPDATE_MUTATION, {
    variables: { cartId, buyerIdentity: { email } },
  })

  const identityErrors = identity.data?.cartBuyerIdentityUpdate?.userErrors ?? []
  if (identity.errors || identityErrors.length > 0) {
    throw new Error(
      `Could not set cart buyer identity: ${identityErrors.map((e) => e.message).join('; ')}`
    )
  }

  const applied = await storefrontClient.request<{
    cartDiscountCodesUpdate: {
      cart: (RawCart & { discountCodes?: Array<{ code: string; applicable: boolean }> }) | null
      userErrors: Array<{ field: string[] | null; message: string }>
    }
  }>(CART_DISCOUNT_CODES_UPDATE_MUTATION, {
    variables: { cartId, discountCodes: [code] },
  })

  const applyErrors = applied.data?.cartDiscountCodesUpdate?.userErrors ?? []
  const cart = applied.data?.cartDiscountCodesUpdate?.cart
  if (applied.errors || applyErrors.length > 0 || !cart) {
    throw new Error(
      `Could not apply reward to cart: ${applyErrors.map((e) => e.message).join('; ')}`
    )
  }

  return normalizeCart(cart)
}
