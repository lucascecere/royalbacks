'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { WorkImage } from '@/src/types/mdx'

interface ProjectGalleryProps {
  images: WorkImage[]
  title: string
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [openAt, setOpenAt] = useState<number | null>(null)

  const close = useCallback(() => setOpenAt(null), [])
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpenAt((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length]
  )

  useEffect(() => {
    if (openAt === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    // Stop the page scrolling behind the lightbox.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [openAt, close, step])

  if (images.length === 0) return null

  const current = openAt === null ? null : images[openAt]

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <figure key={img.src} className="m-0">
            <button
              onClick={() => setOpenAt(i)}
              className="relative aspect-[4/3] w-full bg-[#F7F6F4] rounded-[10px] overflow-hidden group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rb-gold"
              aria-label={`Open image ${i + 1} of ${images.length}: ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </button>
            {img.caption && (
              <figcaption className="text-xs text-rb-muted mt-2">{img.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — image viewer`}
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Close image viewer"
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    step(-1)
                  }}
                  aria-label="Previous image"
                  className="absolute left-2 sm:left-6 text-white/70 hover:text-white p-3 z-10"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    step(1)
                  }}
                  aria-label="Next image"
                  className="absolute right-2 sm:right-6 text-white/70 hover:text-white p-3 z-10"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <motion.figure
              key={current.src}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl m-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full" style={{ height: 'min(78vh, 900px)' }}>
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
              <figcaption className="text-center text-sm text-white/60 mt-4">
                {current.caption ?? current.alt}
                <span className="text-white/35 ml-2">
                  {(openAt ?? 0) + 1} / {images.length}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
