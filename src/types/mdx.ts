export interface BlogFrontmatter {
  title: string
  /** Optional shorter <title>. The on-page h1 keeps `title`. */
  meta_title?: string
  description: string
  date: string
  author: string
  tags: string[]
  og_image: string | null
  reading_time?: number
}

export interface LocationFrontmatter {
  town: string
  slug: string
  county: string
  state: string
  coordinates: { lat: number; lng: number }
  nearby_towns: string[]
  is_hq: boolean
  meta_title: string
  meta_description: string
  schema_data: {
    service_area_radius: number
    address_locality: string
    postal_code: string | null
  }
}

export interface ServiceFrontmatter {
  title: string
  description: string
  garment: string
  hero_image: string
  meta_title: string
  meta_description: string
  faqs: Array<{ question: string; answer: string }>
}

export interface IndustryFrontmatter {
  title: string
  description: string
  industry: string
  hero_image: string
  meta_title: string
  meta_description: string
  cta_headline: string
  faqs: Array<{ question: string; answer: string }>
}

export interface DropFrontmatter {
  title: string
  shopify_collection_handle: string
  status: 'upcoming' | 'live' | 'archived'
  start_date: string
  end_date: string
  hero_image: string
  og_image: string
}

export interface BlogPost extends BlogFrontmatter {
  slug: string
  content: string
}

export interface LocationPage extends LocationFrontmatter {
  slug: string
  content: string
}

export interface ServicePage extends ServiceFrontmatter {
  slug: string
  content: string
}

export interface IndustryPage extends IndustryFrontmatter {
  slug: string
  content: string
}

export interface DropPage extends DropFrontmatter {
  slug: string
  content: string
}

export interface WorkImage {
  /** Path under /public, e.g. /work/bandits/caps-01.jpg */
  src: string
  alt: string
  /** Optional caption shown under the image on the project page. */
  caption?: string
}

export interface WorkFrontmatter {
  title: string
  /** Customer name to display. Omit to fall back to `client_generic`. */
  client?: string
  /** Used when the customer hasn't okayed being named, e.g. "Youth hockey association". */
  client_generic?: string
  category: string
  /** Year the job ran. Shown next to the client. */
  year?: string
  summary: string
  /** Short spec lines: "84 pieces", "4-color left chest", "10-day turnaround". */
  specs?: string[]
  garments?: string[]
  cover: string
  cover_alt?: string
  images: WorkImage[]
  /** Pins the project to the top of /work. */
  featured?: boolean
  /** Controls ordering within a category; lower sorts first. */
  order?: number
  meta_title?: string
  meta_description?: string
}

export interface WorkProject extends WorkFrontmatter {
  slug: string
  content: string
  /** Resolved display name: `client` when present, else `client_generic`. */
  clientLabel: string | null
}
