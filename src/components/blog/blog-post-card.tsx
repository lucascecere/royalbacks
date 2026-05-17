import Link from 'next/link'
import { formatDate } from '@/src/lib/utils'
import type { BlogPost } from '@/src/types/mdx'

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="border border-rb-border rounded-sm p-6 hover:border-rb-navy hover:shadow-sm transition-all bg-white">
        <div className="flex items-center gap-3 text-xs text-rb-muted mb-3">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.reading_time && <span>&middot;</span>}
          {post.reading_time && <span>{post.reading_time} min read</span>}
        </div>
        <h3 className="font-display text-xl font-semibold text-rb-navy mb-2 group-hover:text-rb-gold transition-colors leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-rb-muted leading-relaxed">{post.description}</p>
        <span className="inline-block mt-4 text-sm font-medium text-rb-navy group-hover:text-rb-gold transition-colors">
          Read more &rarr;
        </span>
      </article>
    </Link>
  )
}
