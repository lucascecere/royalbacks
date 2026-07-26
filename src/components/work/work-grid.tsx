'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { WorkProject } from '@/src/types/mdx'

interface WorkGridProps {
  projects: WorkProject[]
  categories: string[]
}

const ALL = 'All Work'

export function WorkGrid({ projects, categories }: WorkGridProps) {
  const [active, setActive] = useState(ALL)

  const filtered = useMemo(
    () => (active === ALL ? projects : projects.filter((p) => p.category === active)),
    [active, projects]
  )

  const counts = useMemo(() => {
    const map = new Map<string, number>([[ALL, projects.length]])
    for (const p of projects) map.set(p.category, (map.get(p.category) ?? 0) + 1)
    return map
  }, [projects])

  return (
    <>
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter work by category">
          {[ALL, ...categories].map((cat) => {
            const isActive = cat === active
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                aria-pressed={isActive}
                className={`text-sm font-semibold px-4 py-2 rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rb-gold ${
                  isActive
                    ? 'bg-rb-black text-white border-rb-black'
                    : 'bg-white text-rb-ink border-rb-border hover:border-rb-black'
                }`}
              >
                {cat}
                <span className={isActive ? 'text-white/50 ml-1.5' : 'text-rb-muted ml-1.5'}>
                  {counts.get(cat) ?? 0}
                </span>
              </button>
            )
          })}
        </div>
      )}

      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.article
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="group"
            >
              <Link
                href={`/work/${project.slug}`}
                className="block rounded-[12px] overflow-hidden border border-rb-border bg-white h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rb-gold"
              >
                <div className="relative aspect-[4/3] bg-[#F7F6F4] overflow-hidden">
                  <Image
                    src={project.cover}
                    alt={project.cover_alt ?? project.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {project.images.length > 1 && (
                    <span className="absolute bottom-3 right-3 text-[11px] font-semibold bg-black/70 text-white px-2 py-1 rounded-full">
                      {project.images.length} photos
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-rb-gold">
                    {project.category}
                  </span>
                  <h2 className="font-display text-lg font-semibold text-rb-navy mt-1">
                    {project.title}
                  </h2>
                  {project.clientLabel && (
                    <p className="text-sm text-rb-muted mt-0.5">
                      {project.clientLabel}
                      {project.year && <span className="text-rb-muted/70"> · {project.year}</span>}
                    </p>
                  )}
                  <p className="text-sm text-rb-muted leading-relaxed mt-3">{project.summary}</p>
                  {project.specs && project.specs.length > 0 && (
                    <ul className="flex flex-wrap gap-x-3 gap-y-1 mt-4 pt-3 border-t border-rb-border">
                      {project.specs.slice(0, 3).map((spec) => (
                        <li key={spec} className="text-xs text-rb-muted flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-rb-gold rounded-full flex-shrink-0" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-rb-muted py-12 text-center">No projects in this category yet.</p>
      )}
    </>
  )
}
