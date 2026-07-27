import Link from 'next/link'
import { hasLoyalty } from '@/src/lib/env'
import { ResetPasswordForm } from '@/src/components/account/auth-forms'
import { AccountUnavailable } from '@/src/components/account/unavailable'

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  if (!hasLoyalty) return <AccountUnavailable />

  const { token } = await searchParams

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 lg:py-24">
        <h1 className="font-display text-3xl font-bold text-rb-black mb-3">
          Link Not Valid
        </h1>
        <p className="text-rb-muted text-sm mb-6">
          That reset link is missing or incomplete. Request a new one.
        </p>
        <Link href="/account/forgot" className="underline hover:text-rb-black text-sm">
          Send a new reset link
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16 lg:py-24">
      <h1 className="font-display text-3xl font-bold text-rb-black mb-2">New Password</h1>
      <p className="text-rb-muted text-sm mb-8">
        Choose a new password. This signs you out everywhere else.
      </p>
      <ResetPasswordForm token={token} />
    </div>
  )
}
