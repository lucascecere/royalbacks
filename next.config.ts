import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: '*.myshopify.com' },
    ],
  },
  // 301 redirects for Wix domain migration
  async redirects() {
    return [
      // Add Wix URL redirects here when migrating
      // { source: '/old-wix-path', destination: '/new-path', permanent: true },
    ]
  },
}

export default nextConfig
