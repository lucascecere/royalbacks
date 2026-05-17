import type { Metadata } from 'next'
import Link from 'next/link'
import { getActiveDrop, getArchivedDrops } from '@/src/services/drops'
import { buildMetadata } from '@/src/lib/seo'
import { DropBadge } from '@/src/components/product/drop-badge'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'

export const revalidate = 900

export const metadata: Metadata = buildMetadata({
  title: 'Drops',
  description:
    'Royal Backs limited-edition drops. Small runs, seasonal designs, and collaborations. Once gone, gone.',
})

export default async function DropsPage() {
  const [activeDrop, archivedDrops] = await Promise.all([getActiveDrop(), getArchivedDrops()])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <BreadcrumbNav
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Collections', href: '/collections' },
          { name: 'Drops', href: '/collections/drops' },
        ]}
      />

      <header className="mt-6 mb-10">
        <h1 className="font-display text-4xl font-bold text-rb-navy mb-3">Drops</h1>
        <p className="text-rb-muted text-lg max-w-xl">
          Limited releases. Seasonal designs. When they sell out, they&apos;re done.
        </p>
      </header>

      {activeDrop ? (
        <div className="mb-16">
          <div className="bg-rb-navy rounded-sm p-8 lg:p-12 text-rb-cream">
            <div className="flex items-start justify-between gap-4 mb-6">
              <DropBadge status={activeDrop.status} />
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
              {activeDrop.title}
            </h2>
            <p className="text-rb-cream/70 mb-8">
              This drop is active now. Get it before it closes.
            </p>
            <Link
              href={`/collections/drops/${activeDrop.handle}`}
              className="inline-block bg-rb-gold text-rb-navy font-semibold px-6 py-3 rounded-sm hover:bg-rb-gold-light transition-colors"
            >
              Shop This Drop
            </Link>
          </div>
        </div>
      ) : (
        <div className="mb-16 bg-rb-surface border border-rb-border rounded-sm p-8 text-center">
          <p className="text-rb-muted font-display text-xl">No active drop right now.</p>
          <p className="text-sm text-rb-muted mt-2">Check back soon — the next one is coming.</p>
        </div>
      )}

      {archivedDrops.length > 0 && (
        <div>
          <h2 className="font-display text-2xl font-bold text-rb-navy mb-6">Past Drops</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {archivedDrops.map((drop) => (
              <Link
                key={drop.handle}
                href={`/collections/drops/${drop.handle}`}
                className="group block bg-white border border-rb-border rounded-sm p-6 hover:border-rb-muted transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <DropBadge status={drop.status} />
                </div>
                <h3 className="font-display text-lg font-semibold text-rb-navy/70 group-hover:text-rb-navy transition-colors">
                  {drop.title}
                </h3>
                {drop.endDate && (
                  <p className="text-xs text-rb-muted mt-2">
                    Ended {new Date(drop.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
