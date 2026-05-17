import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLocationBySlug, getLocationSlugs } from '@/src/services/locations'
import { getCollectionByHandle } from '@/src/services/collections'
import { buildMetadata, buildLocalBusinessSchema } from '@/src/lib/seo'
import { CollectionGrid } from '@/src/components/product/collection-grid'
import { LocalBusinessSchema } from '@/src/components/seo/local-business-schema'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'

export const revalidate = 86400

export async function generateStaticParams() {
  const slugs = getLocationSlugs()
  return slugs.map((slug) => ({ town: slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ town: string }>
}): Promise<Metadata> {
  const { town } = await params
  const location = getLocationBySlug(town)
  if (!location) return {}
  return buildMetadata({
    title: location.meta_title,
    description: location.meta_description,
  })
}

export default async function TownCollectionPage({
  params,
}: {
  params: Promise<{ town: string }>
}) {
  const { town } = await params
  const location = getLocationBySlug(town)
  if (!location) notFound()

  const collection = await getCollectionByHandle('local')
  const products = collection?.products ?? []

  const localBusinessSchema = buildLocalBusinessSchema({
    town: location.town,
    coordinates: location.coordinates,
  })

  return (
    <>
      <LocalBusinessSchema schema={localBusinessSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <BreadcrumbNav
          crumbs={[
            { name: 'Home', href: '/' },
            { name: 'Collections', href: '/collections' },
            { name: 'Local', href: '/collections/local' },
            { name: location.town, href: `/collections/local/${town}` },
          ]}
        />

        <header className="mt-6 mb-10">
          {location.is_hq && (
            <span className="inline-block bg-rb-gold/10 text-rb-gold text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              Our Home
            </span>
          )}
          <h1 className="font-display text-4xl font-bold text-rb-navy mb-3">
            {location.town} Collection
          </h1>
          <p className="text-rb-muted text-lg max-w-xl">
            Hats representing {location.town}, {location.county}. South Shore made, South Shore
            proud.
          </p>
        </header>

        <CollectionGrid products={products} />

        <div className="mt-12 bg-rb-navy/5 border border-rb-border rounded-sm p-6">
          <h2 className="font-display text-xl font-semibold text-rb-navy mb-2">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-rb-muted text-sm mb-4 leading-relaxed">
            We do custom embroidery for {location.town} businesses and organizations too. Hats,
            polos, whatever you need.
          </p>
          <a
            href="/embroidery/quote"
            className="inline-block bg-rb-navy text-rb-cream text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-rb-navy-light transition-colors"
          >
            Get a Custom Quote
          </a>
        </div>
      </div>
    </>
  )
}
