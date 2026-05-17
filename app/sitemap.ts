import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = 'https://royalbacks.com'

  const staticB2C = [
    '/',
    '/collections',
    '/collections/originals',
    '/collections/boston',
    '/collections/local',
    '/collections/drops',
    '/about',
    '/blog',
    '/cart',
    '/search',
  ]

  const staticB2B = [
    '/embroidery',
    '/embroidery/quote',
    '/embroidery/portfolio',
    '/embroidery/process',
    '/embroidery/pricing',
    '/embroidery/locations',
    '/embroidery/authors/dylan',
  ]

  const garments = ['hats', 'polos', 't-shirts', 'sweatshirts', 'jackets', 'bags']
  const industries = [
    'sports-teams',
    'hockey-teams',
    'businesses',
    'contractors',
    'restaurants',
    'schools',
    'non-profits',
    'weddings-events',
  ]

  let blogSlugs: string[] = []
  let locationSlugs: string[] = []
  let productHandles: string[] = []

  try {
    const { getMdxSlugs } = await import('@/src/lib/mdx')
    blogSlugs = getMdxSlugs('blog')
    locationSlugs = getMdxSlugs('locations')
  } catch {
    // MDX not available at build time — skip dynamic entries
  }

  try {
    const { getAllProductHandles } = await import('@/src/services/products')
    productHandles = await getAllProductHandles()
  } catch {
    // Shopify not available at build time — skip
  }

  return [
    ...staticB2C.map((url) => ({
      url: `${BASE}${url}`,
      changeFrequency: 'weekly' as const,
      priority: url === '/' ? 1 : 0.8,
      lastModified: new Date(),
    })),
    ...staticB2B.map((url) => ({
      url: `${BASE}${url}`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
      lastModified: new Date(),
    })),
    ...garments.map((g) => ({
      url: `${BASE}/embroidery/${g}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      lastModified: new Date(),
    })),
    ...industries.map((i) => ({
      url: `${BASE}/embroidery/for/${i}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      lastModified: new Date(),
    })),
    ...locationSlugs.map((s) => ({
      url: `${BASE}/embroidery/locations/${s}`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
      lastModified: new Date(),
    })),
    ...blogSlugs.map((s) => ({
      url: `${BASE}/blog/${s}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      lastModified: new Date(),
    })),
    ...productHandles.map((h) => ({
      url: `${BASE}/products/${h}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      lastModified: new Date(),
    })),
  ]
}
