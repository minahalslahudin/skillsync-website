'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { WarningWithDetails } from '@/lib/supabase/queries/warnings'
import { formatDate } from '@/lib/utils/formatDate'
import { cn } from '@/lib/utils/cn'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface Props {
  initialWarnings: WarningWithDetails[]
  summary: { activeTotal: number; atWarning2: number; atWarning3: number }
  showAll: boolean
}

const NUMBER_STYLE: Record<number, string> = {
  1: 'text-yellow-400 bg-yellow-950/30 border-yellow-800/40',
  2: 'text-orange-400 bg-orange-950/30 border-orange-800/40',
  3: 'text-red-400 bg-red-950/30 border-red-800/40',
}

const ROW_HIGHLIGHT: Record<number, string> = {
  1: '',
  2: '',
  3: 'bg-red-950/10 border-l-2 border-red-800/40',
}

export default function WarningsClient({ initialWarnings, summary, showAll }: Props) {
  const router = useRouter()
  const [warnings, setWarnings] = useState<WarningWithDetails[]>(initialWarnings)
  const [resolveTarget, setResolveTarget] = useState<WarningWithDetails | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleResolve() {
    if (!resolveTarget) return
    setLoading(true)
    const res = await fetch('/api/admin/warnings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ warningId: resolveTarget.id }),
    })
    setLoading(false)
    if (!res.ok) { toast.error('Failed to resolve warning.'); return }
    toast.success('Warning resolved.')
    setWarnings((prev) =>
      prev.map((w) =>
        w.id === resolveTarget.id
          ? { ...w, acknowledged_at: new Date().toISOString() }
          : w
      )
    )
    setResolveTarget(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-display font-bold text-brand-light">Warnings</h2>
        <p className="text-gray-400 mt-1">Formal warning log across all volunteers.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-yellow-800/30 bg-yellow-950/20 p-4">
          <p className="text-2xl font-display font-bold text-yellow-400">{summary.activeTotal}</p>
          <p className="text-sm text-brand-muted mt-0.5">People with active warnings</p>
        </div>
        <div className="rounded-xl border border-orange-800/30 bg-orange-950/20 p-4">
          <p className="text-2xl font-display font-bold text-orange-400">{summary.atWarning2}</p>
          <p className="text-sm text-brand-muted mt-0.5">At Warning #2</p>
        </div>
        <div className="rounded-xl border border-red-800/30 bg-red-950/20 p-4">
          <p className="text-2xl font-display font-bold text-red-400">{summary.atWarning3}</p>
          <p className="text-sm text-brand-muted mt-0.5">At Warning #3 (Final)</p>
        </div>
      </div>

      {/* Filter toggle */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/warnings"
          className={cn(
            'px-4 py-1.5 rounded-lg text-sm font-medium border transition-all',
            !showAll
              ? 'bg-red-950/50 text-red-400 border-red-800/40'
              : 'text-brand-muted border-brand-muted/20 hover:text-brand-light'
          )}
        >
          Active Only
        </Link>
        <Link
          href="/admin/warnings?filter=all"
          className={cn(
            'px-4 py-1.5 rounded-lg text-sm font-medium border transition-all',
            showAll
              ? 'bg-red-950/50 text-red-400 border-red-800/40'
              : 'text-brand-muted border-brand-muted/20 hover:text-brand-light'
          )}
          onClick={() => router.refresh()}
        >
          All Warnings
        </Link>
        <span className="ml-auto text-xs text-brand-muted">{warnings.length} warnings</span>
      </div>

      {/* Table */}
      {warnings.length === 0 ? (
        <p className="text-brand-muted text-sm py-12 text-center rounded-xl border border-brand-muted/20">
          No {showAll ? '' : 'active '}warnings found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand-muted/20">
          <table className="w-full text-sm">
            <thead className="bg-brand-mid">
              <tr>
                {['Volunteer', 'Warning', 'Reason', 'Issued By', 'Date', 'Status', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-muted/10">
              {warnings.map((w) => (
                <tr key={w.id} className={cn('transition-colors hover:bg-brand-mid/30', ROW_HIGHLIGHT[w.warning_number])}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {w.user_avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={w.user_avatar_url} alt={w.user_full_name} className="h-7 w-7 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-brand-accent">
                            {w.user_full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-brand-light">{w.user_full_name}</p>
                        <p className="text-xs text-brand-muted">{w.user_role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border',
                      NUMBER_STYLE[w.warning_number] ?? NUMBER_STYLE[3]
                    )}>
                      {w.warning_number}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brand-muted max-w-[200px]">
                    <p className="line-clamp-2">{w.reason}</p>
                  </td>
                  <td className="px-4 py-3 text-brand-muted">{w.issued_by_name}</td>
                  <td className="px-4 py-3 text-brand-muted">{formatDate(w.issued_at)}</td>
                  <td className="px-4 py-3">
                    {w.acknowledged_at ? (
                      <span className="text-xs text-green-400">✓ Resolved</span>
                    ) : (
                      <span className="text-xs text-yellow-400">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {w.warning_number === 3 && !w.acknowledged_at && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setResolveTarget(w)}
                        className="text-xs"
                      >
                        Resolve
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Resolve confirmation modal */}
      <Modal open={!!resolveTarget} onClose={() => setResolveTarget(null)} title="Resolve Warning">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-brand-muted">
            Mark the Warning #3 issued to{' '}
            <span className="text-brand-light font-medium">{resolveTarget?.user_full_name}</span>{' '}
            as resolved. This acknowledges the issue has been addressed.
          </p>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" loading={loading} onClick={handleResolve}>
              Confirm Resolution
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setResolveTarget(null)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
