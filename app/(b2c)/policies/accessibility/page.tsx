import type { Metadata } from 'next'
import { buildMetadata } from '@/src/lib/seo'
import { PolicyShell, PolicySection } from '../policy-shell'

export const metadata: Metadata = buildMetadata({
  title: 'Accessibility',
  description:
    'Royal Backs is committed to keeping royalbacks.com usable for everyone. How to reach us if something gets in your way.',
})

export default function AccessibilityPage() {
  return (
    <PolicyShell
      title="Accessibility"
      intro="We want everyone to be able to use this site. If something gets in your way, tell us and we'll fix it."
    >
      <PolicySection heading="Our commitment">
        <p>
          Royal Backs is committed to making royalbacks.com usable for people of all abilities. We
          aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA, and we treat
          accessibility as ongoing work rather than a box to check.
        </p>
      </PolicySection>

      <PolicySection heading="What we've built in">
        <ul className="list-disc pl-5 space-y-2">
          <li>Keyboard navigation throughout, including a skip-to-content link on every page</li>
          <li>Semantic HTML structure and labelled form fields</li>
          <li>Alternative text on meaningful images</li>
          <li>Visible focus indicators on links, buttons, and form controls</li>
          <li>Text that reflows and stays readable when zoomed or viewed on a small screen</li>
          <li>Color choices checked for contrast against their backgrounds</li>
        </ul>
      </PolicySection>

      <PolicySection heading="Known limitations">
        <p>
          Some third-party components — most notably the checkout, which is hosted by our
          ecommerce platform — are outside our direct control. We choose vendors with accessibility
          in mind and report problems to them when we find them.
        </p>
        <p>
          If you hit a barrier anywhere on the site, we would genuinely rather hear about it than
          not.
        </p>
      </PolicySection>

      <PolicySection heading="Getting help or reporting a problem">
        <p>
          Email{' '}
          <a href="mailto:info@royalbacks.com" className="underline hover:text-rb-black transition-colors">
            info@royalbacks.com
          </a>{' '}
          with the page you were on and what went wrong. We aim to respond within 2 business days.
        </p>
        <p>
          If a part of the site isn&apos;t working for you, we&apos;re also happy to take your order
          or quote request directly over email — you shouldn&apos;t have to fight the website to buy
          a hat.
        </p>
      </PolicySection>
    </PolicyShell>
  )
}
