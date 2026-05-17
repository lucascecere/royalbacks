import Link from 'next/link'

interface RelatedLink {
  label: string
  href: string
}

interface RelatedLinksProps {
  title?: string
  links: RelatedLink[]
}

export function RelatedLinks({ title = 'Related Pages', links }: RelatedLinksProps) {
  if (links.length === 0) return null
  return (
    <aside className="border-t border-rb-border pt-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-rb-muted mb-3">{title}</p>
      <ul className="flex flex-wrap gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-rb-navy underline underline-offset-2 hover:text-rb-gold transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
