import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/src/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Collections',
  description:
    'Shop all Royal Backs collections — Originals, Boston, Local South Shore designs, and limited drops.',
})

const COLLECTIONS = [
  {
    handle: 'originals',
    title: 'Originals',
    description:
      'Our signature line. Classic silhouettes, elevated details, and craftsmanship that holds up. These are the hats we started with.',
    href: '/collections/originals',
    accent: 'Since 2017',
  },
  {
    handle: 'boston',
    title: 'Boston',
    description:
      'For the city and everyone who grew up in its orbit. Hats that know where they came from.',
    href: '/collections/boston',
    accent: 'For the city',
  },
  {
    handle: 'local',
    title: 'Local',
    description:
      'South Shore towns — Milton, Quincy, Hingham, Cohasset, and beyond. Your place, on your head.',
    href: '/collections/local',
    accent: 'South Shore',
  },
  {
    handle: 'drops',
    title: 'Drops',
    description:
      'Limited releases, seasonal designs, and one-of-a-kind collaborations. Once they&apos;re gone, they&apos;re gone.',
    href: '/collections/drops',
    accent: 'Limited',
  },
]

export default function CollectionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <header className="mb-12">
        <h1 className="font-display text-4xl font-bold text-rb-navy mb-3">Collections</h1>
        <p className="text-rb-muted text-lg max-w-xl">
          Everything we make, organized by where it comes from and who it&apos;s for.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-6">
        {COLLECTIONS.map((col) => (
          <Link
            key={col.handle}
            href={col.href}
            className="group block bg-white border border-rb-border rounded-sm p-8 hover:border-rb-navy hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-display text-2xl font-bold text-rb-navy group-hover:text-rb-gold transition-colors">
                {col.title}
              </h2>
              <span className="text-xs font-semibold uppercase tracking-wider text-rb-gold bg-rb-gold/10 px-2 py-1 rounded-full">
                {col.accent}
              </span>
            </div>
            <p
              className="text-rb-muted leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ __html: col.description }}
            />
            <span className="flex items-center gap-2 text-sm font-medium text-rb-navy group-hover:text-rb-gold transition-colors">
              Shop {col.title}
              <span aria-hidden="true">&rarr;</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
