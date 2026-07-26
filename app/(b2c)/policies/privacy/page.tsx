import type { Metadata } from 'next'
import { buildMetadata } from '@/src/lib/seo'
import { PolicyShell, PolicySection } from '../policy-shell'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'What information Royal Backs collects, how it is used, who it is shared with, and the choices you have.',
})

export default function PrivacyPolicyPage() {
  return (
    <PolicyShell
      title="Privacy Policy"
      intro="We collect what we need to sell you a hat or quote your embroidery job, and nothing more. We don't sell your information."
    >
      <PolicySection heading="Who we are">
        <p>
          Royal Backs (RoyalBacks LLC) is a custom hat and embroidery shop based in Milton,
          Massachusetts. This policy covers royalbacks.com and the forms on it.
        </p>
      </PolicySection>

      <PolicySection heading="What we collect">
        <p>
          <strong className="text-rb-black">When you order:</strong> your name, email address,
          shipping and billing address, phone number if you provide one, and the contents of your
          order.
        </p>
        <p>
          <strong className="text-rb-black">When you request an embroidery quote:</strong> your
          name, email, and optionally phone and company, plus the project details you enter —
          garment type, quantity, colors, artwork description, timeline, and budget range.
        </p>
        <p>
          <strong className="text-rb-black">When you sign up for emails:</strong> your email address
          and your consent to receive them.
        </p>
        <p>
          <strong className="text-rb-black">Automatically:</strong> aggregate, anonymous usage
          statistics — pages viewed, referring site, approximate country, device type. We use
          Plausible Analytics, which does not use cookies and does not track individuals across
          sites.
        </p>
        <p>
          We do not collect or store your full payment card details. Card information is entered
          directly with our payment processor and never touches our servers.
        </p>
      </PolicySection>

      <PolicySection heading="How we use it">
        <p>
          To process, fulfill, and ship your order; to respond to your quote request and send you a
          proof; to send order and shipping confirmations; to send marketing emails if — and only if
          — you asked for them; and to keep the site working and secure.
        </p>
      </PolicySection>

      <PolicySection heading="Who we share it with">
        <p>
          Only the service providers needed to run the business, and only for that purpose:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-rb-black">Shopify</strong> — storefront, checkout, and order
            management
          </li>
          <li>
            <strong className="text-rb-black">Payment processors</strong> — to charge your card
          </li>
          <li>
            <strong className="text-rb-black">Resend</strong> — to deliver quote confirmations and
            transactional email
          </li>
          <li>
            <strong className="text-rb-black">Shipping carriers</strong> — to deliver your order
          </li>
          <li>
            <strong className="text-rb-black">Vercel</strong> — website hosting
          </li>
        </ul>
        <p>
          We do not sell, rent, or trade your personal information. We may disclose information if
          required by law or to protect our legal rights.
        </p>
      </PolicySection>

      <PolicySection heading="Email and marketing">
        <p>
          Marketing emails only go to people who opted in. Every one has an unsubscribe link, and
          unsubscribing takes effect immediately. Order confirmations, shipping notices, and replies
          to your quote are transactional — you&apos;ll get those regardless, because they&apos;re
          about a purchase you made.
        </p>
      </PolicySection>

      <PolicySection heading="How long we keep it">
        <p>
          Order records are kept as long as needed for tax, accounting, and warranty purposes.
          Quote requests are kept while the project is active and for a reasonable period after, so
          we can pick up where we left off on a reorder. Email subscribers are kept until you
          unsubscribe.
        </p>
      </PolicySection>

      <PolicySection heading="Your choices">
        <p>
          You can ask us what personal information we hold about you, ask us to correct it, or ask
          us to delete it. Email{' '}
          <a href="mailto:info@royalbacks.com" className="underline hover:text-rb-black transition-colors">
            info@royalbacks.com
          </a>{' '}
          and we&apos;ll respond within 30 days. We may need to keep some records where the law
          requires it.
        </p>
        <p>
          Depending on where you live, you may have additional rights under laws such as the
          Massachusetts data protection regulations, the California Consumer Privacy Act, or the
          GDPR. We honor these requests regardless of where you live.
        </p>
      </PolicySection>

      <PolicySection heading="Children">
        <p>
          This site is not directed at children under 13, and we do not knowingly collect their
          information. If you believe a child has given us information, email us and we&apos;ll
          delete it.
        </p>
      </PolicySection>

      <PolicySection heading="Changes to this policy">
        <p>
          If we change this policy we&apos;ll update the date at the bottom of this page. Material
          changes will be announced on the site.
        </p>
      </PolicySection>
    </PolicyShell>
  )
}
