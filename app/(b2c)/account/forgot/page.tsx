import { hasLoyalty } from '@/src/lib/env'
import { ForgotPasswordForm } from '@/src/components/account/auth-forms'
import { AccountUnavailable } from '@/src/components/account/unavailable'

export default function ForgotPage() {
  if (!hasLoyalty) return <AccountUnavailable />

  return (
    <div className="max-w-md mx-auto px-6 py-16 lg:py-24">
      <h1 className="font-display text-3xl font-bold text-rb-black mb-2">Reset Password</h1>
      <p className="text-rb-muted text-sm mb-8">
        Enter your email and we&apos;ll send you a link.
      </p>
      <ForgotPasswordForm />
    </div>
  )
}
