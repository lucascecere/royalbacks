import Link from 'next/link'

/** Last reviewed date shown on every policy page. Bump when terms change. */
export const POLICY_EFFECTIVE_DATE = 'July 25, 2026'

export function PolicyShell({
  title,
  intro,
  children,
}: {
  title: string
  intro?: string
  children: React.ReactNode
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <nav className="text-sm text-rb-muted mb-6">
        <Link href="/" className="hover:text-rb-black transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-rb-black">{title}</span>
      </nav>

      <h1 className="font-display text-4xl lg:text-5xl font-bold text-rb-black mb-4">{title}</h1>
      <div className="w-12 h-0.5 bg-rb-gold mb-6" />

      {intro && <p className="text-lg text-rb-muted leading-relaxed mb-8">{intro}</p>}

      <div className="space-y-8 text-rb-ink leading-relaxed">{children}</div>

      <p className="text-sm text-rb-muted mt-14 pt-6 border-t border-rb-border">
        Last updated {POLICY_EFFECTIVE_DATE}. Questions about this policy? Email{' '}
        <a href="mailto:info@royalbacks.com" className="underline hover:text-rb-black transition-colors">
          info@royalbacks.com
        </a>
        .
      </p>
    </div>
  )
}

export function PolicySection({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold text-rb-black mb-3">{heading}</h2>
      <div className="space-y-3 text-rb-muted">{children}</div>
    </section>
  )
}
