'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ReportWithUser } from '@/lib/supabase/queries/reports'
import type { ReportEntry } from '@/lib/types/app.types'

const STATUS_BADGE: Record<string, string> = {
  pending:  'text-amber-400 bg-amber-500/10 border-amber-500/20',
  approved: 'text-green-400 bg-green-500/10 border-green-500/20',
  rejected: 'text-red-400 bg-red-500/10 border-red-500/20',
}

export default function AdminReportsPage() {
  const [reports,      setReports]      = useState<ReportWithUser[]>([])
  const [volunteers,   setVolunteers]   = useState<{ id: string; full_name: string }[]>([])
  const [loading,      setLoading]      = useState(true)
  const [loadError,    setLoadError]    = useState<string | null>(null)
  const [filterWeek,   setFilterWeek]   = useState('')
  const [filterUser,   setFilterUser]   = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [viewing,      setViewing]      = useState<ReportWithUser | null>(null)
  const [comment,      setComment]      = useState('')
  const [reviewing,    setReviewing]    = useState(false)
  const [rate,         setRate]         = useState({ submitted: 0, total: 0 })

  useEffect(() => {
    const supabase = createClient()
    supabase.from('users').select('id, full_name').eq('status', 'active').order('full_name').then(({ data }) => {
      setVolunteers((data ?? []) as { id: string; full_name: string }[])
    })

    // Submission rate for current week
    const today = new Date()
    const daysToSunday = today.getDay() === 0 ? 0 : 7 - today.getDay()
    const sunday = new Date(today)
    sunday.setDate(today.getDate() + daysToSunday)
    const weekEnding = sunday.toISOString().split('T')[0]

    Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('reports').select('id', { count: 'exact', head: true }).eq('week_ending', weekEnding),
    ]).then(([{ count: total }, { count: submitted }]) => {
      setRate({ total: total ?? 0, submitted: submitted ?? 0 })
    })
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let q: any = supabase.from('reports').select('*').order('week_ending', { ascending: false }).order('submitted_at', { ascending: false })
      if (filterWeek)   q = q.eq('week_ending', filterWeek)
      if (filterUser)   q = q.eq('user_id', filterUser)
      if (filterStatus) q = q.eq('status', filterStatus)

      const { data, error } = await q
      if (error) throw new Error(error.message)
      const rows = (data ?? []) as Array<Record<string, unknown> & { user_id: string }>
      if (rows.length === 0) { setReports([]); return }

      const userIds = Array.from(new Set(rows.map((r) => r.user_id)))
      const { data: usersData } = await supabase
        .from('users')
        .select('id, full_name, avatar_url')
        .in('id', userIds)

      const userMap: Record<string, { full_name: string; avatar_url: string | null }> = {}
      for (const u of (usersData ?? []) as Array<{ id: string; full_name: string; avatar_url: string | null }>) {
        userMap[u.id] = u
      }

      setReports(rows.map((r) => ({
        ...(r as unknown as ReportWithUser),
        user_full_name:  userMap[r.user_id]?.full_name  ?? 'Unknown',
        user_avatar_url: userMap[r.user_id]?.avatar_url ?? null,
      })))
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [filterWeek, filterUser, filterStatus])

  useEffect(() => { load() }, [load])

  function openReview(r: ReportWithUser) {
    setViewing(r)
    setComment(r.admin_comment ?? '')
  }

  async function submitReview(status: 'approved' | 'rejected') {
    if (!viewing) return
    setReviewing(true)
    await fetch('/api/admin/reports', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id: viewing.id, status, adminComment: comment || null }),
    })
    setReviewing(false)
    setViewing(null)
    load()
  }

  const submissionPct = rate.total > 0 ? Math.round((rate.submitted / rate.total) * 100) : 0

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Reports</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{reports.length} results</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 mb-0.5">This week&apos;s submissions</p>
          <p className="text-2xl font-bold text-zinc-100">{submissionPct}%</p>
          <p className="text-xs text-zinc-500">{rate.submitted} / {rate.total} active volunteers</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="date"
          value={filterWeek}
          onChange={(e) => setFilterWeek(e.target.value)}
          className="input-field text-sm"
        />
        <select
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="input-field text-sm"
        >
          <option value="">All volunteers</option>
          {volunteers.map((v) => (
            <option key={v.id} value={v.id}>{v.full_name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field text-sm"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Revision needed</option>
        </select>
        {(filterWeek || filterUser || filterStatus) && (
          <button
            onClick={() => { setFilterWeek(''); setFilterUser(''); setFilterStatus('') }}
            className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1"
          >
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-zinc-500 text-sm text-center py-16">Loading…</div>
      ) : loadError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-red-400 mb-1">Failed to load reports</p>
          <p className="text-xs text-red-400/70 font-mono break-all">{loadError}</p>
          <button onClick={load} className="mt-4 text-xs text-zinc-400 hover:text-zinc-200 underline">Try again</button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand-muted/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-muted/20 bg-brand-surface/50 text-zinc-500 text-left text-xs">
                <th className="px-4 py-3 font-medium">Volunteer</th>
                <th className="px-4 py-3 font-medium">Week Ending</th>
                <th className="px-4 py-3 font-medium">Hours</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-muted/10">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-brand-surface/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-200">{r.user_full_name}</td>
                  <td className="px-4 py-3 text-zinc-400">{r.week_ending}</td>
                  <td className="px-4 py-3 text-zinc-400">{r.total_hours}h</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded border ${STATUS_BADGE[r.status] ?? ''}`}>
                      {r.status === 'rejected' ? 'Revision' : r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openReview(r)}
                      className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded border border-brand-muted/20 hover:border-brand-muted/40 transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reports.length === 0 && (
            <p className="text-zinc-500 text-sm text-center py-16">No reports match the current filters</p>
          )}
        </div>
      )}

      {viewing && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-brand-surface border border-brand-muted/20 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-brand-muted/20 flex items-center justify-between sticky top-0 bg-brand-surface z-10">
              <div>
                <h2 className="font-semibold text-zinc-200">Report Review</h2>
                <p className="text-xs text-zinc-500 mt-0.5">{viewing.user_full_name} · {viewing.week_ending}</p>
              </div>
              <button onClick={() => setViewing(null)} className="text-zinc-400 hover:text-zinc-200">✕</button>
            </div>

            <div className="p-4 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-muted/20 text-zinc-500 text-left text-xs">
                      <th className="pb-2 pr-3 font-medium">Day</th>
                      <th className="pb-2 pr-3 font-medium">Task</th>
                      <th className="pb-2 pr-3 font-medium">Hrs</th>
                      <th className="pb-2 font-medium">Deliverable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-muted/10">
                    {(viewing.entries as ReportEntry[]).map((e, i) => (
                      <tr key={i}>
                        <td className="py-2 pr-3 text-zinc-400 whitespace-nowrap">{e.day}</td>
                        <td className="py-2 pr-3 text-zinc-300">{e.task_name}</td>
                        <td className="py-2 pr-3 text-zinc-400">{e.hours}h</td>
                        <td className="py-2 text-zinc-400">{e.deliverable}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-zinc-500">
                Total: <span className="text-zinc-200 font-semibold">{viewing.total_hours}h</span>
              </p>

              {viewing.notes && (
                <div className="p-3 rounded-lg bg-brand-bg/50 border border-brand-muted/20">
                  <p className="text-xs text-zinc-500 mb-1">Volunteer notes</p>
                  <p className="text-sm text-zinc-300">{viewing.notes}</p>
                </div>
              )}

              <div>
                <label className="label-sm">Admin Comment <span className="text-zinc-600">(optional)</span></label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Feedback for the volunteer…"
                  className="input-field w-full resize-none text-sm mt-1"
                />
              </div>

              <div className="flex gap-3">
                <button
                  disabled={reviewing}
                  onClick={() => submitReview('approved')}
                  className="flex-1 py-2.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-sm hover:bg-green-500/20 disabled:opacity-50 transition-colors"
                >
                  Accept
                </button>
                <button
                  disabled={reviewing}
                  onClick={() => submitReview('rejected')}
                  className="flex-1 py-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm hover:bg-amber-500/20 disabled:opacity-50 transition-colors"
                >
                  Request Revision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
