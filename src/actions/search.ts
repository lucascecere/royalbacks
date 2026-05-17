'use server'

import { searchProducts } from '@/src/services/products'
import type { ActionResult } from '@/src/types/action'
import type { ShopifyProduct } from '@/src/types/shopify'

export async function searchProductsAction(
  query: string
): Promise<ActionResult<ShopifyProduct[]>> {
  try {
    if (!query.trim()) {
      return { success: true, data: [] }
    }
    const products = await searchProducts(query.trim())
    return { success: true, data: products }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Search failed'
    return { success: false, error: message }
  }
}
