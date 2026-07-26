import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY ?? 're_placeholder'

export const resend = new Resend(apiKey)

/** False when the key is missing or still the build-time placeholder. */
export const isEmailConfigured = apiKey.startsWith('re_') && apiKey !== 're_placeholder'

type SendPayload = Parameters<typeof resend.emails.send>[0]

/**
 * Resend resolves with `{ data, error }` instead of throwing on API failures
 * (bad key, unverified domain, rate limit). Sending without checking `error`
 * silently drops the message, so every send goes through here and throws.
 */
export async function sendEmail(payload: SendPayload): Promise<void> {
  if (!isEmailConfigured) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  const { error } = await resend.emails.send(payload)
  if (error) {
    throw new Error(`Resend rejected the message: ${error.name} — ${error.message}`)
  }
}
