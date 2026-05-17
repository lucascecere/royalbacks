import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_ROOT = path.join(process.cwd(), 'content')

export function getMdxSlugs(contentType: string): string[] {
  const dir = path.join(CONTENT_ROOT, contentType)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export function readMdxFile<T>(
  contentType: string,
  slug: string
): { data: T; content: string } | null {
  const filePath = path.join(CONTENT_ROOT, contentType, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  return { data: data as T, content }
}

export function computeReadingTime(content: string): number {
  return Math.ceil(content.split(/\s+/).length / 200)
}
