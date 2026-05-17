import type { Metadata } from 'next'
import { buildMetadata } from '@/src/lib/seo'
import { QuoteForm } from '@/src/components/b2b/quote-form'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'

export const metadata: Metadata = buildMetadata({
  title: 'Get a Quote — Custom Embroidery',
  description:
    'Request a custom embroidery quote from Royal Backs. Hats, polos, jackets, bags. We respond within 1 business day.',
})

const TRUST_SIGNALS = [
  { label: '1 Business Day', text: 'We respond to every quote request within 1 business day.' },
  { label: 'No Surprise Fees', text: 'We quote everything upfront — garments, digitizing, shipping.' },
  { label: 'Local Pickup', text: 'Free pickup in Milton, MA. No shipping costs on local orders.' },
  { label: '5–10 Day Turnaround', text: 'Most orders ship or are ready for pickup within 5–10 business days.' },
]

export default function QuotePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <BreadcrumbNav
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Embroidery', href: '/embroidery' },
          { name: 'Get a Quote', href: '/embroidery/quote' },
        ]}
      />

      <div className="mt-8 grid lg:grid-cols-3 gap-10 lg:gap-16">
        {/* Form */}
        <div className="lg:col-span-2">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-rb-navy mb-2">
            Request a Custom Embroidery Quote
          </h1>
          <p className="text-rb-muted mb-8">
            Fill out the form below. We&apos;ll review your request and get back to you within 1
            business day with pricing and next steps.
          </p>
          <QuoteForm />
        </div>

        {/* Trust sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-rb-surface border border-rb-border rounded-sm p-6 sticky top-24 space-y-6">
            <h2 className="font-display text-lg font-semibold text-rb-navy">
              What to expect
            </h2>
            <div className="space-y-5">
              {TRUST_SIGNALS.map((ts) => (
                <div key={ts.label} className="flex gap-3">
                  <div className="w-1.5 flex-shrink-0 bg-rb-gold rounded-full mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-rb-navy">{ts.label}</p>
                    <p className="text-sm text-rb-muted mt-0.5 leading-relaxed">{ts.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-rb-border pt-5">
              <p className="text-sm text-rb-muted">
                Questions? Email us at{' '}
                <a
                  href="mailto:info@royalbacks.com"
                  className="text-rb-navy underline hover:text-rb-gold transition-colors"
                >
                  info@royalbacks.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
