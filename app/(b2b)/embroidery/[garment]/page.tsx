import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { readMdxFile } from '@/src/lib/mdx'
import { buildMetadata, buildServiceSchema, SITE_URL } from '@/src/lib/seo'
import { FaqAccordion } from '@/src/components/b2b/faq-accordion'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'
import type { ServiceFrontmatter } from '@/src/types/mdx'

const GARMENTS = ['hats', 'polos', 't-shirts', 'sweatshirts', 'jackets', 'bags']

// Fallback data when MDX not yet written
const GARMENT_FALLBACK: Record<string, { title: string; description: string; faqs: Array<{question: string; answer: string}> }> = {
  hats: {
    title: 'Custom Embroidered Hats',
    description: 'Structured caps, dad hats, beanies — embroidered with your logo. Our specialty since day one.',
    faqs: [
      { question: 'What hat styles do you carry?', answer: 'Structured 6-panel, unstructured dad hat, trucker, bucket, and beanie. We source from Richardson, Otto, and Yupoong.' },
      { question: 'What is the minimum order for custom hats?', answer: 'Minimum is 6 pieces. Pricing improves at 12, 50, and 100+ units.' },
    ],
  },
  polos: {
    title: 'Custom Embroidered Polo Shirts',
    description: 'Left-chest logo embroidery on polos for your team or staff. Professional and durable.',
    faqs: [
      { question: 'What polo brands do you carry?', answer: 'Port Authority, OGIO, and Nike are our most requested. We can source most major brands.' },
      { question: 'Can you do multiple logo placements on a polo?', answer: 'Yes — left chest is standard. We can also add sleeve, right chest, or back text for an additional charge.' },
    ],
  },
  't-shirts': {
    title: 'Custom Embroidered T-Shirts',
    description: 'Embroidered tees for teams, events, and staff uniforms.',
    faqs: [
      { question: 'Why embroidery instead of screen print for tees?', answer: 'Embroidery is more durable and has a premium feel. For large runs with many colors, screen print may be more cost-effective — ask us what makes sense for your order.' },
    ],
  },
  sweatshirts: {
    title: 'Custom Embroidered Sweatshirts',
    description: 'Full-zip, pullover, and quarter-zip hoodies with embroidered logos.',
    faqs: [
      { question: 'Can you embroider on the hood?', answer: 'Some hood positions are possible but limited by the machine hoop size. Left chest, sleeve, and back are the most reliable placements.' },
    ],
  },
  jackets: {
    title: 'Custom Embroidered Jackets',
    description: 'Soft shells, fleeces, and hard shells with your logo stitched in.',
    faqs: [
      { question: 'What jacket styles work best for embroidery?', answer: 'Soft shells and fleeces work best. Puffy or quilted jackets can be done but require backing material — we handle this automatically.' },
    ],
  },
  bags: {
    title: 'Custom Embroidered Bags',
    description: 'Backpacks, duffels, and tote bags with your logo on them.',
    faqs: [
      { question: 'Can you embroider on the bottom of a bag?', answer: 'Some bag positions are more difficult than others depending on the material and access. We will confirm placement when you submit your order.' },
    ],
  },
}

export function generateStaticParams() {
  return GARMENTS.map((garment) => ({ garment }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ garment: string }>
}): Promise<Metadata> {
  const { garment } = await params
  if (!GARMENTS.includes(garment)) return {}
  const mdx = readMdxFile<ServiceFrontmatter>('services', garment)
  if (mdx) {
    return buildMetadata({ title: mdx.data.meta_title, description: mdx.data.meta_description })
  }
  const fallback = GARMENT_FALLBACK[garment]
  return buildMetadata({
    title: fallback?.title ?? garment,
    description: fallback?.description ?? '',
  })
}

export default async function GarmentPage({
  params,
}: {
  params: Promise<{ garment: string }>
}) {
  const { garment } = await params
  if (!GARMENTS.includes(garment)) notFound()

  const mdx = readMdxFile<ServiceFrontmatter>('services', garment)
  const fallback = GARMENT_FALLBACK[garment]
  const title = mdx?.data.meta_title ?? fallback?.title ?? garment
  const description = mdx?.data.meta_description ?? fallback?.description ?? ''
  const faqs = mdx?.data.faqs ?? fallback?.faqs ?? []

  const serviceSchema = buildServiceSchema({
    name: title,
    description,
    url: `${SITE_URL}/embroidery/${garment}`,
  })

  return (
    <>
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
              { name: title, href: `/embroidery/${garment}` },
            ]}
          />
          <h1 className="font-display text-4xl lg:text-5xl font-bold mt-6 mb-4">{title}</h1>
          <p className="text-rb-cream/70 text-lg max-w-xl">{description}</p>
          <Link
            href="/embroidery/quote"
            className="inline-block mt-8 bg-rb-gold text-rb-navy font-semibold px-8 py-4 rounded-sm hover:bg-rb-gold-light transition-colors"
          >
            Get a Quote
          </Link>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {mdx ? (
          <article className="prose prose-lg max-w-none">
            <MDXRemote source={mdx.content} />
          </article>
        ) : (
          <div className="space-y-6 text-rb-muted">
            <p className="text-lg leading-relaxed">
              Royal Backs has been providing custom {garment} embroidery services to South Shore
              businesses, sports teams, and organizations since 2017. We handle everything from
              artwork digitizing to garment sourcing to final production.
            </p>
            <p className="leading-relaxed">
              Our process is straightforward: you tell us what you need, we quote it honestly, we
              send a proof for your approval, and we deliver on time. Local pickup available in
              Milton, MA.
            </p>
          </div>
        )}

        {faqs.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-rb-navy mb-6">
              Frequently Asked Questions
            </h2>
            <FaqAccordion items={faqs} />
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 bg-rb-navy text-rb-cream rounded-sm p-8 text-center">
          <h2 className="font-display text-xl font-bold mb-3">Ready to order?</h2>
          <p className="text-rb-cream/70 text-sm mb-6">
            Get a quote in under 5 minutes.
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
