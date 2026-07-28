'use client'

import { useState } from 'react'
import Link from 'next/link'

const inputClass =
  'w-full border border-rb-border rounded-[7px] px-3 py-2.5 text-rb-black text-sm focus:outline-none focus:border-rb-black placeholder:text-rb-muted/60 bg-white'
const labelClass = 'block text-sm font-medium text-rb-black mb-1.5'

export function EnquiryForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setStatus('sending')
    setError(null)

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(form.get('name') ?? ''),
          email: String(form.get('email') ?? ''),
          phone: String(form.get('phone') ?? ''),
          message: String(form.get('message') ?? ''),
        }),
      })
      const json = (await res.json()) as { success?: boolean; error?: string }
      if (!res.ok || !json.success) {
        setStatus('error')
        setError(json.error ?? 'Something went wrong. Try again.')
        return
      }
      setStatus('sent')
    } catch {
      setStatus('error')
      setError('Network error. Try again, or email info@royalbacks.com.')
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-white rounded-[12px] p-8 border border-rb-border">
        <p className="font-display text-2xl font-bold text-rb-black mb-3">
          Got it — talk soon.
        </p>
        <p className="text-rb-muted text-sm leading-relaxed mb-6">
          We&apos;ll come back to you within one business day. If it&apos;s urgent, call it
          in or email{' '}
          <a href="mailto:info@royalbacks.com" className="underline hover:text-rb-black">
            info@royalbacks.com
          </a>
          .
        </p>
        <Link
          href="/work"
          className="inline-block border border-rb-black text-rb-black font-bold text-sm px-6 py-3 rounded-[7px] uppercase hover:bg-rb-black hover:text-white transition-colors"
        >
          See Our Work
        </Link>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="bg-white rounded-[12px] p-6 sm:p-8 border border-rb-border"
    >
      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="enq-name">
            Name
          </label>
          <input
            id="enq-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Jane Smith"
            className={inputClass}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="enq-email">
              Email
            </label>
            <input
              id="enq-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="jane@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="enq-phone">
              Phone <span className="text-rb-muted font-normal">(optional)</span>
            </label>
            <input
              id="enq-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="(617) 555-0100"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="enq-message">
            What do you need?
          </label>
          <textarea
            id="enq-message"
            name="message"
            required
            rows={4}
            placeholder="40 polos with our logo on the left chest, needed in about three weeks."
            className={`${inputClass} resize-y`}
          />
        </div>

        {status === 'error' && error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-rb-green text-white font-bold text-sm py-4 rounded-[7px] uppercase hover:bg-rb-green-dark transition-colors disabled:opacity-60"
          style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
        >
          {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
        </button>

        <p className="text-xs text-rb-muted text-center leading-relaxed">
          Want exact pricing?{' '}
          <Link href="/embroidery/quote" className="underline hover:text-rb-black">
            Use the full quote form
          </Link>{' '}
          — it takes about three minutes and covers everything we need.
        </p>
      </div>
    </form>
  )
}
