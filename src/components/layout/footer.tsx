import Link from 'next/link'
import Image from 'next/image'

interface FooterProps {
  showNap?: boolean
}

export function Footer({ showNap = false }: FooterProps) {
  return (
    <footer className="bg-rb-black text-white">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Shop */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Shop</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'All Products', href: '/collections' },
                { label: 'Best Sellers', href: '/collections/originals' },
                { label: 'RB', href: '/collections/originals' },
                { label: 'Boston', href: '/collections/boston' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Embroidery */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Embroidery</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Custom Embroidery', href: '/embroidery' },
                { label: 'Get a Quote', href: '/embroidery/quote' },
                { label: 'Portfolio', href: '/embroidery/portfolio' },
                { label: 'Pricing', href: '/embroidery/pricing' },
                { label: 'How It Works', href: '/embroidery/process' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Contact</h3>
            <address className="not-italic text-sm text-white/70 space-y-2">
              <p>Proudly based in</p>
              <p className="text-white font-medium">Milton, MA 02186</p>
              <p>
                <a href="mailto:info@royalbacks.com" className="hover:text-white transition-colors">
                  info@royalbacks.com
                </a>
              </p>
              <div className="pt-3 flex items-center gap-4">
                {/* Instagram */}
                <a href="https://www.instagram.com/royalbacks/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/60 hover:text-white transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4.5"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                {/* Facebook — placeholder */}
                <a href="#" aria-label="Facebook (coming soon)" className="text-white/30 cursor-not-allowed">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                {/* TikTok — placeholder */}
                <a href="#" aria-label="TikTok (coming soon)" className="text-white/30 cursor-not-allowed">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                  </svg>
                </a>
              </div>
            </address>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Stay in the Loop</h3>
            <p className="text-sm text-white/70 mb-4 leading-relaxed">
              New drops, restocks, and local events. No spam.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-transparent border-b border-white/30 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
                aria-label="Email address for newsletter"
              />
              <div className="flex items-start gap-2 text-xs text-white/50">
                <input type="checkbox" id="footer-consent" className="mt-0.5 accent-rb-green" />
                <label htmlFor="footer-consent">I agree to receive emails from Royal Backs.</label>
              </div>
              <button
                type="submit"
                className="w-full bg-rb-green text-white font-bold text-sm py-3 rounded-[7px] uppercase hover:bg-rb-green-dark transition-colors"
                style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Image
                src="/0c785f29-43a4-4016-8ae7-3326f301c461.png"
                alt="Royal Backs"
                width={80}
                height={80}
                className="h-16 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p>&copy; {new Date().getFullYear()} RoyalBacks LLC. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-right">
            {[
              { label: 'Terms & Conditions', href: '/policies/terms' },
              { label: 'Privacy Policy', href: '/policies/privacy' },
              { label: 'Shipping & Returns', href: '/policies/shipping' },
              { label: 'Accessibility', href: '/policies/accessibility' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white/70 transition-colors whitespace-nowrap">
                {link.label}
              </Link>
            ))}
            <span className="text-white/30">·</span>
            <span className="text-white/40">Managed By Your Website Friend</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
