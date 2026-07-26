import type { MetadataRoute } from 'next'
import { IS_LIVE } from '@/src/lib/seo'

export default function robots(): MetadataRoute.Robots {
  // Keep the temporary preview URL out of search results entirely.
  if (!IS_LIVE) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/account/'],
    },
    sitemap: 'https://royalbacks.com/sitemap.xml',
  }
}
