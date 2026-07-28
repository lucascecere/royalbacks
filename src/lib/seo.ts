import type { Metadata } from 'next'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://royalbacks.com'
export const SITE_NAME = 'Royal Backs'

/**
 * Search engines are kept off the site until the real domain is live, so the
 * temporary *.vercel.app preview never gets indexed. Set NEXT_PUBLIC_SITE_LIVE
 * to "true" in Vercel at domain cutover to open indexing up.
 */
export const IS_LIVE = process.env.NEXT_PUBLIC_SITE_LIVE === 'true'

/**
 * Absolute URLs (og:image especially) have to resolve on whatever host is
 * actually serving the page. Before the domain cutover that's the Vercel URL,
 * so pointing at royalbacks.com would give every shared link a broken preview.
 */
export const METADATA_BASE =
  IS_LIVE || !process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? SITE_URL
    : `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`

export const NAP = {
  name: 'Royal Backs',
  addressLocality: 'Milton',
  addressRegion: 'MA',
  postalCode: '02186',
  addressCountry: 'US',
  // No published phone number yet. Left undefined rather than empty: an empty
  // telephone in LocalBusiness schema is an incomplete listing, whereas an absent
  // one is simply a field we don't publish. Add it here and it flows into the
  // schema and the location pages at once.
  telephone: undefined as string | undefined,
  url: SITE_URL,
  email: 'info@royalbacks.com',
  foundingDate: '2017',
}

export interface TownAssets {
  /** Transparent PNG of the town wordmark as it's stitched. */
  wordmark?: string
  /** Secondary mark, e.g. a side-panel icon. Transparent PNG. */
  icon?: string
  /** Product shot of the finished cap. */
  product?: string
  productAlt?: string
  /** Accent colour pulled from the design, for the town hero. */
  accent?: string
}

export interface TownEntry {
  name: string
  slug: string
  assets?: TownAssets
}

/**
 * The service area, in one place. Drives nav, schema areaServed and the town pages.
 *
 * `assets` are optional — a town without them still gets a working page. Designs
 * get added here as they're finished.
 */
export const SOUTH_SHORE_TOWNS: readonly TownEntry[] = [
  { name: 'Milton', slug: 'milton' },
  { name: 'Quincy', slug: 'quincy' },
  {
    name: 'Braintree',
    slug: 'braintree',
    assets: {
      wordmark: '/towns/braintree/wordmark.png',
      icon: '/towns/braintree/icon.png',
      product: '/towns/braintree/product.jpg',
      productAlt: 'Royal Backs Braintree cap, cream crown with a black brim',
      accent: '#1B39C4',
    },
  },
  { name: 'Weymouth', slug: 'weymouth' },
  { name: 'Hingham', slug: 'hingham' },
  { name: 'Cohasset', slug: 'cohasset' },
  { name: 'Scituate', slug: 'scituate' },
  { name: 'Norwell', slug: 'norwell' },
  { name: 'Marshfield', slug: 'marshfield' },
  { name: 'Duxbury', slug: 'duxbury' },
  { name: 'Canton', slug: 'canton' },
  { name: 'Randolph', slug: 'randolph' },
  { name: 'Dorchester', slug: 'dorchester' },
]

export type SouthShoreTown = TownEntry

export function findTown(slug: string): SouthShoreTown | undefined {
  return SOUTH_SHORE_TOWNS.find((t) => t.slug === slug)
}

export const SERVICE_AREA_TOWNS: readonly string[] = SOUTH_SHORE_TOWNS.map((t) => t.name)

export function buildMetadata(overrides: Partial<Metadata> = {}): Metadata {
  const defaults: Metadata = {
    metadataBase: new URL(METADATA_BASE),
    title: {
      default: 'Royal Backs | Custom Hats & Embroidery, Milton MA',
      template: '%s | Royal Backs',
    },
    description:
      'Custom hats, apparel, and embroidery services in Milton, MA. Serving the South Shore since 2017.',
    openGraph: {
      siteName: SITE_NAME,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Royal Backs embroidered hats',
        },
      ],
    },
    twitter: { card: 'summary_large_image', images: ['/og-image.jpg'] },
  }
  return {
    ...defaults,
    ...overrides,
    openGraph: { ...defaults.openGraph, ...(overrides.openGraph ?? {}) },
    twitter: { ...defaults.twitter, ...(overrides.twitter ?? {}) },
  }
}

/**
 * LocalBusiness for Royal Backs.
 *
 * Always the real Milton address. Earlier this let a page override addressLocality,
 * so /embroidery/locations/quincy asserted the shop was located in Quincy — untrue,
 * and the pattern search engines treat as doorway pages. Town coverage belongs in
 * areaServed, which is emitted below for the whole service area.
 */
export function buildLocalBusinessSchema(
  overrides: { coordinates?: { lat: number; lng: number } } = {}
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: NAP.name,
    url: NAP.url,
    email: NAP.email,
    ...(NAP.telephone ? { telephone: NAP.telephone } : {}),
    foundingDate: NAP.foundingDate,
    address: {
      '@type': 'PostalAddress',
      addressLocality: NAP.addressLocality,
      addressRegion: NAP.addressRegion,
      postalCode: NAP.postalCode,
      addressCountry: NAP.addressCountry,
    },
    geo: overrides.coordinates
      ? {
          '@type': 'GeoCoordinates',
          latitude: overrides.coordinates.lat,
          longitude: overrides.coordinates.lng,
        }
      : undefined,
    areaServed: SERVICE_AREA_TOWNS.map((town) => ({
      '@type': 'City',
      name: town,
      containedInPlace: { '@type': 'State', name: 'Massachusetts' },
    })),
    description:
      'Custom embroidery services serving the South Shore of Massachusetts since 2017.',
  }
}

export function buildProductSchema(product: {
  title: string
  description: string
  handle: string
  price: string
  currencyCode: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    url: `${SITE_URL}/products/${product.handle}`,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currencyCode,
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/products/${product.handle}`,
    },
  }
}

export function buildArticleSchema(post: {
  title: string
  description: string
  date: string
  slug: string
  og_image?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `${SITE_URL}/blog/${post.slug}`,
    image: post.og_image
      ? `${SITE_URL}${post.og_image}`
      : `${SITE_URL}/og-image.jpg`,
    author: {
      '@type': 'Person',
      name: 'Dylan McDougall',
      url: `${SITE_URL}/authors/dylan`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

export function buildServiceSchema(service: {
  name: string
  description: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      '@type': 'LocalBusiness',
      name: NAP.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: NAP.addressLocality,
        addressRegion: NAP.addressRegion,
        addressCountry: NAP.addressCountry,
      },
    },
    areaServed: { '@type': 'State', name: 'Massachusetts' },
  }
}

export function buildFaqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

export function buildBreadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}
