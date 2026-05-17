'use server'

import { randomUUID } from 'crypto'
import { QuoteFormSchema } from '@/src/types/forms'
import { notifyDylan, sendQuoteConfirmation } from '@/src/services/quote'
import type { ActionResult } from '@/src/types/action'
import type { QuoteFormData } from '@/src/types/forms'

export async function submitQuote(
  formData: QuoteFormData
): Promise<ActionResult<{ confirmationId: string }>> {
  try {
    const parsed = QuoteFormSchema.safeParse(formData)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid form data',
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      }
    }

    const confirmationId = randomUUID()

    await Promise.all([
      notifyDylan(parsed.data, confirmationId),
      sendQuoteConfirmation(parsed.data, confirmationId),
    ])

    return { success: true, data: { confirmationId } }
  } catch {
    return {
      success: false,
      error:
        'Failed to submit quote. Please try again or email info@royalbacks.com.',
    }
  }
}
