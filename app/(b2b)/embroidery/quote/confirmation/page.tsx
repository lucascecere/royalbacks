import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/src/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Quote Request Received',
  description: 'Your custom embroidery quote request has been received. We\'ll be in touch shortly.',
})

export default function QuoteConfirmationPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 lg:py-24 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="font-display text-3xl lg:text-4xl font-bold text-rb-navy mb-4">
        Quote Request Received
      </h1>
      <p className="text-rb-muted text-lg mb-8 leading-relaxed">
        We&apos;ve got your request. Someone from the Royal Backs team will follow up within 1
        business day with pricing and next steps.
      </p>

      <div className="bg-rb-surface border border-rb-border rounded-sm p-6 text-left mb-8 space-y-3">
        <h2 className="font-semibold text-rb-navy">What happens next</h2>
        <ol className="space-y-2 text-sm text-rb-muted list-decimal list-inside">
          <li>We review your request and prepare a detailed quote.</li>
          <li>We send you pricing, timeline, and a link to approve artwork.</li>
          <li>Once approved, production starts — typically 5–10 business days to completion.</li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/embroidery"
          className="inline-block bg-rb-navy text-rb-cream font-medium px-6 py-3 rounded-sm hover:bg-rb-navy-light transition-colors"
        >
          Back to Embroidery
        </Link>
        <Link
          href="/"
          className="inline-block border border-rb-border text-rb-navy font-medium px-6 py-3 rounded-sm hover:border-rb-navy transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
