'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const SEMESTERS = [
  '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th',
  'Fresh Graduate', 'Working Professional',
]

const SKILL_LEVELS = [
  'Complete Beginner',
  'Heard of it but never used it',
  'Used it a little',
  'Intermediate',
]

const REFERRAL_SOURCES = [
  'Instagram', 'LinkedIn', 'WhatsApp', 'Friend', 'University', 'Other',
]

const schema = z.object({
  full_name:       z.string().min(2, 'Enter your full name'),
  email:           z.string().email('Enter a valid email address'),
  phone:           z.string().min(7, 'Enter a valid phone number'),
  university:      z.string().min(2, 'Enter your university or institution'),
  semester:        z.string().min(1, 'Select your semester / year'),
  skill_level:     z.string().min(1, 'Select your current skill level'),
  reason:          z.string().min(50, 'Please write at least 50 characters'),
  committed:       z.literal(true, {
    message: 'Full commitment is required to secure your seat.',
  }),
  referral_source: z.string().min(1, 'Let us know how you heard about us'),
})

type FormValues = z.infer<typeof schema>

const SELECT_CLASS =
  'w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-colors duration-200'

export default function WorkshopRegistrationForm() {
  const [submitted,    setSubmitted]    = useState(false)
  const [receiptFile,  setReceiptFile]  = useState<File | null>(null)
  const [receiptError, setReceiptError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setReceiptError('')
    if (!file) { setReceiptFile(null); return }
    const allowed = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowed.includes(file.type)) {
      setReceiptError('Only JPG, PNG, or PDF files are allowed.')
      setReceiptFile(null)
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setReceiptError('File must be under 5 MB.')
      setReceiptFile(null)
      return
    }
    setReceiptFile(file)
  }

  async function onSubmit(values: FormValues) {
    if (!receiptFile) {
      setReceiptError('Please upload your payment receipt.')
      return
    }

    const fd = new FormData()
    Object.entries(values).forEach(([k, v]) => fd.append(k, String(v)))
    fd.append('payment_receipt', receiptFile)
    fd.append('workshop_id', 'n8n-launchpad-may-2025')

    const res = await fetch('/api/workshop-register', { method: 'POST', body: fd })
    if (res.ok) {
      setSubmitted(true)
    } else {
      const data = await res.json().catch(() => ({ error: 'Unknown error' }))
      toast.error(data.error ?? 'Submission failed. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-400/20 bg-green-400/5 p-8">
        <div className="text-center mb-5">
          <div className="text-5xl mb-3">✅</div>
          <h3 className="text-xl font-display font-bold text-brand-light mb-2">
            Registration submitted!
          </h3>
        </div>
        <div className="text-sm text-gray-300 leading-relaxed space-y-3">
          <p>
            Your registration has been submitted! Our team will verify your payment within 24 hours.
            Once confirmed, you&apos;ll receive your workshop details via email.
          </p>
          <p>
            In the meantime, you can{' '}
            <a
              href="https://chat.whatsapp.com/GMVf74K1owlKnTEvd9JIGK"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-accent hover:underline font-semibold"
            >
              join our WhatsApp group here
            </a>
            {' '}— you&apos;ll be added once verified.
          </p>
          <p>
            Questions? Email us at{' '}
            <a
              href="mailto:skillit.co@gmail.com"
              className="text-brand-accent hover:underline"
            >
              skillit.co@gmail.com
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

      {/* 1. Full Name */}
      <Input
        label="Full Name"
        placeholder="Your full name"
        error={errors.full_name?.message}
        {...register('full_name')}
      />

      {/* 2. Email Address */}
      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        helperText="Used to send confirmation and workshop details."
        error={errors.email?.message}
        {...register('email')}
      />

      {/* 3. Phone Number */}
      <Input
        label="Phone Number"
        type="tel"
        placeholder="+92 300 0000000"
        helperText="Used for WhatsApp communication and reminders."
        error={errors.phone?.message}
        {...register('phone')}
      />

      {/* 4. University / Institution */}
      <Input
        label="University / Institution"
        placeholder="Write 'Working Professional' if not a student"
        error={errors.university?.message}
        {...register('university')}
      />

      {/* 5. Semester / Year */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">
          Current Semester / Year of Study
          <span className="text-red-400 ml-1">*</span>
        </label>
        <select
          className={`${SELECT_CLASS} ${errors.semester ? 'border-red-500' : ''}`}
          {...register('semester')}
        >
          <option value="">Select…</option>
          {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.semester && (
          <p className="text-sm text-red-400">{errors.semester.message}</p>
        )}
      </div>

      {/* 6. Skill Level */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">
          Current Skill Level with the Workshop Topic
          <span className="text-red-400 ml-1">*</span>
        </label>
        <select
          className={`${SELECT_CLASS} ${errors.skill_level ? 'border-red-500' : ''}`}
          {...register('skill_level')}
        >
          <option value="">Select…</option>
          {SKILL_LEVELS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.skill_level && (
          <p className="text-sm text-red-400">{errors.skill_level.message}</p>
        )}
      </div>

      {/* 7. Reason */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">
          Why do you want to attend this workshop?
          <span className="text-red-400 ml-1">*</span>
        </label>
        <textarea
          rows={4}
          placeholder="Tell us your goals and what you hope to get out of this workshop…"
          className={`${SELECT_CLASS} resize-none ${errors.reason ? 'border-red-500' : ''}`}
          {...register('reason')}
        />
        <p className="text-xs text-brand-muted">
          This helps us understand your goals. Minimum 50 characters.
        </p>
        {errors.reason && (
          <p className="text-sm text-red-400">{errors.reason.message}</p>
        )}
      </div>

      {/* 8. Commitment Checkbox */}
      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-brand-muted/30 bg-brand-dark accent-brand-accent"
            {...register('committed')}
          />
          <span className="text-sm font-medium text-brand-light leading-relaxed">
            Yes, I confirm I will attend every session and complete assigned work.
            <span className="text-red-400 ml-1">*</span>
          </span>
        </label>
        {errors.committed && (
          <p className="text-sm text-red-400 ml-7">{errors.committed.message}</p>
        )}
      </div>

      {/* 9. Referral Source */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">
          How did you hear about this workshop?
          <span className="text-red-400 ml-1">*</span>
        </label>
        <select
          className={`${SELECT_CLASS} ${errors.referral_source ? 'border-red-500' : ''}`}
          {...register('referral_source')}
        >
          <option value="">Select…</option>
          {REFERRAL_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.referral_source && (
          <p className="text-sm text-red-400">{errors.referral_source.message}</p>
        )}
      </div>

      {/* 10. Payment Receipt Upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-brand-light">
          Payment Receipt
          <span className="text-red-400 ml-1">*</span>
        </label>
        <p className="text-xs text-brand-muted">
          Upload screenshot or PDF of your payment receipt. Your seat is only confirmed after
          payment is verified by our team.
        </p>
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload payment receipt"
          className={`relative rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
            receiptFile
              ? 'border-green-400/40 bg-green-400/5'
              : receiptError
              ? 'border-red-500/40 bg-red-500/5'
              : 'border-brand-muted/30 bg-brand-dark/50 hover:border-brand-accent/50 hover:bg-brand-accent/5'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          {receiptFile ? (
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-3xl">📎</span>
              <p className="text-sm font-semibold text-green-400">{receiptFile.name}</p>
              <p className="text-xs text-brand-muted">
                {(receiptFile.size / 1024 / 1024).toFixed(2)} MB · click to replace
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-3xl text-brand-muted">📄</span>
              <p className="text-sm font-medium text-brand-muted">
                Click to upload JPG, PNG, or PDF
              </p>
              <p className="text-xs text-brand-muted/60">Max 5 MB</p>
            </div>
          )}
        </div>
        {receiptError && (
          <p className="text-sm text-red-400">{receiptError}</p>
        )}
      </div>

      {/* Seat Notice */}
      <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-4 py-3">
        <p className="text-xs text-yellow-300 leading-relaxed">
          <span className="font-semibold">Important:</span> Seats are limited. Submission does not
          guarantee your seat — your place is confirmed only after payment verification by the
          skillSYNC team, typically within 24 hours.
        </p>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isSubmitting}
        className="w-full"
      >
        Submit Registration
      </Button>
    </form>
  )
}
