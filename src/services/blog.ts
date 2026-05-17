import { readMdxFile, getMdxSlugs, computeReadingTime } from '@/src/lib/mdx'
import type { BlogFrontmatter, BlogPost } from '@/src/types/mdx'

export function getAllBlogPosts(): BlogPost[] {
  const slugs = getMdxSlugs('blog')
  const posts: BlogPost[] = []

  for (const slug of slugs) {
    const result = readMdxFile<BlogFrontmatter>('blog', slug)
    if (!result) continue
    const reading_time = computeReadingTime(result.content)
    posts.push({
      ...result.data,
      reading_time,
      slug,
      content: result.content,
    })
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getPostBySlug(slug: string): BlogPost | null {
  const result = readMdxFile<BlogFrontmatter>('blog', slug)
  if (!result) return null
  const reading_time = computeReadingTime(result.content)
  return {
    ...result.data,
    reading_time,
    slug,
    content: result.content,
  }
}

export function getRecentPosts(n: number): BlogPost[] {
  return getAllBlogPosts().slice(0, n)
}

export function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  n: number = 3
): BlogPost[] {
  return getAllBlogPosts()
    .filter((post) => post.slug !== currentSlug)
    .filter((post) => post.tags.some((tag) => tags.includes(tag)))
    .slice(0, n)
}
