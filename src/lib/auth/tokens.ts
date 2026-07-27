import 'server-only'

import { createHmac, randomBytes, timingSafeEqual } from 'crypto'
import { env } from '@/src/lib/env'

/**
 * Session and email tokens are opaque random strings. We hand the raw value to the
 * user and store only an HMAC of it, so a database leak can't be replayed as a login
 * or a password reset.
 *
 * HMAC rather than a bare SHA-256: these are high-entropy random values, so the salt
 * isn't doing work against guessing, but keying the digest means the stored hashes are
 * useless to anyone who dumps the table without also holding SESSION_SECRET.
 */
export function generateToken(): string {
  return randomBytes(32).toString('base64url')
}

export function hashToken(token: string): string {
  return createHmac('sha256', env.SESSION_SECRET).update(token).digest('hex')
}

/** Constant-time compare for anything attacker-supplied. */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export function expiresInDays(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

export function expiresInHours(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
}
