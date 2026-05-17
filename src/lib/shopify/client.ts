import { createStorefrontApiClient } from '@shopify/storefront-api-client'

export const storefrontClient = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN ?? 'placeholder.myshopify.com',
  apiVersion: 'unstable',
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? 'placeholder-build-token',
})
