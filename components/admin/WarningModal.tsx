'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import type { VolunteerRow } from '@/lib/supabase/queries/users'
import type { Warning } from '@/lib/types/app.types'

interface Props {
  open: boolean
  onClose: () => void
  volunteer: VolunteerRow
  onSuccess: () => void
}

function severityFromCount(count: number): Warning['severity'] {
  if (count === 0) return 'minor'
  if (count === 1) return 'major'
  return 'final'
}

const SEVERITY_LABEL: Record<Warning['severity'], string> = {
  minor: 'Warning #1 (Minor)',
  major: 'Warning #2 (Major)',
  final: 'Warning #3 (Final)',
}

export default function WarningModal({ open, onClose, volunteer, onSuccess }: Props) {
  const severity = severityFromCount(volunteer.warning_count)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (reason.trim().length < 10) {
      toast.error('Reason must be at least 10 characters.')
      return
    }
    setLoading(true)
    const res = await fetch('/api/admin/warnings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: volunteer.id, reason: reason.trim(), severity }),
    })
    setLoading(false)
    if (!res.ok) {
      const { error } = await res.json()
      toast.error(error ?? 'Failed to issue warning.')
      return
    }
    toast.success(`Warning issued to ${volunteer.full_name}.`)
    setReason('')
    onSuccess()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Issue Warning" className="max-w-md">
      <div className="flex flex-col gap-5">
        <div className="rounded-xl border border-yellow-800/40 bg-yellow-950/30 p-4 text-sm">
          <p className="font-semibold text-yellow-400 mb-1">
            {SEVERITY_LABEL[severity]}
          </p>
          <p className="text-brand-muted">
            Issuing warning to <span className="text-brand-light font-medium">{volunteer.full_name}</span>.{' '}
            Current warning count: <span className="text-yellow-400 font-semibold">{volunteer.warning_count}</span>
          </p>
          {severity === 'final' && (
            <p className="mt-2 text-red-400 font-medium">
              ⚠ This is a final warning. The next step may result in account suspension.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-light">Reason for warning</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Describe why this warning is being issued…"
            className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
          />
          <p className="text-xs text-brand-muted">{reason.length}/10 chars minimum</p>
        </div>

        <div className="flex gap-2">
          <Button variant="danger" size="sm" loading={loading} onClick={handleSubmit}>
            Issue Warning
          </Button>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}
