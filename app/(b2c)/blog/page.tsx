import type { Metadata } from 'next'
import { getAllBlogPosts } from '@/src/services/blog'
import { buildMetadata } from '@/src/lib/seo'
import { BlogPostCard } from '@/src/components/blog/blog-post-card'

export const metadata: Metadata = buildMetadata({
  title: 'Blog',
  description:
    'Tips, guides, and stories from Royal Backs — custom embroidery, hat care, South Shore, and more.',
})

export default function BlogIndexPage() {
  const posts = getAllBlogPosts()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <header className="mb-12">
        <h1 className="font-display text-4xl font-bold text-rb-navy mb-3">Blog</h1>
        <p className="text-rb-muted text-lg max-w-xl">
          Thoughts on embroidery, headwear, and the South Shore — from the people who do the work.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-rb-muted font-display text-xl">No posts yet.</p>
          <p className="text-sm text-rb-muted mt-2">Check back soon.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
