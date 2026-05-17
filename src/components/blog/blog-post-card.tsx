import Link from 'next/link'
import { formatDate } from '@/src/lib/utils'
import type { BlogPost } from '@/src/types/mdx'

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="border border-rb-border rounded-[12px] p-6 hover:border-rb-black hover:shadow-sm transition-all bg-white">
        <div className="flex items-center gap-3 text-xs text-rb-muted mb-3">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.reading_time && <span>&middot;</span>}
          {post.reading_time && <span>{post.reading_time} min read</span>}
        </div>
        <h3 className="font-display text-xl font-bold text-rb-black mb-2 group-hover:text-rb-green transition-colors leading-snug uppercase">
          {post.title}
        </h3>
        <p className="text-sm text-rb-muted leading-relaxed">{post.description}</p>
        <span className="inline-block mt-4 text-sm font-bold text-rb-black group-hover:text-rb-green transition-colors" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          Read more &rarr;
        </span>
      </article>
    </Link>
  )
}
