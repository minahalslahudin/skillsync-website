'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import type { Project } from '@/lib/types/app.types'

const schema = z.object({
  title:             z.string().min(2, 'Title required'),
  slug:              z.string().min(2, 'Slug required'),
  description:       z.string().min(10, 'Description too short'),
  short_description: z.string().nullable().optional(),
  brand:             z.string().nullable().optional(),
  category:          z.string().nullable().optional(),
  tech_tags:         z.array(z.string()).default([]),
  is_ongoing:        z.boolean().default(false),
  is_published:      z.boolean().default(false),
  live_url:          z.string().nullable().optional(),
  repo_url:          z.string().nullable().optional(),
  sort_order:        z.number().default(0),
  content:           z.string().nullable().optional(),
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
  const [saving,     setSaving]     = useState(false)
  const [apiError,   setApiError]   = useState<string | null>(null)
  const [tagInput,   setTagInput]   = useState('')
  const [imageUrls,  setImageUrls]  = useState<string[]>(project?.image_urls ?? [])
  const [uploading,  setUploading]  = useState(false)

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      title:             project?.title             ?? '',
      slug:              project?.slug              ?? '',
      description:       project?.description       ?? '',
      short_description: project?.short_description ?? '',
      brand:             project?.brand             ?? '',
      category:          project?.category          ?? '',
      tech_tags:         project?.tech_tags         ?? [],
      is_ongoing:        project?.is_ongoing        ?? false,
      is_published:      project?.is_published      ?? false,
      live_url:          project?.live_url          ?? '',
      repo_url:          project?.repo_url          ?? '',
      sort_order:        project?.sort_order        ?? 0,
      content:           project?.content           ?? '',
    },
  })

  const titleValue = watch('title')
  const techTags   = watch('tech_tags')

  useEffect(() => {
    if (!project && titleValue) setValue('slug', slugify(titleValue))
  }, [titleValue, project, setValue])

  function addTag() {
    const t = tagInput.trim()
    if (!t) return
    setValue('tech_tags', [...(techTags ?? []), t])
    setTagInput('')
  }

  function removeTag(t: string) {
    setValue('tech_tags', (techTags ?? []).filter((x) => x !== t))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    const supabase = createClient()
    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      const path = `projects/${Date.now()}-${file.name.replace(/\s+/g, '_')}`
      const { error } = await supabase.storage.from('public').upload(path, file)
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('public').getPublicUrl(path)
        uploaded.push(publicUrl)
      }
    }
    setImageUrls((prev) => [...prev, ...uploaded])
    setUploading(false)
  }

  async function submit(data: FormValues) {
    setSaving(true)
    setApiError(null)
    try {
      const payload = {
        ...data,
        image_urls:        imageUrls,
        brand:             data.brand             || null,
        category:          data.category          || null,
        short_description: data.short_description || null,
        live_url:          data.live_url          || null,
        repo_url:          data.repo_url          || null,
        content:           data.content           || null,
      }
      const res = await fetch('/api/admin/projects', {
        method:  project?.id ? 'PATCH' : 'POST',
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

        <form onSubmit={handleSubmit(submit)} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">

            <div className="col-span-2">
              <label className="label-sm">Title</label>
              <input {...register('title')} className="input-field w-full mt-1" />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="label-sm">Slug</label>
              <input {...register('slug')} className="input-field w-full mt-1" />
              {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <label className="label-sm">Sort Order</label>
              <input {...register('sort_order', { valueAsNumber: true })} type="number" className="input-field w-full mt-1" />
            </div>

            <div>
              <label className="label-sm">Brand</label>
              <input {...register('brand')} className="input-field w-full mt-1" placeholder="skillSYNC / skillIT" />
            </div>

            <div>
              <label className="label-sm">Category</label>
              <input {...register('category')} className="input-field w-full mt-1" placeholder="e.g. Web App" />
            </div>

            <div className="col-span-2">
              <label className="label-sm">Short Description</label>
              <input {...register('short_description')} className="input-field w-full mt-1" placeholder="One-liner for cards" />
            </div>

            <div className="col-span-2">
              <label className="label-sm">Description</label>
              <textarea {...register('description')} rows={3} className="input-field w-full mt-1 resize-none" />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label className="label-sm">Live URL</label>
              <input {...register('live_url')} className="input-field w-full mt-1" placeholder="https://…" />
            </div>

            <div>
              <label className="label-sm">Repo URL</label>
              <input {...register('repo_url')} className="input-field w-full mt-1" placeholder="https://github.com/…" />
            </div>

            <div className="col-span-2">
              <label className="label-sm">Tech Tags</label>
              <div className="flex gap-2 mt-1 mb-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                  className="input-field flex-1"
                  placeholder="e.g. Next.js"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-1.5 rounded bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-sm hover:bg-brand-accent/20"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(techTags ?? []).map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="opacity-60 hover:opacity-100">✕</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <label className="label-sm">Project Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="mt-1 text-xs text-zinc-400 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-brand-muted/20 file:text-zinc-300 hover:file:bg-brand-muted/30"
              />
              {uploading && <p className="text-xs text-zinc-500 mt-1">Uploading…</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                {imageUrls.map((url) => (
                  <div key={url} className="relative group w-16 h-16 rounded border border-brand-muted/30 overflow-hidden">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrls((p) => p.filter((u) => u !== url))}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 col-span-2">
              <Controller
                control={control}
                name="is_ongoing"
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                    <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} className="rounded" />
                    Ongoing
                  </label>
                )}
              />
              <Controller
                control={control}
                name="is_published"
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                    <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} className="rounded" />
                    Published
                  </label>
                )}
              />
            </div>
          </div>

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
