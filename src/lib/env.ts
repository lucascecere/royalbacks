import { z } from 'zod'

/**
 * Everything defaults so `next build` succeeds without secrets present.
 * Use the `has*` guards below before touching a subsystem rather than assuming a
 * value is real — a placeholder here means the feature simply isn't wired up yet.
 */
const envSchema = z.object({
  // Storefront (public catalog + cart)
  SHOPIFY_STORE_DOMAIN: z.string().min(1).default('placeholder.myshopify.com'),
  SHOPIFY_STOREFRONT_ACCESS_TOKEN: z.string().min(1).default('placeholder-build-token'),

  // Admin API — order history, discount minting, draft orders. Server-only.
  SHOPIFY_ADMIN_ACCESS_TOKEN: z.string().default(''),
  SHOPIFY_ADMIN_API_VERSION: z.string().default('2026-01'),
  SHOPIFY_WEBHOOK_SECRET: z.string().default(''),

  // Loyalty datastore. Server-only — the service role key bypasses RLS.
  SUPABASE_URL: z.string().default(''),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default(''),

  // Session token derivation.
  SESSION_SECRET: z.string().default(''),

  // Protects the Vercel Cron endpoint.
  CRON_SECRET: z.string().default(''),

  RESEND_API_KEY: z.string().min(1).default('re_placeholder'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://royalbacks.com'),
  NEXT_PUBLIC_GMB_PLACE_ID: z.string().default(''),
})

export const env = envSchema.parse(process.env)

/** Loyalty needs a database and a secret long enough to derive session tokens with. */
export const hasLoyalty =
  env.SUPABASE_URL !== '' &&
  env.SUPABASE_SERVICE_ROLE_KEY !== '' &&
  env.SESSION_SECRET.length >= 32

/** Order history, discount minting and draft orders all go through the Admin API. */
export const hasShopifyAdmin = env.SHOPIFY_ADMIN_ACCESS_TOKEN !== ''

/** Webhooks are rejected outright unless we can verify their signature. */
export const hasWebhookSecret = env.SHOPIFY_WEBHOOK_SECRET !== ''

export const hasResend = env.RESEND_API_KEY !== 're_placeholder'

/**
 * Whether a real Shopify store is wired up. False on the pre-launch preview, where
 * the catalog is empty by circumstance rather than because a collection sold out —
 * the storefront should say so plainly instead of rendering "no products found".
 */
export const hasShopifyStorefront =
  env.SHOPIFY_STORE_DOMAIN !== 'placeholder.myshopify.com' &&
  env.SHOPIFY_STOREFRONT_ACCESS_TOKEN !== 'placeholder-build-token'
