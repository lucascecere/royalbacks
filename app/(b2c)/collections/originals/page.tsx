import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCollectionByHandle } from '@/src/services/collections'
import { buildMetadata } from '@/src/lib/seo'
import { CollectionGrid } from '@/src/components/product/collection-grid'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'

export const revalidate = 3600

export const metadata: Metadata = buildMetadata({
  title: 'Originals Collection',
  description:
    'The Royal Backs Originals line — signature hats with elevated details and small-batch craftsmanship. Made in Milton, MA.',
})

export default async function OriginalsCollectionPage() {
  const collection = await getCollectionByHandle('originals')

  if (!collection) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <BreadcrumbNav
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Collections', href: '/collections' },
          { name: 'Originals', href: '/collections/originals' },
        ]}
      />

      <header className="mt-6 mb-10">
        <h1 className="font-display text-4xl font-bold text-rb-navy mb-3">Originals</h1>
        <p className="text-rb-muted text-lg max-w-xl">
          Our signature line. Classic silhouettes, elevated details, and craftsmanship that holds
          up.
        </p>
      </header>

      <CollectionGrid products={collection.products} />
    </div>
  )
}
