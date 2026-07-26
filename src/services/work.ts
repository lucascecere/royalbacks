import { readMdxFile, getMdxSlugs } from '@/src/lib/mdx'
import type { WorkFrontmatter, WorkProject } from '@/src/types/mdx'

const CONTENT_TYPE = 'work'

function hydrate(slug: string, data: WorkFrontmatter, content: string): WorkProject {
  return {
    ...data,
    slug,
    content,
    clientLabel: data.client ?? data.client_generic ?? null,
    images: data.images ?? [],
    specs: data.specs ?? [],
    garments: data.garments ?? [],
  }
}

export function getAllWork(): WorkProject[] {
  const projects: WorkProject[] = []

  for (const slug of getMdxSlugs(CONTENT_TYPE)) {
    const result = readMdxFile<WorkFrontmatter>(CONTENT_TYPE, slug)
    if (!result) continue
    projects.push(hydrate(slug, result.data, result.content))
  }

  // Featured first, then by explicit order, then newest year, then title.
  return projects.sort((a, b) => {
    if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER
    if (orderA !== orderB) return orderA - orderB
    if (a.year && b.year && a.year !== b.year) return b.year.localeCompare(a.year)
    return a.title.localeCompare(b.title)
  })
}

export function getWorkBySlug(slug: string): WorkProject | null {
  const result = readMdxFile<WorkFrontmatter>(CONTENT_TYPE, slug)
  if (!result) return null
  return hydrate(slug, result.data, result.content)
}

export function getWorkSlugs(): string[] {
  return getMdxSlugs(CONTENT_TYPE)
}

/** Categories present in the content, in the order they should appear as filters. */
export function getWorkCategories(projects: WorkProject[]): string[] {
  const seen = new Map<string, number>()
  for (const p of projects) {
    seen.set(p.category, (seen.get(p.category) ?? 0) + 1)
  }
  return [...seen.keys()].sort((a, b) => {
    const diff = (seen.get(b) ?? 0) - (seen.get(a) ?? 0)
    return diff !== 0 ? diff : a.localeCompare(b)
  })
}

/** Other projects to show at the bottom of a project page — same category first. */
export function getRelatedWork(current: WorkProject, limit = 3): WorkProject[] {
  const others = getAllWork().filter((p) => p.slug !== current.slug)
  const sameCategory = others.filter((p) => p.category === current.category)
  const rest = others.filter((p) => p.category !== current.category)
  return [...sameCategory, ...rest].slice(0, limit)
}

/** Total finished photos across all projects — used for the page intro. */
export function getWorkPhotoCount(projects: WorkProject[]): number {
  return projects.reduce((sum, p) => sum + p.images.length, 0)
}
