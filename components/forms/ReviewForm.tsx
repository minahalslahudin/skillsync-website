'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useBrand } from '@/lib/context/BrandContext'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  reviewer_name:       z.string().min(2, 'Enter your name'),
  reviewer_role:       z.string().optional(),
  workshop_or_service: z.string().optional(),
  body:                z.string().min(50, 'Review must be at least 50 characters'),
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
  const { brand }              = useBrand()
  const [rating, setRating]    = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const fileInputRef            = useRef<HTMLInputElement>(null)

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

    // Optional photo upload to Supabase storage
    let photo_url: string | null = null
    if (photoFile) {
      try {
        const supabase = createClient()
        const ext      = photoFile.name.split('.').pop() ?? 'jpg'
        const fileName = `review-${Date.now()}.${ext}`
        const { data } = await supabase.storage
          .from('review-photos')
          .upload(fileName, photoFile, { upsert: false })
        if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from('review-photos')
            .getPublicUrl(fileName)
          photo_url = publicUrl
        }
      } catch {
        // Non-fatal — continue without photo
      }
    }

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...values,
        rating,
        brand,
        photo_url,
        reviewer_role:       values.reviewer_role       ?? null,
        workshop_or_service: values.workshop_or_service ?? null,
      }),
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
        <h3 className="font-display font-bold text-brand-light mb-1">Thank you!</h3>
        <p className="text-sm text-gray-400">Your review is pending approval and will appear shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-medium text-brand-light mb-2">Your rating <span className="text-red-400">*</span></p>
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
          {...register('reviewer_role')}
        />
      </div>

      <Input
        label="Workshop or service reviewed (optional)"
        placeholder="e.g. Figma for Beginners, Web Dev Cohort…"
        {...register('workshop_or_service')}
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-baseline">
          <label className="text-sm font-medium text-brand-light">Your review <span className="text-red-400">*</span></label>
        </div>
        <textarea
          {...register('body')}
          rows={4}
          placeholder="Share your experience with skillSYNC or skillIT…"
          className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent resize-none"
        />
        {errors.body && <p className="text-xs text-red-400">{errors.body.message}</p>}
      </div>

      {/* Photo upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">Photo (optional)</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm px-3 py-2 rounded-lg border border-brand-muted/30 text-brand-muted hover:text-brand-light hover:border-brand-accent/40 transition-colors"
          >
            {photoFile ? photoFile.name : 'Choose file…'}
          </button>
          {photoFile && (
            <button
              type="button"
              onClick={() => { setPhotoFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
              className="text-xs text-brand-muted hover:text-red-400 transition-colors"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
        />
        <p className="text-xs text-brand-muted">JPG, PNG or WebP. Max 2 MB.</p>
      </div>

      <Button type="submit" variant="primary" loading={isSubmitting} className="self-start">
        Submit review
      </Button>
    </form>
  )
}
