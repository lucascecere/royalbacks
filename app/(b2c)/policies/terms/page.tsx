import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/src/lib/seo'
import { PolicyShell, PolicySection } from '../policy-shell'

export const metadata: Metadata = buildMetadata({
  title: 'Terms & Conditions',
  description:
    'The terms that apply when you buy from Royal Backs or order custom embroidery work.',
})

export default function TermsPage() {
  return (
    <PolicyShell
      title="Terms & Conditions"
      intro="The ground rules for buying from Royal Backs and ordering custom embroidery. Plain language, no traps."
    >
      <PolicySection heading="Agreement">
        <p>
          By using royalbacks.com or placing an order, you agree to these terms. If you don&apos;t
          agree with them, please don&apos;t use the site. Royal Backs is operated by RoyalBacks
          LLC, Milton, Massachusetts.
        </p>
      </PolicySection>

      <PolicySection heading="Orders and pricing">
        <p>
          All prices are in US dollars. We do our best to keep pricing, product descriptions, and
          availability accurate, but errors happen. We reserve the right to correct errors and to
          cancel or refuse any order — including orders where a product was listed at an incorrect
          price. If we cancel an order you already paid for, you get a full refund.
        </p>
        <p>
          Placing an order is an offer to buy. Your order is accepted when we send an order
          confirmation or, for custom work, when we confirm your quote in writing.
        </p>
        <p>
          Embroidery prices shown on the{' '}
          <Link href="/embroidery/pricing" className="underline hover:text-rb-black transition-colors">
            pricing page
          </Link>{' '}
          are starting estimates. Your final quote depends on garment, quantity, stitch count,
          number of colors, and timeline, and will be confirmed before any work begins.
        </p>
      </PolicySection>

      <PolicySection heading="Custom embroidery work">
        <p>
          <strong className="text-rb-black">Proofs.</strong> We send a digital proof before
          production. Nothing goes on the machine until you approve it. Approving a proof means
          you&apos;ve checked spelling, colors, sizing, and placement.
        </p>
        <p>
          <strong className="text-rb-black">Once approved.</strong> Custom goods are made for you
          specifically and cannot be cancelled, returned, or refunded once production starts. If we
          deviate from your approved proof, we remake it at no charge.
        </p>
        <p>
          <strong className="text-rb-black">Color and material variation.</strong> Thread and
          garment colors can vary slightly between batches and can look different on screen than in
          person. We match as closely as the materials allow. Minor variation is not a defect.
        </p>
        <p>
          <strong className="text-rb-black">Quantities.</strong> On large runs, garment suppliers
          occasionally short or substitute stock. We&apos;ll always contact you before substituting
          anything.
        </p>
        <p>
          <strong className="text-rb-black">Customer-supplied garments.</strong> If you send us your
          own garments to embroider, we&apos;ll treat them carefully, but we can&apos;t be
          responsible for the cost of items damaged during production. We recommend sending a couple
          of spares on large runs.
        </p>
      </PolicySection>

      <PolicySection heading="Artwork and intellectual property">
        <p>
          When you send us artwork, you confirm that you own it or have permission to use it, and
          you authorize us to reproduce it on your order. You remain the owner of your artwork.
        </p>
        <p>
          We won&apos;t knowingly reproduce trademarked or copyrighted work belonging to someone
          else, and we may decline any job we believe infringes another party&apos;s rights. You
          agree to cover any third-party claim arising from artwork you supplied to us.
        </p>
        <p>
          Digitized embroidery files we create remain our property, though we&apos;re happy to reuse
          them for your reorders at no additional digitizing charge.
        </p>
        <p>
          We may photograph completed work for our portfolio and social media. Tell us if you&apos;d
          rather we didn&apos;t and we won&apos;t.
        </p>
        <p>
          The Royal Backs name, logo, designs, and site content belong to RoyalBacks LLC and may not
          be reproduced without permission.
        </p>
      </PolicySection>

      <PolicySection heading="Shipping, returns, and payment">
        <p>
          Delivery, turnaround, and returns are covered in our{' '}
          <Link href="/policies/shipping" className="underline hover:text-rb-black transition-colors">
            Shipping &amp; Returns policy
          </Link>
          , which forms part of these terms. Payment is due at checkout for stock items. Custom
          orders may require a deposit before production, which will be stated in your quote.
        </p>
      </PolicySection>

      <PolicySection heading="Site use">
        <p>
          Don&apos;t use this site to break the law, interfere with its operation, scrape it in bulk,
          or attempt to gain unauthorized access. We may suspend access for any of the above.
        </p>
      </PolicySection>

      <PolicySection heading="Disclaimers and liability">
        <p>
          The site and its content are provided &ldquo;as is.&rdquo; We don&apos;t warrant that the
          site will be uninterrupted or error-free.
        </p>
        <p>
          To the fullest extent permitted by law, our total liability for any claim relating to an
          order is limited to the amount you paid for that order. We are not liable for indirect or
          consequential losses, including lost profits or missed events. Nothing here limits
          liability that cannot be limited under Massachusetts law.
        </p>
      </PolicySection>

      <PolicySection heading="Governing law">
        <p>
          These terms are governed by the laws of the Commonwealth of Massachusetts, and any dispute
          will be handled in the state or federal courts located in Massachusetts.
        </p>
      </PolicySection>

      <PolicySection heading="Changes">
        <p>
          We may update these terms. The version posted when you place your order is the one that
          applies to it.
        </p>
      </PolicySection>
    </PolicyShell>
  )
}
