import { NextRequest, NextResponse } from 'next/server'
import { QuoteFormSchema } from '@/src/types/forms'
import { notifyDylan, sendQuoteConfirmation } from '@/src/services/quote'

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

  // The notification to Royal Backs IS the lead. If it doesn't go out the
  // request is lost, so never report success on it failing. Pointing the
  // customer at the inbox keeps the lead recoverable.
  try {
    await notifyDylan(data, confirmationId)
  } catch (err) {
    console.error(`[quote ${confirmationId}] lead notification failed for ${data.email}:`, err)
    return NextResponse.json(
      {
        success: false,
        error:
          "We couldn't submit your request just now. Please email info@royalbacks.com with your details and we'll get right back to you.",
      },
      { status: 502 }
    )
  }

  // Lead is captured by here. A failed customer receipt is worth logging but
  // must not fail the submission.
  try {
    await sendQuoteConfirmation(data, confirmationId)
  } catch (err) {
    console.error(`[quote ${confirmationId}] customer confirmation failed:`, err)
  }

  return NextResponse.json({ success: true, confirmationId })
}
