import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/src/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description:
    'Royal Backs is a custom hat and embroidery shop based in Milton, MA. Founded by Dylan McDougall in 2017.',
})

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      {/* Brand mark */}
      <div className="mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-rb-gold">
          Milton, Massachusetts
        </span>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-rb-navy mt-2 mb-6">
          We started because we wanted better hats.
        </h1>
        <div className="w-12 h-0.5 bg-rb-gold" />
      </div>

      {/* Story */}
      <div className="prose max-w-none space-y-6 text-rb-ink">
        <p className="text-lg leading-relaxed text-rb-muted">
          Royal Backs was founded in 2017 by Dylan McDougall, a Milton native who got tired of
          settling for mass-produced headwear that looked cheap after one season. The idea was
          simple: make hats worth keeping.
        </p>

        <p className="leading-relaxed text-rb-muted">
          What started as a small operation — a single embroidery machine, a basement table, and a
          lot of opinions about thread tension — grew into something bigger. Today Royal Backs
          serves customers across the South Shore, both through our direct B2C line and through
          custom embroidery work for local businesses, sports teams, and organizations.
        </p>

        <p className="leading-relaxed text-rb-muted">
          The collections reflect where we come from. The Originals line is our flagship — classic
          silhouettes with details that earn a second look. The Boston collection is for the city
          and everyone shaped by it. The Local collection puts South Shore towns on headwear worth
          wearing.
        </p>

        <p className="leading-relaxed text-rb-muted">
          On the embroidery side, we&apos;ve stitched logos onto polos for local contractors,
          hats for youth hockey teams, and custom gear for restaurants, schools, and nonprofits.
          We work fast, we&apos;re transparent about pricing, and we answer our messages.
        </p>
      </div>

      {/* Values */}
      <div className="mt-16 grid sm:grid-cols-3 gap-6">
        {[
          {
            label: 'Since 2017',
            text: 'Seven years of machine time, thread knowledge, and knowing what holds up.',
          },
          {
            label: 'Milton, MA',
            text: "We're local. You can pick up your order. We know the South Shore.",
          },
          {
            label: 'Small batch',
            text: 'We don\'t run factory volumes. Every order gets real attention.',
          },
        ].map((v) => (
          <div key={v.label} className="border-t-2 border-rb-gold pt-5">
            <p className="font-display font-semibold text-rb-navy mb-2">{v.label}</p>
            <p className="text-sm text-rb-muted leading-relaxed">{v.text}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 flex flex-col sm:flex-row gap-4">
        <Link
          href="/collections"
          className="inline-block bg-rb-navy text-rb-cream font-medium px-6 py-3 rounded-sm hover:bg-rb-navy-light transition-colors text-center"
        >
          Shop the Collections
        </Link>
        <Link
          href="/embroidery"
          className="inline-block border border-rb-navy text-rb-navy font-medium px-6 py-3 rounded-sm hover:bg-rb-navy hover:text-rb-cream transition-colors text-center"
        >
          Custom Embroidery
        </Link>
      </div>
    </div>
  )
}
