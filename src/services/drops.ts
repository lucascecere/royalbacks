import { storefrontClient } from '@/src/lib/shopify/client'
import { DROPS_QUERY, COLLECTION_BY_HANDLE_QUERY } from '@/src/lib/shopify/queries'
import type { DropStatus, DropMeta } from '@/src/types/drops'

export function resolveDropStatus(
  startDate: string | null,
  endDate: string | null,
  rawStatus: string
): DropStatus {
  const now = new Date()
  if (rawStatus === 'archived') return 'archived'
  if (!startDate || !endDate) return rawStatus as DropStatus
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (now < start) return 'upcoming'
  if (now > end) return 'archived'
  const hoursLeft = (end.getTime() - now.getTime()) / (1000 * 60 * 60)
  if (hoursLeft <= 24) return 'ending_soon'
  return 'live'
}

interface RawDropCollectionMetafield {
  value: string
}

interface RawDropCollection {
  id: string
  handle: string
  title: string
  description: string
  drop_status: RawDropCollectionMetafield | null
  drop_start_date: RawDropCollectionMetafield | null
  drop_end_date: RawDropCollectionMetafield | null
  drop_hero_image: RawDropCollectionMetafield | null
  drop_story_slug: RawDropCollectionMetafield | null
  products: { edges: unknown[] }
}

function rawToDropMeta(raw: RawDropCollection): DropMeta {
  const startDate = raw.drop_start_date?.value ?? null
  const endDate = raw.drop_end_date?.value ?? null
  const rawStatus = raw.drop_status?.value ?? 'upcoming'
  const status = resolveDropStatus(startDate, endDate, rawStatus)

  return {
    handle: raw.handle,
    title: raw.title,
    status,
    startDate,
    endDate,
    heroImage: raw.drop_hero_image?.value ?? null,
    storySlug: raw.drop_story_slug?.value ?? null,
  }
}

export async function getActiveDrop(): Promise<DropMeta | null> {
  try {
    const { data, errors } = await storefrontClient.request<{
      collections: { edges: Array<{ node: RawDropCollection }> }
    }>(DROPS_QUERY)

    if (errors || !data?.collections) return null

    const drops = data.collections.edges.map((e) => rawToDropMeta(e.node))
    return (
      drops.find((d) => d.status === 'live' || d.status === 'ending_soon') ??
      null
    )
  } catch {
    return null
  }
}

export async function getDropByHandle(handle: string): Promise<DropMeta | null> {
  try {
    const { data, errors } = await storefrontClient.request<{
      collection: RawDropCollection | null
    }>(COLLECTION_BY_HANDLE_QUERY, {
      variables: { handle },
    })

    if (errors || !data?.collection) return null
    if (!data.collection.drop_status) return null

    return rawToDropMeta(data.collection)
  } catch {
    return null
  }
}

export async function getArchivedDrops(): Promise<DropMeta[]> {
  try {
    const { data, errors } = await storefrontClient.request<{
      collections: { edges: Array<{ node: RawDropCollection }> }
    }>(DROPS_QUERY)

    if (errors || !data?.collections) return []

    return data.collections.edges
      .map((e) => rawToDropMeta(e.node))
      .filter((d) => d.status === 'archived')
  } catch {
    return []
  }
}
