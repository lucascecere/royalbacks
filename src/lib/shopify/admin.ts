import 'server-only'

import { env, hasShopifyAdmin } from '@/src/lib/env'

/**
 * Admin GraphQL client. Separate from the Storefront client in ./client.ts — this
 * token can read every order and mint discounts, so it must never reach the browser.
 * The `server-only` import turns any client import into a build error.
 */
const endpoint = () =>
  `https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/${env.SHOPIFY_ADMIN_API_VERSION}/graphql.json`

export class ShopifyAdminError extends Error {
  constructor(
    message: string,
    readonly details?: unknown
  ) {
    super(message)
    this.name = 'ShopifyAdminError'
  }
}

export async function adminRequest<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  if (!hasShopifyAdmin) {
    throw new ShopifyAdminError('SHOPIFY_ADMIN_ACCESS_TOKEN is not configured')
  }

  const res = await fetch(endpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': env.SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new ShopifyAdminError(`Admin API HTTP ${res.status}`, await res.text())
  }

  const json = (await res.json()) as {
    data?: T
    errors?: Array<{ message: string }>
  }

  if (json.errors?.length) {
    throw new ShopifyAdminError(
      json.errors.map((e) => e.message).join('; '),
      json.errors
    )
  }
  if (!json.data) throw new ShopifyAdminError('Admin API returned no data')

  return json.data
}

/**
 * Shopify `userErrors` are business-rule rejections returned alongside a 200 — an
 * invalid discount value, a duplicate code. They are not exceptions, so they have to
 * be checked explicitly or the mutation silently appears to succeed.
 */
export function assertNoUserErrors(
  errors: Array<{ field?: string[] | null; message: string }> | undefined,
  context: string
): void {
  if (errors && errors.length > 0) {
    throw new ShopifyAdminError(
      `${context}: ${errors.map((e) => e.message).join('; ')}`,
      errors
    )
  }
}

export function numericId(gid: string): string {
  return gid.split('/').pop() ?? gid
}

export function orderGid(id: string | number): string {
  return String(id).startsWith('gid://') ? String(id) : `gid://shopify/Order/${id}`
}

export function customerGid(id: string | number): string {
  return String(id).startsWith('gid://') ? String(id) : `gid://shopify/Customer/${id}`
}
