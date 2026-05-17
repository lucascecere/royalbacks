import { readMdxFile, getMdxSlugs } from '@/src/lib/mdx'
import type { IndustryFrontmatter, IndustryPage } from '@/src/types/mdx'

export function getAllIndustries(): IndustryPage[] {
  const slugs = getMdxSlugs('industries')
  const industries: IndustryPage[] = []

  for (const slug of slugs) {
    const result = readMdxFile<IndustryFrontmatter>('industries', slug)
    if (!result) continue
    industries.push({
      ...result.data,
      slug,
      content: result.content,
    })
  }

  return industries.sort((a, b) => a.title.localeCompare(b.title))
}

export function getIndustryBySlug(slug: string): IndustryPage | null {
  const result = readMdxFile<IndustryFrontmatter>('industries', slug)
  if (!result) return null
  return {
    ...result.data,
    slug,
    content: result.content,
  }
}
