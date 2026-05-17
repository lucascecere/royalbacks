import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCollectionByHandle } from '@/src/services/collections'
import { buildMetadata } from '@/src/lib/seo'
import { CollectionGrid } from '@/src/components/product/collection-grid'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'

export const revalidate = 3600

export const metadata: Metadata = buildMetadata({
  title: 'Boston Collection',
  description:
    'Royal Backs Boston Collection — hats made for the city and everyone who calls it home.',
})

export default async function BostonCollectionPage() {
  const collection = await getCollectionByHandle('boston')

  if (!collection) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <BreadcrumbNav
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Collections', href: '/collections' },
          { name: 'Boston', href: '/collections/boston' },
        ]}
      />

      <header className="mt-6 mb-10">
        <h1 className="font-display text-4xl font-bold text-rb-navy mb-3">Boston Collection</h1>
        <p className="text-rb-muted text-lg max-w-xl">
          For the city. Hats that know where they came from.
        </p>
      </header>

      <CollectionGrid products={collection.products} />
    </div>
  )
}
