'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const schema = z.object({
  reviewer_name: z.string().min(2, 'Enter your name'),
  reviewer_role: z.string().optional(),
  body:          z.string().min(20, 'Review must be at least 20 characters'),
})

type FormValues = z.infer<typeof schema>

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          className="transition-transform duration-100 hover:scale-110"
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <svg
            className={`h-8 w-8 ${star <= (hovered || value) ? 'text-yellow-400' : 'text-brand-muted/30'} transition-colors`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

export default function ReviewForm() {
  const [rating, setRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    if (rating === 0) {
      toast.error('Please select a star rating.')
      return
    }
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, rating }),
    })
    if (res.ok) {
      setSubmitted(true)
    } else {
      toast.error('Could not submit review. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-brand-accent/30 bg-brand-accent/5 p-6 text-center">
        <p className="text-2xl mb-2">⭐</p>
        <h3 className="font-display font-bold text-brand-light mb-1">Thank you for your review!</h3>
        <p className="text-sm text-gray-400">It will appear after approval.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-medium text-brand-light mb-2">Your rating</p>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Your name"
          placeholder="Jane Smith"
          error={errors.reviewer_name?.message}
          {...register('reviewer_name')}
        />
        <Input
          label="Your role / title (optional)"
          placeholder="e.g. Student, Developer"
          error={errors.reviewer_role?.message}
          {...register('reviewer_role')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">Your review</label>
        <textarea
          {...register('body')}
          rows={4}
          placeholder="Share your experience with skillSYNC or skillIT…"
          className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent resize-none"
        />
        {errors.body && <p className="text-xs text-red-400">{errors.body.message}</p>}
      </div>

      <Button type="submit" variant="primary" loading={isSubmitting} className="self-start">
        Submit review
      </Button>
    </form>
  )
}
