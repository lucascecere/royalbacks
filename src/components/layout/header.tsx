'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CartIconButton } from '@/src/components/cart/cart-icon-button'

interface HeaderProps {
  mode: 'b2c' | 'b2b'
}

const B2C_NAV = [
  { label: 'Collections', href: '/collections' },
  { label: 'Originals', href: '/collections/originals' },
  { label: 'Boston', href: '/collections/boston' },
  { label: 'Local', href: '/collections/local' },
  { label: 'Drops', href: '/collections/drops' },
  { label: 'About', href: '/about' },
]

const B2B_NAV = [
  { label: 'Embroidery', href: '/embroidery' },
  { label: 'Portfolio', href: '/embroidery/portfolio' },
  { label: 'Pricing', href: '/embroidery/pricing' },
  { label: 'Blog', href: '/blog' },
]

export function Header({ mode }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems = mode === 'b2c' ? B2C_NAV : B2B_NAV

  return (
    <header className="bg-rb-navy sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight text-rb-cream hover:text-rb-gold transition-colors"
          >
            Royal Backs
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-rb-cream/80 hover:text-rb-cream transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {mode === 'b2c' ? (
              <CartIconButton />
            ) : (
              <Link
                href="/embroidery/quote"
                className="hidden md:block bg-rb-gold text-rb-navy text-sm font-medium px-4 py-2 rounded-sm hover:bg-rb-gold-light transition-colors"
              >
                Get a Quote
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-rb-cream"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10"
          >
            <nav className="px-4 py-4 flex flex-col gap-4" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-rb-cream/90 hover:text-rb-cream py-1 text-base"
                >
                  {item.label}
                </Link>
              ))}
              {mode === 'b2b' && (
                <Link
                  href="/embroidery/quote"
                  onClick={() => setMobileOpen(false)}
                  className="bg-rb-gold text-rb-navy text-center py-3 font-medium rounded-sm mt-2"
                >
                  Get a Quote
                </Link>
              )}
              {mode === 'b2c' && (
                <Link
                  href="/embroidery"
                  onClick={() => setMobileOpen(false)}
                  className="border border-rb-gold text-rb-gold text-center py-3 font-medium rounded-sm mt-2"
                >
                  Custom Embroidery
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
