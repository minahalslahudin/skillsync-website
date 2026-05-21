'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { VolunteerRow } from '@/lib/supabase/queries/users'

interface Props {
  open: boolean
  onClose: () => void
  volunteers: Pick<VolunteerRow, 'id' | 'full_name' | 'role' | 'department'>[]
  currentUserId: string
  onSuccess: () => void
}

const schema = z.object({
  title:       z.string().min(3, 'Title required'),
  description: z.string().optional(),
  assigned_to: z.string().uuid('Select a volunteer'),
  due_date:    z.string().optional(),
  priority:    z.enum(['low', 'medium', 'high']),
})

type FormData = z.infer<typeof schema>

export default function WorkAssignModal({ open, onClose, volunteers, currentUserId, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [search, setSearch]   = useState('')

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'medium' },
  })

  const filtered = volunteers.filter((v) =>
    v.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (v.department ?? '').toLowerCase().includes(search.toLowerCase())
  )

  async function onSubmit(data: FormData) {
    setLoading(true)
    const res = await fetch('/api/admin/tasks', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        title:       data.title,
        description: data.description || null,
        assigned_to: data.assigned_to,
        assigned_by: currentUserId,
        priority:    data.priority,
        due_date:    data.due_date || null,
        status:      'not_started',
        file_urls:   [],
      }),
    })
    setLoading(false)
    if (!res.ok) {
      toast.error('Failed to create task.')
      return
    }
    toast.success('Task assigned.')
    reset()
    setSearch('')
    onSuccess()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Assign Work" className="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Task title"
          placeholder="e.g. Design new onboarding flow"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-light">Description (optional)</label>
          <textarea
            rows={3}
            placeholder="Add details, acceptance criteria, links…"
            className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 resize-none"
            {...register('description')}
          />
        </div>

        {/* Searchable volunteer select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-light">Assign to</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search volunteer…"
            className="w-full rounded-t-lg border-x border-t border-brand-muted/30 bg-brand-dark px-3 py-2 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none"
          />
          <div className="max-h-36 overflow-y-auto rounded-b-lg border border-brand-muted/30 bg-brand-dark divide-y divide-brand-muted/10">
            {filtered.map((v) => (
              <label
                key={v.id}
                className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-brand-mid/50 transition-colors"
              >
                <input type="radio" value={v.id} className="accent-brand-accent" {...register('assigned_to')} />
                <div>
                  <p className="text-sm text-brand-light font-medium">{v.full_name}</p>
                  <p className="text-xs text-brand-muted">{v.role}{v.department ? ` · ${v.department}` : ''}</p>
                </div>
              </label>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-brand-muted">No volunteers found.</p>
            )}
          </div>
          {errors.assigned_to && <p className="text-sm text-red-400">{errors.assigned_to.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-light">Due date (optional)</label>
            <input
              type="date"
              className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
              {...register('due_date')}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-light">Priority</label>
            <select
              className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
              {...register('priority')}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-1 border-t border-brand-muted/20">
          <Button type="submit" variant="primary" size="sm" loading={loading}>
            Assign Task
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
