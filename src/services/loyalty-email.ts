import 'server-only'

import { sendEmail } from '@/src/lib/email'
import { SITE_URL } from '@/src/lib/seo'
import { formatCents, formatPoints } from '@/src/lib/loyalty/config'

const FROM = 'Royal Backs <hello@royalbacks.com>'
const REPLY_TO = 'info@royalbacks.com'

/** Escape anything customer-supplied before it goes into an HTML email. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function layout(bodyHtml: string, footerNote?: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f5f5f5;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;font-family:-apple-system,Helvetica Neue,Helvetica,Arial,sans-serif;color:#111;">
    <div style="background:#ffffff;border-radius:12px;padding:32px;">
      <p style="margin:0 0 24px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#CC2929;">Royal Backs</p>
      ${bodyHtml}
    </div>
    <p style="margin:24px 0 0;font-size:12px;color:#999;text-align:center;line-height:1.6;">
      Royal Backs &middot; Milton, MA<br />
      ${footerNote ?? ''}
    </p>
  </div>
</body>
</html>`
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#CC2929;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;padding:14px 28px;border-radius:7px;">${label}</a>`
}

// ---------------------------------------------------------------------------
// Transactional — always sent, no opt-out.
// ---------------------------------------------------------------------------

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const url = `${SITE_URL}/account/verify?token=${encodeURIComponent(token)}`
  await sendEmail({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: 'Confirm your Royal Backs account',
    html: layout(
      `<h1 style="margin:0 0 16px;font-size:24px;">Confirm your email</h1>
       <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#444;">
         Click below to finish setting up your account and start earning points on every order.
       </p>
       ${button(url, 'Confirm Email')}
       <p style="margin:24px 0 0;font-size:13px;color:#888;line-height:1.6;">
         This link expires in 48 hours. If you didn't create an account, ignore this email.
       </p>`
    ),
  })
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  const url = `${SITE_URL}/account/reset?token=${encodeURIComponent(token)}`
  await sendEmail({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: 'Reset your Royal Backs password',
    html: layout(
      `<h1 style="margin:0 0 16px;font-size:24px;">Reset your password</h1>
       <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#444;">
         Click below to choose a new password.
       </p>
       ${button(url, 'Reset Password')}
       <p style="margin:24px 0 0;font-size:13px;color:#888;line-height:1.6;">
         This link expires in 1 hour and can only be used once. If you didn't ask for this,
         you can ignore it — your password won't change.
       </p>`
    ),
  })
}

export async function sendRedemptionEmail(
  to: string,
  code: string,
  valueCents: number,
  expiresAt: Date
): Promise<void> {
  const expiry = expiresAt.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  await sendEmail({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: `Your ${formatCents(valueCents)} Royal Backs reward`,
    html: layout(
      `<h1 style="margin:0 0 16px;font-size:24px;">${formatCents(valueCents)} off your order</h1>
       <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#444;">
         Your reward is ready. It's already applied to your cart — this code is just a backup.
       </p>
       <div style="background:#f7f6f4;border:1px dashed #ccc;border-radius:8px;padding:20px;text-align:center;margin:0 0 24px;">
         <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:.06em;">${esc(code)}</p>
       </div>
       ${button(`${SITE_URL}/cart`, 'Back to Cart')}
       <p style="margin:24px 0 0;font-size:13px;color:#888;line-height:1.6;">
         Valid until ${expiry}. It only works on your account, and only once. If it expires
         unused, we put the points back on your balance automatically.
       </p>`
    ),
  })
}

// ---------------------------------------------------------------------------
// Marketing — requires marketing_opt_in.
// ---------------------------------------------------------------------------

export async function sendPointsEarnedEmail(
  to: string,
  pointsEarned: number,
  newBalance: number
): Promise<void> {
  await sendEmail({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: `You earned ${formatPoints(pointsEarned)} points`,
    html: layout(
      `<h1 style="margin:0 0 16px;font-size:24px;">+${formatPoints(pointsEarned)} points</h1>
       <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#444;">
         Thanks for the order. Your balance is now
         <strong>${formatPoints(newBalance)} points</strong>.
       </p>
       ${button(`${SITE_URL}/account`, 'View Your Account')}`,
      `<a href="${SITE_URL}/account/preferences" style="color:#999;">Manage email preferences</a>`
    ),
  })
}

export async function sendRedemptionExpiringEmail(
  to: string,
  code: string,
  valueCents: number,
  daysLeft: number
): Promise<void> {
  await sendEmail({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: `Your ${formatCents(valueCents)} reward expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
    html: layout(
      `<h1 style="margin:0 0 16px;font-size:24px;">Don't lose your reward</h1>
       <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#444;">
         Your ${formatCents(valueCents)} reward (<strong>${esc(code)}</strong>) expires in
         ${daysLeft} day${daysLeft === 1 ? '' : 's'}.
       </p>
       <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#444;">
         If you don't use it, we'll return the points to your balance — nothing is lost either way.
       </p>
       ${button(`${SITE_URL}/collections`, 'Shop Now')}`,
      `<a href="${SITE_URL}/account/preferences" style="color:#999;">Manage email preferences</a>`
    ),
  })
}
