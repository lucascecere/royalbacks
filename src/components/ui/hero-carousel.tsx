'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface HeroSlide {
  id: string
  image: string | null
  bgColor: string
  headline: string[]
  sub: string
  ctaLabel: string
  ctaHref: string
}

const SLIDES: HeroSlide[] = [
  {
    id: 'purpose',
    image: null,
    bgColor: '#E8E4DC',
    headline: ['WALKING WITH', 'PURPOSE.'],
    sub: 'Custom embroidery for apparel & accessories',
    ctaLabel: 'Shop Now',
    ctaHref: '/collections',
  },
  {
    id: 'boston',
    image: null,
    bgColor: '#D6DDE8',
    headline: ['BUILT FOR', 'BOSTON.'],
    sub: 'Hats that know where they came from.',
    ctaLabel: 'Shop Boston',
    ctaHref: '/collections/boston',
  },
  {
    id: 'milton',
    image: null,
    bgColor: '#DDE8D6',
    headline: ['MADE IN', 'MILTON.'],
    sub: 'South Shore roots. Every stitch earns its place.',
    ctaLabel: 'Our Story',
    ctaHref: '/about',
  },
  {
    id: 'embroidery',
    image: null,
    bgColor: '#1A1A1A',
    headline: ['CUSTOM', 'EMBROIDERY.'],
    sub: 'Teams, businesses, and brands across the South Shore.',
    ctaLabel: 'Get a Quote',
    ctaHref: '/embroidery/quote',
  },
]

const INTERVAL = 5000

export function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((next: number, dir: number) => {
    setDirection(dir)
    setIndex(next)
  }, [])

  const prev = useCallback(() => {
    goTo((index - 1 + SLIDES.length) % SLIDES.length, -1)
  }, [index, goTo])

  const next = useCallback(() => {
    goTo((index + 1) % SLIDES.length, 1)
  }, [index, goTo])

  useEffect(() => {
    if (paused) return
    const t = setTimeout(next, INTERVAL)
    return () => clearTimeout(t)
  }, [index, paused, next])

  const slide = SLIDES[index]
  const isDark = slide.bgColor.startsWith('#1') || slide.bgColor === '#000000'

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <section
      className="relative min-h-[85vh] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.32, 0, 0.67, 0] }}
          className="absolute inset-0"
          style={{ backgroundColor: slide.bgColor }}
        >
          {slide.image && (
            <Image
              src={slide.image}
              alt={slide.headline.join(' ')}
              fill
              className="object-cover"
              sizes="100vw"
              priority={index === 0}
            />
          )}
          {/* Overlay for dark text legibility on photos */}
          {slide.image && (
            <div className="absolute inset-0 bg-black/30" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Text content — stays above slides */}
      <div className="relative z-10 min-h-[85vh] flex items-end">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 w-full py-16 lg:py-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + '-text'}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
              className="max-w-[620px]"
            >
              <h1
                className="font-display font-bold uppercase leading-[0.9] tracking-[-0.03em] mb-5"
                style={{
                  fontSize: 'clamp(44px, 6.5vw, 88px)',
                  color: isDark ? '#FFFFFF' : '#000000',
                }}
              >
                {slide.headline.map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>
              <p
                className="font-bold mb-8 text-lg"
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  color: isDark ? 'rgba(255,255,255,0.85)' : '#282828',
                }}
              >
                {slide.sub}
              </p>
              <Link
                href={slide.ctaHref}
                className="inline-block bg-rb-green text-white font-bold text-sm px-7 py-3.5 rounded-[7px] hover:bg-rb-green-dark transition-colors uppercase"
                style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
              >
                {slide.ctaLabel}
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-10">
            {/* Dot indicators */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Slide indicators">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  className="transition-all duration-300"
                  style={{
                    width: i === index ? 24 : 8,
                    height: 8,
                    borderRadius: 9999,
                    backgroundColor: isDark
                      ? i === index ? '#FFFFFF' : 'rgba(255,255,255,0.35)'
                      : i === index ? '#000000' : 'rgba(0,0,0,0.25)',
                  }}
                />
              ))}
            </div>

            {/* Prev / Next */}
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="w-9 h-9 flex items-center justify-center rounded-full border transition-colors"
                style={{
                  borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                  color: isDark ? '#FFFFFF' : '#000000',
                }}
              >
                ←
              </button>
              <button
                onClick={next}
                aria-label="Next slide"
                className="w-9 h-9 flex items-center justify-center rounded-full border transition-colors"
                style={{
                  borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                  color: isDark ? '#FFFFFF' : '#000000',
                }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
