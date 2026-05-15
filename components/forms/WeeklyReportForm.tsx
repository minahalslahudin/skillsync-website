'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { useUserContext } from '@/lib/context/UserContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const entrySchema = z.object({
  date:        z.string().min(1, 'Date required'),
  hours:       z.number().min(0.5, 'Min 0.5h').max(16, 'Max 16h'),
  description: z.string().min(5, 'Describe the work done'),
})

const schema = z.object({
  week_start: z.string().min(1, 'Select week start'),
  week_end:   z.string().min(1, 'Select week end'),
  entries:    z.array(entrySchema).min(1, 'Add at least one entry'),
  notes:      z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface WeeklyReportFormProps {
  onSuccess?: () => void
}

export default function WeeklyReportForm({ onSuccess }: WeeklyReportFormProps) {
  const { user } = useUserContext()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      entries: [{ date: '', hours: 2, description: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'entries' })

  async function onSubmit(data: FormValues) {
    if (!user) { toast.error('Not authenticated.'); return }
    const total_hours = data.entries.reduce((sum, e) => sum + Number(e.hours), 0)
    const supabase = createClient()
    const { error } = await supabase.from('reports').insert({
      user_id:    user.id,
      week_start: data.week_start,
      week_end:   data.week_end,
      entries:    data.entries,
      total_hours,
      notes:      data.notes ?? null,
      submitted_at: new Date().toISOString(),
    })
    if (error) {
      toast.error('Failed to submit. Please try again.')
      return
    }
    toast.success('Report submitted!')
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Week start"
          type="date"
          error={errors.week_start?.message}
          {...register('week_start')}
        />
        <Input
          label="Week end"
          type="date"
          error={errors.week_end?.message}
          {...register('week_end')}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-brand-light">Daily entries</p>
          <button
            type="button"
            onClick={() => append({ date: '', hours: 2, description: '' })}
            className="text-xs text-brand-accent hover:underline"
          >
            + Add entry
          </button>
        </div>

        {fields.map((field, i) => (
          <div
            key={field.id}
            className="rounded-xl border border-brand-muted/20 bg-brand-mid/50 p-4 flex flex-col gap-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date"
                type="date"
                error={(errors.entries?.[i]?.date as { message?: string } | undefined)?.message}
                {...register(`entries.${i}.date`)}
              />
              <Input
                label="Hours"
                type="number"
                step="0.5"
                min="0.5"
                max="16"
                error={(errors.entries?.[i]?.hours as { message?: string } | undefined)?.message}
                {...register(`entries.${i}.hours`, { valueAsNumber: true })}
              />
            </div>
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <Input
                  label="What did you work on?"
                  placeholder="Brief description of work completed"
                  error={(errors.entries?.[i]?.description as { message?: string } | undefined)?.message}
                  {...register(`entries.${i}.description`)}
                />
              </div>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="mt-6 text-brand-muted hover:text-red-400 transition-colors text-xs"
                  aria-label="Remove entry"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}

        {errors.entries?.root && (
          <p className="text-xs text-red-400">{errors.entries.root.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">Additional notes (optional)</label>
        <textarea
          {...register('notes')}
          rows={3}
          placeholder="Blockers, context, anything the team should know…"
          className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent resize-none"
        />
      </div>

      <Button type="submit" variant="primary" loading={isSubmitting} className="self-start">
        Submit report
      </Button>
    </form>
  )
}
