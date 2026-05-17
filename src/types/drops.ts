export type DropStatus = 'upcoming' | 'live' | 'ending_soon' | 'archived'

export interface DropMeta {
  handle: string
  title: string
  status: DropStatus
  startDate: string | null
  endDate: string | null
  heroImage: string | null
  storySlug: string | null
}
