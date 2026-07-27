'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import type { ActionResult } from '@/src/types/action'
import { hasLoyalty } from '@/src/lib/env'
import {
  createAccount,
  authenticate,
  requestPasswordReset,
  resetPassword,
  resendVerification,
  setMarketingOptIn,
} from '@/src/services/account'
import {
  createSession,
  destroySession,
  getSessionCustomer,
} from '@/src/lib/auth/session'
import { isRateLimited, recordAttempt } from '@/src/lib/auth/rate-limit'

const NOT_CONFIGURED = 'Accounts are not available yet. Check back soon.'
const TOO_MANY = 'Too many attempts. Wait a few minutes and try again.'
/** Deliberately identical for wrong password and unknown email. */
const BAD_CREDENTIALS = 'That email or password is incorrect.'

const SignupSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter a password.'),
  firstName: z.string().max(80).optional(),
  lastName: z.string().max(80).optional(),
  marketingOptIn: z.boolean().optional(),
})

export async function signupAction(
  input: z.infer<typeof SignupSchema>
): Promise<ActionResult<{ needsVerification: true }>> {
  if (!hasLoyalty) return { success: false, error: NOT_CONFIGURED }

  const parsed = SignupSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Check the form and try again.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  if (await isRateLimited('signup', parsed.data.email)) {
    return { success: false, error: TOO_MANY }
  }

  try {
    const result = await createAccount(parsed.data)

    if (!result.ok && result.error !== 'DUPLICATE') {
      await recordAttempt('signup', parsed.data.email, false)
      return { success: false, error: result.error }
    }

    await recordAttempt('signup', parsed.data.email, true)

    // On a duplicate we report the same thing as a fresh signup. Saying "that email
    // is taken" would let anyone test which of Dylan's customers have accounts.
    // The real owner already has a verification email; nobody else learns anything.
    return { success: true, data: { needsVerification: true } }
  } catch (err) {
    console.error('signupAction failed:', err)
    return { success: false, error: 'Could not create your account. Try again.' }
  }
}

const LoginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
})

export async function loginAction(
  input: z.infer<typeof LoginSchema>
): Promise<ActionResult<{ ok: true }>> {
  if (!hasLoyalty) return { success: false, error: NOT_CONFIGURED }

  const parsed = LoginSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: BAD_CREDENTIALS }

  if (await isRateLimited('login', parsed.data.email)) {
    return { success: false, error: TOO_MANY }
  }

  try {
    const result = await authenticate(parsed.data.email, parsed.data.password)
    if (!result.ok) {
      await recordAttempt('login', parsed.data.email, false)
      return { success: false, error: BAD_CREDENTIALS }
    }

    await recordAttempt('login', parsed.data.email, true)
    await createSession(result.customerId)
    return { success: true, data: { ok: true } }
  } catch (err) {
    console.error('loginAction failed:', err)
    return { success: false, error: 'Could not sign you in. Try again.' }
  }
}

export async function logoutAction(): Promise<void> {
  if (hasLoyalty) await destroySession()
  redirect('/')
}

const ForgotSchema = z.object({ email: z.string().email() })

export async function forgotPasswordAction(
  input: z.infer<typeof ForgotSchema>
): Promise<ActionResult<{ sent: true }>> {
  if (!hasLoyalty) return { success: false, error: NOT_CONFIGURED }

  const parsed = ForgotSchema.safeParse(input)
  // Report "sent" even for a malformed address so this can't probe for accounts.
  if (!parsed.success) return { success: true, data: { sent: true } }

  if (await isRateLimited('reset', parsed.data.email)) {
    return { success: false, error: TOO_MANY }
  }

  try {
    await recordAttempt('reset', parsed.data.email, true)
    await requestPasswordReset(parsed.data.email)
  } catch (err) {
    // Log it, but still report success — the response must not differ based on
    // whether the address exists.
    console.error('forgotPasswordAction failed:', err)
  }

  return { success: true, data: { sent: true } }
}

const ResetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(1, 'Enter a new password.'),
})

export async function resetPasswordAction(
  input: z.infer<typeof ResetSchema>
): Promise<ActionResult<{ ok: true }>> {
  if (!hasLoyalty) return { success: false, error: NOT_CONFIGURED }

  const parsed = ResetSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Enter a new password.' }
  }

  try {
    const result = await resetPassword(parsed.data.token, parsed.data.password)
    if (!result.ok) return { success: false, error: result.error }
    return { success: true, data: { ok: true } }
  } catch (err) {
    console.error('resetPasswordAction failed:', err)
    return { success: false, error: 'Could not reset your password. Try again.' }
  }
}

export async function resendVerificationAction(): Promise<ActionResult<{ sent: true }>> {
  if (!hasLoyalty) return { success: false, error: NOT_CONFIGURED }

  const customer = await getSessionCustomer()
  if (!customer) return { success: false, error: 'Sign in first.' }
  if (customer.emailVerified) return { success: true, data: { sent: true } }

  if (await isRateLimited('reset', customer.email)) {
    return { success: false, error: TOO_MANY }
  }

  try {
    await recordAttempt('reset', customer.email, true)
    await resendVerification(customer.id, customer.email)
    return { success: true, data: { sent: true } }
  } catch (err) {
    console.error('resendVerificationAction failed:', err)
    return { success: false, error: 'Could not send the email. Try again.' }
  }
}

export async function updateMarketingOptInAction(
  optIn: boolean
): Promise<ActionResult<{ optIn: boolean }>> {
  if (!hasLoyalty) return { success: false, error: NOT_CONFIGURED }

  const customer = await getSessionCustomer()
  if (!customer) return { success: false, error: 'Sign in first.' }

  try {
    await setMarketingOptIn(customer.id, optIn)
    return { success: true, data: { optIn } }
  } catch (err) {
    console.error('updateMarketingOptInAction failed:', err)
    return { success: false, error: 'Could not save your preference.' }
  }
}
