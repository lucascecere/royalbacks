import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/src/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Dylan McDougall — Royal Backs',
  description:
    'Dylan McDougall is the founder of Royal Backs, a custom hat and embroidery shop in Milton, MA. He has been embroidering since 2017.',
})

const EXPERTISE = [
  'Custom embroidery for sports teams and businesses',
  'Embroidery machine operation and maintenance',
  'Logo digitizing and thread color matching',
  'Garment sourcing and procurement',
  'South Shore Massachusetts small business community',
  'Custom headwear construction and design',
]

const CREDENTIALS = [
  { label: 'Founded Royal Backs', year: '2017' },
  { label: 'Years of commercial embroidery experience', year: '7+' },
  { label: 'Location', year: 'Milton, MA' },
]

export default function DylanAuthorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      {/* Header */}
      <div className="flex items-start gap-6 mb-10">
        <div className="w-20 h-20 bg-rb-navy rounded-full flex-shrink-0 flex items-center justify-center">
          <span className="font-display text-rb-cream font-bold text-3xl">D</span>
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-rb-navy mb-1">Dylan McDougall</h1>
          <p className="text-rb-muted">Founder, Royal Backs · Milton, MA</p>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-5 text-rb-muted leading-relaxed mb-12">
        <p className="text-lg">
          Dylan McDougall is the founder of Royal Backs, a custom hat and embroidery shop based in
          Milton, Massachusetts. He started the business in 2017 because he wanted better hats —
          and because he figured if he felt that way, other people probably did too.
        </p>
        <p>
          He runs the embroidery machines, sources the garments, digitizes the artwork, and
          handles production from start to finish. Royal Backs is not a drop-shipper or a
          middleman — Dylan does the work.
        </p>
        <p>
          Over seven years, Dylan has embroidered logos for youth hockey teams, local restaurants,
          landscaping companies, schools, and everyone in between. He knows thread tension, he
          knows what garments hold up, and he has a lot of opinions about hat construction.
        </p>
        <p>
          The blog at Royal Backs is where he writes about embroidery, headwear, and the South
          Shore — for business owners who want to understand the process before they order, and for
          people who just care about quality.
        </p>
      </div>

      {/* Credentials */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {CREDENTIALS.map((c) => (
          <div key={c.label} className="bg-rb-surface border border-rb-border rounded-sm p-4">
            <p className="font-bold text-rb-navy text-lg">{c.year}</p>
            <p className="text-xs text-rb-muted mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Areas of expertise */}
      <div className="mb-12">
        <h2 className="font-display text-xl font-bold text-rb-navy mb-4">
          What Dylan writes about
        </h2>
        <ul className="space-y-2">
          {EXPERTISE.map((area) => (
            <li key={area} className="flex items-center gap-3 text-sm text-rb-muted">
              <span className="w-1.5 h-1.5 bg-rb-gold rounded-full flex-shrink-0" />
              {area}
            </li>
          ))}
        </ul>
      </div>

      {/* Links */}
      <div className="border-t border-rb-border pt-8 flex flex-col sm:flex-row gap-4">
        <Link
          href="/blog"
          className="inline-block bg-rb-navy text-rb-cream font-medium px-6 py-3 rounded-sm hover:bg-rb-navy-light transition-colors text-center"
        >
          Read the Blog
        </Link>
        <Link
          href="/embroidery/quote"
          className="inline-block border border-rb-border text-rb-navy font-medium px-6 py-3 rounded-sm hover:border-rb-navy transition-colors text-center"
        >
          Work with Dylan
        </Link>
        <a
          href="mailto:info@royalbacks.com"
          className="inline-block border border-rb-border text-rb-navy font-medium px-6 py-3 rounded-sm hover:border-rb-navy transition-colors text-center"
        >
          Contact
        </a>
      </div>
    </div>
  )
}
