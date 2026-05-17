import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/src/lib/seo'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'

export const metadata: Metadata = buildMetadata({
  title: 'Embroidery Portfolio',
  description:
    'Custom embroidery work by Royal Backs — sports teams, businesses, restaurants, and more. Based in Milton, MA.',
})

const PORTFOLIO_ITEMS = [
  {
    category: 'Sports Teams',
    title: 'South Shore Youth Hockey',
    description: 'Travel hats with embroidered logo for 3 age groups. 120 pieces, 2-week turnaround.',
    details: ['Structured 6-panel caps', '4-color embroidery', 'Youth sizing'],
  },
  {
    category: 'Construction',
    title: 'Braintree Landscaping Co.',
    description: 'Polo shirts and caps for crew of 18. Ongoing order relationship — reorder every spring.',
    details: ['Left-chest logo polos', 'Matching cap program', 'PMS color matching'],
  },
  {
    category: 'Restaurant',
    title: 'Milton Tavern',
    description: 'Staff uniforms and branded merch. Front-of-house polos + customer hats for sale at the bar.',
    details: ['Staff uniform program', 'Retail merch line', 'Same-batch color consistency'],
  },
  {
    category: 'Non-Profit',
    title: 'Quincy YMCA',
    description: 'Volunteer shirts and staff jackets for annual fundraiser. 60 pieces, 10-day turnaround.',
    details: ['Soft-shell jackets', 'Staff polos', 'Event tees'],
  },
  {
    category: 'Corporate',
    title: 'Hingham Financial Group',
    description: 'Client gift packages: embroidered hats and bags. Delivered in branded boxes.',
    details: ['Premium structured caps', 'Canvas tote bags', 'Packaging coordination'],
  },
  {
    category: 'Hockey',
    title: 'Norwell HS Hockey',
    description: 'Locker room hats and parent apparel. Booster club sweatshirts for fundraiser.',
    details: ['Locker room caps', 'Booster club hoodies', 'Parent tee program'],
  },
]

export default function PortfolioPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <BreadcrumbNav
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Embroidery', href: '/embroidery' },
          { name: 'Portfolio', href: '/embroidery/portfolio' },
        ]}
      />

      <header className="mt-6 mb-12">
        <h1 className="font-display text-4xl font-bold text-rb-navy mb-3">Portfolio</h1>
        <p className="text-rb-muted text-lg max-w-xl">
          A sample of the custom embroidery work we&apos;ve done for South Shore teams and
          businesses.
        </p>
        <p className="text-sm text-rb-muted mt-2">
          Note: Photos coming soon — check back or{' '}
          <a href="mailto:info@royalbacks.com" className="underline hover:text-rb-navy transition-colors">
            email us
          </a>{' '}
          to request samples.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PORTFOLIO_ITEMS.map((item) => (
          <div key={item.title} className="bg-white border border-rb-border rounded-sm overflow-hidden">
            {/* Placeholder image area */}
            <div className="h-48 bg-rb-navy flex items-center justify-center">
              <span className="font-display text-4xl font-bold text-rb-gold/30">RB</span>
            </div>
            <div className="p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-rb-gold">
                {item.category}
              </span>
              <h2 className="font-display text-lg font-semibold text-rb-navy mt-1 mb-2">
                {item.title}
              </h2>
              <p className="text-sm text-rb-muted leading-relaxed mb-4">{item.description}</p>
              <ul className="space-y-1">
                {item.details.map((d) => (
                  <li key={d} className="text-xs text-rb-muted flex items-center gap-2">
                    <span className="w-1 h-1 bg-rb-gold rounded-full flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 bg-rb-navy text-rb-cream rounded-sm p-8 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">Want to see work like yours?</h2>
        <p className="text-rb-cream/70 mb-6">
          Tell us your project and we can share similar examples from past orders.
        </p>
        <Link
          href="/embroidery/quote"
          className="inline-block bg-rb-gold text-rb-navy font-semibold px-8 py-3 rounded-sm hover:bg-rb-gold-light transition-colors"
        >
          Get a Quote
        </Link>
      </div>
    </div>
  )
}
