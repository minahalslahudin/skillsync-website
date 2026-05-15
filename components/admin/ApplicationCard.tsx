'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import type { Application } from '@/lib/types/app.types'
import { formatDate } from '@/lib/utils/formatDate'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface Props {
  application: Application
  onStatusChange: (id: string, status: Application['status']) => void
}

const STATUS_VARIANT: Record<Application['status'], 'neutral' | 'warning' | 'success' | 'danger' | 'info'> = {
  pending:    'warning',
  approved:   'success',
  rejected:   'danger',
  waitlisted: 'info',
}

export default function ApplicationCard({ application: app, onStatusChange }: Props) {
  const [open, setOpen]       = useState(false)
  const [notes, setNotes]     = useState(app.admin_notes ?? '')
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)

  async function handleAction(action: 'approve' | 'reject') {
    setLoading(action)
    const res = await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: app.id, action, adminNotes: notes }),
    })
    setLoading(null)
    const json = await res.json()
    if (!res.ok) {
      toast.error(json.error ?? `Failed to ${action} application.`)
      return
    }
    toast.success(action === 'approve' ? 'Approved — account created!' : 'Application rejected.')
    onStatusChange(app.id, action === 'approve' ? 'approved' : 'rejected')
    setOpen(false)
  }

  return (
    <>
      <div className="flex items-start gap-4 p-4 rounded-xl border border-brand-muted/20 bg-brand-mid hover:border-brand-muted/40 transition-colors">
        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-brand-accent">
            {app.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="font-semibold text-brand-light">{app.full_name}</p>
              <p className="text-xs text-brand-muted">{app.email}</p>
            </div>
            <Badge variant={STATUS_VARIANT[app.status]} className="flex-shrink-0">
              {app.status}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-brand-muted">
            {app.university && <span>{app.university}{app.semester ? `, Sem ${app.semester}` : ''}</span>}
            {app.department_interest && <span className="text-brand-accent">{app.department_interest}</span>}
            <span>{formatDate(app.applied_at)}</span>
          </div>
          {app.motivation && (
            <p className="mt-1.5 text-xs text-gray-400 line-clamp-2">{app.motivation}</p>
          )}
        </div>

        {/* Action */}
        {app.status === 'pending' && (
          <Button variant="secondary" size="sm" onClick={() => setOpen(true)} className="flex-shrink-0">
            Review
          </Button>
        )}
      </div>

      {/* Full review modal */}
      <Modal open={open} onClose={() => setOpen(false)} title={`Review: ${app.full_name}`} className="max-w-2xl">
        <div className="flex flex-col gap-5 max-h-[70vh] overflow-y-auto pr-1">
          {/* Contact */}
          <section>
            <h4 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Contact</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Field label="Email" value={app.email} />
              <Field label="Phone" value={app.phone} />
              <Field label="City" value={app.city} />
              <Field label="Applied" value={formatDate(app.applied_at)} />
            </div>
          </section>

          {/* Academic */}
          <section>
            <h4 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Academic</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Field label="University" value={app.university} />
              <Field label="Semester" value={app.semester} />
              <Field label="Department interest" value={app.department_interest} />
              <Field label="Referral" value={app.referral_source} />
            </div>
          </section>

          {/* Skills */}
          {app.current_skills.length > 0 && (
            <section>
              <h4 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {app.current_skills.map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-brand-dark border border-brand-muted/30 text-brand-light">{s}</span>
                ))}
              </div>
            </section>
          )}

          {/* Links */}
          {(app.linkedin || app.github || app.portfolio) && (
            <section>
              <h4 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Links</h4>
              <div className="flex flex-col gap-1 text-sm">
                {app.linkedin && <a href={app.linkedin} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline truncate">{app.linkedin}</a>}
                {app.github   && <a href={app.github}   target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline truncate">{app.github}</a>}
                {app.portfolio && <a href={app.portfolio} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline truncate">{app.portfolio}</a>}
              </div>
            </section>
          )}

          {/* Motivation */}
          <section>
            <h4 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Motivation</h4>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{app.motivation ?? '—'}</p>
          </section>

          {/* Commitment */}
          <div className={`text-sm rounded-lg px-3 py-2 border ${app.can_commit ? 'border-green-800/40 bg-green-950/30 text-green-400' : 'border-red-800/40 bg-red-950/30 text-red-400'}`}>
            {app.can_commit ? '✓ Confirmed 20 hrs/week commitment' : '✗ Did not confirm commitment'}
          </div>

          {/* Admin notes */}
          <section>
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider block mb-1.5">
              Admin notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Internal notes about this applicant…"
              className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 resize-none"
            />
          </section>

          {/* Actions */}
          {app.status === 'pending' && (
            <div className="flex gap-2 pt-1 border-t border-brand-muted/20 sticky bottom-0 bg-brand-mid py-3">
              <Button
                variant="primary"
                size="sm"
                loading={loading === 'approve'}
                disabled={!!loading}
                onClick={() => handleAction('approve')}
              >
                Approve & Create Account
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={loading === 'reject'}
                disabled={!!loading}
                onClick={() => handleAction('reject')}
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-brand-muted mb-0.5">{label}</p>
      <p className="text-brand-light">{value ?? '—'}</p>
    </div>
  )
}
