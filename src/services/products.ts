import { storefrontClient } from '@/src/lib/shopify/client'
import {
  PRODUCT_BY_HANDLE_QUERY,
  ALL_PRODUCT_HANDLES_QUERY,
  SEARCH_PRODUCTS_QUERY,
} from '@/src/lib/shopify/queries'
import type { ClientResponse } from '@shopify/graphql-client'
import type { ShopifyProduct, ShopifyImage, ShopifyMoney, ShopifyProductVariant } from '@/src/types/shopify'

export const revalidate = 3600

interface RawProduct {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  tags: string[]
  seo: { title: string | null; description: string | null }
  featuredImage: ShopifyImage | null
  images: { edges: Array<{ node: ShopifyImage }> }
  priceRange: {
    minVariantPrice: ShopifyMoney
    maxVariantPrice: ShopifyMoney
  }
  variants: {
    edges: Array<{
      node: ShopifyProductVariant
    }>
  }
}

function normalizeProduct(raw: RawProduct): ShopifyProduct {
  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
    descriptionHtml: raw.descriptionHtml,
    tags: raw.tags,
    seo: raw.seo,
    featuredImage: raw.featuredImage,
    images: raw.images.edges.map((e) => e.node),
    variants: raw.variants.edges.map((e) => e.node),
    priceRange: raw.priceRange,
  }
}

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  try {
    const { data, errors } = await storefrontClient.request<{
      product: RawProduct | null
    }>(PRODUCT_BY_HANDLE_QUERY, {
      variables: { handle },
    })
    if (errors || !data?.product) return null
    return normalizeProduct(data.product)
  } catch {
    return null
  }
}

export async function getAllProductHandles(): Promise<string[]> {
  const handles: string[] = []
  let cursor: string | null = null
  let hasNextPage = true

  type HandlesResponse = {
    products: {
      edges: Array<{ node: { handle: string }; cursor: string }>
      pageInfo: { hasNextPage: boolean }
    }
  }

  try {
    while (hasNextPage) {
      const result: ClientResponse<HandlesResponse> =
        await storefrontClient.request<HandlesResponse>(
          ALL_PRODUCT_HANDLES_QUERY,
          { variables: cursor ? { cursor } : {} }
        )

      if (result.errors || !result.data?.products) break

      const edges: Array<{ node: { handle: string }; cursor: string }> =
        result.data.products.edges
      for (const edge of edges) {
        handles.push(edge.node.handle)
        cursor = edge.cursor
      }
      hasNextPage = result.data.products.pageInfo.hasNextPage
    }
  } catch {
    return handles
  }

  return handles
}

export async function searchProducts(query: string): Promise<ShopifyProduct[]> {
  try {
    const { data, errors } = await storefrontClient.request<{
      products: { edges: Array<{ node: RawProduct }> }
    }>(SEARCH_PRODUCTS_QUERY, {
      variables: { query, first: 20 },
    })
    if (errors || !data?.products) return []
    return data.products.edges.map((e) => normalizeProduct(e.node))
  } catch {
    return []
  }
}
