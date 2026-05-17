'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CartIconButton } from '@/src/components/cart/cart-icon-button'

interface HeaderProps {
  mode: 'b2c' | 'b2b'
}

const B2C_NAV = [
  { label: 'Shop All', href: '/collections' },
  { label: 'Best Sellers', href: '/collections/originals' },
  { label: 'Boston', href: '/collections/boston' },
  { label: 'About Us', href: '/about' },
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
    <>
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-rb-link focus:rounded-sm focus:outline-none focus:ring-2 focus:ring-rb-link text-sm"
      >
        Skip to Main Content
      </a>

      <header className="bg-white sticky top-0 z-30 border-b border-rb-card">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/brand/royalbacks logo.webp"
                alt="Royal Backs"
                width={280}
                height={112}
                className="h-24 w-auto object-contain mix-blend-multiply"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-rb-ink hover:text-rb-black transition-colors font-medium"
                  style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {mode === 'b2c' ? (
                <CartIconButton />
              ) : (
                <Link
                  href="/embroidery/quote"
                  className="hidden md:block bg-rb-green text-white text-sm font-bold px-5 py-2.5 rounded-[7px] hover:bg-rb-green-dark transition-colors uppercase"
                  style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                >
                  Get a Quote
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-rb-black"
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
              className="md:hidden border-t border-rb-card bg-white"
            >
              <nav className="max-w-[1320px] mx-auto px-6 py-6 flex flex-col gap-4" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-rb-ink hover:text-rb-black py-1 text-base font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
                {mode === 'b2b' && (
                  <Link
                    href="/embroidery/quote"
                    onClick={() => setMobileOpen(false)}
                    className="bg-rb-green text-white text-center py-3 font-bold rounded-[7px] mt-2 uppercase text-sm"
                  >
                    Get a Quote
                  </Link>
                )}
                {mode === 'b2c' && (
                  <Link
                    href="/embroidery"
                    onClick={() => setMobileOpen(false)}
                    className="border border-rb-green text-rb-green text-center py-3 font-medium rounded-[7px] mt-2 text-sm"
                  >
                    Custom Embroidery
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
