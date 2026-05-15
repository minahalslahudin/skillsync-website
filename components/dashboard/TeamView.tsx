'use client'

import { useState } from 'react'
import type { DepartmentUser } from '@/lib/supabase/queries/users'
import { formatDate } from '@/lib/utils/formatDate'

interface MemberStats {
  lastActive:     string | null
  reportsMonth:   number
  tasksPending:   number
}

interface TeamViewProps {
  members: DepartmentUser[]
  stats:   Record<string, MemberStats>
}

export default function TeamView({ members, stats }: TeamViewProps) {
  const [selected, setSelected] = useState<DepartmentUser | null>(null)

  if (members.length === 0) {
    return (
      <p className="text-brand-muted text-sm py-12 text-center rounded-xl border border-brand-muted/20">
        No other members in your department yet.
      </p>
    )
  }

  return (
    <div className="flex gap-6">
      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-muted/20">
              <th className="text-left pb-3 pr-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Member</th>
              <th className="text-left pb-3 pr-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Role</th>
              <th className="text-left pb-3 pr-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Last active</th>
              <th className="text-left pb-3 pr-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Reports (mo)</th>
              <th className="text-left pb-3 text-xs font-semibold text-brand-muted uppercase tracking-wider">Pending tasks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-muted/10">
            {members.map((m) => {
              const s = stats[m.id]
              const initials = m.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
              return (
                <tr
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className="cursor-pointer hover:bg-brand-mid/50 transition-colors"
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      {m.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.avatar_url} alt={m.full_name} className="h-7 w-7 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-brand-accent">{initials}</span>
                        </div>
                      )}
                      <span className="font-medium text-brand-light">{m.full_name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-brand-muted">{m.role}</td>
                  <td className="py-3 pr-4 text-brand-muted">
                    {s?.lastActive ? formatDate(s.lastActive) : '—'}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-semibold text-brand-light">{s?.reportsMonth ?? 0}</span>
                  </td>
                  <td className="py-3">
                    <span className={`font-semibold ${(s?.tasksPending ?? 0) > 0 ? 'text-yellow-400' : 'text-brand-muted'}`}>
                      {s?.tasksPending ?? 0}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Side panel */}
      {selected && (
        <div className="w-72 flex-shrink-0 rounded-2xl border border-brand-muted/20 bg-brand-mid p-5 self-start sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-display font-semibold text-brand-light">Member details</h3>
            <button
              onClick={() => setSelected(null)}
              className="text-brand-muted hover:text-brand-light transition-colors text-lg leading-none"
              aria-label="Close panel"
            >×</button>
          </div>

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
              <p className="text-xs text-brand-accent">{selected.role}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-muted">Joined</span>
              <span className="text-brand-light">{formatDate(selected.joined_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Last report</span>
              <span className="text-brand-light">{stats[selected.id]?.lastActive ? formatDate(stats[selected.id].lastActive!) : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Reports this month</span>
              <span className="font-semibold text-brand-light">{stats[selected.id]?.reportsMonth ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Pending tasks</span>
              <span className={`font-semibold ${(stats[selected.id]?.tasksPending ?? 0) > 0 ? 'text-yellow-400' : 'text-brand-light'}`}>
                {stats[selected.id]?.tasksPending ?? 0}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
