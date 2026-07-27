import Link from 'next/link'

/**
 * Shown when the loyalty env vars aren't set, so the account routes render
 * something honest instead of throwing on a site that's otherwise fine.
 */
export function AccountUnavailable() {
  return (
    <div className="max-w-md mx-auto px-6 py-20 lg:py-28 text-center">
      <h1 className="font-display text-3xl font-bold text-rb-black mb-3">
        Accounts Coming Soon
      </h1>
      <p className="text-rb-muted text-sm leading-relaxed mb-8">
        We&apos;re setting up accounts and the rewards program. Check back shortly — in the
        meantime you can still order as a guest, and any points you earn will be waiting
        when you sign up.
      </p>
      <Link
        href="/collections"
        className="inline-block bg-rb-green text-white font-bold text-sm px-8 py-3 rounded-[7px] uppercase hover:bg-rb-green-dark transition-colors"
      >
        Shop Now
      </Link>
    </div>
  )
}
