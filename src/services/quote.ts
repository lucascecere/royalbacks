import { resend } from '@/src/lib/email'
import type { QuoteFormData } from '@/src/types/forms'

const NOTIFY_EMAIL = 'info@royalbacks.com'
const FROM_EMAIL = 'Royal Backs <noreply@royalbacks.com>'

const GARMENT_LABELS: Record<string, string> = {
  hats: 'Hats',
  polos: 'Polo Shirts',
  't-shirts': 'T-Shirts',
  sweatshirts: 'Sweatshirts / Hoodies',
  jackets: 'Jackets',
  bags: 'Bags',
  other: 'Other',
}

const DEADLINE_LABELS: Record<string, string> = {
  asap: 'As soon as possible',
  '1_week': 'Within 1 week',
  '2_weeks': 'Within 2 weeks',
  '1_month': 'Within 1 month',
  flexible: 'Flexible',
}

const BUDGET_LABELS: Record<string, string> = {
  under_500: 'Under $500',
  '500_1000': '$500 – $1,000',
  '1000_2500': '$1,000 – $2,500',
  '2500_plus': '$2,500+',
  not_sure: 'Not sure yet',
}

const ARTWORK_FORMAT_LABELS: Record<string, string> = {
  ai: 'Adobe Illustrator (.ai)',
  pdf: 'PDF',
  png: 'PNG',
  jpg: 'JPG',
  other: 'Other format',
  need_design: 'Need design help',
}

export function buildQuoteEmailHtml(
  data: QuoteFormData,
  confirmationId: string
): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
  <h2 style="color: #1a1a1a;">New Quote Request — ${confirmationId}</h2>

  <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px;">Contact Info</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 4px 0; color: #555; width: 160px;">Name</td><td style="padding: 4px 0;">${data.name}</td></tr>
    <tr><td style="padding: 4px 0; color: #555;">Email</td><td style="padding: 4px 0;">${data.email}</td></tr>
    ${data.phone ? `<tr><td style="padding: 4px 0; color: #555;">Phone</td><td style="padding: 4px 0;">${data.phone}</td></tr>` : ''}
    ${data.company ? `<tr><td style="padding: 4px 0; color: #555;">Company</td><td style="padding: 4px 0;">${data.company}</td></tr>` : ''}
  </table>

  <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 24px;">Order Details</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 4px 0; color: #555; width: 160px;">Garment</td><td style="padding: 4px 0;">${GARMENT_LABELS[data.garment_type] ?? data.garment_type}</td></tr>
    <tr><td style="padding: 4px 0; color: #555;">Quantity</td><td style="padding: 4px 0;">${data.quantity}</td></tr>
    <tr><td style="padding: 4px 0; color: #555;">Colors</td><td style="padding: 4px 0;">${data.colors_count}</td></tr>
    ${data.notes ? `<tr><td style="padding: 4px 0; color: #555;">Notes</td><td style="padding: 4px 0;">${data.notes}</td></tr>` : ''}
  </table>

  <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 24px;">Artwork</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 4px 0; color: #555; width: 160px;">Has artwork</td><td style="padding: 4px 0;">${data.has_artwork ? 'Yes' : 'No'}</td></tr>
    ${data.artwork_format ? `<tr><td style="padding: 4px 0; color: #555;">Format</td><td style="padding: 4px 0;">${ARTWORK_FORMAT_LABELS[data.artwork_format] ?? data.artwork_format}</td></tr>` : ''}
    ${data.artwork_description ? `<tr><td style="padding: 4px 0; color: #555;">Description</td><td style="padding: 4px 0;">${data.artwork_description}</td></tr>` : ''}
  </table>

  <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 24px;">Timeline & Budget</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 4px 0; color: #555; width: 160px;">Deadline</td><td style="padding: 4px 0;">${DEADLINE_LABELS[data.deadline] ?? data.deadline}</td></tr>
    <tr><td style="padding: 4px 0; color: #555;">Budget</td><td style="padding: 4px 0;">${BUDGET_LABELS[data.budget_range] ?? data.budget_range}</td></tr>
  </table>

  <p style="margin-top: 32px; font-size: 12px; color: #999;">Confirmation ID: ${confirmationId}</p>
</body>
</html>
  `.trim()
}

export async function notifyDylan(
  data: QuoteFormData,
  confirmationId: string
): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: NOTIFY_EMAIL,
    subject: `New Quote Request from ${data.name} — ${GARMENT_LABELS[data.garment_type] ?? data.garment_type}, qty ${data.quantity}`,
    html: buildQuoteEmailHtml(data, confirmationId),
    replyTo: data.email,
  })
}

export async function sendQuoteConfirmation(
  data: QuoteFormData,
  confirmationId: string
): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.email,
    subject: `We received your quote request — Royal Backs`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
  <h2>Thanks, ${data.name}. We'll be in touch.</h2>
  <p>We received your quote request for <strong>${data.quantity} ${GARMENT_LABELS[data.garment_type] ?? data.garment_type}</strong>. Someone from Royal Backs will get back to you within one business day.</p>
  <p>If you have questions in the meantime, email <a href="mailto:info@royalbacks.com">info@royalbacks.com</a>.</p>
  <p style="margin-top: 32px; font-size: 12px; color: #999;">Confirmation ID: ${confirmationId}</p>
</body>
</html>
    `.trim(),
  })
}
