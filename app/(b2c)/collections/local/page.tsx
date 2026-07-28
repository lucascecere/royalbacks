import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { buildMetadata, SOUTH_SHORE_TOWNS } from '@/src/lib/seo'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'

export const metadata: Metadata = buildMetadata({
  title: 'Local Collection — South Shore MA',
  description:
    'Royal Backs Local Collection — hats representing South Shore Massachusetts towns. Milton, Quincy, Hingham, Cohasset, and more.',
})


export default function LocalCollectionPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <BreadcrumbNav
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Collections', href: '/collections' },
          { name: 'Local', href: '/collections/local' },
        ]}
      />

      <header className="mt-6 mb-10">
        <h1 className="font-display text-4xl font-bold text-rb-navy mb-3">Local Collection</h1>
        <p className="text-rb-muted text-lg max-w-xl">
          South Shore towns, on your head. Select your town to see what&apos;s available.
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {SOUTH_SHORE_TOWNS.map((town) => (
          <Link
            key={town.slug}
            href={`/collections/local/${town.slug}`}
            className="group block bg-white border border-rb-border rounded-sm overflow-hidden hover:border-rb-navy hover:shadow-sm transition-all"
          >
            {/* Towns with a finished design show it; the rest stay a plain tile. */}
            {town.assets?.product && (
              <div className="relative aspect-[4/3] bg-[#F7F6F4] overflow-hidden">
                <Image
                  src={town.assets.product}
                  alt={town.assets.productAlt ?? `Royal Backs ${town.name} cap`}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
            )}
            <div className="p-5 text-center">
              <span className="font-display text-lg font-semibold text-rb-navy group-hover:text-rb-gold transition-colors">
                {town.name}
              </span>
              <p className="text-xs text-rb-muted mt-1">
                {town.assets?.product ? 'Shop the cap' : 'View hats'} &rarr;
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-rb-navy/5 border border-rb-border rounded-sm p-6">
        <h2 className="font-display text-xl font-semibold text-rb-navy mb-2">
          Don&apos;t see your town?
        </h2>
        <p className="text-rb-muted text-sm leading-relaxed">
          We&apos;re always adding new towns. If yours isn&apos;t listed yet, reach out — we may
          have something in the works, or we can do a custom run.
        </p>
      </div>
    </div>
  )
}
