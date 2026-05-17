import { getMdxSlugs } from '@/src/lib/mdx'
import { getAllProductHandles } from '@/src/services/products'

export async function getProductRoutes(): Promise<string[]> {
  try {
    return await getAllProductHandles()
  } catch {
    return []
  }
}

export async function getLocationRoutes(): Promise<string[]> {
  return getMdxSlugs('locations')
}

export async function getBlogRoutes(): Promise<string[]> {
  return getMdxSlugs('blog')
}

export async function getIndustryRoutes(): Promise<string[]> {
  return getMdxSlugs('industries')
}

export async function getDropRoutes(): Promise<string[]> {
  return getMdxSlugs('drops')
}
