import type { Metadata } from 'next'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://royalbacks.com'
export const SITE_NAME = 'Royal Backs'

export const NAP = {
  name: 'Royal Backs',
  addressLocality: 'Milton',
  addressRegion: 'MA',
  postalCode: '02186',
  addressCountry: 'US',
  telephone: '', // TBD
  url: SITE_URL,
  email: 'info@royalbacks.com',
  foundingDate: '2017',
}

export const SERVICE_AREA_TOWNS = [
  'Milton',
  'Quincy',
  'Braintree',
  'Weymouth',
  'Hingham',
  'Cohasset',
  'Scituate',
  'Norwell',
  'Marshfield',
  'Duxbury',
  'Canton',
  'Randolph',
  'Dorchester',
]

export function buildMetadata(overrides: Partial<Metadata> = {}): Metadata {
  const defaults: Metadata = {
    metadataBase: new URL(SITE_URL),
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
    },
    twitter: { card: 'summary_large_image' },
  }
  return {
    ...defaults,
    ...overrides,
    openGraph: { ...defaults.openGraph, ...(overrides.openGraph ?? {}) },
    twitter: { ...defaults.twitter, ...(overrides.twitter ?? {}) },
  }
}

export function buildLocalBusinessSchema(
  overrides: { town?: string; coordinates?: { lat: number; lng: number } } = {}
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: NAP.name,
    url: NAP.url,
    email: NAP.email,
    foundingDate: NAP.foundingDate,
    address: {
      '@type': 'PostalAddress',
      addressLocality: overrides.town ?? NAP.addressLocality,
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
