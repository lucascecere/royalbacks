import Link from 'next/link'
import { buildBreadcrumbSchema } from '@/src/lib/seo'

interface Crumb {
  name: string
  href: string
}

interface BreadcrumbNavProps {
  crumbs: Crumb[]
}

export function BreadcrumbNav({ crumbs }: BreadcrumbNavProps) {
  const schema = buildBreadcrumbSchema(
    crumbs.map((c) => ({ name: c.name, url: `https://royalbacks.com${c.href}` }))
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-rb-muted">
        <ol className="flex items-center gap-2 flex-wrap">
          {crumbs.map((crumb, i) => (
            <li key={crumb.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === crumbs.length - 1 ? (
                <span className="text-rb-black font-medium" aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <Link href={crumb.href} className="hover:text-rb-black transition-colors">
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
