import type { Metadata } from 'next'
import Link from 'next/link'
import { Shirt, HardHat, Briefcase, Users, ChefHat, GraduationCap } from 'lucide-react'
import { buildMetadata, buildLocalBusinessSchema, buildServiceSchema, SITE_URL } from '@/src/lib/seo'
import { EmbroideryServiceCard } from '@/src/components/b2b/embroidery-service-card'
import { FaqAccordion } from '@/src/components/b2b/faq-accordion'
import { TestimonialCarousel } from '@/src/components/b2b/testimonial-carousel'
import { LocalBusinessSchema } from '@/src/components/seo/local-business-schema'

export const metadata: Metadata = buildMetadata({
  title: 'Custom Embroidery Services | Milton, MA | Royal Backs',
  description:
    'Custom embroidery in Milton, MA. Hats, polos, jackets, bags. Fast turnaround, local pickup. Serving South Shore businesses and teams since 2017.',
})

const GARMENT_SERVICES = [
  {
    title: 'Custom Hats',
    description: 'Structured caps, dad hats, beanies — embroidered with your logo or design. Our specialty since day one.',
    href: '/embroidery/hats',
    icon: <HardHat className="w-6 h-6" />,
  },
  {
    title: 'Polo Shirts',
    description: 'Left-chest logo embroidery on polos. Professional, clean, and built to last through a hundred washes.',
    href: '/embroidery/polos',
    icon: <Shirt className="w-6 h-6" />,
  },
  {
    title: 'T-Shirts',
    description: 'Embroidered tees for teams, events, and staff. More durable than screen print, more premium feel.',
    href: '/embroidery/t-shirts',
    icon: <Shirt className="w-6 h-6" />,
  },
  {
    title: 'Sweatshirts & Hoodies',
    description: 'Full-zip, pullover, quarter-zip — embroidered with chest logos, sleeve text, and back designs.',
    href: '/embroidery/sweatshirts',
    icon: <Shirt className="w-6 h-6" />,
  },
  {
    title: 'Jackets',
    description: 'Soft shells, fleeces, and hard shells with embroidered logos. Great for construction crews and sales teams.',
    href: '/embroidery/jackets',
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    title: 'Bags',
    description: 'Backpacks, duffels, tote bags. Embroidered branding that travels everywhere your team does.',
    href: '/embroidery/bags',
    icon: <Briefcase className="w-6 h-6" />,
  },
]

const INDUSTRY_SERVICES = [
  {
    title: 'Sports Teams',
    description: 'Travel hats, practice polos, sideline jackets. Local teams trust us for consistent quality every season.',
    href: '/embroidery/for/sports-teams',
    icon: <Users className="w-6 h-6" />,
  },
  {
    title: 'Hockey Teams',
    description: 'Locker room gear, travel fits, and parent apparel. We know hockey and we know what teams need.',
    href: '/embroidery/for/hockey-teams',
    icon: <Users className="w-6 h-6" />,
  },
  {
    title: 'Businesses',
    description: 'Uniform programs, company swag, client gifts. We handle ongoing orders without the minimum quantity drama.',
    href: '/embroidery/for/businesses',
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    title: 'Contractors',
    description: 'Your logo on the job site. Hats, polos, and jackets built for the work — not just the look.',
    href: '/embroidery/for/contractors',
    icon: <HardHat className="w-6 h-6" />,
  },
  {
    title: 'Restaurants',
    description: 'Staff uniforms and merch that holds up through kitchen shifts. We keep colors consistent batch to batch.',
    href: '/embroidery/for/restaurants',
    icon: <ChefHat className="w-6 h-6" />,
  },
  {
    title: 'Schools & Non-Profits',
    description: 'Spirit gear, volunteer apparel, and fundraiser merchandise. We work with schools and nonprofits regularly.',
    href: '/embroidery/for/schools',
    icon: <GraduationCap className="w-6 h-6" />,
  },
]

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Request a Quote',
    body: 'Fill out our quote form. Tell us what garments, how many, and what your artwork looks like. We respond within 1 business day.',
  },
  {
    step: '02',
    title: 'Approve Your Proof',
    body: "We digitize your logo and send a digital proof before anything goes on the machine. You approve it, we stitch it.",
  },
  {
    step: '03',
    title: 'Pick Up or Ship',
    body: 'Local pickup in Milton, MA. Shipping available anywhere. Most orders are done in 5–10 business days.',
  },
]

const FAQS = [
  {
    question: 'What is the minimum order quantity?',
    answer: 'We can work with as few as 6 pieces, though pricing is most competitive at 12+. We\'ll tell you upfront what makes sense for your order size.',
  },
  {
    question: 'Do I need to supply the garments?',
    answer: 'No. We source garments for you — we work with major wholesale suppliers (SanMar, S&S, Alphabroder) and can get most styles. Or, if you have specific garments you want to use, you can supply them.',
  },
  {
    question: 'What file formats do you accept for artwork?',
    answer: 'Vector files work best (AI, PDF, SVG). We can also work from high-resolution PNGs and JPGs, though vector is preferred for cleanest results. If you don\'t have a proper file, we can help with digitizing.',
  },
  {
    question: 'How long does it take?',
    answer: 'Standard turnaround is 5–10 business days after artwork approval. Rush options are available. We\'ll give you an exact timeline when you request a quote.',
  },
  {
    question: 'Can you match our brand colors?',
    answer: 'Yes. We use Madeira thread, which has 200+ colors. We can match PMS colors closely and will send you a proof to approve before production.',
  },
  {
    question: 'Do you offer local pickup?',
    answer: 'Yes — we\'re in Milton, MA. Local pickup is free and available once your order is ready. Shipping is also available.',
  },
]

