import 'server-only'

import { cookies, headers } from 'next/headers'
import { db } from '@/src/lib/db'
import { generateToken, hashToken, expiresInDays } from '@/src/lib/auth/tokens'
import { SESSION_TTL_DAYS } from '@/src/lib/loyalty/config'

export const SESSION_COOKIE = 'rb_session'

export interface SessionCustomer {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  emailVerified: boolean
  shopifyCustomerId: string | null
  marketingOptIn: boolean
}

async function requestMeta() {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')
  return {
    userAgent: h.get('user-agent')?.slice(0, 400) ?? null,
    // x-forwarded-for is a client-controllable list; only the first hop is meaningful
    // and it's used for rate limiting, never for authorization.
    ip: forwarded?.split(',')[0]?.trim() || null,
  }
}

export async function createSession(customerId: string): Promise<void> {
  const token = generateToken()
  const meta = await requestMeta()

  const { error } = await db().from('sessions').insert({
    customer_id: customerId,
    token_hash: hashToken(token),
    expires_at: expiresInDays(SESSION_TTL_DAYS),
    user_agent: meta.userAgent,
    ip: meta.ip,
  })
  if (error) throw new Error(`Failed to create session: ${error.message}`)

  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  })
}

/** The signed-in customer, or null. Safe to call from any server component. */
export async function getSessionCustomer(): Promise<SessionCustomer | null> {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null

  const { data, error } = await db()
    .from('sessions')
    .select(
      'id, expires_at, customers ( id, email, first_name, last_name, email_verified_at, shopify_customer_id, marketing_opt_in )'
    )
    .eq('token_hash', hashToken(token))
    .maybeSingle()

  if (error || !data) return null

  if (new Date(data.expires_at).getTime() < Date.now()) {
    await db().from('sessions').delete().eq('id', data.id)
    return null
  }

  // Supabase types the embedded relation as an array.
  const c = (Array.isArray(data.customers) ? data.customers[0] : data.customers) as
    | {
        id: string
        email: string
        first_name: string | null
        last_name: string | null
        email_verified_at: string | null
        shopify_customer_id: string | null
        marketing_opt_in: boolean
      }
    | undefined
  if (!c) return null

  return {
    id: c.id,
    email: c.email,
    firstName: c.first_name,
    lastName: c.last_name,
    emailVerified: !!c.email_verified_at,
    shopifyCustomerId: c.shopify_customer_id,
    marketingOptIn: c.marketing_opt_in,
  }
}

/**
 * Order history and point balances resolve by email address, so an unverified
 * account could otherwise be used to read a stranger's purchase history just by
 * signing up with their address. Anything reading real customer data goes through here.
 */
export async function requireVerifiedCustomer(): Promise<SessionCustomer | null> {
  const customer = await getSessionCustomer()
  if (!customer || !customer.emailVerified) return null
  return customer
}

export async function destroySession(): Promise<void> {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (token) {
    await db().from('sessions').delete().eq('token_hash', hashToken(token))
  }
  jar.delete(SESSION_COOKIE)
}

/** Used after a password change so other devices are logged out. */
export async function destroyAllSessions(customerId: string): Promise<void> {
  await db().from('sessions').delete().eq('customer_id', customerId)
}
