import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { getLocationBySlug, getLocationSlugs, getNearbyLocations } from '@/src/services/locations'
import { buildMetadata, buildLocalBusinessSchema } from '@/src/lib/seo'
import { TownHero } from '@/src/components/local/town-hero'
import { FaqAccordion } from '@/src/components/b2b/faq-accordion'
import { LocalBusinessSchema } from '@/src/components/seo/local-business-schema'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'
import { RelatedLinks } from '@/src/components/ui/related-links'

export const revalidate = 86400

export function generateStaticParams() {
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

export default async function LocationPage({
  params,
}: {
  params: Promise<{ town: string }>
}) {
  const { town } = await params
  const location = getLocationBySlug(town)
  if (!location) notFound()

  const nearbyLocations = getNearbyLocations(town, location.nearby_towns)

  const localBizSchema = buildLocalBusinessSchema({
    town: location.town,
    coordinates: location.coordinates,
  })

  const EMBROIDERY_FAQS = [
    {
      question: `Do you serve ${location.town}, MA?`,
      answer: `Yes. Royal Backs serves ${location.town} and surrounding towns in ${location.county}. We offer local pickup in Milton, MA and can ship to your ${location.town} address.`,
    },
    {
      question: 'What is your turnaround time?',
      answer: 'Standard orders are completed in 5–10 business days after artwork approval. Rush options are available.',
    },
    {
      question: 'Do I need to supply garments?',
      answer: 'No. We source garments from major suppliers. Or you can supply your own if you have a specific garment in mind.',
    },
    {
      question: 'What is the minimum order quantity?',
      answer: 'We can work with as few as 6 pieces. Pricing improves at 12, 50, and 100+ units.',
    },
  ]

  return (
    <>
      <LocalBusinessSchema schema={localBizSchema} />

      <TownHero
        town={location.town}
        county={location.county}
        isHq={location.is_hq}
        coordinates={location.coordinates}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <BreadcrumbNav
          crumbs={[
            { name: 'Home', href: '/' },
            { name: 'Embroidery', href: '/embroidery' },
            { name: 'Locations', href: '/embroidery/locations' },
            { name: location.town, href: `/embroidery/locations/${town}` },
          ]}
        />

        {/* MDX content or fallback */}
        {location.content ? (
          <article className="prose prose-lg max-w-none mt-8">
            <MDXRemote source={location.content} />
          </article>
        ) : (
          <div className="mt-8 space-y-4 text-rb-muted leading-relaxed">
            <p className="text-lg">
              Royal Backs provides custom embroidery services to businesses, sports teams, and
              organizations in {location.town} and throughout {location.county}. We&apos;ve been
              doing this since 2017.
            </p>
            <p>
              Whether you need 12 hats for your restaurant staff or 200 polos for a corporate
              event, we handle the sourcing, the digitizing, and the production. You just approve
              the proof and pick up your order — or we ship it directly to you.
            </p>
            <p>
              Local {location.town} businesses trust Royal Backs for consistent quality and honest
              pricing. We show our rates upfront, respond within 1 business day, and turn orders
              around in 5–10 business days.
            </p>
            <p>
              We embroider hats, polo shirts, t-shirts, sweatshirts, jackets, and bags. If it has
              a surface, we can probably stitch it.
            </p>
          </div>
        )}

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold text-rb-navy mb-6">
            Custom Embroidery in {location.town} — FAQ
          </h2>
          <FaqAccordion items={EMBROIDERY_FAQS} />
        </div>

        {/* Quote CTA */}
        <div className="mt-12 bg-rb-gold rounded-sm p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-rb-navy mb-3">
            Get a Quote for {location.town}
          </h2>
          <p className="text-rb-navy/70 mb-6">
            We respond within 1 business day. Free local pickup from Milton, MA.
          </p>
          <Link
            href="/embroidery/quote"
            className="inline-block bg-rb-navy text-rb-cream font-semibold px-8 py-3 rounded-sm hover:bg-rb-navy-light transition-colors"
          >
            Request a Free Quote
          </Link>
        </div>

        {/* Nearby towns */}
        {nearbyLocations.length > 0 && (
          <div className="mt-10">
            <RelatedLinks
              title="Nearby Service Areas"
              links={nearbyLocations.map((l) => ({
                label: `Custom Embroidery in ${l.town}`,
                href: `/embroidery/locations/${l.slug}`,
              }))}
            />
          </div>
        )}
      </div>
    </>
  )
}
