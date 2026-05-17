'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Testimonial {
  quote: string
  author: string
  role: string
  company?: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)

  function go(dir: 1 | -1) {
    setDirection(dir)
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length)
  }

  const current = testimonials[index]
  if (!current) return null

  return (
    <div className="relative max-w-2xl mx-auto">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.blockquote
          key={index}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <p className="font-display text-xl text-rb-navy leading-relaxed mb-6">
            &ldquo;{current.quote}&rdquo;
          </p>
          <footer className="text-sm text-rb-muted">
            <span className="font-medium text-rb-navy">{current.author}</span>
            {current.role && <span> &mdash; {current.role}</span>}
            {current.company && <span>, {current.company}</span>}
          </footer>
        </motion.blockquote>
      </AnimatePresence>
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="p-2 text-rb-muted hover:text-rb-navy transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2 items-center">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > index ? 1 : -1)
                  setIndex(i)
                }}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === index ? 'bg-rb-navy' : 'bg-rb-border'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="p-2 text-rb-muted hover:text-rb-navy transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
