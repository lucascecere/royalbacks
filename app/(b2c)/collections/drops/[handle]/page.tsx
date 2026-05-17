import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDropByHandle, getArchivedDrops } from '@/src/services/drops'
import { getCollectionByHandle } from '@/src/services/collections'
import { buildMetadata } from '@/src/lib/seo'
import { CollectionGrid } from '@/src/components/product/collection-grid'
import { DropBadge } from '@/src/components/product/drop-badge'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'

export const revalidate = 900

export async function generateStaticParams() {
  const archived = await getArchivedDrops()
  return archived.map((d) => ({ handle: d.handle }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const drop = await getDropByHandle(handle)
  if (!drop) return {}
  return buildMetadata({
    title: drop.title,
    description: `Royal Backs ${drop.title} — limited edition drop.`,
  })
}

export default async function DropDetailPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const [drop, collection] = await Promise.all([
    getDropByHandle(handle),
    getCollectionByHandle(handle),
  ])

  if (!drop) notFound()

  const products = collection?.products ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <BreadcrumbNav
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Collections', href: '/collections' },
          { name: 'Drops', href: '/collections/drops' },
          { name: drop.title, href: `/collections/drops/${handle}` },
        ]}
      />

      <header className="mt-6 mb-10">
        <div className="mb-4">
          <DropBadge status={drop.status} />
        </div>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-rb-navy mb-4">
          {drop.title}
        </h1>
        {drop.endDate && drop.status !== 'archived' && (
          <p className="text-rb-muted">
            Ends{' '}
            {new Date(drop.endDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
        {drop.status === 'archived' && (
          <p className="text-rb-muted">This drop has ended. Browse our active collections below.</p>
        )}
      </header>

      {products.length > 0 ? (
        <CollectionGrid products={products} />
      ) : (
        <div className="text-center py-16 bg-rb-surface rounded-sm border border-rb-border">
          <p className="text-rb-muted font-display text-xl">No products in this drop yet.</p>
        </div>
      )}
    </div>
  )
}
