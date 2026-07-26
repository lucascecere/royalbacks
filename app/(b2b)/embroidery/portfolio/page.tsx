import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/src/lib/seo'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'

export const metadata: Metadata = buildMetadata({
  title: 'Embroidery Portfolio',
  description:
    'The kinds of embroidery programs Royal Backs runs — team gear, uniform programs, retail merch, and corporate gifts. Milton, MA.',
})

/**
 * Capability categories, not client case studies. Real projects and photos go
 * here once Royal Backs supplies them with permission to name the customer.
 */
const WORK_TYPES = [
  {
    category: 'Sports Teams',
    title: 'Team and travel gear',
    description:
      'Structured caps, practice polos, and sideline layers sized for a full roster — with youth sizing where you need it and consistent color across every age group.',
    details: ['Structured 6-panel caps', 'Multi-color logo embroidery', 'Youth through adult sizing'],
  },
  {
    category: 'Contractors',
    title: 'Crew uniform programs',
    description:
      'Work shirts, jackets, and caps that hold up on a job site. Set the program up once and reorder for new hires without redoing artwork.',
    details: ['Left-chest logo polos', 'Matching cap program', 'Reorder-ready artwork on file'],
  },
  {
    category: 'Restaurants',
    title: 'Front-of-house and retail',
    description:
      'Staff uniforms that survive the shift, plus branded hats you can actually sell at the bar. Colors stay consistent batch to batch.',
    details: ['Staff uniform program', 'Retail merch line', 'Same-batch color consistency'],
  },
  {
    category: 'Schools & Non-Profits',
    title: 'Spirit wear and event apparel',
    description:
      'Volunteer shirts, staff jackets, and fundraiser merch, priced so a booster club or a nonprofit still clears a margin on it.',
    details: ['Soft-shell jackets', 'Staff polos', 'Event tees'],
  },
  {
    category: 'Businesses',
    title: 'Corporate gifts and swag',
    description:
      'Embroidered hats and bags for client gifts, onboarding kits, and company events — packed and ready to hand out.',
    details: ['Premium structured caps', 'Canvas tote bags', 'Packaging coordination'],
  },
  {
    category: 'Hockey',
    title: 'Locker room and booster gear',
    description:
      'Locker room caps, parent apparel, and booster club sweatshirts, timed around tryouts and the season opener rather than whenever the machine is free.',
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
        <h1 className="font-display text-4xl font-bold text-rb-navy mb-3">What We Make</h1>
        <p className="text-rb-muted text-lg max-w-xl leading-relaxed">
          The kinds of embroidery programs we run for South Shore teams and businesses. Photos of
          finished work are on the way — in the meantime,{' '}
          <a
            href="mailto:info@royalbacks.com"
            className="underline hover:text-rb-navy transition-colors"
          >
            email us
          </a>{' '}
          and we&apos;ll send samples relevant to your project.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {WORK_TYPES.map((item) => (
          <div
            key={item.title}
            className="bg-white border border-rb-border rounded-sm overflow-hidden flex flex-col"
          >
            <div className="p-6 flex flex-col h-full">
              <span className="text-xs font-semibold uppercase tracking-wider text-rb-gold">
                {item.category}
              </span>
              <h2 className="font-display text-lg font-semibold text-rb-navy mt-1 mb-2">
                {item.title}
              </h2>
              <p className="text-sm text-rb-muted leading-relaxed mb-4">{item.description}</p>
              <ul className="space-y-1 mt-auto pt-2 border-t border-rb-border">
                {item.details.map((d) => (
                  <li key={d} className="text-xs text-rb-muted flex items-center gap-2 pt-1">
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
          Tell us what you&apos;re planning and we&apos;ll walk you through options and pricing.
        </p>
        <Link
          href="/embroidery/quote"
          className="inline-block bg-rb-gold text-white font-semibold px-8 py-3 rounded-sm hover:bg-rb-gold-light transition-colors"
        >
          Get a Quote
        </Link>
      </div>
    </div>
  )
}
