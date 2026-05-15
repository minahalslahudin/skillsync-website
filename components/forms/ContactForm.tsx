'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const SUBJECTS = ['General', 'Partnership', 'Client Enquiry', 'Workshop', 'Other'] as const

const schema = z.object({
  name:    z.string().min(2, 'Enter your name'),
  email:   z.string().email('Enter a valid email'),
  subject: z.enum(SUBJECTS, { message: 'Select a subject' }),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type FormValues = z.infer<typeof schema>

export default function ContactForm() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (res.ok) {
      setSent(true)
    } else {
      toast.error('Failed to send message. Please try again.')
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-brand-accent/30 bg-brand-accent/5 p-8 text-center">
        <p className="text-2xl mb-2">✉️</p>
        <h3 className="font-display font-bold text-brand-light mb-1">Message sent!</h3>
        <p className="text-sm text-gray-400">We&apos;ll get back to you within 1–2 business days.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Your name"
          placeholder="Jane Smith"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">Subject</label>
        <select
          {...register('subject')}
          className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent"
        >
          <option value="">Select a subject…</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.subject && <p className="text-xs text-red-400">{errors.subject.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">Message</label>
        <textarea
          {...register('message')}
          rows={5}
          placeholder="Tell us how we can help…"
          className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent resize-none"
        />
        {errors.message && <p className="text-xs text-red-400">{errors.message.message}</p>}
      </div>

      <Button type="submit" variant="primary" loading={isSubmitting} className="self-start">
        Send message
      </Button>
    </form>
  )
}
