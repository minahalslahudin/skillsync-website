'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useState, useRef, KeyboardEvent } from 'react'
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
  userId:   string
  initial: {
    full_name:   string
    bio:         string | null
    linkedin:    string | null
    github:      string | null
    portfolio:   string | null
    department:  string | null
    skills:      string[]
    avatar_url:  string | null
  }
}

export default function ProfileForm({ userId, initial }: ProfileFormProps) {
  const { refetchProfile } = useUserContext()
  const [skills, setSkills]         = useState<string[]>(initial.skills ?? [])
  const [skillInput, setSkillInput] = useState('')
  const [avatarUrl, setAvatarUrl]   = useState<string | null>(initial.avatar_url)
  const [uploading, setUploading]   = useState(false)
  const fileInputRef                = useRef<HTMLInputElement>(null)
  const skillInputRef               = useRef<HTMLInputElement>(null)

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

  // --- Skills tag input ---
  function addSkill(raw: string) {
    const tag = raw.trim()
    if (!tag || skills.includes(tag)) { setSkillInput(''); return }
    setSkills((prev) => [...prev, tag])
    setSkillInput('')
  }

  function removeSkill(tag: string) {
    setSkills((prev) => prev.filter((s) => s !== tag))
  }

  function onSkillKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(skillInput)
    }
    if (e.key === 'Backspace' && skillInput === '' && skills.length > 0) {
      setSkills((prev) => prev.slice(0, -1))
    }
  }

  // --- Avatar upload ---
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `avatars/${userId}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      // Update avatar_url in DB immediately
      await supabase.from('users').update({ avatar_url: publicUrl }).eq('id', userId)
      setAvatarUrl(publicUrl)
      await refetchProfile()
      toast.success('Avatar updated!')
    } catch {
      toast.error('Failed to upload avatar.')
    } finally {
      setUploading(false)
    }
  }

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
        skills,
      })
      .eq('id', userId)

    if (error) {
      toast.error('Failed to save changes.')
      return
    }

    await refetchProfile()
    toast.success('Profile updated!')
  }

  const initials = initial.full_name
    .split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Avatar upload */}
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={initial.full_name}
              className="h-20 w-20 rounded-full object-cover ring-2 ring-brand-accent/30"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center">
              <span className="text-2xl font-display font-bold text-brand-accent">{initials}</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 rounded-full bg-brand-darker/60 flex items-center justify-center">
              <div className="h-5 w-5 rounded-full border-2 border-brand-accent border-t-transparent animate-spin" />
            </div>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-sm px-3 py-1.5 rounded-lg border border-brand-muted/30 text-brand-muted hover:text-brand-light hover:border-brand-accent/40 transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : 'Change avatar'}
          </button>
          <p className="text-xs text-brand-muted mt-1">JPG or PNG, max 2 MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      <Input label="Full name" error={errors.full_name?.message} {...register('full_name')} />

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

      {/* Skills tag input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">
          Skills
          <span className="text-brand-muted font-normal ml-1">(type and press Enter)</span>
        </label>
        <div
          onClick={() => skillInputRef.current?.focus()}
          className="min-h-[44px] w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2 flex flex-wrap gap-1.5 items-center cursor-text focus-within:ring-2 focus-within:ring-brand-accent/50 focus-within:border-brand-accent"
        >
          {skills.map((tag) => (
            <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-accent/15 border border-brand-accent/30 text-xs text-brand-accent">
              {tag}
              <button
                type="button"
                onClick={() => removeSkill(tag)}
                className="text-brand-accent/60 hover:text-brand-accent"
              >×</button>
            </span>
          ))}
          <input
            ref={skillInputRef}
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={onSkillKeyDown}
            onBlur={() => { if (skillInput.trim()) addSkill(skillInput) }}
            placeholder={skills.length === 0 ? 'React, Figma, Python…' : ''}
            className="flex-1 min-w-[120px] bg-transparent text-sm text-brand-light placeholder:text-brand-muted/60 outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">Department</label>
        <select {...register('department')} className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent">
          <option value="">No department</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/…" error={errors.linkedin?.message} {...register('linkedin')} />
        <Input label="GitHub URL"   placeholder="https://github.com/…"     error={errors.github?.message}   {...register('github')} />
        <Input label="Portfolio URL" placeholder="https://…"               error={errors.portfolio?.message} {...register('portfolio')} />
      </div>

      <Button type="submit" variant="primary" loading={isSubmitting} disabled={!isDirty && skills.join(',') === initial.skills.join(',')} className="self-start">
        Save changes
      </Button>
    </form>
  )
}
