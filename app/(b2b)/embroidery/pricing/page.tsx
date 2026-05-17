import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/src/lib/seo'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'

export const metadata: Metadata = buildMetadata({
  title: 'Embroidery Pricing | Custom Hats & Apparel | Royal Backs',
  description:
    'Transparent embroidery pricing from Royal Backs. Hats starting at $14, polos at $18. Quantity breaks, digitizing fees, and no surprises.',
})

const PRICING_TIERS = [
  {
    garment: 'Hats',
    base: '$14',
    tier12: '$12',
    tier50: '$10',
    tier100: '$9',
  },
  {
    garment: 'Polos',
    base: '$18',
    tier12: '$16',
    tier50: '$14',
    tier100: '$12',
  },
  {
    garment: 'T-Shirts',
    base: '$14',
    tier12: '$12',
    tier50: '$10',
    tier100: '$9',
  },
  {
    garment: 'Sweatshirts',
    base: '$24',
    tier12: '$22',
    tier50: '$20',
    tier100: '$18',
  },
  {
    garment: 'Jackets',
    base: '$36',
    tier12: '$32',
    tier50: '$28',
    tier100: '$26',
  },
  {
    garment: 'Bags',
    base: '$16',
    tier12: '$14',
    tier50: '$12',
    tier100: '$11',
  },
]

const ADDITIONAL_FEES = [
  {
    item: 'Digitizing (new design)',
    price: '$35–$65',
    notes: 'One-time fee. Reused on all future orders with that design.',
  },
  {
    item: 'Back logo / second location',
    price: '+$4–$8/piece',
    notes: 'Depends on design complexity.',
  },
  {
    item: 'Rush order',
    price: '2x base price',
    notes: 'For orders needed within 2–3 business days.',
  },
  {
    item: 'Shipping',
    price: 'Carrier rates',
    notes: 'Free for local Milton, MA pickup.',
  },
]

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <BreadcrumbNav
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Embroidery', href: '/embroidery' },
          { name: 'Pricing', href: '/embroidery/pricing' },
        ]}
      />

      <header className="mt-6 mb-4">
        <h1 className="font-display text-4xl font-bold text-rb-navy mb-3">Embroidery Pricing</h1>
        <p className="text-rb-muted text-lg max-w-xl leading-relaxed">
          We show our prices because we&apos;re confident in our value. No bait-and-switch, no
          surprise fees after you approve. Prices below are embroidery + garment combined.
        </p>
      </header>

      <div className="bg-rb-gold/10 border border-rb-gold/30 rounded-sm px-5 py-4 mb-10 text-sm text-rb-navy">
        <strong>Pricing note:</strong> These are starting estimates. Final pricing depends on
        garment brand, exact design complexity, and quantity. Request a quote for exact numbers.
      </div>

      {/* Pricing table */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-bold text-rb-navy mb-6">Price Per Piece</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-rb-border rounded-sm overflow-hidden">
            <thead>
              <tr className="bg-rb-navy text-rb-cream">
                <th className="text-left px-4 py-3 font-medium">Garment</th>
                <th className="text-center px-4 py-3 font-medium">6 pcs</th>
                <th className="text-center px-4 py-3 font-medium">12 pcs</th>
                <th className="text-center px-4 py-3 font-medium">50 pcs</th>
                <th className="text-center px-4 py-3 font-medium">100+ pcs</th>
              </tr>
            </thead>
            <tbody>
              {PRICING_TIERS.map((row, i) => (
                <tr key={row.garment} className={i % 2 === 0 ? 'bg-white' : 'bg-rb-surface'}>
                  <td className="px-4 py-3 font-medium text-rb-navy">{row.garment}</td>
                  <td className="px-4 py-3 text-center text-rb-muted">{row.base}</td>
                  <td className="px-4 py-3 text-center text-rb-muted">{row.tier12}</td>
                  <td className="px-4 py-3 text-center text-rb-muted">{row.tier50}</td>
                  <td className="px-4 py-3 text-center font-medium text-rb-navy">{row.tier100}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Additional fees */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-bold text-rb-navy mb-6">Additional Fees</h2>
        <div className="space-y-3">
          {ADDITIONAL_FEES.map((fee) => (
            <div key={fee.item} className="flex items-start justify-between gap-4 p-4 bg-white border border-rb-border rounded-sm">
              <div>
                <p className="font-medium text-rb-navy text-sm">{fee.item}</p>
                <p className="text-xs text-rb-muted mt-0.5">{fee.notes}</p>
              </div>
              <span className="text-sm font-semibold text-rb-navy flex-shrink-0">{fee.price}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Value prop */}
      <section className="bg-rb-navy text-rb-cream rounded-sm p-8 mb-10">
        <h2 className="font-display text-2xl font-bold mb-4">Why we show our prices</h2>
        <p className="text-rb-cream/70 leading-relaxed">
          A lot of embroidery shops make you request a quote just to get a ballpark. We don&apos;t
          think that&apos;s fair. These numbers give you a real starting point so you can decide
          if we&apos;re the right fit before spending any time on forms. If your project has
          specific needs, the quote will give you an exact number.
        </p>
      </section>

      <div className="text-center">
        <Link
          href="/embroidery/quote"
          className="inline-block bg-rb-gold text-rb-navy font-semibold px-10 py-4 rounded-sm hover:bg-rb-gold-light transition-colors"
        >
          Get an Exact Quote
        </Link>
        <p className="text-sm text-rb-muted mt-4">We respond within 1 business day.</p>
      </div>
    </div>
  )
}
