export interface BlogFrontmatter {
  title: string
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
