'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  QuoteStep1Schema,
  QuoteStep2Schema,
  QuoteStep3Schema,
  QuoteStep4Schema,
} from '@/src/types/forms'
import type { z } from 'zod'

type Step1Data = z.infer<typeof QuoteStep1Schema>
type Step2Data = z.infer<typeof QuoteStep2Schema>
type Step3Data = z.infer<typeof QuoteStep3Schema>
type Step4Data = z.infer<typeof QuoteStep4Schema>

const STEP_COUNT = 4

function ProgressBar({ step }: { step: number }) {
  const pct = (step / STEP_COUNT) * 100
  return (
    <div className="mb-8">
      <div className="flex justify-between text-xs text-rb-muted mb-2">
        <span>Step {step} of {STEP_COUNT}</span>
        <span>{Math.round(pct)}% complete</span>
      </div>
      <div className="h-1.5 bg-rb-border rounded-full overflow-hidden">
        <div
          className="h-full bg-rb-gold rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

const inputClass =
  'w-full border border-rb-border rounded-sm px-3 py-2 text-rb-navy text-sm focus:outline-none focus:border-rb-navy placeholder:text-rb-muted/60 bg-white'
const labelClass = 'block text-sm font-medium text-rb-navy mb-1'
const errorClass = 'text-xs text-red-500 mt-1'

function Step1Form({ onNext, defaultValues }: { onNext: (d: Step1Data) => void; defaultValues: Partial<Step1Data> }) {
  const { register, handleSubmit, formState: { errors } } = useForm<Step1Data>({
    resolver: zodResolver(QuoteStep1Schema),
    defaultValues,
  })
  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-rb-navy mb-6">Your Contact Info</h2>
        <div>
          <label className={labelClass} htmlFor="name">Full Name *</label>
          <input id="name" type="text" placeholder="Jane Smith" className={inputClass} {...register('name')} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="email">Email Address *</label>
          <input id="email" type="email" placeholder="jane@example.com" className={inputClass} {...register('email')} />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">Phone (optional)</label>
          <input id="phone" type="tel" placeholder="(617) 555-0100" className={inputClass} {...register('phone')} />
        </div>
        <div>
          <label className={labelClass} htmlFor="company">Company / Organization (optional)</label>
          <input id="company" type="text" placeholder="Acme Sports" className={inputClass} {...register('company')} />
        </div>
      </div>
      <button type="submit" className="flex-1 w-full mt-8 py-3 bg-rb-navy text-rb-cream font-medium rounded-sm hover:bg-rb-navy-light transition-colors">
        Continue
      </button>
    </form>
  )
}

function Step2Form({ onNext, onBack, defaultValues }: { onNext: (d: Step2Data) => void; onBack: () => void; defaultValues: Partial<Step2Data> }) {
  const { register, handleSubmit, formState: { errors } } = useForm<Step2Data>({
    resolver: zodResolver(QuoteStep2Schema),
    defaultValues,
  })
  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-rb-navy mb-6">About Your Order</h2>
        <div>
          <label className={labelClass} htmlFor="garment_type">Garment Type *</label>
          <select id="garment_type" className={inputClass} {...register('garment_type')}>
            <option value="">Select a garment...</option>
            <option value="hats">Hats / Caps</option>
            <option value="polos">Polo Shirts</option>
            <option value="t-shirts">T-Shirts</option>
            <option value="sweatshirts">Sweatshirts / Hoodies</option>
            <option value="jackets">Jackets</option>
            <option value="bags">Bags / Backpacks</option>
            <option value="other">Other</option>
          </select>
          {errors.garment_type && <p className={errorClass}>{errors.garment_type.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="quantity">Quantity *</label>
          <input id="quantity" type="number" min={1} max={10000} placeholder="24" className={inputClass} {...register('quantity', { valueAsNumber: true })} />
          {errors.quantity && <p className={errorClass}>{errors.quantity.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="colors_count">Number of Embroidery Colors *</label>
          <input id="colors_count" type="number" min={1} max={15} placeholder="3" className={inputClass} {...register('colors_count', { valueAsNumber: true })} />
          {errors.colors_count && <p className={errorClass}>{errors.colors_count.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="notes">Additional Notes (optional)</label>
          <textarea id="notes" rows={3} placeholder="Left chest logo + back text, navy and white thread..." className={`${inputClass} resize-none`} {...register('notes')} />
        </div>
      </div>
      <div className="flex gap-4 mt-8">
        <button type="button" onClick={onBack} className="px-6 py-3 border border-rb-border text-rb-navy text-sm font-medium rounded-sm hover:border-rb-navy transition-colors">Back</button>
        <button type="submit" className="flex-1 py-3 bg-rb-navy text-rb-cream font-medium rounded-sm hover:bg-rb-navy-light transition-colors">Continue</button>
      </div>
    </form>
  )
}

function Step3Form({ onNext, onBack, defaultValues }: { onNext: (d: Step3Data) => void; onBack: () => void; defaultValues: Partial<Step3Data> }) {
  const { register, handleSubmit, watch } = useForm<Step3Data>({
    resolver: zodResolver(QuoteStep3Schema),
    defaultValues,
  })
  const hasArtwork = watch('has_artwork')
  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-rb-navy mb-6">Your Artwork</h2>
        <div>
          <p className={labelClass}>Do you have existing artwork? *</p>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="true" {...register('has_artwork', { setValueAs: (v: string) => v === 'true' })} className="accent-rb-navy" />
              <span className="text-sm text-rb-navy">Yes, I have a file</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="false" {...register('has_artwork', { setValueAs: (v: string) => v === 'true' })} className="accent-rb-navy" />
              <span className="text-sm text-rb-navy">No, I need design help</span>
            </label>
          </div>
        </div>
        {hasArtwork === true && (
          <div>
            <label className={labelClass} htmlFor="artwork_format">File Format</label>
            <select id="artwork_format" className={inputClass} {...register('artwork_format')}>
              <option value="">Select format...</option>
              <option value="ai">Adobe Illustrator (.ai)</option>
              <option value="pdf">PDF</option>
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}
        <div>
          <label className={labelClass} htmlFor="artwork_description">
            {hasArtwork === false ? 'What do you have in mind?' : 'Describe your artwork (optional)'}
          </label>
          <textarea id="artwork_description" rows={3} placeholder={hasArtwork === false ? 'Company name in block letters, shield graphic...' : 'Team logo with name underneath, approx 3 inches wide...'} className={`${inputClass} resize-none`} {...register('artwork_description')} />
        </div>
        {hasArtwork === false && (
          <div className="bg-rb-surface border border-rb-border rounded-sm p-4 text-sm text-rb-muted">
            No problem — we can help with design. Describe what you&apos;re envisioning and we&apos;ll work with you from there.
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-8">
        <button type="button" onClick={onBack} className="px-6 py-3 border border-rb-border text-rb-navy text-sm font-medium rounded-sm hover:border-rb-navy transition-colors">Back</button>
        <button type="submit" className="flex-1 py-3 bg-rb-navy text-rb-cream font-medium rounded-sm hover:bg-rb-navy-light transition-colors">Continue</button>
      </div>
    </form>
  )
}

function Step4Form({ onSubmit, onBack, defaultValues, isSubmitting, serverError }: {
  onSubmit: (d: Step4Data) => void
  onBack: () => void
  defaultValues: Partial<Step4Data>
  isSubmitting: boolean
  serverError: string | null
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<Step4Data>({
    resolver: zodResolver(QuoteStep4Schema),
    defaultValues,
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-rb-navy mb-6">Timeline & Budget</h2>
        <div>
          <label className={labelClass} htmlFor="deadline">When do you need it by? *</label>
          <select id="deadline" className={inputClass} {...register('deadline')}>
            <option value="">Select timeline...</option>
            <option value="asap">ASAP (rush)</option>
            <option value="1_week">Within 1 week</option>
            <option value="2_weeks">Within 2 weeks</option>
            <option value="1_month">Within a month</option>
            <option value="flexible">Flexible</option>
          </select>
          {errors.deadline && <p className={errorClass}>{errors.deadline.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="budget_range">Budget Range *</label>
          <select id="budget_range" className={inputClass} {...register('budget_range')}>
            <option value="">Select budget...</option>
            <option value="under_500">Under $500</option>
            <option value="500_1000">$500 &ndash; $1,000</option>
            <option value="1000_2500">$1,000 &ndash; $2,500</option>
            <option value="2500_plus">$2,500+</option>
            <option value="not_sure">Not sure yet</option>
          </select>
          {errors.budget_range && <p className={errorClass}>{errors.budget_range.message}</p>}
        </div>
      </div>
      {serverError && (
        <p className="mt-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
          {serverError}
        </p>
      )}
      <div className="flex gap-4 mt-8">
        <button type="button" onClick={onBack} className="px-6 py-3 border border-rb-border text-rb-navy text-sm font-medium rounded-sm hover:border-rb-navy transition-colors">Back</button>
        <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-rb-navy text-rb-cream font-medium rounded-sm hover:bg-rb-navy-light transition-colors disabled:opacity-60 disabled:cursor-wait">
          {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
        </button>
      </div>
    </form>
  )
}

export function QuoteForm() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [confirmationId, setConfirmationId] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [step1Data, setStep1Data] = useState<Partial<Step1Data>>({})
  const [step2Data, setStep2Data] = useState<Partial<Step2Data>>({})
  const [step3Data, setStep3Data] = useState<Partial<Step3Data>>({})

  function handleStep1(data: Step1Data) {
    setStep1Data(data)
    setStep(2)
  }
  function handleStep2(data: Step2Data) {
    setStep2Data(data)
    setStep(3)
  }
  function handleStep3(data: Step3Data) {
    setStep3Data(data)
    setStep(4)
  }

  async function handleStep4(data: Step4Data) {
    setIsSubmitting(true)
    setServerError(null)
    const payload = { ...step1Data, ...step2Data, ...step3Data, ...data }
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json() as { success?: boolean; confirmationId?: string; error?: string }
      if (!res.ok || !json.success) {
        setServerError(json.error ?? 'Something went wrong. Please try again.')
        return
      }
      setConfirmationId(json.confirmationId ?? null)
      setSubmitted(true)
    } catch {
      setServerError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-rb-navy">Quote Request Received</h2>
        <p className="text-rb-muted max-w-sm mx-auto">
          We&apos;ll review your request and get back to you within 1 business day.
        </p>
        {confirmationId && (
          <p className="text-xs text-rb-muted">
            Confirmation: <span className="font-mono">{confirmationId}</span>
          </p>
        )}
        <a href="/embroidery" className="inline-block text-rb-navy underline text-sm hover:text-rb-gold transition-colors">
          Back to Embroidery Services
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white border border-rb-border rounded-sm p-6 sm:p-8">
      <ProgressBar step={step} />
      {step === 1 && <Step1Form onNext={handleStep1} defaultValues={step1Data} />}
      {step === 2 && <Step2Form onNext={handleStep2} onBack={() => setStep(1)} defaultValues={step2Data} />}
      {step === 3 && <Step3Form onNext={handleStep3} onBack={() => setStep(2)} defaultValues={step3Data} />}
      {step === 4 && (
        <Step4Form
          onSubmit={handleStep4}
          onBack={() => setStep(3)}
          defaultValues={{}}
          isSubmitting={isSubmitting}
          serverError={serverError}
        />
      )}
    </div>
  )
}
