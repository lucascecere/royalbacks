import 'server-only'

import { db, normalizeEmail } from '@/src/lib/db'
import {
  hashPassword,
  verifyPassword,
  fakeVerify,
  validatePassword,
} from '@/src/lib/auth/password'
import { generateToken, hashToken, expiresInHours } from '@/src/lib/auth/tokens'
import { destroyAllSessions } from '@/src/lib/auth/session'
import { VERIFY_TOKEN_TTL_HOURS, RESET_TOKEN_TTL_HOURS } from '@/src/lib/loyalty/config'
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '@/src/services/loyalty-email'

export interface AccountRecord {
  id: string
  email: string
  emailVerified: boolean
}

/** Issues a fresh token, invalidating any outstanding one for the same purpose. */
async function issueEmailToken(
  customerId: string,
  purpose: 'verify' | 'reset'
): Promise<string> {
  const token = generateToken()
  const ttl = purpose === 'verify' ? VERIFY_TOKEN_TTL_HOURS : RESET_TOKEN_TTL_HOURS

  // One live token per purpose: a new reset link must void the previous one.
  await db()
    .from('email_tokens')
    .delete()
    .eq('customer_id', customerId)
    .eq('purpose', purpose)
    .is('consumed_at', null)

  const { error } = await db().from('email_tokens').insert({
    customer_id: customerId,
    purpose,
    token_hash: hashToken(token),
    expires_at: expiresInHours(ttl),
  })
  if (error) throw new Error(`Failed to issue ${purpose} token: ${error.message}`)

  return token
}

export type SignupResult =
  | { ok: true; customerId: string }
  | { ok: false; error: string }

export async function createAccount(input: {
  email: string
  password: string
  firstName?: string
  lastName?: string
  marketingOptIn?: boolean
}): Promise<SignupResult> {
  const email = normalizeEmail(input.email)

  const problem = validatePassword(input.password)
  if (problem) return { ok: false, error: problem.message }

  const passwordHash = await hashPassword(input.password)

  const { data, error } = await db()
    .from('customers')
    .insert({
      email,
      password_hash: passwordHash,
      first_name: input.firstName?.trim() || null,
      last_name: input.lastName?.trim() || null,
      marketing_opt_in: input.marketingOptIn ?? false,
    })
    .select('id')
    .single()

  if (error) {
    // 23505 = unique violation on email. Don't confirm the address is taken —
    // that turns signup into an account-enumeration oracle. The caller reports
    // success either way and the real owner gets an email.
    if (error.code === '23505') return { ok: false, error: 'DUPLICATE' }
    throw new Error(`Failed to create account: ${error.message}`)
  }

  // Any points already accrued against this email as a guest now belong to them.
  await db().rpc('claim_guest_points', { p_customer_id: data.id, p_email: email })

  const token = await issueEmailToken(data.id, 'verify')
  await sendVerificationEmail(email, token)

  return { ok: true, customerId: data.id }
}

export type LoginResult =
  | { ok: true; customerId: string }
  | { ok: false }

export async function authenticate(
  emailInput: string,
  password: string
): Promise<LoginResult> {
  const email = normalizeEmail(emailInput)

  const { data } = await db()
    .from('customers')
    .select('id, password_hash')
    .eq('email', email)
    .maybeSingle()

  if (!data) {
    // Spend comparable time so response latency doesn't reveal whether the
    // address is registered.
    await fakeVerify()
    return { ok: false }
  }

  const valid = await verifyPassword(data.password_hash, password)
  if (!valid) return { ok: false }

  return { ok: true, customerId: data.id }
}

/** Consumes a token and returns its owner. One use only, expiry enforced. */
async function consumeToken(
  token: string,
  purpose: 'verify' | 'reset'
): Promise<string | null> {
  const { data } = await db()
    .from('email_tokens')
    .select('id, customer_id, expires_at, consumed_at')
    .eq('token_hash', hashToken(token))
    .eq('purpose', purpose)
    .maybeSingle()

  if (!data || data.consumed_at) return null
  if (new Date(data.expires_at).getTime() < Date.now()) return null

  // Conditional update doubles as the claim: if a concurrent request consumed it
  // first, this matches zero rows and we reject.
  const { data: claimed } = await db()
    .from('email_tokens')
    .update({ consumed_at: new Date().toISOString() })
    .eq('id', data.id)
    .is('consumed_at', null)
    .select('id')
    .maybeSingle()

  return claimed ? data.customer_id : null
}

export async function verifyEmailToken(token: string): Promise<boolean> {
  const customerId = await consumeToken(token, 'verify')
  if (!customerId) return false

  const { error } = await db()
    .from('customers')
    .update({ email_verified_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', customerId)

  return !error
}

/** Always behaves identically whether or not the address exists. */
export async function requestPasswordReset(emailInput: string): Promise<void> {
  const email = normalizeEmail(emailInput)

  const { data } = await db()
    .from('customers')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (!data) return

  const token = await issueEmailToken(data.id, 'reset')
  await sendPasswordResetEmail(email, token)
}

export type ResetResult = { ok: true } | { ok: false; error: string }

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<ResetResult> {
  const problem = validatePassword(newPassword)
  if (problem) return { ok: false, error: problem.message }

  const customerId = await consumeToken(token, 'reset')
  if (!customerId) {
    return { ok: false, error: 'That reset link is invalid or has expired.' }
  }

  const passwordHash = await hashPassword(newPassword)
  const { error } = await db()
    .from('customers')
    .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
    .eq('id', customerId)

  if (error) return { ok: false, error: 'Could not update your password. Try again.' }

  // Completing a reset proves control of the mailbox.
  await db()
    .from('customers')
    .update({ email_verified_at: new Date().toISOString() })
    .eq('id', customerId)
    .is('email_verified_at', null)

  // A reset is the standard response to a suspected compromise — log every other
  // device out rather than leaving an attacker's session alive.
  await destroyAllSessions(customerId)

  return { ok: true }
}

export async function resendVerification(customerId: string, email: string): Promise<void> {
  const token = await issueEmailToken(customerId, 'verify')
  await sendVerificationEmail(email, token)
}

export async function setMarketingOptIn(customerId: string, optIn: boolean): Promise<void> {
  await db()
    .from('customers')
    .update({ marketing_opt_in: optIn, updated_at: new Date().toISOString() })
    .eq('id', customerId)
}
