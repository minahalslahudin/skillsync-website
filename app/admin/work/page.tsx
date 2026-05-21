'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { Task } from '@/lib/types/app.types'
import type { VolunteerRow } from '@/lib/supabase/queries/users'
import { formatDate } from '@/lib/utils/formatDate'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import WorkAssignModal from '@/components/admin/WorkAssignModal'
import { useUser } from '@/lib/hooks/useUser'

type TaskWithUser = Task & { volunteer_name?: string }

const STATUS_VARIANT: Record<Task['status'], 'neutral' | 'info' | 'success' | 'danger' | 'warning'> = {
  not_started: 'neutral',
  in_progress: 'info',
  submitted:   'warning',
  completed:   'success',
  overdue:     'danger',
}

const PRIORITY_COLOR: Record<string, string> = {
  low:    'text-brand-muted',
  medium: 'text-yellow-400',
  high:   'text-red-400',
}

export default function AdminWorkPage() {
  const { user } = useUser()
  const [tasks, setTasks]               = useState<TaskWithUser[]>([])
  const [volunteers, setVolunteers]     = useState<VolunteerRow[]>([])
  const [loading, setLoading]           = useState(true)
  const [loadError, setLoadError]       = useState<string | null>(null)
  const [showAssign, setShowAssign]     = useState(false)
  const [selected, setSelected]         = useState<TaskWithUser | null>(null)
  const [filterStatus, setFilterStatus] = useState<Task['status'] | 'all'>('all')
  const [filterUser, setFilterUser]     = useState('all')
  const [closing, setClosing]           = useState(false)

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const supabase = createClient()
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
      if (tasksError) throw new Error(tasksError.message)

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, email, avatar_url, role, department, status, warning_count, joined_at, skills')
      if (usersError) throw new Error(usersError.message)

      const nameById: Record<string, string> = {}
      for (const u of (usersData ?? []) as Array<{ id: string; full_name: string }>) {
        nameById[u.id] = u.full_name
      }
      setVolunteers((usersData ?? []) as unknown as VolunteerRow[])
      setTasks(
        ((tasksData ?? []) as Task[]).map((t) => ({
          ...t,
          volunteer_name: nameById[t.assigned_to] ?? 'Unknown',
        }))
      )
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTasks() }, [loadTasks])

  const displayed = tasks.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false
    if (filterUser !== 'all' && t.assigned_to !== filterUser) return false
    return true
  })

  async function handleClose() {
    if (!selected) return
    setClosing(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', selected.id)
    setClosing(false)
    if (error) { toast.error('Failed to close task.'); return }
    toast.success('Task marked complete.')
    setTasks((prev) => prev.map((t) => t.id === selected.id ? { ...t, status: 'completed' } : t))
    setSelected(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-brand-light">Work</h2>
          <p className="text-gray-400 mt-1">Assign and review tasks across the org.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowAssign(true)}>
          Assign Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as Task['status'] | 'all')}
          className="rounded-lg border border-brand-muted/30 bg-brand-mid px-3 py-2 text-sm text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
        >
          <option value="all">All statuses</option>
          <option value="not_started">Not started</option>
          <option value="in_progress">In progress</option>
          <option value="submitted">Submitted</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="rounded-lg border border-brand-muted/30 bg-brand-mid px-3 py-2 text-sm text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
        >
          <option value="all">All volunteers</option>
          {volunteers.map((v) => <option key={v.id} value={v.id}>{v.full_name}</option>)}
        </select>
        <span className="text-xs text-brand-muted ml-auto">{displayed.length} tasks</span>
      </div>

      {/* Tasks table */}
      {loading ? (
        <p className="text-brand-muted text-sm">Loading…</p>
      ) : loadError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-red-400 mb-1">Failed to load tasks</p>
          <p className="text-xs text-red-400/70 font-mono break-all">{loadError}</p>
          <button onClick={loadTasks} className="mt-4 text-xs text-zinc-400 hover:text-zinc-200 underline">Try again</button>
        </div>
      ) : displayed.length === 0 ? (
        <p className="text-brand-muted text-sm py-12 text-center rounded-xl border border-brand-muted/20">No tasks found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand-muted/20">
          <table className="w-full text-sm">
            <thead className="bg-brand-mid">
              <tr>
                {['Task', 'Assigned To', 'Priority', 'Due Date', 'Status', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-muted/10">
              {displayed.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className="cursor-pointer hover:bg-brand-mid/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-brand-light">{t.title}</p>
                    {t.description && <p className="text-xs text-brand-muted mt-0.5 line-clamp-1">{t.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-brand-muted">{t.volunteer_name}</td>
                  <td className={`px-4 py-3 font-medium capitalize ${PRIORITY_COLOR[t.priority]}`}>{t.priority}</td>
                  <td className="px-4 py-3 text-brand-muted">{t.due_date ? formatDate(t.due_date) : '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[t.status]}>
                      {t.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {t.status === 'submitted' && (
                      <span className="text-xs text-yellow-400 font-medium">Review →</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Task detail modal */}
      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title={selected.title} className="max-w-xl">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant={STATUS_VARIANT[selected.status]}>{selected.status.replace('_', ' ')}</Badge>
              <Badge variant={selected.priority === 'high' ? 'danger' : selected.priority === 'medium' ? 'warning' : 'neutral'}>
                {selected.priority} priority
              </Badge>
            </div>

            {selected.description && (
              <p className="text-sm text-gray-400 leading-relaxed">{selected.description}</p>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-brand-muted uppercase tracking-wider mb-0.5">Assigned To</p>
                <p className="text-brand-light">{selected.volunteer_name}</p>
              </div>
              {selected.due_date && (
                <div>
                  <p className="text-xs text-brand-muted uppercase tracking-wider mb-0.5">Due Date</p>
                  <p className={selected.status === 'overdue' ? 'text-red-400' : 'text-brand-light'}>
                    {formatDate(selected.due_date)}
                  </p>
                </div>
              )}
              {selected.completed_at && (
                <div>
                  <p className="text-xs text-brand-muted uppercase tracking-wider mb-0.5">Completed</p>
                  <p className="text-brand-light">{formatDate(selected.completed_at)}</p>
                </div>
              )}
            </div>

            {selected.submission_text && (
              <div className="rounded-lg bg-brand-dark/50 border border-brand-muted/20 px-3 py-2.5">
                <p className="text-xs font-medium text-brand-muted uppercase tracking-wider mb-1">Submission</p>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{selected.submission_text}</p>
              </div>
            )}

            {selected.status === 'submitted' && (
              <div className="pt-2 border-t border-brand-muted/20">
                <Button variant="primary" size="sm" loading={closing} onClick={handleClose}>
                  Review & Close Task
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Assign work modal */}
      {user && (
        <WorkAssignModal
          open={showAssign}
          onClose={() => setShowAssign(false)}
          volunteers={volunteers}
          currentUserId={user.id}
          onSuccess={loadTasks}
        />
      )}
    </div>
  )
}
