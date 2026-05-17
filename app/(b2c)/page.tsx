import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getActiveDrop } from '@/src/services/drops'
import { getCollectionByHandle } from '@/src/services/collections'
import { buildMetadata } from '@/src/lib/seo'
import { ProductCard } from '@/src/components/product/product-card'
import { DropBadge } from '@/src/components/product/drop-badge'

export const revalidate = 900

export const metadata: Metadata = buildMetadata({
  title: 'Royal Backs | Custom Hats & Embroidery, Milton MA',
  description:
    'Shop limited-run hats, Boston collections, and local South Shore designs. Custom embroidery also available for teams and businesses.',
})

const CORE_COLLECTIONS = [
  {
    handle: 'originals',
    title: 'Originals',
    description: 'Our signature line — classic silhouettes, elevated details.',
    href: '/collections/originals',
  },
  {
    handle: 'boston',
    title: 'Boston',
    description: 'For the city. Hats that know where they came from.',
    href: '/collections/boston',
  },
  {
    handle: 'local',
    title: 'Local',
    description: 'South Shore towns. Your place, on your head.',
    href: '/collections/local',
  },
]

export default async function HomePage() {
  const [activeDrop, originalsCollection] = await Promise.all([
    getActiveDrop(),
    getCollectionByHandle('originals'),
  ])

  const featuredProducts = originalsCollection?.products.slice(0, 4) ?? []

  return (
    <>
      {/* Hero */}
      <section className="bg-rb-navy text-rb-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
          {activeDrop ? (
            <div className="max-w-2xl">
              <div className="mb-4">
                <DropBadge status={activeDrop.status} />
              </div>
              <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight mb-6">
                {activeDrop.title}
              </h1>
              <p className="text-rb-cream/70 text-lg mb-8">
                Limited release. Once it&apos;s gone, it&apos;s gone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/collections/drops/${activeDrop.handle}`}
                  className="inline-block bg-rb-gold text-rb-navy font-semibold px-8 py-4 rounded-sm hover:bg-rb-gold-light transition-colors text-center"
                >
                  Shop the Drop
                </Link>
                <Link
                  href="/collections"
                  className="inline-block border border-rb-cream/30 text-rb-cream font-medium px-8 py-4 rounded-sm hover:border-rb-cream transition-colors text-center"
                >
                  All Collections
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl">
              <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Hats worth wearing.
              </h1>
              <p className="text-rb-cream/70 text-lg mb-8">
                Small-batch headwear made with care, from Milton, MA. Every stitch earns its place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/collections/originals"
                  className="inline-block bg-rb-gold text-rb-navy font-semibold px-8 py-4 rounded-sm hover:bg-rb-gold-light transition-colors text-center"
                >
                  Shop Originals
                </Link>
                <Link
                  href="/collections"
                  className="inline-block border border-rb-cream/30 text-rb-cream font-medium px-8 py-4 rounded-sm hover:border-rb-cream transition-colors text-center"
                >
                  All Collections
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Collections */}
      <section className="bg-rb-surface py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-rb-navy mb-10">Collections</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {CORE_COLLECTIONS.map((col) => (
              <Link
                key={col.handle}
                href={col.href}
                className="group block bg-white border border-rb-border rounded-sm p-6 hover:border-rb-navy hover:shadow-md transition-all"
              >
                <h3 className="font-display text-xl font-semibold text-rb-navy mb-2 group-hover:text-rb-gold transition-colors">
                  {col.title}
                </h3>
                <p className="text-sm text-rb-muted leading-relaxed mb-4">{col.description}</p>
                <span className="text-sm font-medium text-rb-navy group-hover:text-rb-gold transition-colors">
                  Shop {col.title} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-white py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-display text-3xl font-bold text-rb-navy">Featured</h2>
              <Link
                href="/collections/originals"
                className="text-sm text-rb-muted hover:text-rb-navy transition-colors"
              >
                View all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* B2B CTA Banner */}
      <section className="bg-rb-navy text-rb-cream py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-rb-gold text-sm font-semibold uppercase tracking-widest mb-3">
            For Teams &amp; Businesses
          </p>
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
            Need custom embroidery?
          </h2>
          <p className="text-rb-cream/70 text-lg max-w-xl mx-auto mb-8">
            We&apos;ve been doing this since 2017. Hats, polos, jackets, bags — anything with a
            surface we can stitch. Local pickup in Milton. Quick turnaround.
          </p>
          <Link
            href="/embroidery"
            className="inline-block bg-rb-gold text-rb-navy font-semibold px-8 py-4 rounded-sm hover:bg-rb-gold-light transition-colors"
          >
            Explore Embroidery Services
          </Link>
        </div>
      </section>
    </>
  )
}
