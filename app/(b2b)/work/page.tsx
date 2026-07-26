import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata, SITE_URL } from '@/src/lib/seo'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'
import { WorkGrid } from '@/src/components/work/work-grid'
import { getAllWork, getWorkCategories, getWorkPhotoCount } from '@/src/services/work'

export const metadata: Metadata = buildMetadata({
  title: 'Our Work | Custom Embroidery Portfolio',
  description:
    'Custom embroidery work by Royal Backs — team gear, uniform programs, retail merch, and corporate apparel for South Shore teams and businesses.',
  alternates: { canonical: `${SITE_URL}/work` },
})

export default function WorkPage() {
  const projects = getAllWork()
  const categories = getWorkCategories(projects)
  const photoCount = getWorkPhotoCount(projects)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <BreadcrumbNav
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Our Work', href: '/work' },
        ]}
      />

      <header className="mt-6 mb-10">
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-rb-navy mb-3">Our Work</h1>
        <p className="text-rb-muted text-lg max-w-2xl leading-relaxed">
          {projects.length > 0 ? (
            <>
              Real orders we&apos;ve stitched for South Shore teams, businesses, and organizations
              — {projects.length} project{projects.length === 1 ? '' : 's'}
              {photoCount > 0 && <> and {photoCount} photos</>} of finished work.
            </>
          ) : (
            <>
              Photos of finished embroidery work for South Shore teams and businesses. We&apos;re
              adding projects here now — in the meantime,{' '}
              <a
                href="mailto:info@royalbacks.com"
                className="underline hover:text-rb-navy transition-colors"
              >
                email us
              </a>{' '}
              and we&apos;ll send samples relevant to your project.
            </>
          )}
        </p>
      </header>

      {projects.length > 0 ? (
        <WorkGrid projects={projects} categories={categories} />
      ) : (
        <div className="border border-dashed border-rb-border rounded-[12px] py-16 px-6 text-center">
          <p className="font-display text-xl font-semibold text-rb-navy mb-2">
            Projects going up shortly
          </p>
          <p className="text-rb-muted text-sm max-w-md mx-auto">
            We&apos;d rather show you real finished work than stock photos. Ask us for samples that
            match what you&apos;re planning and we&apos;ll send them over.
          </p>
        </div>
      )}

      <div className="mt-16 bg-rb-navy text-rb-cream rounded-sm p-8 lg:p-12 text-center">
        <h2 className="font-display text-2xl lg:text-3xl font-bold mb-4">
          Want something like this for your team?
        </h2>
        <p className="text-rb-cream/70 mb-7 max-w-lg mx-auto">
          Tell us what you&apos;re planning — garments, quantity, and roughly what your logo looks
          like. We respond to every quote request within one business day.
        </p>
        <Link
          href="/embroidery/quote"
          className="inline-block bg-rb-gold text-white font-semibold px-10 py-4 rounded-sm hover:bg-rb-gold-light transition-colors"
        >
          Get a Free Quote
        </Link>
      </div>
    </div>
  )
}
