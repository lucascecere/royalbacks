import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/src/lib/email'
import { hasLoyalty } from '@/src/lib/env'
import { db, normalizeEmail } from '@/src/lib/db'

const SubscribeSchema = z.object({
  email: z.email('Please enter a valid email address'),
  consent: z.literal(true, { message: 'Please agree to receive emails' }),
})

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = SubscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid submission' },
      { status: 422 }
    )
  }

  const email = normalizeEmail(parsed.data.email)

  // Store it first where one exists. A durable list is the point; the email to
  // Dylan is just a heads-up, and losing a subscriber because a notification
  // bounced would be the same lead-dropping bug as the quote form had.
  let stored = false
  if (hasLoyalty) {
    try {
      const { error } = await db()
        .from('newsletter_subscribers')
        .upsert(
          { email, source: 'footer', unsubscribed_at: null },
          { onConflict: 'email' }
        )
      if (error) throw new Error(error.message)
      stored = true
    } catch (err) {
      console.error(`[subscribe] failed to store ${email}:`, err)
    }
  }

  try {
    await sendEmail({
      from: 'Royal Backs <noreply@royalbacks.com>',
      to: 'info@royalbacks.com',
      subject: `New email signup — ${email}`,
      replyTo: email,
      html: `<p><strong>${escapeHtml(email)}</strong> signed up for Royal Backs emails from the site footer.</p>
             <p>They checked the consent box agreeing to receive marketing email.</p>`,
    })
  } catch (err) {
    console.error(`[subscribe] notification failed for ${email}:`, err)
    // Already saved, so this is genuinely just a missed notification.
    if (stored) return NextResponse.json({ success: true })
    return NextResponse.json(
      { success: false, error: "That didn't go through. Please try again in a minute." },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true })
}
