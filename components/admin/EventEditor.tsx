'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormBuilder from '@/components/forms/FormBuilder'
import type { Event, FormField } from '@/lib/types/app.types'

const schema = z.object({
  title:                 z.string().min(2, 'Title required'),
  slug:                  z.string().min(2, 'Slug required'),
  description:           z.string().min(10, 'Description too short'),
  type:                  z.enum(['workshop', 'event', 'cohort']),
  brand:                 z.string().nullable().optional(),
  date:                  z.string().min(1, 'Date required'),
  registration_deadline: z.string().nullable().optional(),
  seats:                 z.number().nullable().optional(),
  is_paid:               z.boolean().default(false),
  price:                 z.number().min(0).optional(),
  tools_covered:         z.array(z.string()).default([]),
  resources_url:         z.string().nullable().optional(),
  cover_image:           z.string().nullable().optional(),
  content:               z.string().nullable().optional(),
  registration_open:     z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

interface Props {
  event?: Event | null
  onClose: () => void
  onSaved: () => void
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// form_schema can arrive as an array [], an object {fields:[...]}, or null
// depending on how/when the event was created. Normalise to a plain array.
function normalizeFormSchema(schema: unknown): FormField[] {
  if (!schema) return []
  if (Array.isArray(schema)) return schema as FormField[]
  if (typeof schema === 'object' && schema !== null) {
    const obj = schema as { fields?: unknown }
    if (Array.isArray(obj.fields)) return obj.fields as FormField[]
  }
  return []
}

// ISO timestamps from Supabase (e.g. "2026-04-15T05:00:00+00:00") need
// slicing to "YYYY-MM-DD" for <input type="date"> to display correctly.
function toDateInput(value: string | null | undefined): string {
  if (!value) return ''
  return value.slice(0, 10)
}

export default function EventEditor({ event, onClose, onSaved }: Props) {
  const [saving,     setSaving]     = useState(false)
  const [apiError,   setApiError]   = useState<string | null>(null)
  const [formFields, setFormFields] = useState<FormField[]>(
    normalizeFormSchema(event?.form_schema)
  )
  const [toolInput, setToolInput] = useState('')

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      title:                 event?.title                 ?? '',
      slug:                  event?.slug                  ?? '',
      description:           event?.description           ?? '',
      type:                  event?.type                  ?? 'workshop',
      brand:                 event?.brand                 ?? '',
      date:                  toDateInput(event?.date),
      registration_deadline: toDateInput(event?.registration_deadline),
      seats:                 event?.seats                 ?? null,
      is_paid:               event?.is_paid               ?? false,
      price:                 event?.price                 ?? 0,
      tools_covered:         event?.tools_covered         ?? [],
      resources_url:         event?.resources_url         ?? '',
      cover_image:           event?.cover_image           ?? '',
      content:               event?.content               ?? '',
      registration_open:     event?.registration_open     ?? true,
    },
  })

  const titleValue   = watch('title')
  const isPaid       = watch('is_paid')
  const toolsCovered = watch('tools_covered')

  // Auto-generate slug from title when creating
  useEffect(() => {
    if (!event && titleValue) {
      setValue('slug', slugify(titleValue))
    }
  }, [titleValue, event, setValue])

  function addTool() {
    const t = toolInput.trim()
    if (!t) return
    setValue('tools_covered', [...(toolsCovered ?? []), t])
    setToolInput('')
  }

  function removeTool(t: string) {
    setValue('tools_covered', (toolsCovered ?? []).filter((x) => x !== t))
  }

  async function submit(data: FormValues, publish: boolean) {
    setSaving(true)
    setApiError(null)
    try {
      const payload = {
        ...data,
        is_published:          publish,
        registration_open:     data.registration_open,
        form_schema:           formFields.length > 0 ? formFields : null,
        brand:                 data.brand                 || null,
        registration_deadline: data.registration_deadline || null,
        resources_url:         data.resources_url         || null,
        cover_image:           data.cover_image           || null,
        content:               data.content               || null,
        price:                 data.is_paid ? (data.price ?? 0) : 0,
      }

      const res = await fetch('/api/admin/events', {
        method:  event?.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(event?.id ? { id: event.id, ...payload } : payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Failed to save event')
      }
      onSaved()
    } catch (e) {
      setApiError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-brand-surface border border-brand-muted/20 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <div className="p-4 border-b border-brand-muted/20 flex items-center justify-between sticky top-0 bg-brand-surface z-10">
          <h2 className="font-semibold text-zinc-200">{event ? 'Edit Event' : 'New Event'}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200">✕</button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">

            <div className="col-span-2">
              <label className="label-sm">Title</label>
              <input {...register('title')} className="input-field w-full mt-1" placeholder="Event title" />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="label-sm">Slug</label>
              <input {...register('slug')} className="input-field w-full mt-1" placeholder="url-slug" />
              {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <label className="label-sm">Type</label>
              <select {...register('type')} className="input-field w-full mt-1">
                <option value="workshop">Workshop</option>
                <option value="event">Event</option>
                <option value="cohort">Cohort</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="label-sm">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="input-field w-full mt-1 resize-none"
                placeholder="Short event description"
              />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label className="label-sm">Brand</label>
              <input {...register('brand')} className="input-field w-full mt-1" placeholder="skillSYNC / skillIT" />
            </div>

            <div>
              <label className="label-sm">Date</label>
              <input {...register('date')} type="date" className="input-field w-full mt-1" />
              {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>}
            </div>

            <div>
              <label className="label-sm">Registration Deadline</label>
              <input {...register('registration_deadline')} type="date" className="input-field w-full mt-1" />
            </div>

            <div>
              <label className="label-sm">Seats (blank = unlimited)</label>
              <input
                {...register('seats', { setValueAs: (v) => (v === '' || v === null) ? null : Number(v) })}
                type="number"
                min={0}
                className="input-field w-full mt-1"
                placeholder="∞"
              />
            </div>

            <div className="flex items-center gap-6 pt-5">
              <Controller
                control={control}
                name="is_paid"
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="rounded"
                    />
                    Paid Event
                  </label>
                )}
              />
              <Controller
                control={control}
                name="registration_open"
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="rounded"
                    />
                    Registration Open
                  </label>
                )}
              />
            </div>

            {isPaid && (
              <div>
                <label className="label-sm">Price (PKR)</label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  min={0}
                  className="input-field w-full mt-1"
                />
              </div>
            )}

            <div className="col-span-2">
              <label className="label-sm">Tools Covered</label>
              <div className="flex gap-2 mt-1 mb-2">
                <input
                  value={toolInput}
                  onChange={(e) => setToolInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTool() } }}
                  className="input-field flex-1"
                  placeholder="e.g. Figma"
                />
                <button
                  type="button"
                  onClick={addTool}
                  className="px-3 py-1.5 rounded bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-sm hover:bg-brand-accent/20"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(toolsCovered ?? []).map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-brand-accent/10 text-brand-accent border border-brand-accent/20"
                  >
                    {tool}
                    <button type="button" onClick={() => removeTool(tool)} className="opacity-60 hover:opacity-100">✕</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="label-sm">Resources URL</label>
              <input {...register('resources_url')} className="input-field w-full mt-1" placeholder="https://…" />
            </div>

            <div>
              <label className="label-sm">Cover Image URL</label>
              <input {...register('cover_image')} className="input-field w-full mt-1" placeholder="https://…" />
            </div>
          </div>

          <div className="pt-2 border-t border-brand-muted/20">
            <FormBuilder value={formFields} onChange={setFormFields} />
          </div>

          {apiError && <p className="text-red-400 text-sm">{apiError}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={handleSubmit((d) => submit(d, false))}
              className="flex-1 py-2 rounded-lg border border-brand-muted/30 text-zinc-300 text-sm hover:bg-brand-surface/80 disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSubmit((d) => submit(d, true))}
              className="flex-1 py-2 rounded-lg bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
