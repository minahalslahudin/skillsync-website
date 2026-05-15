'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import type { Event } from '@/lib/types/app.types'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface SchemaField {
  id:       string
  label:    string
  type:     'text' | 'email' | 'phone' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'number'
  required?: boolean
  options?:  string[]
}

const baseSchema = z.object({
  attendee_name:  z.string().min(2, 'Enter your name'),
  attendee_email: z.string().email('Enter a valid email'),
})

type BaseValues = z.infer<typeof baseSchema>

interface DynamicEventFormProps {
  event: Event
}

function parseExtraFields(event: Event): SchemaField[] {
  try {
    const schema = event.form_schema as { fields?: SchemaField[] } | null
    return schema?.fields ?? []
  } catch {
    return []
  }
}

const INPUT_CLASS =
  'w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent'

export default function DynamicEventForm({ event }: DynamicEventFormProps) {
  const [submitted, setSubmitted]           = useState(false)
  const [dynamicValues, setDynamicValues]   = useState<Record<string, string | string[]>>({})
  const [dynamicErrors, setDynamicErrors]   = useState<Record<string, string>>({})

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BaseValues>({ resolver: zodResolver(baseSchema) })

  const extraFields = parseExtraFields(event)

  // -- Full / deadline checks (shown before form) --
  const isFull = event.seats !== null && event.seats_taken >= event.seats
  const deadlineDate = event.registration_deadline
    ? new Date(event.registration_deadline)
    : event.date
    ? new Date(event.date)
    : null
  const isPastDeadline = deadlineDate ? deadlineDate < new Date() : false

  if (isFull) {
    return (
      <div className="rounded-xl border border-brand-muted/20 bg-brand-mid/50 p-6 text-center">
        <p className="text-2xl mb-2">🎟️</p>
        <p className="font-semibold text-brand-light">This workshop is full</p>
        <p className="text-sm text-brand-muted mt-1">Join the waitlist by contacting us directly.</p>
      </div>
    )
  }

  if (isPastDeadline) {
    return (
      <div className="rounded-xl border border-brand-muted/20 bg-brand-mid/50 p-6 text-center">
        <p className="text-sm text-brand-muted">Registration is closed for this event.</p>
      </div>
    )
  }

  // -- Dynamic field helpers --
  function setString(id: string, value: string) {
    setDynamicValues((prev) => ({ ...prev, [id]: value }))
    setDynamicErrors((prev) => { const e = { ...prev }; delete e[id]; return e })
  }

  function toggleMulti(id: string, option: string) {
    setDynamicValues((prev) => {
      const current = (prev[id] as string[] | undefined) ?? []
      const next = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option]
      return { ...prev, [id]: next }
    })
    setDynamicErrors((prev) => { const e = { ...prev }; delete e[id]; return e })
  }

  async function onSubmit(base: BaseValues) {
    // Validate required dynamic fields
    const newErrors: Record<string, string> = {}
    for (const field of extraFields) {
      if (!field.required) continue
      const val = dynamicValues[field.id]
      if (!val || (Array.isArray(val) && val.length === 0) || val === '') {
        newErrors[field.id] = `${field.label} is required`
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setDynamicErrors(newErrors)
      return
    }

    // Serialize dynamic values
    const serialized: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(dynamicValues)) {
      serialized[k] = Array.isArray(v) ? v.join(', ') : v
    }

    const form_data: Record<string, unknown> = {
      attendee_name:  base.attendee_name,
      attendee_email: base.attendee_email,
      ...serialized,
    }

    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: event.id, form_data }),
    })

    if (res.ok) {
      // Confetti
      const confetti = (await import('canvas-confetti')).default
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E94560', '#0F6B7A', '#F0F4FF'],
      })
      setSubmitted(true)
    } else {
      const data = await res.json().catch(() => ({ error: 'Unknown error' }))
      toast.error(data.error ?? 'Registration failed. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-brand-accent/30 bg-brand-accent/5 p-6 text-center">
        <p className="text-2xl mb-2">🎟️</p>
        <h3 className="font-display font-bold text-brand-light mb-1">You&apos;re registered!</h3>
        <p className="text-sm text-gray-400">Check your email for confirmation details.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Base fields */}
      <Input
        label="Full name"
        placeholder="Your name"
        error={errors.attendee_name?.message}
        {...register('attendee_name')}
      />
      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        error={errors.attendee_email?.message}
        {...register('attendee_email')}
      />

      {/* Dynamic extra fields */}
      {extraFields.map((field) => (
        <div key={field.id} className="flex flex-col gap-1.5">
          {field.type !== 'checkbox' && (
            <label className="text-sm font-medium text-brand-light">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
          )}

          {field.type === 'textarea' && (
            <textarea
              rows={3}
              value={(dynamicValues[field.id] as string) ?? ''}
              onChange={(e) => setString(field.id, e.target.value)}
              className={`${INPUT_CLASS} resize-none`}
            />
          )}

          {field.type === 'select' && (
            <select
              value={(dynamicValues[field.id] as string) ?? ''}
              onChange={(e) => setString(field.id, e.target.value)}
              className={INPUT_CLASS}
            >
              <option value="">Select…</option>
              {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          )}

          {field.type === 'multiselect' && (
            <div className="flex flex-col gap-2">
              {field.options?.map((opt) => {
                const selected = ((dynamicValues[field.id] as string[]) ?? []).includes(opt)
                return (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleMulti(field.id, opt)}
                      className="h-4 w-4 rounded border-brand-muted/30 bg-brand-dark accent-brand-accent"
                    />
                    <span className="text-sm text-brand-light">{opt}</span>
                  </label>
                )
              })}
            </div>
          )}

          {field.type === 'checkbox' && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(dynamicValues[field.id] as string) === 'true'}
                onChange={(e) => setString(field.id, e.target.checked ? 'true' : '')}
                className="h-4 w-4 rounded border-brand-muted/30 bg-brand-dark accent-brand-accent"
              />
              <span className="text-sm font-medium text-brand-light">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </span>
            </label>
          )}

          {(field.type === 'text' || field.type === 'email' || field.type === 'phone' || field.type === 'number') && (
            <input
              type={field.type === 'phone' ? 'tel' : field.type}
              value={(dynamicValues[field.id] as string) ?? ''}
              onChange={(e) => setString(field.id, e.target.value)}
              className={INPUT_CLASS}
            />
          )}

          {dynamicErrors[field.id] && (
            <p className="text-xs text-red-400">{dynamicErrors[field.id]}</p>
          )}
        </div>
      ))}

      <Button type="submit" variant="primary" loading={isSubmitting} className="self-start">
        Register now
      </Button>
    </form>
  )
}
