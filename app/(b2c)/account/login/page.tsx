import { redirect } from 'next/navigation'
import { hasLoyalty } from '@/src/lib/env'
import { getSessionCustomer } from '@/src/lib/auth/session'
import { LoginForm } from '@/src/components/account/auth-forms'
import { AccountUnavailable } from '@/src/components/account/unavailable'

export default async function LoginPage() {
  if (!hasLoyalty) return <AccountUnavailable />
  if (await getSessionCustomer()) redirect('/account')

  return (
    <div className="max-w-md mx-auto px-6 py-16 lg:py-24">
      <h1 className="font-display text-3xl font-bold text-rb-black mb-2">Sign In</h1>
      <p className="text-rb-muted text-sm mb-8">
        Track your orders and spend your points.
      </p>
      <LoginForm />
    </div>
  )
}
