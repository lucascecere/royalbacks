import 'server-only'

import { headers } from 'next/headers'
import { db } from '@/src/lib/db'
import { RATE_LIMITS } from '@/src/lib/loyalty/config'

type Kind = keyof typeof RATE_LIMITS

async function clientIp(): Promise<string | null> {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || null
}

export async function recordAttempt(
  kind: Kind,
  email: string | null,
  successful: boolean
): Promise<void> {
  await db()
    .from('auth_attempts')
    .insert({ kind, email, ip: await clientIp(), successful })
}

/**
 * Counts recent failures against both the email and the source IP, so neither
 * spraying one account nor rotating across many accounts from one host gets a free pass.
 */
export async function isRateLimited(kind: Kind, email: string | null): Promise<boolean> {
  const { max, windowMinutes } = RATE_LIMITS[kind]
  const since = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString()
  const ip = await clientIp()

  const [byEmail, byIp] = await Promise.all([
    email
      ? db()
          .from('auth_attempts')
          .select('id', { count: 'exact', head: true })
          .eq('kind', kind)
          .eq('email', email)
          .eq('successful', false)
          .gte('created_at', since)
      : Promise.resolve({ count: 0 }),
    ip
      ? db()
          .from('auth_attempts')
          .select('id', { count: 'exact', head: true })
          .eq('kind', kind)
          .eq('ip', ip)
          .eq('successful', false)
          .gte('created_at', since)
      : Promise.resolve({ count: 0 }),
  ])

  // Allow more room per IP than per account: families, offices and mobile carriers
  // share addresses, and locking all of them out because one person fat-fingered a
  // password is its own outage.
  return (byEmail.count ?? 0) >= max || (byIp.count ?? 0) >= max * 4
}
