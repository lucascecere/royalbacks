import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getAllBlogPosts, getRelatedPosts } from '@/src/services/blog'
import { buildMetadata, buildArticleSchema } from '@/src/lib/seo'
import { AuthorBio } from '@/src/components/blog/author-bio'
import { BlogPostCard } from '@/src/components/blog/blog-post-card'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'
import { formatDate } from '@/src/lib/utils'

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return buildMetadata({
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      images: post.og_image ? [{ url: post.og_image }] : undefined,
    },
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  const relatedPosts = getRelatedPosts(slug, post.tags, 3)
  const articleSchema = buildArticleSchema(post)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <BreadcrumbNav
          crumbs={[
            { name: 'Home', href: '/' },
            { name: 'Blog', href: '/blog' },
            { name: post.title, href: `/blog/${slug}` },
          ]}
        />

        <header className="mt-8 mb-10">
          <div className="flex items-center gap-3 text-xs text-rb-muted mb-4">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.reading_time && (
              <>
                <span>&middot;</span>
                <span>{post.reading_time} min read</span>
              </>
            )}
          </div>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-rb-navy mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-rb-muted leading-relaxed">{post.description}</p>
        </header>

        <article className="prose prose-lg max-w-none">
          <MDXRemote source={post.content} />
        </article>

        <div className="mt-12">
          <AuthorBio />
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-rb-navy mb-6">Related Posts</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedPosts.map((related) => (
                <BlogPostCard key={related.slug} post={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
