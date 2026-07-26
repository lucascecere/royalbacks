'use client'

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setMessage(null)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent }),
      })
      const json = (await res.json()) as { success?: boolean; error?: string }
      if (!res.ok || !json.success) {
        setStatus('error')
        setMessage(json.error ?? 'Something went wrong. Please try again.')
        return
      }
      setStatus('success')
      setEmail('')
      setConsent(false)
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm text-white/80 leading-relaxed" role="status">
        You&apos;re on the list. Watch your inbox for new drops and restocks.
      </p>
    )
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full bg-transparent border-b border-white/30 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
        aria-label="Email address for newsletter"
      />
      <div className="flex items-start gap-2 text-xs text-white/50">
        <input
          type="checkbox"
          id="footer-consent"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 accent-rb-green"
        />
        <label htmlFor="footer-consent">I agree to receive emails from Royal Backs.</label>
      </div>
      {message && (
        <p className="text-xs text-rb-green" role="alert">
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-rb-green text-white font-bold text-sm py-3 rounded-[7px] uppercase hover:bg-rb-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
      >
        {status === 'submitting' ? 'Signing up…' : 'Sign Up'}
      </button>
    </form>
  )
}
