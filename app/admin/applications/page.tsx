'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Application } from '@/lib/types/app.types'
import ApplicationCard from '@/components/admin/ApplicationCard'

const TABS: { label: string; status: Application['status'] | 'all' }[] = [
  { label: 'New',      status: 'pending' },
  { label: 'Approved', status: 'approved' },
  { label: 'Rejected', status: 'rejected' },
  { label: 'All',      status: 'all' },
]

export default function AdminApplicationsPage() {
  const [tab, setTab]               = useState<Application['status'] | 'all'>('pending')
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading]       = useState(true)
  const [loadError, setLoadError]   = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const supabase = createClient()
      let query = supabase.from('applications').select('*').order('applied_at', { ascending: false })
      if (tab !== 'all') query = query.eq('status', tab)
      const { data, error } = await query
      if (error) throw new Error(error.message)
      setApplications((data as Application[]) ?? [])
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [tab])

  useEffect(() => { load() }, [load])

  function handleStatusChange(id: string, status: Application['status']) {
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a))
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-display font-bold text-brand-light">Applications</h2>
        <p className="text-gray-400 mt-1">Review and process volunteer applications.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-brand-mid border border-brand-muted/20 w-fit">
        {TABS.map(({ label, status }) => (
          <button
            key={status}
            onClick={() => setTab(status)}
            className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 ${
              tab === status
                ? 'bg-red-800/50 text-red-300 shadow border border-red-800/40'
                : 'text-brand-muted hover:text-brand-light'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-brand-muted text-sm">Loading…</p>
      ) : loadError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-red-400 mb-1">Failed to load applications</p>
          <p className="text-xs text-red-400/70 font-mono break-all">{loadError}</p>
          <button onClick={load} className="mt-4 text-xs text-zinc-400 hover:text-zinc-200 underline">Try again</button>
        </div>
      ) : applications.length === 0 ? (
        <p className="text-brand-muted text-sm py-12 text-center rounded-xl border border-brand-muted/20">
          No {tab === 'all' ? '' : tab} applications.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
