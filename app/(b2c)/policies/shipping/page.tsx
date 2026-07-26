import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/src/lib/seo'
import { PolicyShell, PolicySection } from '../policy-shell'

export const metadata: Metadata = buildMetadata({
  title: 'Shipping & Returns',
  description:
    'Shipping options, turnaround times, local pickup in Milton MA, and the return policy for Royal Backs hats and custom embroidery orders.',
})

export default function ShippingPolicyPage() {
  return (
    <PolicyShell
      title="Shipping & Returns"
      intro="How your order gets to you, how long it takes, and what happens if something isn't right."
    >
      <PolicySection heading="Shipping rates">
        <p>
          Shipping within the United States is free on orders over $50. Orders under $50 are charged
          carrier rates, calculated at checkout based on your address and package weight.
        </p>
        <p>
          We currently ship within the United States only. If you&apos;re outside the US and want
          something, email us and we&apos;ll see what we can do.
        </p>
      </PolicySection>

      <PolicySection heading="Local pickup">
        <p>
          Local pickup in Milton, MA is free. Choose it at checkout and we&apos;ll email you when
          your order is ready along with pickup details. Pickup is by arrangement rather than
          walk-in hours, so please wait for that email before heading over.
        </p>
      </PolicySection>

      <PolicySection heading="Turnaround and delivery times">
        <p>
          <strong className="text-rb-black">In-stock hats and apparel</strong> ship within 1–3
          business days. Once shipped, standard domestic delivery typically takes 3–5 business days.
        </p>
        <p>
          <strong className="text-rb-black">Custom embroidery orders</strong> are made to order.
          Most are complete within 5–10 business days after you approve your digital proof. Larger
          runs, rush jobs, and specialty garments can vary — your quote will always state the
          timeline for your specific order.
        </p>
        <p>
          Delivery estimates are not guarantees. Once a package is with the carrier, transit delays
          are outside our control, though we&apos;ll always help you track it down.
        </p>
      </PolicySection>

      <PolicySection heading="Returns on stock items">
        <p>
          Unworn, unwashed stock items in original condition can be returned within 30 days of
          delivery for a refund to the original payment method. Email{' '}
          <a href="mailto:info@royalbacks.com" className="underline hover:text-rb-black transition-colors">
            info@royalbacks.com
          </a>{' '}
          with your order number to start a return.
        </p>
        <p>
          Return shipping is the customer&apos;s responsibility unless the item arrived damaged or
          we shipped the wrong thing — in that case we cover it. Refunds are issued once the return
          arrives and is inspected, typically within 5 business days.
        </p>
      </PolicySection>

      <PolicySection heading="Custom and personalized orders">
        <p>
          Custom embroidered goods are made specifically for you and cannot be returned or refunded
          once production has started. This is why we send a digital proof before anything goes on
          the machine — please review proofs carefully, including spelling, colors, and placement.
        </p>
        <p>
          If we made an error against your approved proof, we will remake the order at no cost to
          you. Reach out within 14 days of delivery with photos and we&apos;ll take care of it.
        </p>
      </PolicySection>

      <PolicySection heading="Damaged, defective, or missing orders">
        <p>
          Email us within 14 days of delivery with your order number and photos of the issue.
          Manufacturing defects and shipping damage are on us — we&apos;ll replace or refund.
        </p>
        <p>
          If tracking shows delivered but nothing arrived, let us know and we&apos;ll open a claim
          with the carrier and work it out with you.
        </p>
      </PolicySection>

      <PolicySection heading="Order changes and cancellations">
        <p>
          Need to change or cancel? Email us as soon as possible. We can usually adjust stock orders
          before they ship. Custom orders can be changed up until you approve your proof; after
          that, production has begun and changes may not be possible.
        </p>
        <p>
          Questions about a specific order, or want a quote on a custom run?{' '}
          <Link href="/embroidery/quote" className="underline hover:text-rb-black transition-colors">
            Request a quote
          </Link>{' '}
          or email us directly.
        </p>
      </PolicySection>
    </PolicyShell>
  )
}
