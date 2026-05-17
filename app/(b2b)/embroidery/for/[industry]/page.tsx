import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { getIndustryBySlug, getAllIndustries } from '@/src/services/industries'
import { readMdxFile } from '@/src/lib/mdx'
import { buildMetadata, buildServiceSchema, buildLocalBusinessSchema, SITE_URL } from '@/src/lib/seo'
import { FaqAccordion } from '@/src/components/b2b/faq-accordion'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'
import { LocalBusinessSchema } from '@/src/components/seo/local-business-schema'
import type { IndustryFrontmatter } from '@/src/types/mdx'

const KNOWN_INDUSTRIES = [
  'sports-teams',
  'hockey-teams',
  'businesses',
  'contractors',
  'restaurants',
  'schools',
  'non-profits',
  'weddings-events',
]

const INDUSTRY_FALLBACK: Record<string, { title: string; description: string; cta: string }> = {
  'sports-teams': { title: 'Custom Embroidery for Sports Teams', description: 'Travel hats, sideline jackets, and team apparel for South Shore sports teams.', cta: 'Get Team Gear Quoted' },
  'hockey-teams': { title: 'Custom Embroidery for Hockey Teams', description: 'Locker room hats, practice polos, and parent apparel for hockey programs.', cta: 'Get Hockey Gear Quoted' },
  businesses: { title: 'Custom Embroidery for Businesses', description: 'Uniform programs, company swag, and client gifts for South Shore businesses.', cta: 'Get Business Gear Quoted' },
  contractors: { title: 'Custom Embroidery for Contractors', description: 'Workwear with your logo — hats, polos, and jackets built for the job site.', cta: 'Get Workwear Quoted' },
  restaurants: { title: 'Custom Embroidery for Restaurants', description: 'Staff uniforms and merch that holds up through kitchen shifts.', cta: 'Get Restaurant Gear Quoted' },
  schools: { title: 'Custom Embroidery for Schools', description: 'Spirit gear, staff apparel, and fundraiser merchandise for schools and non-profits.', cta: 'Get School Gear Quoted' },
  'non-profits': { title: 'Custom Embroidery for Non-Profits', description: 'Volunteer apparel and event merchandise for non-profit organizations.', cta: 'Get Non-Profit Gear Quoted' },
  'weddings-events': { title: 'Custom Embroidery for Weddings & Events', description: 'Custom hats and apparel for weddings, corporate events, and special occasions.', cta: 'Get Event Gear Quoted' },
}

export function generateStaticParams() {
  return KNOWN_INDUSTRIES.map((industry) => ({ industry }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>
}): Promise<Metadata> {
  const { industry } = await params
  const page = getIndustryBySlug(industry)
  if (page) {
    return buildMetadata({ title: page.meta_title, description: page.meta_description })
  }
  const fallback = INDUSTRY_FALLBACK[industry]
  return buildMetadata({
    title: fallback?.title ?? industry,
    description: fallback?.description ?? '',
  })
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ industry: string }>
}) {
  const { industry } = await params
  if (!KNOWN_INDUSTRIES.includes(industry)) {
    const page = getIndustryBySlug(industry)
    if (!page) notFound()
  }

  const page = getIndustryBySlug(industry)
  const fallback = INDUSTRY_FALLBACK[industry]
  const title = page?.meta_title ?? fallback?.title ?? industry
  const description = page?.meta_description ?? fallback?.description ?? ''
  const faqs = page?.faqs ?? []
  const ctaText = page?.cta_headline ?? fallback?.cta ?? 'Get a Quote'

  const localBizSchema = buildLocalBusinessSchema()
  const serviceSchema = buildServiceSchema({
    name: title,
    description,
    url: `${SITE_URL}/embroidery/for/${industry}`,
  })

  return (
    <>
      <LocalBusinessSchema schema={localBizSchema} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <section className="bg-rb-navy text-rb-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <BreadcrumbNav
            crumbs={[
              { name: 'Home', href: '/' },
              { name: 'Embroidery', href: '/embroidery' },
              { name: title, href: `/embroidery/for/${industry}` },
            ]}
          />
          <h1 className="font-display text-4xl lg:text-5xl font-bold mt-6 mb-4">{title}</h1>
          <p className="text-rb-cream/70 text-lg max-w-xl">{description}</p>
          <Link
            href="/embroidery/quote"
            className="inline-block mt-8 bg-rb-gold text-rb-navy font-semibold px-8 py-4 rounded-sm hover:bg-rb-gold-light transition-colors"
          >
            {ctaText}
          </Link>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {page?.content ? (
          <article className="prose prose-lg max-w-none">
            <MDXRemote source={page.content} />
          </article>
        ) : (
          <div className="space-y-6 text-rb-muted">
            <p className="text-lg leading-relaxed">
              Royal Backs has been providing custom embroidery services to South Shore{' '}
              {industry.replace(/-/g, ' ')} since 2017. We understand the needs of your
              organization and deliver consistent quality, on time.
            </p>
            <p className="leading-relaxed">
              From a single logo on a cap to a full uniform program, we handle orders of all sizes.
              Local pickup in Milton, MA, or we ship directly to you.
            </p>
          </div>
        )}

        {faqs.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-rb-navy mb-6">
              Common Questions
            </h2>
            <FaqAccordion items={faqs} />
          </div>
        )}

        <div className="mt-14 bg-rb-navy text-rb-cream rounded-sm p-8 text-center">
          <h2 className="font-display text-xl font-bold mb-3">{ctaText}</h2>
          <p className="text-rb-cream/70 text-sm mb-6">
            We respond within 1 business day with pricing and timeline.
          </p>
          <Link
            href="/embroidery/quote"
            className="inline-block bg-rb-gold text-rb-navy font-semibold px-8 py-3 rounded-sm hover:bg-rb-gold-light transition-colors"
          >
            Request a Quote
          </Link>
        </div>
      </div>
    </>
  )
}
