'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Project } from '@/lib/types/app.types'

const howItWorksSchema = z.object({ title: z.string().min(1), description: z.string().min(1) })
const featureSchema    = z.object({ title: z.string().min(1), description: z.string().min(1) })
const resultSchema     = z.object({ value: z.string().min(1) })
const techItemSchema   = z.object({ tool: z.string().min(1), role: z.string().min(1) })

const schema = z.object({
  title:             z.string().min(2, 'Title required'),
  tagline:           z.string().nullable().optional(),
  slug:              z.string().min(2, 'Slug required'),
  tool:              z.string().nullable().optional(),
  industry:          z.string().nullable().optional(),
  builder_name:      z.string().nullable().optional(),
  builder_role:      z.string().nullable().optional(),
  problem_statement: z.string().nullable().optional(),
  how_it_works:      z.array(howItWorksSchema).default([]),
  key_features:      z.array(featureSchema).default([]),
  results:           z.array(resultSchema).default([]),
  tech_stack:        z.array(techItemSchema).default([]),
  time_saved:        z.string().nullable().optional(),
  money_saved:       z.string().nullable().optional(),
  is_published:      z.boolean().default(false),
})

type FormValues = z.infer<typeof schema>

interface Props {
  project?: Project | null
  onClose: () => void
  onSaved: () => void
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function ProjectEditor({ project, onClose, onSaved }: Props) {
  const [saving,   setSaving]   = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(schema) as Resolver<FormValues>,
      defaultValues: {
        title:             project?.title             ?? '',
        tagline:           project?.tagline           ?? '',
        slug:              project?.slug              ?? '',
        tool:              project?.tool              ?? '',
        industry:          project?.industry          ?? '',
        builder_name:      project?.builder_name      ?? '',
        builder_role:      project?.builder_role      ?? '',
        problem_statement: project?.problem_statement ?? '',
        how_it_works:      (project?.how_it_works     ?? []) as { title: string; description: string }[],
        key_features:      (project?.key_features     ?? []) as { title: string; description: string }[],
        results:           ((project?.results         ?? []) as string[]).map(v => ({ value: v })),
        tech_stack:        (project?.tech_stack       ?? []) as { tool: string; role: string }[],
        time_saved:        project?.time_saved        ?? '',
        money_saved:       project?.money_saved       ?? '',
        is_published:      project?.is_published      ?? false,
      },
    })

  const titleValue = watch('title')

  useEffect(() => {
    if (!project && titleValue) setValue('slug', slugify(titleValue))
  }, [titleValue, project, setValue])

  const howItWorksArr = useFieldArray({ control, name: 'how_it_works' })
  const keyFeatArr    = useFieldArray({ control, name: 'key_features' })
  const resultsArr    = useFieldArray({ control, name: 'results' })
  const techStackArr  = useFieldArray({ control, name: 'tech_stack' })

  async function submit(data: FormValues) {
    setSaving(true)
    setApiError(null)
    try {
      const payload = {
        ...data,
        tagline:           data.tagline           || null,
        tool:              data.tool              || null,
        industry:          data.industry          || null,
        builder_name:      data.builder_name      || null,
        builder_role:      data.builder_role      || null,
        problem_statement: data.problem_statement || null,
        time_saved:        data.time_saved        || null,
        money_saved:       data.money_saved       || null,
        results:           data.results.map(r => r.value),
      }
      const res = await fetch('/api/admin/projects', {
        method:  project?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(project?.id ? { id: project.id, ...payload } : payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Failed to save project')
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
          <h2 className="font-semibold text-zinc-200">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200">✕</button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="p-4 space-y-6">

          {/* Basic Info */}
          <section className="space-y-3">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Basic Info</p>

            <div>
              <label className="label-sm">Title</label>
              <input {...register('title')} className="input-field w-full mt-1" />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="label-sm">Tagline</label>
              <input {...register('tagline')} className="input-field w-full mt-1" placeholder="One punchy line" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-sm">Slug</label>
                <input {...register('slug')} className="input-field w-full mt-1" />
                {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
              </div>
              <div>
                <label className="label-sm">Tool</label>
                <input {...register('tool')} className="input-field w-full mt-1" placeholder="Make.com, n8n…" />
              </div>
            </div>

            <div>
              <label className="label-sm">Industry</label>
              <input {...register('industry')} className="input-field w-full mt-1" placeholder="e.g. Real Estate" />
            </div>
          </section>

          {/* Builder */}
          <section className="space-y-3">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Builder</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-sm">Builder Name</label>
                <input {...register('builder_name')} className="input-field w-full mt-1" />
              </div>
              <div>
                <label className="label-sm">Builder Role</label>
                <input {...register('builder_role')} className="input-field w-full mt-1" placeholder="e.g. AI Intern" />
              </div>
            </div>
          </section>

          {/* Problem Statement */}
          <section className="space-y-3">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Problem Statement</p>
            <textarea
              {...register('problem_statement')}
              rows={3}
              className="input-field w-full resize-none"
              placeholder="What problem does this solve?"
            />
          </section>

          {/* How It Works */}
          <section className="space-y-3">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">How It Works</p>
            {howItWorksArr.fields.map((field, i) => (
              <div key={field.id} className="rounded-lg border border-brand-muted/20 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Step {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => howItWorksArr.remove(i)}
                    className="text-xs text-red-400/60 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
                <input
                  {...register(`how_it_works.${i}.title`)}
                  className="input-field w-full"
                  placeholder="Step title"
                />
                <textarea
                  {...register(`how_it_works.${i}.description`)}
                  rows={2}
                  className="input-field w-full resize-none"
                  placeholder="Step description"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => howItWorksArr.append({ title: '', description: '' })}
              className="text-xs text-brand-accent border border-brand-accent/20 px-3 py-1.5 rounded hover:bg-brand-accent/5"
            >
              + Add Step
            </button>
          </section>

          {/* Key Features */}
          <section className="space-y-3">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Key Features</p>
            {keyFeatArr.fields.map((field, i) => (
              <div key={field.id} className="rounded-lg border border-brand-muted/20 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Feature {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => keyFeatArr.remove(i)}
                    className="text-xs text-red-400/60 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
                <input
                  {...register(`key_features.${i}.title`)}
                  className="input-field w-full"
                  placeholder="Feature name"
                />
                <textarea
                  {...register(`key_features.${i}.description`)}
                  rows={2}
                  className="input-field w-full resize-none"
                  placeholder="Feature description"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => keyFeatArr.append({ title: '', description: '' })}
              className="text-xs text-brand-accent border border-brand-accent/20 px-3 py-1.5 rounded hover:bg-brand-accent/5"
            >
              + Add Feature
            </button>
          </section>

          {/* Results */}
          <section className="space-y-3">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Results</p>
            {resultsArr.fields.map((field, i) => (
              <div key={field.id} className="flex gap-2 items-center">
                <input
                  {...register(`results.${i}.value`)}
                  className="input-field flex-1"
                  placeholder="e.g. Saved 3 hours daily"
                />
                <button
                  type="button"
                  onClick={() => resultsArr.remove(i)}
                  className="text-zinc-500 hover:text-red-400 px-2 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => resultsArr.append({ value: '' })}
              className="text-xs text-brand-accent border border-brand-accent/20 px-3 py-1.5 rounded hover:bg-brand-accent/5"
            >
              + Add Result
            </button>
          </section>

          {/* Tech Stack */}
          <section className="space-y-3">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tech Stack</p>
            {techStackArr.fields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-2 gap-2 items-center">
                <input
                  {...register(`tech_stack.${i}.tool`)}
                  className="input-field w-full"
                  placeholder="Tool name"
                />
                <div className="flex gap-2">
                  <input
                    {...register(`tech_stack.${i}.role`)}
                    className="input-field flex-1"
                    placeholder="Role / purpose"
                  />
                  <button
                    type="button"
                    onClick={() => techStackArr.remove(i)}
                    className="text-zinc-500 hover:text-red-400 px-2 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => techStackArr.append({ tool: '', role: '' })}
              className="text-xs text-brand-accent border border-brand-accent/20 px-3 py-1.5 rounded hover:bg-brand-accent/5"
            >
              + Add Tool
            </button>
          </section>

          {/* Impact */}
          <section className="space-y-3">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Impact</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-sm">Time Saved</label>
                <input
                  {...register('time_saved')}
                  className="input-field w-full mt-1"
                  placeholder="3–4 hours per day"
                />
              </div>
              <div>
                <label className="label-sm">Money Saved</label>
                <input
                  {...register('money_saved')}
                  className="input-field w-full mt-1"
                  placeholder="PKR 30,000–60,000/client"
                />
              </div>
            </div>
          </section>

          {/* Publish */}
          <section>
            <Controller
              control={control}
              name="is_published"
              render={({ field }) => (
                <label className="flex items-center gap-3 text-sm text-zinc-400 cursor-pointer select-none">
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={`relative inline-flex w-10 h-5 rounded-full transition-colors focus:outline-none ${field.value ? 'bg-brand-accent' : 'bg-zinc-700'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${field.value ? 'translate-x-5' : ''}`} />
                  </button>
                  Published
                </label>
              )}
            />
          </section>

          {apiError && <p className="text-red-400 text-sm">{apiError}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-brand-muted/30 text-zinc-300 text-sm hover:bg-brand-surface/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 rounded-lg bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
