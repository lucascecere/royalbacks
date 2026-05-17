import { readMdxFile, getMdxSlugs } from '@/src/lib/mdx'
import type { LocationFrontmatter, LocationPage } from '@/src/types/mdx'

export function getAllLocations(): LocationPage[] {
  const slugs = getMdxSlugs('locations')
  const locations: LocationPage[] = []

  for (const slug of slugs) {
    const result = readMdxFile<LocationFrontmatter>('locations', slug)
    if (!result) continue
    locations.push({
      ...result.data,
      slug,
      content: result.content,
    })
  }

  // HQ first, then alphabetical by town
  return locations.sort((a, b) => {
    if (a.is_hq && !b.is_hq) return -1
    if (!a.is_hq && b.is_hq) return 1
    return a.town.localeCompare(b.town)
  })
}

export function getLocationBySlug(slug: string): LocationPage | null {
  const result = readMdxFile<LocationFrontmatter>('locations', slug)
  if (!result) return null
  return {
    ...result.data,
    slug,
    content: result.content,
  }
}

export function getLocationSlugs(): string[] {
  return getMdxSlugs('locations')
}

export function getNearbyLocations(
  currentSlug: string,
  nearbySlugs: string[]
): LocationPage[] {
  const results: LocationPage[] = []
  for (const slug of nearbySlugs) {
    if (slug === currentSlug) continue
    const location = getLocationBySlug(slug)
    if (location) results.push(location)
  }
  return results
}
