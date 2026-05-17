import { NextRequest, NextResponse } from 'next/server'
import { QuoteFormSchema } from '@/src/types/forms'
import { resend } from '@/src/lib/email'

function generateConfirmationId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'RB-'
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = QuoteFormSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid form data. Please check your answers and try again.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    )
  }

  const data = parsed.data
  const confirmationId = generateConfirmationId()

  // Notification email to Royal Backs
  try {
    await resend.emails.send({
      from: 'quotes@royalbacks.com',
      to: 'info@royalbacks.com',
      subject: `New Quote Request [${confirmationId}] — ${data.garment_type} for ${data.name}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Confirmation:</strong> ${confirmationId}</p>
        <hr />
        <h3>Contact</h3>
        <p>Name: ${data.name}<br/>
        Email: ${data.email}<br/>
        Phone: ${data.phone ?? 'Not provided'}<br/>
        Company: ${data.company ?? 'Not provided'}</p>
        <h3>Order Details</h3>
        <p>Garment: ${data.garment_type}<br/>
        Quantity: ${data.quantity}<br/>
        Colors: ${data.colors_count}<br/>
        Notes: ${data.notes ?? 'None'}</p>
        <h3>Artwork</h3>
        <p>Has artwork: ${data.has_artwork ? 'Yes' : 'No'}<br/>
        Format: ${data.artwork_format ?? 'N/A'}<br/>
        Description: ${data.artwork_description ?? 'None'}</p>
        <h3>Timeline & Budget</h3>
        <p>Deadline: ${data.deadline}<br/>
        Budget: ${data.budget_range}</p>
      `,
    })
  } catch (err) {
    console.error('Failed to send quote notification email:', err)
  }

  // Confirmation email to customer
  try {
    await resend.emails.send({
      from: 'quotes@royalbacks.com',
      to: data.email,
      subject: `Quote Request Received [${confirmationId}] — Royal Backs`,
      html: `
        <h2>We got your request.</h2>
        <p>Hi ${data.name},</p>
        <p>Your custom embroidery quote request has been received. We'll review it and get back to you within 1 business day.</p>
        <p><strong>Confirmation ID:</strong> ${confirmationId}</p>
        <hr />
        <p>Questions? Reply to this email or reach us at info@royalbacks.com.</p>
        <p>— Royal Backs, Milton, MA</p>
      `,
    })
  } catch (err) {
    console.error('Failed to send customer confirmation email:', err)
  }

  return NextResponse.json({ success: true, confirmationId })
}
