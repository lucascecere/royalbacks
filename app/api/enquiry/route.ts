import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/src/lib/email'

/**
 * Short embroidery enquiry from the homepage.
 *
 * Deliberately lighter than /api/quote: four fields instead of a four-step wizard,
 * because the homepage's job is to start a conversation, not to price a job. Anyone
 * who wants exact numbers gets pointed at the full quote form.
 */
const EnquirySchema = z.object({
  name: z.string().min(1, 'Tell us your name.').max(120),
  email: z.email('Enter a valid email address.'),
  phone: z.string().max(40).optional().or(z.literal('')),
  message: z.string().min(1, 'Tell us what you need.').max(4000),
})

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function reference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'RB-E'
  for (let i = 0; i < 5; i++) id += chars[Math.floor(Math.random() * chars.length)]
  return id
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = EnquirySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsed.error.issues[0]?.message ?? 'Check the form and try again.',
      },
      { status: 422 }
    )
  }

  const data = parsed.data
  const ref = reference()

  // This email IS the lead. If it doesn't go out, say so — never show a
  // confirmation for an enquiry nobody received.
  try {
    await sendEmail({
      from: 'Royal Backs <noreply@royalbacks.com>',
      to: 'info@royalbacks.com',
      replyTo: data.email,
      subject: `Embroidery enquiry [${ref}] — ${data.name}`,
      html: `
        <h2 style="font-family:Arial,sans-serif;">New embroidery enquiry</h2>
        <p style="font-family:Arial,sans-serif;color:#555;">Reference ${ref} · from the homepage form</p>
        <table style="font-family:Arial,sans-serif;border-collapse:collapse;">
          <tr><td style="padding:4px 16px 4px 0;color:#555;">Name</td><td>${escapeHtml(data.name)}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#555;">Email</td><td>${escapeHtml(data.email)}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#555;">Phone</td><td>${escapeHtml(data.phone || 'Not provided')}</td></tr>
        </table>
        <h3 style="font-family:Arial,sans-serif;margin-top:20px;">What they need</h3>
        <p style="font-family:Arial,sans-serif;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
      `,
    })
  } catch (err) {
    console.error(`[enquiry ${ref}] lead notification failed for ${data.email}:`, err)
    return NextResponse.json(
      {
        success: false,
        error:
          "We couldn't send that just now. Email info@royalbacks.com and we'll pick it straight up.",
      },
      { status: 502 }
    )
  }

  // Receipt to the customer. Best-effort — the lead is already delivered.
  try {
    await sendEmail({
      from: 'Royal Backs <noreply@royalbacks.com>',
      to: data.email,
      replyTo: 'info@royalbacks.com',
      subject: 'We got your message — Royal Backs',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;color:#111;">
          <h2>Thanks, ${escapeHtml(data.name)}.</h2>
          <p>We got your embroidery enquiry and we'll get back to you within one business day.</p>
          <p style="color:#555;">Reference: ${ref}</p>
          <p style="margin-top:24px;">— Royal Backs, Milton MA</p>
        </div>
      `,
    })
  } catch (err) {
    console.error(`[enquiry ${ref}] customer receipt failed:`, err)
  }

  return NextResponse.json({ success: true, reference: ref })
}
