'use client'

import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import type { VolunteerRow } from '@/lib/supabase/queries/users'
import { formatDate } from '@/lib/utils/formatDate'
import { cn } from '@/lib/utils/cn'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import WarningModal from '@/components/admin/WarningModal'
import AnnouncementModal from '@/components/admin/AnnouncementModal'
import type { Warning, Achievement, Report } from '@/lib/types/app.types'
import { ROLES } from '@/lib/constants/roles'

interface Props {
  initialVolunteers: VolunteerRow[]
  currentUserId: string
}

type ModalType = 'promote' | 'status' | 'remove' | null

const ROLE_VARIANT: Record<string, 'neutral' | 'info' | 'success' | 'warning' | 'danger'> = {
  Volunteer: 'neutral',
  Intern:    'info',
  Lead:      'success',
  'C-Suite': 'warning',
  Admin:     'danger',
}

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  active:   'success',
  on_hold:  'warning',
  removed:  'danger',
}

export default function VolunteerTable({ initialVolunteers, currentUserId: _currentUserId }: Props) {
  const [volunteers, setVolunteers] = useState<VolunteerRow[]>(initialVolunteers)
  const [search, setSearch]         = useState('')
  const [sortBy, setSortBy]         = useState<'name' | 'joined' | 'warnings'>('joined')
  const [selected, setSelected]     = useState<VolunteerRow | null>(null)
  const [modal, setModal]           = useState<ModalType>(null)
  const [warnOpen, setWarnOpen]     = useState(false)
  const [dropdownId, setDropdownId] = useState<string | null>(null)
  const [promoteRole, setPromoteRole] = useState('')
  const [promoteNote, setPromoteNote] = useState('')
  const [newStatus, setNewStatus]   = useState<'active' | 'on_hold' | 'removed'>('active')
  const [removeReason, setRemoveReason] = useState('')
  const [loading, setLoading]       = useState(false)
  const [annOpen, setAnnOpen]       = useState(false)

  // Side panel: per-user data
  const [panelWarnings, setPanelWarnings]       = useState<Warning[]>([])
  const [panelReports, setPanelReports]         = useState<Partial<Report>[]>([])
  const [panelAchievements, setPanelAchievements] = useState<Achievement[]>([])
  const [panelLoading, setPanelLoading]         = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownId(null)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  async function loadPanelData(userId: string) {
    setPanelLoading(true)
    const supabase = createClient()
    const [wRes, rRes, aRes] = await Promise.all([
      supabase.from('warnings').select('*').eq('user_id', userId).order('issued_at', { ascending: false }),
      supabase.from('reports').select('id, week_ending, total_hours, status, submitted_at').eq('user_id', userId).order('week_ending', { ascending: false }).limit(5),
      supabase.from('achievements').select('*').eq('user_id', userId).order('earned_at', { ascending: false }),
    ])
    setPanelWarnings((wRes.data ?? []) as Warning[])
    setPanelReports((rRes.data ?? []) as Partial<Report>[])
    setPanelAchievements((aRes.data ?? []) as Achievement[])
    setPanelLoading(false)
  }

  function openPanel(v: VolunteerRow) {
    setSelected(v)
    setDropdownId(null)
    loadPanelData(v.id)
  }

  async function handlePromote() {
    if (!selected || !promoteRole) return
    setLoading(true)
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'promote', userId: selected.id, role: promoteRole, note: promoteNote }),
    })
    setLoading(false)
    if (!res.ok) { toast.error('Failed to promote.'); return }
    toast.success(`${selected.full_name} promoted to ${promoteRole}.`)
    setVolunteers((prev) => prev.map((v) => v.id === selected.id ? { ...v, role: promoteRole } : v))
    setSelected((prev) => prev ? { ...prev, role: promoteRole } : prev)
    setModal(null)
    setPromoteRole('')
    setPromoteNote('')
  }

  async function handleStatusChange() {
    if (!selected) return
    setLoading(true)
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status', userId: selected.id, status: newStatus }),
    })
    setLoading(false)
    if (!res.ok) { toast.error('Failed to update status.'); return }
    toast.success(`Status updated to ${newStatus}.`)
    setVolunteers((prev) => prev.map((v) => v.id === selected.id ? { ...v, status: newStatus } : v))
    setSelected((prev) => prev ? { ...prev, status: newStatus } : prev)
    setModal(null)
  }

  async function handleRemove() {
    if (!selected) return
    setLoading(true)
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status', userId: selected.id, status: 'removed' }),
    })
    setLoading(false)
    if (!res.ok) { toast.error('Failed to remove.'); return }
    toast.success(`${selected.full_name} removed.`)
    setVolunteers((prev) => prev.map((v) => v.id === selected.id ? { ...v, status: 'removed' } : v))
    setSelected((prev) => prev ? { ...prev, status: 'removed' } : prev)
    setModal(null)
    setRemoveReason('')
  }

  const filtered = volunteers
    .filter((v) =>
      v.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (v.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (v.department ?? '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name')     return a.full_name.localeCompare(b.full_name)
      if (sortBy === 'warnings') return b.warning_count - a.warning_count
      return new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime()
    })

  function SortTh({ col, label }: { col: typeof sortBy; label: string }) {
    return (
      <th
        className="text-left pb-3 pr-4 text-xs font-semibold text-brand-muted uppercase tracking-wider cursor-pointer hover:text-brand-light select-none"
        onClick={() => setSortBy(col)}
      >
        {label}{sortBy === col && ' ↓'}
      </th>
    )
  }

  return (
    <div className="flex gap-6">
      {/* Table */}
      <div className="flex-1 min-w-0">
        {/* Search */}
        <div className="mb-4 flex gap-3 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, department…"
            className="flex-1 rounded-lg border border-brand-muted/30 bg-brand-mid px-3 py-2 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
          />
          <span className="text-xs text-brand-muted flex-shrink-0">{filtered.length} members</span>
          <button
            onClick={() => setAnnOpen(true)}
            className="flex-shrink-0 px-3 py-2 rounded-lg border border-brand-muted/30 bg-brand-mid text-sm text-brand-light hover:bg-brand-surface transition-colors"
          >
            📢 Announce
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-muted/20">
                <SortTh col="name" label="Member" />
                <th className="text-left pb-3 pr-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Role</th>
                <th className="text-left pb-3 pr-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Department</th>
                <th className="text-left pb-3 pr-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Status</th>
                <SortTh col="warnings" label="Warnings" />
                <th className="text-left pb-3 pr-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Last Report</th>
                <SortTh col="joined" label="Joined" />
                <th className="pb-3 text-xs font-semibold text-brand-muted uppercase tracking-wider" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-muted/10">
              {filtered.map((v) => {
                const initials = v.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                return (
                  <tr
                    key={v.id}
                    onClick={() => openPanel(v)}
                    className={cn(
                      'cursor-pointer hover:bg-brand-mid/50 transition-colors',
                      selected?.id === v.id && 'bg-brand-mid/30'
                    )}
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        {v.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={v.avatar_url} alt={v.full_name} className="h-7 w-7 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-brand-accent">{initials}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-brand-light leading-tight">{v.full_name}</p>
                          <p className="text-xs text-brand-muted">{v.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={ROLE_VARIANT[v.role] ?? 'neutral'}>{v.role}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-brand-muted text-xs">{v.department ?? '—'}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={STATUS_VARIANT[v.status] ?? 'neutral'}>{v.status?.replace('_', ' ')}</Badge>
                    </td>
                    <td className="py-3 pr-4">
                      {v.warning_count > 0 ? (
                        <span className={cn(
                          'font-semibold text-sm',
                          v.warning_count === 1 ? 'text-yellow-400' : v.warning_count === 2 ? 'text-orange-400' : 'text-red-400'
                        )}>
                          {v.warning_count}
                        </span>
                      ) : (
                        <span className="text-brand-muted">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-brand-muted text-xs">
                      {v.last_report_date ? formatDate(v.last_report_date) : '—'}
                    </td>
                    <td className="py-3 pr-4 text-brand-muted text-xs">{formatDate(v.joined_at)}</td>
                    <td className="py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="relative" ref={dropdownId === v.id ? dropdownRef : undefined}>
                        <button
                          onClick={() => setDropdownId(dropdownId === v.id ? null : v.id)}
                          className="flex items-center justify-center w-7 h-7 rounded-md text-brand-muted hover:text-brand-light hover:bg-brand-mid transition-colors text-lg leading-none"
                        >
                          ···
                        </button>
                        {dropdownId === v.id && (
                          <div className="absolute right-0 top-8 z-20 w-44 rounded-xl border border-brand-muted/30 bg-brand-darker shadow-glow divide-y divide-brand-muted/10">
                            {[
                              { label: 'View Profile',    action: () => openPanel(v) },
                              { label: 'Promote Role',    action: () => { setSelected(v); setModal('promote'); setDropdownId(null) } },
                              { label: 'Issue Warning',   action: () => { setSelected(v); setWarnOpen(true); setDropdownId(null) } },
                              { label: 'Change Status',   action: () => { setSelected(v); setNewStatus(v.status as 'active' | 'on_hold'); setModal('status'); setDropdownId(null) } },
                              { label: 'Remove',          action: () => { setSelected(v); setModal('remove'); setDropdownId(null) }, danger: true },
                            ].map(({ label, action, danger }) => (
                              <button
                                key={label}
                                onClick={action}
                                className={cn(
                                  'w-full text-left px-3 py-2 text-sm transition-colors',
                                  danger ? 'text-red-400 hover:bg-red-950/30' : 'text-brand-light hover:bg-brand-mid/50'
                                )}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-brand-muted text-sm py-10">No volunteers found.</p>
          )}
        </div>
      </div>

      {/* Side panel */}
      {selected && (
        <div className="w-72 flex-shrink-0 rounded-2xl border border-brand-muted/20 bg-brand-mid p-5 self-start sticky top-24 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-display font-semibold text-brand-light">Volunteer Profile</h3>
            <button onClick={() => setSelected(null)} className="text-brand-muted hover:text-brand-light text-lg leading-none">×</button>
          </div>

          {/* Avatar + name */}
          <div className="flex items-center gap-3 mb-4">
            {selected.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selected.avatar_url} alt={selected.full_name} className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center">
                <span className="text-sm font-bold text-brand-accent">
                  {selected.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="font-semibold text-brand-light">{selected.full_name}</p>
              <p className="text-xs text-brand-muted">{selected.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            <Badge variant={ROLE_VARIANT[selected.role] ?? 'neutral'}>{selected.role}</Badge>
            <Badge variant={STATUS_VARIANT[selected.status] ?? 'neutral'}>{selected.status?.replace('_', ' ')}</Badge>
            {selected.warning_count > 0 && (
              <Badge variant={selected.warning_count >= 3 ? 'danger' : selected.warning_count === 2 ? 'warning' : 'neutral'}>
                {selected.warning_count} warning{selected.warning_count !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm mb-5">
            <div className="flex justify-between">
              <span className="text-brand-muted">Department</span>
              <span className="text-brand-light">{selected.department ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Joined</span>
              <span className="text-brand-light">{formatDate(selected.joined_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Last report</span>
              <span className="text-brand-light">{selected.last_report_date ? formatDate(selected.last_report_date) : '—'}</span>
            </div>
          </div>

          {panelLoading ? (
            <p className="text-xs text-brand-muted text-center py-4">Loading…</p>
          ) : (
            <>
              {/* Warnings */}
              {panelWarnings.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Warning History</h4>
                  <div className="flex flex-col gap-1.5">
                    {panelWarnings.map((w) => (
                      <div key={w.id} className={cn(
                        'rounded-lg px-2.5 py-2 text-xs border',
                        w.severity === 'final' ? 'border-red-800/40 bg-red-950/20 text-red-300' :
                        w.severity === 'major' ? 'border-orange-800/40 bg-orange-950/20 text-orange-300' :
                        'border-yellow-800/40 bg-yellow-950/20 text-yellow-300'
                      )}>
                        <p className="font-medium capitalize">{w.severity} warning · {formatDate(w.issued_at)}</p>
                        <p className="text-brand-muted mt-0.5">{w.reason}</p>
                        {w.acknowledged_at && <p className="text-green-400 mt-0.5">✓ Resolved {formatDate(w.acknowledged_at)}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent reports */}
              {panelReports.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Recent Reports</h4>
                  <div className="flex flex-col gap-1">
                    {panelReports.map((r) => (
                      <div key={r.id} className="flex justify-between text-xs">
                        <span className="text-brand-muted">Week of {r.week_ending ? formatDate(r.week_ending) : '—'}</span>
                        <span className={r.status === 'approved' ? 'text-green-400' : r.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}>
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {panelAchievements.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Achievements</h4>
                  <div className="flex flex-col gap-1">
                    {panelAchievements.map((a) => (
                      <div key={a.id} className="text-xs">
                        <p className="text-brand-light font-medium">{a.title}</p>
                        <p className="text-brand-muted">{formatDate(a.earned_at)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {panelWarnings.length === 0 && panelReports.length === 0 && panelAchievements.length === 0 && (
                <p className="text-xs text-brand-muted text-center py-2">No activity yet.</p>
              )}
            </>
          )}
        </div>
      )}

      {/* Promote Role modal */}
      <Modal open={modal === 'promote'} onClose={() => setModal(null)} title="Promote Role">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-brand-muted">
            Promoting <span className="text-brand-light font-medium">{selected?.full_name}</span> from <span className="text-brand-accent">{selected?.role}</span>
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-light">New role</label>
            <select
              value={promoteRole}
              onChange={(e) => setPromoteRole(e.target.value)}
              className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
            >
              <option value="">Select role…</option>
              {ROLES.filter((r) => r !== selected?.role).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-light">Promotion note (optional)</label>
            <textarea
              value={promoteNote}
              onChange={(e) => setPromoteNote(e.target.value)}
              rows={2}
              placeholder="Reason for promotion…"
              className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 resize-none"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" loading={loading} disabled={!promoteRole} onClick={handlePromote}>
              Confirm Promotion
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setModal(null)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Change Status modal */}
      <Modal open={modal === 'status'} onClose={() => setModal(null)} title="Change Status">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-brand-muted">Update status for <span className="text-brand-light font-medium">{selected?.full_name}</span></p>
          <div className="flex flex-col gap-2">
            {(['active', 'on_hold'] as const).map((s) => (
              <label key={s} className="flex items-center gap-3 cursor-pointer rounded-lg border border-brand-muted/20 px-3 py-2.5 hover:border-brand-accent/50 transition-colors">
                <input type="radio" name="status" value={s} checked={newStatus === s} onChange={() => setNewStatus(s)} className="accent-brand-accent" />
                <div>
                  <p className="text-sm font-medium text-brand-light capitalize">{s.replace('_', ' ')}</p>
                  <p className="text-xs text-brand-muted">{s === 'active' ? 'Full access, active member' : 'Temporarily suspended — no dashboard access'}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" loading={loading} onClick={handleStatusChange}>Update</Button>
            <Button variant="secondary" size="sm" onClick={() => setModal(null)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Remove confirmation modal */}
      <Modal open={modal === 'remove'} onClose={() => setModal(null)} title="Remove Volunteer">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-red-800/40 bg-red-950/20 p-3 text-sm text-red-300">
            This will mark <span className="font-semibold">{selected?.full_name}</span> as removed. They will lose dashboard access. This action can be undone by changing their status back to active.
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-light">Reason (optional)</label>
            <textarea
              value={removeReason}
              onChange={(e) => setRemoveReason(e.target.value)}
              rows={2}
              placeholder="Reason for removal…"
              className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="danger" size="sm" loading={loading} onClick={handleRemove}>Confirm Remove</Button>
            <Button variant="secondary" size="sm" onClick={() => setModal(null)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Warning modal */}
      {selected && (
        <WarningModal
          open={warnOpen}
          onClose={() => setWarnOpen(false)}
          volunteer={selected}
          onSuccess={() => {
            setVolunteers((prev) =>
              prev.map((v) => v.id === selected.id ? { ...v, warning_count: v.warning_count + 1 } : v)
            )
            setSelected((prev) => prev ? { ...prev, warning_count: prev.warning_count + 1 } : prev)
            loadPanelData(selected.id)
          }}
        />
      )}

      {annOpen && (
        <AnnouncementModal
          volunteers={volunteers.map((v) => ({ id: v.id, full_name: v.full_name }))}
          onClose={() => setAnnOpen(false)}
        />
      )}
    </div>
  )
}
