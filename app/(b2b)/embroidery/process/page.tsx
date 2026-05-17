import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/src/lib/seo'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'

export const metadata: Metadata = buildMetadata({
  title: 'How Custom Embroidery Works | Royal Backs',
  description:
    'Step-by-step process for ordering custom embroidery from Royal Backs. Turnaround times, file requirements, and what to expect.',
})

const STEPS = [
  {
    step: 1,
    title: 'Request a Quote',
    body: 'Fill out our quote form with your garment type, quantity, and any artwork you have. We respond within 1 business day.',
    timeframe: 'Day 1',
  },
  {
    step: 2,
    title: 'Review Pricing',
    body: 'We send you a detailed quote covering garments, digitizing (if needed), embroidery, and shipping. No hidden fees.',
    timeframe: 'Day 1–2',
  },
  {
    step: 3,
    title: 'Artwork & Digitizing',
    body: 'We convert your logo into an embroidery file (digitizing). We send a digital proof for your approval before anything goes on the machine.',
    timeframe: 'Day 2–4',
  },
  {
    step: 4,
    title: 'Production',
    body: 'Once artwork is approved, we start production. We run samples when appropriate and notify you if any issues come up.',
    timeframe: 'Day 4–9',
  },
  {
    step: 5,
    title: 'Pickup or Ship',
    body: 'Local orders are available for pickup in Milton, MA. We also ship anywhere in the US. Final payment due on completion.',
    timeframe: 'Day 5–10',
  },
]

const FILE_REQUIREMENTS = [
  { format: 'Adobe Illustrator (.ai)', preferred: true, notes: 'Best quality, cleanest results' },
  { format: 'PDF (vector)', preferred: true, notes: 'Accepted if vector paths are embedded' },
  { format: 'SVG', preferred: false, notes: 'Acceptable, check for font outlines' },
  { format: 'PNG (300+ dpi)', preferred: false, notes: 'We can work with it, digitizing may cost more' },
  { format: 'JPG', preferred: false, notes: 'Workable for simple logos at high resolution' },
]

const TURNAROUND_TABLE = [
  { type: 'Standard order', time: '5–10 business days', notes: 'After artwork approval' },
  { type: 'Rush order (2x price)', time: '2–3 business days', notes: 'Call to confirm availability' },
  { type: 'Large orders (200+)', time: '10–15 business days', notes: 'Contact us for scheduling' },
  { type: 'Digitizing only', time: '1–2 business days', notes: 'Digital file delivered via email' },
]

export default function ProcessPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <BreadcrumbNav
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Embroidery', href: '/embroidery' },
          { name: 'How It Works', href: '/embroidery/process' },
        ]}
      />

      <header className="mt-6 mb-12">
        <h1 className="font-display text-4xl font-bold text-rb-navy mb-3">How It Works</h1>
        <p className="text-rb-muted text-lg max-w-xl">
          From quote to delivery — here&apos;s exactly what to expect when you order custom
          embroidery from Royal Backs.
        </p>
      </header>

      {/* Process steps */}
      <section className="mb-16">
        <div className="space-y-0">
          {STEPS.map((s, i) => (
            <div key={s.step} className="relative flex gap-6">
              {/* Timeline line */}
              {i < STEPS.length - 1 && (
                <div className="absolute left-5 top-12 w-0.5 h-full bg-rb-border" />
              )}
              <div className="flex-shrink-0 w-10 h-10 bg-rb-navy rounded-full flex items-center justify-center z-10">
                <span className="text-rb-cream text-sm font-bold">{s.step}</span>
              </div>
              <div className="pb-10">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-display text-xl font-semibold text-rb-navy">{s.title}</h2>
                  <span className="text-xs text-rb-muted border border-rb-border px-2 py-0.5 rounded-full">
                    {s.timeframe}
                  </span>
                </div>
                <p className="text-rb-muted leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Turnaround table */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-bold text-rb-navy mb-6">Turnaround Times</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-rb-border rounded-sm overflow-hidden">
            <thead>
              <tr className="bg-rb-navy text-rb-cream">
                <th className="text-left px-4 py-3 font-medium">Order Type</th>
                <th className="text-left px-4 py-3 font-medium">Time</th>
                <th className="text-left px-4 py-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {TURNAROUND_TABLE.map((row, i) => (
                <tr key={row.type} className={i % 2 === 0 ? 'bg-white' : 'bg-rb-surface'}>
                  <td className="px-4 py-3 font-medium text-rb-navy">{row.type}</td>
                  <td className="px-4 py-3 text-rb-muted">{row.time}</td>
                  <td className="px-4 py-3 text-rb-muted">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* File requirements */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-bold text-rb-navy mb-3">File Requirements</h2>
        <p className="text-rb-muted mb-6">
          We accept most common file formats. Vector files produce the cleanest results and cost
          less to digitize.
        </p>
        <div className="space-y-3">
          {FILE_REQUIREMENTS.map((req) => (
            <div
              key={req.format}
              className="flex items-start gap-4 p-4 border border-rb-border rounded-sm bg-white"
            >
              <span
                className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full flex-shrink-0 ${
                  req.preferred
                    ? 'bg-green-100 text-green-700'
                    : 'bg-rb-surface text-rb-muted'
                }`}
              >
                {req.preferred ? 'Preferred' : 'OK'}
              </span>
              <div>
                <p className="font-medium text-rb-navy text-sm">{req.format}</p>
                <p className="text-xs text-rb-muted mt-0.5">{req.notes}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-rb-muted">
          Don&apos;t have a proper file? We can create a design from scratch or work from a
          description — ask about design services when you request a quote.
        </p>
      </section>

      {/* CTA */}
      <div className="bg-rb-navy text-rb-cream rounded-sm p-8 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">Ready to start?</h2>
        <p className="text-rb-cream/70 mb-6">Get a quote in under 5 minutes.</p>
        <Link
          href="/embroidery/quote"
          className="inline-block bg-rb-gold text-rb-navy font-semibold px-8 py-3 rounded-sm hover:bg-rb-gold-light transition-colors"
        >
          Get a Free Quote
        </Link>
      </div>
    </div>
  )
}
