import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Hero and collection photos are served at quality 100
    qualities: [75, 100],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: '*.myshopify.com' },
    ],
  },
  async redirects() {
    return [
      // The portfolio page became the top-level Work showcase.
      { source: '/embroidery/portfolio', destination: '/work', permanent: true },
      // Add Wix URL redirects here when migrating
      // { source: '/old-wix-path', destination: '/new-path', permanent: true },
    ]
  },
}

export default nextConfig
