'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { ROLES } from '@/lib/constants/roles'
import { DEPARTMENTS } from '@/lib/constants/departments'

const schema = z.object({
  full_name:             z.string().min(2, 'Enter your full name'),
  email:                 z.string().email('Enter a valid email address'),
  phone:                 z.string().optional(),
  role_applied:          z.string().min(1, 'Select a role'),
  department_preference: z.string().optional(),
  motivation:            z.string().min(50, 'Write at least 50 characters about your motivation'),
  skills:                z.string().min(2, 'Enter at least one skill'),
})

type FormValues = z.infer<typeof schema>

export default function VolunteerApplicationForm() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...values,
        skills: values.skills.split(',').map((s) => s.trim()).filter(Boolean),
      }),
    })
    if (res.ok) {
      setSubmitted(true)
    } else {
      const { error } = await res.json().catch(() => ({ error: 'Unknown error' }))
      toast.error(error ?? 'Something went wrong. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-brand-accent/30 bg-brand-accent/5 p-8 text-center">
        <p className="text-2xl mb-2">🎉</p>
        <h3 className="text-xl font-display font-bold text-brand-light mb-2">Application received!</h3>
        <p className="text-gray-400">We&apos;ll review your application and get back to you within 5–7 business days.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Full name"
          placeholder="Your full name"
          error={errors.full_name?.message}
          {...register('full_name')}
        />
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <Input
        label="Phone number (optional)"
        type="tel"
        placeholder="+27 XX XXX XXXX"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-light">Role applying for</label>
          <select
            {...register('role_applied')}
            className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent"
          >
            <option value="">Select a role…</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {errors.role_applied && (
            <p className="text-xs text-red-400">{errors.role_applied.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-light">Department preference (optional)</label>
          <select
            {...register('department_preference')}
            className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent"
          >
            <option value="">No preference</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">
          Skills <span className="text-brand-muted font-normal">(comma-separated)</span>
        </label>
        <Input
          placeholder="e.g. React, Figma, Python, Communication"
          error={errors.skills?.message}
          {...register('skills')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">Why do you want to join? (min. 50 characters)</label>
        <textarea
          {...register('motivation')}
          rows={5}
          placeholder="Tell us about yourself, your goals, and why you want to be part of skillSYNC / skillIT…"
          className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent resize-none"
        />
        {errors.motivation && (
          <p className="text-xs text-red-400">{errors.motivation.message}</p>
        )}
      </div>

      <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="self-start">
        Submit application
      </Button>
    </form>
  )
}
