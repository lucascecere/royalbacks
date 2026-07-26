import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { buildMetadata, buildBreadcrumbSchema, SITE_URL } from '@/src/lib/seo'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'
import { ProjectGallery } from '@/src/components/work/project-gallery'
import { getWorkBySlug, getWorkSlugs, getRelatedWork } from '@/src/services/work'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getWorkSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getWorkBySlug(slug)
  if (!project) return buildMetadata({ title: 'Project Not Found' })

  const description =
    project.meta_description ??
    `${project.summary} Custom embroidery by Royal Backs, Milton MA.`

  return buildMetadata({
    title: project.meta_title ?? `${project.title} | Our Work`,
    description,
    alternates: { canonical: `${SITE_URL}/work/${slug}` },
    openGraph: {
      title: project.title,
      description,
      images: [{ url: `${SITE_URL}${project.cover}` }],
      type: 'article',
    },
  })
}

export default async function WorkProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = getWorkBySlug(slug)
  if (!project) notFound()

  const related = getRelatedWork(project)
  // Ignore comment-only bodies so they don't render an empty prose block.
  const bodyText = project.content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').trim()

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Our Work', url: `${SITE_URL}/work` },
    { name: project.title, url: `${SITE_URL}/work/${slug}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <BreadcrumbNav
          crumbs={[
            { name: 'Home', href: '/' },
            { name: 'Our Work', href: '/work' },
            { name: project.title, href: `/work/${slug}` },
          ]}
        />

        <header className="mt-6 mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-rb-gold">
            {project.category}
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-rb-navy mt-2 mb-3">
            {project.title}
          </h1>
          {project.clientLabel && (
            <p className="text-rb-muted text-lg">
              {project.clientLabel}
              {project.year && <span className="text-rb-muted/70"> · {project.year}</span>}
            </p>
          )}
          <p className="text-rb-ink text-lg leading-relaxed max-w-2xl mt-4">{project.summary}</p>
        </header>

        {/* Cover */}
        <div className="relative aspect-[16/9] w-full bg-[#F7F6F4] rounded-[12px] overflow-hidden mb-10">
          <Image
            src={project.cover}
            alt={project.cover_alt ?? project.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </div>

        {/* Spec strip */}
        {((project.specs && project.specs.length > 0) ||
          (project.garments && project.garments.length > 0)) && (
          <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-4 border-y border-rb-border py-6 mb-10">
            {project.specs && project.specs.length > 0 && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-rb-muted mb-2">
                  Order details
                </dt>
                <dd>
                  <ul className="space-y-1">
                    {project.specs.map((spec) => (
                      <li key={spec} className="text-sm text-rb-ink flex items-center gap-2">
                        <span className="w-1 h-1 bg-rb-gold rounded-full flex-shrink-0" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
            {project.garments && project.garments.length > 0 && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-rb-muted mb-2">
                  Garments
                </dt>
                <dd>
                  <ul className="space-y-1">
                    {project.garments.map((g) => (
                      <li key={g} className="text-sm text-rb-ink flex items-center gap-2">
                        <span className="w-1 h-1 bg-rb-gold rounded-full flex-shrink-0" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        )}

        {/* Write-up */}
        {bodyText && (
          <div className="prose max-w-none mb-12">
            <MDXRemote source={project.content} />
          </div>
        )}

        {/* Gallery */}
        {project.images.length > 0 && (
          <section className="mb-14">
            <h2 className="font-display text-2xl font-bold text-rb-navy mb-5">The Work</h2>
            <ProjectGallery images={project.images} title={project.title} />
          </section>
        )}

        <div className="bg-rb-navy text-rb-cream rounded-sm p-8 text-center">
          <h2 className="font-display text-2xl font-bold mb-3">Need something similar?</h2>
          <p className="text-rb-cream/70 mb-6 max-w-lg mx-auto">
            Send us your garments, quantity, and logo — we&apos;ll come back with real pricing
            within one business day.
          </p>
          <Link
            href="/embroidery/quote"
            className="inline-block bg-rb-gold text-white font-semibold px-8 py-3 rounded-sm hover:bg-rb-gold-light transition-colors"
          >
            Get a Free Quote
          </Link>
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold text-rb-navy mb-5">More Work</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/work/${p.slug}`}
                  className="group block rounded-[12px] overflow-hidden border border-rb-border bg-white"
                >
                  <div className="relative aspect-[4/3] bg-[#F7F6F4]">
                    <Image
                      src={p.cover}
                      alt={p.cover_alt ?? p.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-rb-gold">
                      {p.category}
                    </span>
                    <p className="font-display font-semibold text-rb-navy mt-1">{p.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
