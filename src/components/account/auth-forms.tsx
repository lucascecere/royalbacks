'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  signupAction,
  loginAction,
  forgotPasswordAction,
  resetPasswordAction,
} from '@/src/actions/account'

const inputClass =
  'w-full border border-rb-border rounded-[7px] px-3 py-2 text-rb-black text-sm focus:outline-none focus:border-rb-black placeholder:text-rb-muted/60 bg-white'
const labelClass = 'block text-sm font-medium text-rb-black mb-1'
const buttonClass =
  'w-full bg-rb-green text-white font-bold text-sm py-3 rounded-[7px] uppercase hover:bg-rb-green-dark transition-colors disabled:opacity-60'

function Alert({ kind, children }: { kind: 'error' | 'success'; children: React.ReactNode }) {
  const styles =
    kind === 'error'
      ? 'bg-red-50 border-red-200 text-red-700'
      : 'bg-green-50 border-green-200 text-green-800'
  return (
    <p className={`border rounded-[7px] px-3 py-2 text-sm mb-4 ${styles}`} role="alert">
      {children}
    </p>
  )
}

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setError(null)
    start(async () => {
      const result = await loginAction({
        email: String(form.get('email') ?? ''),
        password: String(form.get('password') ?? ''),
      })
      if (!result.success) {
        setError(result.error)
        return
      }
      router.push('/account')
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error && <Alert kind="error">{error}</Alert>}
      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
        </div>
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? 'Signing in…' : 'Sign In'}
        </button>
      </div>
      <div className="flex items-center justify-between mt-4 text-sm">
        <Link href="/account/forgot" className="text-rb-muted hover:text-rb-black underline">
          Forgot password?
        </Link>
        <Link href="/account/signup" className="text-rb-muted hover:text-rb-black underline">
          Create account
        </Link>
      </div>
    </form>
  )
}

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [pending, start] = useTransition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setError(null)
    start(async () => {
      const result = await signupAction({
        email: String(form.get('email') ?? ''),
        password: String(form.get('password') ?? ''),
        firstName: String(form.get('firstName') ?? '') || undefined,
        lastName: String(form.get('lastName') ?? '') || undefined,
        marketingOptIn: form.get('marketingOptIn') === 'on',
      })
      if (!result.success) {
        setError(result.error)
        return
      }
      setSent(true)
    })
  }

  if (sent) {
    return (
      <div>
        <Alert kind="success">Check your email to confirm your account.</Alert>
        <p className="text-sm text-rb-muted leading-relaxed">
          We sent a confirmation link. Click it and you can start earning points on every
          order. If it doesn&apos;t arrive in a few minutes, check your spam folder.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error && <Alert kind="error">{error}</Alert>}
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="firstName">First name</label>
            <input id="firstName" name="firstName" type="text" autoComplete="given-name" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="lastName">Last name</label>
            <input id="lastName" name="lastName" type="text" autoComplete="family-name" className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="password">Password *</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
            className={inputClass}
            aria-describedby="password-hint"
          />
          <p id="password-hint" className="text-xs text-rb-muted mt-1">
            At least 10 characters.
          </p>
        </div>
        <label className="flex items-start gap-2 text-sm text-rb-muted">
          <input type="checkbox" name="marketingOptIn" className="mt-1 accent-rb-green" />
          <span>Email me when I earn points, plus new drops and restocks.</span>
        </label>
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? 'Creating account…' : 'Create Account'}
        </button>
      </div>
      <p className="text-sm text-rb-muted mt-4">
        Already have an account?{' '}
        <Link href="/account/login" className="underline hover:text-rb-black">Sign in</Link>
      </p>
    </form>
  )
}

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setError(null)
    start(async () => {
      const result = await forgotPasswordAction({ email: String(form.get('email') ?? '') })
      if (!result.success) {
        setError(result.error)
        return
      }
      setSent(true)
    })
  }

  if (sent) {
    return (
      <Alert kind="success">
        If there&apos;s an account with that email, we&apos;ve sent a reset link.
      </Alert>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error && <Alert kind="error">{error}</Alert>}
      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
        </div>
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? 'Sending…' : 'Send Reset Link'}
        </button>
      </div>
    </form>
  )
}

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [pending, start] = useTransition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setError(null)
    start(async () => {
      const result = await resetPasswordAction({
        token,
        password: String(form.get('password') ?? ''),
      })
      if (!result.success) {
        setError(result.error)
        return
      }
      setDone(true)
      setTimeout(() => router.push('/account/login'), 2000)
    })
  }

  if (done) {
    return <Alert kind="success">Password updated. Redirecting you to sign in…</Alert>
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error && <Alert kind="error">{error}</Alert>}
      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="password">New password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
            className={inputClass}
          />
          <p className="text-xs text-rb-muted mt-1">At least 10 characters.</p>
        </div>
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? 'Saving…' : 'Set New Password'}
        </button>
      </div>
    </form>
  )
}
