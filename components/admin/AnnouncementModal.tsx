'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { DEPARTMENTS } from '@/lib/constants/departments'

const schema = z.object({
  title:             z.string().min(1, 'Title required'),
  body:              z.string().min(1, 'Body required'),
  targetType:        z.enum(['all', 'department', 'individual']),
  target_department: z.string().nullable().optional(),
  target_user_id:    z.string().nullable().optional(),
})

type FormValues = z.infer<typeof schema>

interface VolunteerOption {
  id:        string
  full_name: string
}

interface Props {
  volunteers: VolunteerOption[]
  onClose:    () => void
}

export default function AnnouncementModal({ volunteers, onClose }: Props) {
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { targetType: 'all' },
  })

  const targetType = watch('targetType')

  async function submit(data: FormValues) {
    setSaving(true)
    const payload = {
      title: data.title,
      body:  data.body,
      target: data.targetType === 'all'
        ? 'all'
        : data.targetType === 'department'
        ? (data.target_department ?? 'all')
        : 'individual',
      target_department: data.targetType === 'department' ? (data.target_department ?? null) : null,
      target_user_id:    data.targetType === 'individual' ? (data.target_user_id ?? null) : null,
    }
    const res = await fetch('/api/announcements', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
    setSaving(false)
    if (!res.ok) { toast.error('Failed to send announcement'); return }
    toast.success('Announcement sent')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-brand-surface border border-brand-muted/20 rounded-xl w-full max-w-md">
        <div className="p-4 border-b border-brand-muted/20 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-200">Send Announcement</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200">✕</button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="p-4 space-y-4">
          <div>
            <label className="label-sm">Title</label>
            <input {...register('title')} className="input-field w-full mt-1" placeholder="Announcement title" />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label-sm">Message</label>
            <textarea
              {...register('body')}
              rows={4}
              className="input-field w-full mt-1 resize-none"
              placeholder="Write your message…"
            />
            {errors.body && <p className="text-red-400 text-xs mt-1">{errors.body.message}</p>}
          </div>

          <div>
            <label className="label-sm">Send To</label>
            <select {...register('targetType')} className="input-field w-full mt-1">
              <option value="all">All Members</option>
              <option value="department">Select Department</option>
              <option value="individual">Select Individual</option>
            </select>
          </div>

          {targetType === 'department' && (
            <div>
              <label className="label-sm">Department</label>
              <select {...register('target_department')} className="input-field w-full mt-1">
                <option value="">— Choose —</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}

          {targetType === 'individual' && (
            <div>
              <label className="label-sm">Volunteer</label>
              <select {...register('target_user_id')} className="input-field w-full mt-1">
                <option value="">— Choose —</option>
                {volunteers.map((v) => (
                  <option key={v.id} value={v.id}>{v.full_name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-brand-muted/30 text-zinc-300 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 rounded-lg bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-50"
            >
              {saving ? 'Sending…' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
