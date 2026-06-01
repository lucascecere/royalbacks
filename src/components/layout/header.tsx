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

      {/* Floating pill nav — fixed, transparent outer, rounded inner bar */}
      <header className="fixed top-12 left-0 right-0 z-40 px-4 lg:px-8 pointer-events-none">
        <div className="max-w-[1320px] mx-auto">
          <div
            className="flex items-center justify-between h-16 px-5 lg:px-7 rounded-2xl pointer-events-auto"
            style={{
              background: '#FFFFFF',
              boxShadow: '0 2px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
              border: '1px solid #EFEFEF',
            }}
          >
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/brand/royalbacks logo.webp"
                alt="Royal Backs"
                width={200}
                height={80}
                className="h-14 w-auto object-contain mix-blend-multiply"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-rb-ink hover:text-rb-black transition-colors"
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
                  className="hidden md:block bg-rb-green text-white text-sm font-bold px-5 py-2 rounded-[7px] hover:bg-rb-green-dark transition-colors uppercase"
                  style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                >
                  Get a Quote
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-1.5 text-rb-black"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown — extends below the pill */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="mt-2 rounded-2xl overflow-hidden pointer-events-auto"
                style={{
                  background: '#FFFFFF',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  border: '1px solid #EFEFEF',
                }}
              >
                <nav className="px-5 py-5 flex flex-col gap-4" aria-label="Mobile navigation">
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
                      className="bg-rb-green text-white text-center py-3 font-bold rounded-[7px] mt-1 uppercase text-sm"
                    >
                      Get a Quote
                    </Link>
                  )}
                  {mode === 'b2c' && (
                    <Link
                      href="/embroidery"
                      onClick={() => setMobileOpen(false)}
                      className="border border-rb-green text-rb-green text-center py-3 font-medium rounded-[7px] mt-1 text-sm"
                    >
                      Custom Embroidery
                    </Link>
                  )}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  )
}
