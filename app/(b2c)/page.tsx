import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCollectionByHandle } from '@/src/services/collections'
import { buildMetadata } from '@/src/lib/seo'
import { ProductCard } from '@/src/components/product/product-card'
import { MarqueeBar } from '@/src/components/ui/marquee-bar'
import { HeroCarousel } from '@/src/components/ui/hero-carousel'
import { EnquiryForm } from '@/src/components/b2b/enquiry-form'

export const revalidate = 900

export const metadata: Metadata = buildMetadata({
  // absolute: this is the brand's landing page, so it skips the "| Royal Backs"
  // template rather than repeating the name twice.
  title: { absolute: 'Royal Backs | Custom Hats & Embroidery, Milton MA' },
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

      {/* Second marquee */}
      <MarqueeBar items={['MADE IN MILTON, MA', 'CUSTOM EMBROIDERY FOR TEAMS & BUSINESSES']} separator="✶" />

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
              <div className="space-y-4 max-w-md" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                <p className="text-white/70 text-base leading-relaxed">
                  Royal Backs started in Milton and never left. It began with one machine
                  in a family home and a lot of opinions about thread tension, and it still
                  runs the same way — small batches, and the person who takes your order is
                  the person running the machine.
                </p>
                <p className="text-white/70 text-base leading-relaxed">
                  Milton sits right where the city ends and the South Shore begins, and
                  that&apos;s the whole brand. Hats for people who grew up around here, and
                  embroidery for the teams, crews and restaurants that keep the place
                  running. Order local, pick it up local.
                </p>
              </div>
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

      {/* Embroidery enquiry */}
      <section className="bg-rb-card py-16 lg:py-24">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <p
                className="text-rb-green text-xs font-bold uppercase tracking-widest mb-4"
                style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
              >
                Teams · Businesses · Events
              </p>
              <h2
                className="font-display font-bold text-rb-black uppercase leading-[0.9] tracking-[-0.03em] mb-5"
                style={{ fontSize: 'clamp(34px, 4.4vw, 64px)' }}
              >
                YOUR LOGO.<br />YOUR STITCH.
              </h2>
              <p
                className="text-rb-ink text-base leading-relaxed max-w-md mb-8"
                style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
              >
                Hats, polos, jackets, bags — if it has a surface, we can stitch it. Tell us
                what you&apos;re planning and we&apos;ll come back with real pricing, not a
                runaround.
              </p>

              <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                {[
                  { term: 'One business day', desc: 'We answer every enquiry, fast.' },
                  { term: '5–10 day turnaround', desc: 'Rush available when you need it.' },
                  { term: 'Free local pickup', desc: 'Milton, MA. Shipping anywhere.' },
                  { term: 'No minimum drama', desc: 'Small runs are welcome here.' },
                ].map((item) => (
                  <div key={item.term}>
                    <dt
                      className="text-sm font-bold text-rb-black mb-1"
                      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                    >
                      {item.term}
                    </dt>
                    <dd
                      className="text-sm text-rb-muted leading-relaxed"
                      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                    >
                      {item.desc}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  )
}
