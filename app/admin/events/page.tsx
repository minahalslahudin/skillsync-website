'use client'

import { useState, useEffect, useCallback } from 'react'
import type { EventWithCount } from '@/lib/supabase/queries/events'
import EventEditor from '@/components/admin/EventEditor'

const TYPE_BADGE: Record<string, string> = {
  workshop: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  event:    'bg-purple-500/10 text-purple-400 border-purple-500/20',
  cohort:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

export default function AdminEventsPage() {
  const [events,      setEvents]      = useState<EventWithCount[]>([])
  const [loading,     setLoading]     = useState(true)
  const [loadError,   setLoadError]   = useState<string | null>(null)
  const [editorOpen,  setEditorOpen]  = useState(false)
  const [editing,     setEditing]     = useState<EventWithCount | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const res = await fetch('/api/admin/events')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setEvents(data ?? [])
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function togglePublished(id: string, current: boolean) {
    await fetch('/api/admin/events', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id, action: 'toggle_published', published: !current }),
    })
    load()
  }

  async function deleteEvent(id: string) {
    if (!confirm('Delete this event? This cannot be undone.')) return
    await fetch('/api/admin/events', {
      method:  'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id }),
    })
    load()
  }

  function openCreate() {
    setEditing(null)
    setEditorOpen(true)
  }

  function openEdit(ev: EventWithCount) {
    setEditing(ev)
    setEditorOpen(true)
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Events</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{events.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent/90"
        >
          + New Event
        </button>
      </div>

      {loading ? (
        <div className="text-zinc-500 text-sm text-center py-16">Loading…</div>
      ) : loadError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-red-400 mb-1">Failed to load events</p>
          <p className="text-xs text-red-400/70 font-mono break-all">{loadError}</p>
          <button
            onClick={load}
            className="mt-4 text-xs text-zinc-400 hover:text-zinc-200 underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand-muted/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-muted/20 bg-brand-surface/50 text-zinc-500 text-left text-xs">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Brand</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Seats</th>
                <th className="px-4 py-3 font-medium">Regs</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-muted/10">
              {events.map((ev) => {
                const regCount = Array.isArray(ev.registrations)
                  ? ((ev.registrations[0] as { count: number } | undefined)?.count ?? 0)
                  : 0
                return (
                  <tr key={ev.id} className="hover:bg-brand-surface/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-200">{ev.title}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded border ${TYPE_BADGE[ev.type] ?? ''}`}>
                        {ev.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{ev.brand ?? '—'}</td>
                    <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{ev.date}</td>
                    <td className="px-4 py-3 text-zinc-400">{ev.seats ?? '∞'}</td>
                    <td className="px-4 py-3 text-zinc-400">{regCount}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => togglePublished(ev.id, ev.is_published)}
                        className={`relative inline-flex w-10 h-5 rounded-full transition-colors focus:outline-none ${ev.is_published ? 'bg-brand-accent' : 'bg-zinc-700'}`}
                        aria-label={ev.is_published ? 'Unpublish' : 'Publish'}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${ev.is_published ? 'translate-x-5' : ''}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(ev)}
                          className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded border border-brand-muted/20 hover:border-brand-muted/40 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEvent(ev.id)}
                          className="text-xs text-red-400/60 hover:text-red-400 px-2 py-1 rounded border border-red-900/20 hover:border-red-800/40 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {events.length === 0 && (
            <p className="text-zinc-500 text-sm text-center py-16">No events yet. Create one to get started.</p>
          )}
        </div>
      )}

      {editorOpen && (
        <EventEditor
          event={editing}
          onClose={() => setEditorOpen(false)}
          onSaved={() => { setEditorOpen(false); load() }}
        />
      )}
    </div>
  )
}
