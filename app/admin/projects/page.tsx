'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Project } from '@/lib/types/app.types'
import ProjectEditor from '@/components/admin/ProjectEditor'

export default function AdminProjectsPage() {
  const [projects,   setProjects]   = useState<Project[]>([])
  const [loading,    setLoading]    = useState(true)
  const [loadError,  setLoadError]  = useState<string | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing,    setEditing]    = useState<Project | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const res = await fetch('/api/admin/projects')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setProjects(data ?? [])
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function togglePublished(id: string, current: boolean) {
    await fetch('/api/admin/projects', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id, action: 'toggle_published', published: !current }),
    })
    load()
  }

  async function deleteProject(id: string) {
    if (!confirm('Delete this project? This cannot be undone.')) return
    await fetch('/api/admin/projects', {
      method:  'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id }),
    })
    load()
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Projects</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{projects.length} total</p>
        </div>
        <button
          onClick={() => { setEditing(null); setEditorOpen(true) }}
          className="px-4 py-2 rounded-lg bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent/90"
        >
          + New Project
        </button>
      </div>

      {loading ? (
        <div className="text-zinc-500 text-sm text-center py-16">Loading…</div>
      ) : loadError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-red-400 mb-1">Failed to load projects</p>
          <p className="text-xs text-red-400/70 font-mono break-all">{loadError}</p>
          <button onClick={load} className="mt-4 text-xs text-zinc-400 hover:text-zinc-200 underline">Try again</button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand-muted/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-muted/20 bg-brand-surface/50 text-zinc-500 text-left text-xs">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Tool</th>
                <th className="px-4 py-3 font-medium">Industry</th>
                <th className="px-4 py-3 font-medium">Builder</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-muted/10">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-brand-surface/40 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-200">{p.title}</p>
                    {p.tagline && <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-[200px]">{p.tagline}</p>}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{p.tool ?? '—'}</td>
                  <td className="px-4 py-3 text-zinc-400">{p.industry ?? '—'}</td>
                  <td className="px-4 py-3 text-zinc-400">{p.builder_name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublished(p.id, p.is_published)}
                      className={`relative inline-flex w-10 h-5 rounded-full transition-colors focus:outline-none ${p.is_published ? 'bg-brand-accent' : 'bg-zinc-700'}`}
                      aria-label={p.is_published ? 'Unpublish' : 'Publish'}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${p.is_published ? 'translate-x-5' : ''}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditing(p); setEditorOpen(true) }}
                        className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded border border-brand-muted/20 hover:border-brand-muted/40 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProject(p.id)}
                        className="text-xs text-red-400/60 hover:text-red-400 px-2 py-1 rounded border border-red-900/20 hover:border-red-800/40 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && (
            <p className="text-zinc-500 text-sm text-center py-16">No projects yet. Create one to get started.</p>
          )}
        </div>
      )}

      {editorOpen && (
        <ProjectEditor
          project={editing}
          onClose={() => setEditorOpen(false)}
          onSaved={() => { setEditorOpen(false); load() }}
        />
      )}
    </div>
  )
}
