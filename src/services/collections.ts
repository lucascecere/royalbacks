import { storefrontClient } from '@/src/lib/shopify/client'
import {
  COLLECTION_BY_HANDLE_QUERY,
  ALL_COLLECTIONS_QUERY,
} from '@/src/lib/shopify/queries'
import type { ShopifyCollection, ShopifyImage } from '@/src/types/shopify'

export const revalidate = 900

interface RawCollectionMetafield {
  value: string
}

interface RawCollection {
  id: string
  handle: string
  title: string
  description: string
  products: {
    edges: Array<{
      node: {
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
          minVariantPrice: { amount: string; currencyCode: string }
          maxVariantPrice: { amount: string; currencyCode: string }
        }
        variants: {
          edges: Array<{
            node: {
              id: string
              title: string
              availableForSale: boolean
              selectedOptions: Array<{ name: string; value: string }>
              price: { amount: string; currencyCode: string }
              compareAtPrice: { amount: string; currencyCode: string } | null
              image: ShopifyImage | null
            }
          }>
        }
      }
    }>
  }
  drop_status: RawCollectionMetafield | null
  drop_start_date: RawCollectionMetafield | null
  drop_end_date: RawCollectionMetafield | null
  drop_hero_image: RawCollectionMetafield | null
  drop_story_slug: RawCollectionMetafield | null
}

interface RawCollectionListItem {
  id: string
  handle: string
  title: string
  image: ShopifyImage | null
}

function normalizeCollection(raw: RawCollection): ShopifyCollection {
  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
    products: raw.products.edges.map((e) => ({
      id: e.node.id,
      handle: e.node.handle,
      title: e.node.title,
      description: e.node.description,
      descriptionHtml: e.node.descriptionHtml,
      tags: e.node.tags,
      seo: e.node.seo,
      featuredImage: e.node.featuredImage,
      images: e.node.images.edges.map((img) => img.node),
      priceRange: e.node.priceRange,
      variants: e.node.variants.edges.map((v) => v.node),
    })),
    metafields: {
      drop_status: raw.drop_status?.value ?? null,
      drop_start_date: raw.drop_start_date?.value ?? null,
      drop_end_date: raw.drop_end_date?.value ?? null,
      drop_hero_image: raw.drop_hero_image?.value ?? null,
      drop_story_slug: raw.drop_story_slug?.value ?? null,
    },
  }
}

export async function getCollectionByHandle(
  handle: string
): Promise<ShopifyCollection | null> {
  try {
    const { data, errors } = await storefrontClient.request<{
      collection: RawCollection | null
    }>(COLLECTION_BY_HANDLE_QUERY, {
      variables: { handle },
    })
    if (errors || !data?.collection) return null
    return normalizeCollection(data.collection)
  } catch {
    return null
  }
}

export async function getAllCollections(): Promise<ShopifyCollection[]> {
  try {
    const { data, errors } = await storefrontClient.request<{
      collections: { edges: Array<{ node: RawCollectionListItem }> }
    }>(ALL_COLLECTIONS_QUERY)
    if (errors || !data?.collections) return []

    // For the full list we return minimal data; fetch full details per collection if needed
    return data.collections.edges.map((e) => ({
      id: e.node.id,
      handle: e.node.handle,
      title: e.node.title,
      description: '',
      products: [],
      metafields: {
        drop_status: null,
        drop_start_date: null,
        drop_end_date: null,
        drop_hero_image: null,
        drop_story_slug: null,
      },
    }))
  } catch {
    return []
  }
}