const TESTIMONIALS = [
  {
    quote: 'Dylan turned our logo into something that actually looks sharp on a hat. The quality is there — we\'ve been reordering every season for two years.',
    author: 'Mike S.',
    role: 'Coach',
    company: 'South Shore Youth Hockey',
  },
  {
    quote: 'We needed 40 polos with our logo in two weeks. Royal Backs handled it, no drama. Exactly what I needed.',
    author: 'Jessica T.',
    role: 'Owner',
    company: 'Braintree Landscaping',
  },
  {
    quote: 'The communication was the best part. I always knew where my order was. We\'ll be back for the next batch.',
    author: 'Carlos M.',
    role: 'Manager',
    company: 'Quincy Restaurant Group',
  },
]

export default function EmbroideryHubPage() {
  const localBusinessSchema = buildLocalBusinessSchema()
  const serviceSchema = buildServiceSchema({
    name: 'Custom Embroidery Services',
    description: 'Custom embroidery on hats, polos, jackets, bags, and more. Serving South Shore businesses and teams from Milton, MA.',
    url: `${SITE_URL}/embroidery`,
  })

  return (
    <>
      <LocalBusinessSchema schema={localBusinessSchema} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <section className="bg-rb-navy text-rb-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
          <div className="max-w-2xl">
            <span className="text-rb-gold text-xs font-semibold uppercase tracking-widest">
              Milton, MA · Since 2017
            </span>
            <h1 className="font-display text-4xl lg:text-6xl font-bold mt-3 mb-6 leading-tight">
              Custom Embroidery Services in Milton, MA
            </h1>
            <p className="text-rb-cream/70 text-lg mb-8 leading-relaxed">
              We embroider hats, polos, jackets, bags — anything your team wears. Local pickup,
              fast turnaround, real answers when you call.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/embroidery/quote"
                className="inline-block bg-rb-gold text-rb-navy font-semibold px-8 py-4 rounded-sm hover:bg-rb-gold-light transition-colors text-center"
              >
                Get a Free Quote
              </Link>
              <Link
                href="/embroidery/portfolio"
                className="inline-block border border-rb-cream/30 text-rb-cream font-medium px-8 py-4 rounded-sm hover:border-rb-cream transition-colors text-center"
              >
                See Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals bar */}
      <div className="bg-rb-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-medium text-rb-navy">
            <span>Embroidering since 2017</span>
            <span className="hidden sm:inline">·</span>
            <span>Local pickup in Milton, MA</span>
            <span className="hidden sm:inline">·</span>
            <span>5–10 day turnaround</span>
            <span className="hidden sm:inline">·</span>
            <span>No minimum drama</span>
          </div>
        </div>
      </div>

      {/* Garment Services */}
      <section className="bg-rb-surface py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <h2 className="font-display text-3xl font-bold text-rb-navy mb-3">What We Embroider</h2>
            <p className="text-rb-muted max-w-xl">
              If it has a surface, we can probably stitch it. Here&apos;s what we do most often.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GARMENT_SERVICES.map((svc) => (
              <EmbroideryServiceCard key={svc.href} {...svc} />
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <h2 className="font-display text-3xl font-bold text-rb-navy mb-3">Who We Serve</h2>
            <p className="text-rb-muted max-w-xl">
              From local sports teams to South Shore businesses — here&apos;s who trusts us with
              their gear.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INDUSTRY_SERVICES.map((svc) => (
              <EmbroideryServiceCard key={svc.href} {...svc} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-rb-navy text-rb-cream py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {PROCESS_STEPS.map((s) => (
              <div key={s.step}>
                <p className="font-display text-5xl font-bold text-rb-gold mb-4">{s.step}</p>
                <h3 className="font-display text-xl font-semibold mb-3">{s.title}</h3>
                <p className="text-rb-cream/70 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link
              href="/embroidery/process"
              className="text-rb-gold text-sm font-medium hover:text-rb-gold-light transition-colors underline underline-offset-2"
            >
              Full process details &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-rb-surface py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-rb-navy mb-12 text-center">
            What Clients Say
          </h2>
          <TestimonialCarousel testimonials={TESTIMONIALS} />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-rb-navy mb-10">
            Frequently Asked Questions
          </h2>
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      {/* Quote CTA */}
      <section className="bg-rb-gold py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-rb-navy mb-4">
            Ready to get started?
          </h2>
          <p className="text-rb-navy/70 text-lg mb-8 max-w-xl mx-auto">
            Fill out our quote form. We&apos;ll respond within 1 business day with pricing and
            timeline.
          </p>
          <Link
            href="/embroidery/quote"
            className="inline-block bg-rb-navy text-rb-cream font-semibold px-10 py-4 rounded-sm hover:bg-rb-navy-light transition-colors"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  )
}
