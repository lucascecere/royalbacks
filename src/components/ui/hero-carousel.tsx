'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface HeroSlide {
  id: string
  image: string
  alt: string
  /** Ground behind the copy panel. The photo panel stays light so the studio shots sit flush. */
  panel: string
  onDark: boolean
  eyebrow: string
  headline: string[]
  sub: string
  ctaLabel: string
  ctaHref: string
}

const SLIDES: HeroSlide[] = [
  {
    id: 'originals',
    image: '/products/rb-4suites-black.jpg',
    alt: 'Royal Backs 4 Suites cap in black',
    panel: '#000000',
    onDark: true,
    eyebrow: 'The Originals',
    headline: ['HATS WORTH', 'WEARING.'],
    sub: 'Premium caps stitched in Milton, MA. Built to be worn, not collected.',
    ctaLabel: 'Shop Originals',
    ctaHref: '/collections/originals',
  },
  {
    id: 'boston',
    image: '/products/boston-black.jpg',
    alt: 'Royal Backs Boston script cap in black',
    panel: '#EFEDEA',
    onDark: false,
    eyebrow: 'The Boston Collection',
    headline: ['BUILT FOR', 'BOSTON.'],
    sub: 'Hats that know where they came from.',
    ctaLabel: 'Shop Boston',
    ctaHref: '/collections/boston',
  },
  {
    id: 'milton',
    image: '/products/rb-classic.jpg',
    alt: 'Royal Backs classic cap',
    panel: '#000000',
    onDark: true,
    eyebrow: 'Milton, MA — Since 2017',
    headline: ['MADE ON THE', 'SOUTH SHORE.'],
    sub: 'One shop, one machine to start, and a lot of opinions about thread tension.',
    ctaLabel: 'Our Story',
    ctaHref: '/about',
  },
]

const INTERVAL = 6000

export function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), [])
  const prev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), [])

  useEffect(() => {
    if (paused || reduceMotion) return
    const t = setTimeout(next, INTERVAL)
    return () => clearTimeout(t)
  }, [index, paused, reduceMotion, next])

  const slide = SLIDES[index]

  return (
    <section
      className="relative -mt-24 pt-24 lg:pt-0"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="grid lg:grid-cols-2 lg:min-h-[86vh]">
        {/* Copy panel */}
        <div
          className="order-2 lg:order-1 flex items-center transition-colors duration-500"
          style={{ backgroundColor: slide.panel }}
        >
          <div className="w-full px-6 sm:px-10 lg:pl-[max(2.5rem,calc((100vw-1320px)/2))] lg:pr-16 py-14 lg:py-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: reduceMotion ? 0 : 0.4, ease: 'easeOut' }}
                className="max-w-[560px]"
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-4"
                  style={{
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    color: '#CC2929',
                  }}
                >
                  {slide.eyebrow}
                </p>
                <h1
                  className="font-display font-bold uppercase leading-[0.9] tracking-[-0.03em] mb-5"
                  style={{
                    fontSize: 'clamp(40px, 5vw, 76px)',
                    color: slide.onDark ? '#FFFFFF' : '#000000',
                  }}
                >
                  {slide.headline.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h1>
                <p
                  className="mb-8 text-lg max-w-md"
                  style={{
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    color: slide.onDark ? 'rgba(255,255,255,0.75)' : '#454545',
                  }}
                >
                  {slide.sub}
                </p>
                <Link
                  href={slide.ctaHref}
                  className="inline-block bg-rb-green text-white font-bold text-sm px-8 py-4 rounded-[7px] hover:bg-rb-green-dark transition-colors uppercase"
                  style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                >
                  {slide.ctaLabel}
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-12">
              <div className="flex items-center gap-2">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    aria-label={`Show ${s.eyebrow}`}
                    aria-current={i === index}
                    onClick={() => setIndex(i)}
                    className="transition-all duration-300 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rb-green"
                    style={{
                      width: i === index ? 26 : 8,
                      height: 8,
                      backgroundColor: slide.onDark
                        ? i === index
                          ? '#FFFFFF'
                          : 'rgba(255,255,255,0.35)'
                        : i === index
                          ? '#000000'
                          : 'rgba(0,0,0,0.22)',
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 ml-2">
                {[
                  { label: 'Previous slide', onClick: prev, glyph: '←' },
                  { label: 'Next slide', onClick: next, glyph: '→' },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={btn.onClick}
                    aria-label={btn.label}
                    className="w-9 h-9 flex items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rb-green"
                    style={{
                      borderColor: slide.onDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                      color: slide.onDark ? '#FFFFFF' : '#000000',
                    }}
                  >
                    {btn.glyph}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Photo panel */}
        <div className="order-1 lg:order-2 relative bg-[#F7F6F4] min-h-[46vh] lg:min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.5, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={index === 0}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
