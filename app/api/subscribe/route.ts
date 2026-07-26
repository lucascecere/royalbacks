import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/src/lib/email'

const SubscribeSchema = z.object({
  email: z.email('Please enter a valid email address'),
  consent: z.literal(true, { message: 'Please agree to receive emails' }),
})

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

  const { email } = parsed.data

  try {
    await sendEmail({
      from: 'Royal Backs <noreply@royalbacks.com>',
      to: 'info@royalbacks.com',
      subject: `New email signup — ${email}`,
      replyTo: email,
      html: `<p><strong>${email}</strong> signed up for Royal Backs emails from the site footer.</p>
             <p>They checked the consent box agreeing to receive marketing email.</p>`,
    })
  } catch (err) {
    console.error(`[subscribe] failed to record signup for ${email}:`, err)
    return NextResponse.json(
      { success: false, error: "That didn't go through. Please try again in a minute." },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true })
}
