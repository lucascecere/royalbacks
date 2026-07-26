import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCollectionByHandle } from '@/src/services/collections'
import { buildMetadata } from '@/src/lib/seo'
import { ProductCard } from '@/src/components/product/product-card'
import { MarqueeBar } from '@/src/components/ui/marquee-bar'
import { HeroCarousel } from '@/src/components/ui/hero-carousel'

export const revalidate = 900

export const metadata: Metadata = buildMetadata({
  title: 'Royal Backs | Custom Hats & Embroidery, Milton MA',
  description:
    'Shop limited-run hats, Boston collections, and local South Shore designs. Custom embroidery also available for teams and businesses.',
})

const COLLECTIONS = [
  {
    handle: 'originals',
    label: 'ORIGINALS',
    href: '/collections/originals',
    image: '/products/rb-4suites-white.jpg',
  },
  {
    handle: 'boston',
    label: 'BOSTON',
    href: '/collections/boston',
    image: '/products/boston-gray.jpg',
  },
  {
    handle: 'local',
    label: 'LOCAL',
    href: '/collections/local',
    image: '/products/rb-natural-black.jpg',
  },
]

export default async function HomePage() {
  const originalsCollection = await getCollectionByHandle('originals')

  const featuredProducts = originalsCollection?.products.slice(0, 4) ?? []

  return (
    <>
      {/* Hero carousel */}
      <HeroCarousel />

      {/* Best Sellers */}
      {featuredProducts.length > 0 && (
        <section className="bg-white py-16 lg:py-20">
          <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
            <div className="flex items-center justify-between mb-8">
              <h2
                className="font-display text-[26px] font-bold text-rb-black uppercase"
              >
                OUR BEST SELLERS
              </h2>
              <Link
                href="/collections"
                className="text-sm font-bold text-rb-ink hover:text-rb-black transition-colors"
                style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
              >
                VIEW ALL →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} showBestSellerBadge />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Boston feature */}
      <section className="bg-white py-16 lg:py-20 border-t border-rb-card">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-rb-green text-xs font-bold uppercase tracking-widest mb-4" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                The Boston Collection
              </p>
              <h2
                className="font-display font-bold text-rb-black uppercase leading-[1.0] tracking-[-0.03em] mb-4"
                style={{ fontSize: 'clamp(32px, 4vw, 58px)' }}
              >
                FOR THE CITY<br />AND EVERYONE<br />IN ITS ORBIT.
              </h2>
              <p className="text-rb-ink text-base mb-6 max-w-md" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                Script logos, shamrocks, and old-school lettering — on rope caps, truckers, and
                classic five-panels.
              </p>
              <Link
                href="/collections/boston"
                className="inline-block border border-rb-black text-rb-black font-bold text-sm px-6 py-3 rounded-[7px] hover:bg-rb-black hover:text-white transition-colors uppercase"
                style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
              >
                Shop Boston
              </Link>
            </div>
            <div className="aspect-[4/3] rounded-[12px] overflow-hidden relative bg-[#F7F6F4]">
              <Image
                src="/products/boston-shamrock.jpg"
                alt="Royal Backs Boston shamrock cap"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Second marquee */}
      <MarqueeBar items={['LIMITED EDITION, FRESHLY ARRIVED']} separator="✶" />

      {/* Shop by Collection */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-[26px] font-bold text-rb-black uppercase">
              SHOP BY COLLECTION
            </h2>
            <Link
              href="/collections"
              className="text-sm font-bold text-rb-ink hover:text-rb-black transition-colors"
              style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
            >
              VIEW ALL →
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {COLLECTIONS.map((col) => (
              <Link
                key={col.handle}
                href={col.href}
                className="group relative aspect-square bg-rb-card rounded-[12px] overflow-hidden hover:scale-[1.02] transition-transform duration-400"
              >
                {col.image && (
                  <Image
                    src={col.image}
                    alt={col.label}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 right-4 flex items-center gap-1 text-white font-bold text-sm" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                  {col.label} <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Local story block */}
      <section className="py-16 lg:py-24 bg-rb-black">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-rb-green text-xs font-bold uppercase tracking-widest mb-4" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                Milton, MA — Since 2017
              </p>
              <h2
                className="font-display font-bold text-white uppercase leading-[0.9] tracking-[-0.03em] mb-6"
                style={{ fontSize: 'clamp(36px, 5vw, 75px)' }}
              >
                ROOTED IN THE SOUTH SHORE.
              </h2>
              <p className="text-white/70 text-base leading-relaxed max-w-md" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                Royal Backs started in Milton and never left. Every hat is built to be worn — not just bought. Whether it&apos;s a cap off the shelf or a custom stitch job for your team, we put the same care into every order.
              </p>
            </div>
            <div className="aspect-[4/3] rounded-[12px] overflow-hidden relative bg-[#F7F6F4]">
              <Image
                src="/products/rb-arch-gray.jpg"
                alt="Royal Backs arch logo cap in heather grey"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* B2B Embroidery CTA */}
      <section className="bg-rb-black text-white py-16 lg:py-20">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-rb-green mb-3" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            Teams · Businesses · Events
          </p>
          <h2
            className="font-display font-bold text-white uppercase leading-[0.9] tracking-[-0.03em] mb-4"
            style={{ fontSize: 'clamp(32px, 4vw, 64px)' }}
          >
            YOUR LOGO.<br />YOUR STITCH.
          </h2>
          <p className="text-white/70 text-base max-w-xl mx-auto mb-8" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            Custom embroidery on hats, polos, jackets, bags — if it has a surface, we can stitch it. Serving South Shore teams and businesses since 2017. Local pickup in Milton.
          </p>
          <Link
            href="/embroidery"
            className="inline-block bg-rb-green text-white font-bold text-sm px-8 py-4 rounded-[7px] hover:bg-rb-green-dark transition-colors uppercase"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            Get a Quote
          </Link>
        </div>
      </section>
    </>
  )
}
