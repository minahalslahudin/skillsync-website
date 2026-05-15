'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { useUserContext } from '@/lib/context/UserContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { DEPARTMENTS } from '@/lib/constants/departments'

const schema = z.object({
  full_name:  z.string().min(2, 'Name is required'),
  bio:        z.string().max(300, 'Max 300 characters').optional(),
  linkedin:   z.string().url('Enter a valid URL').optional().or(z.literal('')),
  github:     z.string().url('Enter a valid URL').optional().or(z.literal('')),
  portfolio:  z.string().url('Enter a valid URL').optional().or(z.literal('')),
  department: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface ProfileFormProps {
  userId: string
  initial: {
    full_name:  string
    bio:        string | null
    linkedin:   string | null
    github:     string | null
    portfolio:  string | null
    department: string | null
  }
}

export default function ProfileForm({ userId, initial }: ProfileFormProps) {
  const { refetchProfile } = useUserContext()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name:  initial.full_name,
      bio:        initial.bio ?? '',
      linkedin:   initial.linkedin ?? '',
      github:     initial.github ?? '',
      portfolio:  initial.portfolio ?? '',
      department: initial.department ?? '',
    },
  })

  async function onSubmit(values: FormValues) {
    const supabase = createClient()
    const { error } = await supabase
      .from('users')
      .update({
        full_name:  values.full_name,
        bio:        values.bio || null,
        linkedin:   values.linkedin || null,
        github:     values.github || null,
        portfolio:  values.portfolio || null,
        department: values.department || null,
      })
      .eq('id', userId)

    if (error) {
      toast.error('Failed to save changes.')
      return
    }

    await refetchProfile()
    toast.success('Profile updated!')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        label="Full name"
        error={errors.full_name?.message}
        {...register('full_name')}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">
          Bio <span className="text-brand-muted font-normal">(max 300 chars)</span>
        </label>
        <textarea
          {...register('bio')}
          rows={3}
          placeholder="A short bio about yourself…"
          className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent resize-none"
        />
        {errors.bio && <p className="text-xs text-red-400">{errors.bio.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">Department</label>
        <select
          {...register('department')}
          className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent"
        >
          <option value="">No department</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="LinkedIn URL"
          placeholder="https://linkedin.com/in/…"
          error={errors.linkedin?.message}
          {...register('linkedin')}
        />
        <Input
          label="GitHub URL"
          placeholder="https://github.com/…"
          error={errors.github?.message}
          {...register('github')}
        />
        <Input
          label="Portfolio URL"
          placeholder="https://…"
          error={errors.portfolio?.message}
          {...register('portfolio')}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={isSubmitting}
        disabled={!isDirty}
        className="self-start"
      >
        Save changes
      </Button>
    </form>
  )
}
