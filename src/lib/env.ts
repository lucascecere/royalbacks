import { z } from 'zod'

const envSchema = z.object({
  SHOPIFY_STORE_DOMAIN: z.string().min(1).default('placeholder.myshopify.com'),
  SHOPIFY_STOREFRONT_ACCESS_TOKEN: z.string().min(1).default('placeholder-build-token'),
  RESEND_API_KEY: z.string().min(1).default('re_placeholder'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://royalbacks.com'),
  NEXT_PUBLIC_GMB_PLACE_ID: z.string().default(''),
})

export const env = envSchema.parse(process.env)
