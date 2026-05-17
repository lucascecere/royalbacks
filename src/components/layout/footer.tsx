import Link from 'next/link'

interface FooterProps {
  showNap?: boolean
}

export function Footer({ showNap = false }: FooterProps) {
  return (
    <footer className="bg-rb-navy text-rb-cream/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="font-display text-xl font-bold text-rb-cream block mb-3">
              Royal Backs
            </Link>
            <p className="text-sm text-rb-cream/60 leading-relaxed">
              Custom hats and embroidery from Milton, MA. Since 2017.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-rb-cream mb-3 uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Originals', href: '/collections/originals' },
                { label: 'Boston Collection', href: '/collections/boston' },
                { label: 'Local Collection', href: '/collections/local' },
                { label: 'Drops', href: '/collections/drops' },
                { label: 'All Collections', href: '/collections' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-rb-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Embroidery */}
          <div>
            <h3 className="text-sm font-semibold text-rb-cream mb-3 uppercase tracking-wider">
              Embroidery
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Custom Embroidery', href: '/embroidery' },
                { label: 'Get a Quote', href: '/embroidery/quote' },
                { label: 'Portfolio', href: '/embroidery/portfolio' },
                { label: 'Pricing', href: '/embroidery/pricing' },
                { label: 'How It Works', href: '/embroidery/process' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-rb-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-rb-cream mb-3 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'About', href: '/about' },
                { label: 'Blog', href: '/blog' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-rb-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {showNap && (
              <address className="not-italic mt-4 text-sm text-rb-cream/60 space-y-1">
                <p>Milton, MA 02186</p>
                <p>
                  <a
                    href="mailto:info@royalbacks.com"
                    className="hover:text-rb-cream transition-colors"
                  >
                    info@royalbacks.com
                  </a>
                </p>
                <p className="text-xs mt-2">Embroidering since 2017</p>
              </address>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-4 text-xs text-rb-cream/40">
          <p>&copy; {new Date().getFullYear()} Royal Backs. All rights reserved.</p>
          <p>Milton, Massachusetts</p>
        </div>
      </div>
    </footer>
  )
}
