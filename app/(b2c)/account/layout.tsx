import type { Metadata } from 'next'
import { buildMetadata } from '@/src/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Account',
  // Account pages are already Disallow'ed in robots.ts; this is the belt-and-braces.
  robots: { index: false, follow: false },
})

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[60vh]">{children}</div>
}
