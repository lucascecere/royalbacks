import Link from 'next/link'
import { hasLoyalty } from '@/src/lib/env'
import { verifyEmailToken } from '@/src/services/account'
import { AccountUnavailable } from '@/src/components/account/unavailable'

// The token is single-use, so this must never be served from a cache.
export const dynamic = 'force-dynamic'

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  if (!hasLoyalty) return <AccountUnavailable />

  const { token } = await searchParams
  const verified = token ? await verifyEmailToken(token) : false

  return (
    <div className="max-w-md mx-auto px-6 py-20 lg:py-28 text-center">
      <h1 className="font-display text-3xl font-bold text-rb-black mb-3">
        {verified ? 'Email Confirmed' : 'Link Expired'}
      </h1>
      <p className="text-rb-muted text-sm leading-relaxed mb-8">
        {verified
          ? "You're all set. Your points are ready to use."
          : 'That confirmation link is invalid or has already been used. Sign in and we can send you a fresh one.'}
      </p>
      <Link
        href={verified ? '/account' : '/account/login'}
        className="inline-block bg-rb-green text-white font-bold text-sm px-8 py-3 rounded-[7px] uppercase hover:bg-rb-green-dark transition-colors"
      >
        {verified ? 'Go to Account' : 'Sign In'}
      </Link>
    </div>
  )
}
