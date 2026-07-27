import { redirect } from 'next/navigation'
import { hasLoyalty } from '@/src/lib/env'
import { getSessionCustomer } from '@/src/lib/auth/session'
import { SignupForm } from '@/src/components/account/auth-forms'
import { AccountUnavailable } from '@/src/components/account/unavailable'
import { POINTS_PER_DOLLAR, REDEMPTION_TIERS, formatCents } from '@/src/lib/loyalty/config'

export default async function SignupPage() {
  if (!hasLoyalty) return <AccountUnavailable />
  if (await getSessionCustomer()) redirect('/account')

  const first = REDEMPTION_TIERS[0]

  return (
    <div className="max-w-md mx-auto px-6 py-16 lg:py-24">
      <h1 className="font-display text-3xl font-bold text-rb-black mb-2">Create Account</h1>
      <p className="text-rb-muted text-sm mb-8">
        Earn {POINTS_PER_DOLLAR} point per $1 on everything — hats and custom embroidery
        both count. {first.points} points is {formatCents(first.valueCents)} off.
      </p>
      <SignupForm />
    </div>
  )
}
