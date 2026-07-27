'use client'

import { useState, useTransition } from 'react'
import { resendVerificationAction } from '@/src/actions/account'

export function ResendVerification() {
  const [status, setStatus] = useState<string | null>(null)
  const [pending, start] = useTransition()

  function onClick() {
    setStatus(null)
    start(async () => {
      const result = await resendVerificationAction()
      setStatus(
        result.success ? 'Sent — check your inbox.' : result.error
      )
    })
  }

  if (status) {
    return <p className="text-sm text-rb-ink" role="status">{status}</p>
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="text-sm font-semibold underline hover:text-rb-green disabled:opacity-60"
    >
      {pending ? 'Sending…' : 'Resend confirmation email'}
    </button>
  )
}
