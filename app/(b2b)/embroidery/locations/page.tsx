import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllLocations } from '@/src/services/locations'
import { SERVICE_AREA_TOWNS, buildMetadata } from '@/src/lib/seo'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'

export const metadata: Metadata = buildMetadata({
  title: 'Custom Embroidery — Service Area | South Shore MA',
  description:
    'Royal Backs provides custom embroidery services across the South Shore of Massachusetts. Milton, Quincy, Hingham, Braintree, and beyond.',
})

export default function LocationsIndexPage() {
  const locations = getAllLocations()

  // Fall back to static list if no MDX files yet
  const displayTowns =
    locations.length > 0
      ? locations.map((l) => ({ name: l.town, slug: l.slug, isHq: l.is_hq }))
      : SERVICE_AREA_TOWNS.map((name) => ({
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          isHq: name === 'Milton',
        }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <BreadcrumbNav
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Embroidery', href: '/embroidery' },
          { name: 'Service Area', href: '/embroidery/locations' },
        ]}
      />

      <header className="mt-6 mb-12">
        <h1 className="font-display text-4xl font-bold text-rb-navy mb-3">
          Custom Embroidery Across the South Shore
        </h1>
        <p className="text-rb-muted text-lg max-w-xl leading-relaxed">
          We&apos;re based in Milton, MA and serve businesses, sports teams, and organizations
          across the South Shore and greater Boston area. Select your town to learn more.
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {displayTowns.map((town) => (
          <Link
            key={town.slug}
            href={`/embroidery/locations/${town.slug}`}
            className="group block p-4 bg-white border border-rb-border rounded-sm hover:border-rb-navy hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-rb-navy text-sm group-hover:text-rb-gold transition-colors">
                {town.name}
              </span>
              {town.isHq && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-rb-gold bg-rb-gold/10 px-1.5 py-0.5 rounded-full">
                  HQ
                </span>
              )}
            </div>
            <p className="text-xs text-rb-muted mt-1">Embroidery services &rarr;</p>
          </Link>
        ))}
      </div>

      <div className="mt-14 bg-rb-navy text-rb-cream rounded-sm p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl font-bold mb-4">
            Don&apos;t see your town?
          </h2>
          <p className="text-rb-cream/70 mb-6">
            We serve the entire South Shore and beyond. If your town isn&apos;t listed, reach out
            — we can almost certainly help.
          </p>
          <Link
            href="/embroidery/quote"
            className="inline-block bg-rb-gold text-rb-navy font-semibold px-8 py-3 rounded-sm hover:bg-rb-gold-light transition-colors"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </div>
  )
}
