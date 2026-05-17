import Link from 'next/link'

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
                { label: 'CLOVR', href: '/collections/local' },
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

          {/* Policies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Policies</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Terms & Conditions', href: '/policies/terms' },
                { label: 'Privacy Policy', href: '/policies/privacy' },
                { label: 'Shipping & Returns', href: '/policies/shipping' },
                { label: 'Accessibility', href: '/policies/accessibility' },
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
              <div className="pt-2 space-y-2">
                <p className="text-xs uppercase tracking-widest font-bold text-white">Social</p>
                <p><a href="#" className="hover:text-white transition-colors">Instagram</a></p>
                <p><a href="#" className="hover:text-white transition-colors">Facebook</a></p>
                <p><a href="#" className="hover:text-white transition-colors">TikTok</a></p>
              </div>
            </address>
          </div>

          {/* Newsletter */}
          <div>
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
        <div className="border-t border-white/10 mt-14 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} RoyalBacks LLC. All rights reserved.</p>
          <p>Made by <span className="text-white/60">TETRA MEDIA</span></p>
        </div>
      </div>
    </footer>
  )
}
