'use client'

import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import type { Report } from '@/lib/types/app.types'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

function getComingSunday(): string {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Sun
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  const sunday = new Date(today)
  sunday.setDate(today.getDate() + daysUntilSunday)
  return sunday.toISOString().split('T')[0]
}

interface RowState {
  task_name:   string
  hours:       string
  deliverable: string
}

interface WeeklyReportFormProps {
  onSuccess?: () => void
  initial?:   Report | null
}

export default function WeeklyReportForm({ onSuccess, initial }: WeeklyReportFormProps) {
  const weekEnding = useMemo(() => {
    if (initial?.week_ending) return initial.week_ending
    return getComingSunday()
  }, [initial])

  const [rows, setRows] = useState<RowState[]>(() => {
    if (initial?.entries?.length === 7) {
      return initial.entries.map((e) => ({
        task_name:   e.task_name,
        hours:       String(e.hours),
        deliverable: e.deliverable,
      }))
    }
    return DAYS.map(() => ({ task_name: '', hours: '0', deliverable: '' }))
  })

  const [blockers,    setBlockers]   = useState(
    initial?.notes ? parseNotes(initial.notes).blockers : ''
  )
  const [nextWeek,    setNextWeek]   = useState(
    initial?.notes ? parseNotes(initial.notes).nextWeek : ''
  )
  const [submitting,  setSubmitting] = useState(false)

  const totalHours = rows.reduce((sum, r) => {
    const h = parseFloat(r.hours)
    return sum + (isNaN(h) ? 0 : h)
  }, 0)

  function updateRow(i: number, field: keyof RowState, value: string) {
    setRows((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], [field]: value }
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (totalHours <= 0) {
      toast.error('Total hours must be greater than 0.')
      return
    }
    const hasContent = rows.some((r) => r.task_name.trim() || r.hours !== '0')
    if (!hasContent) {
      toast.error('Add at least one entry.')
      return
    }

    const entries = rows.map((r, i) => ({
      day:         DAYS[i],
      task_name:   r.task_name,
      hours:       Math.max(0, parseFloat(r.hours) || 0),
      deliverable: r.deliverable,
    }))

    const notes = [
      blockers.trim() ? `Blockers: ${blockers.trim()}` : '',
      nextWeek.trim() ? `Next week: ${nextWeek.trim()}` : '',
    ].filter(Boolean).join('\n\n') || null

    setSubmitting(true)
    const res = await fetch('/api/reports', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        week_ending:  weekEnding,
        entries,
        total_hours:  totalHours,
        notes,
        ...(initial?.id ? { report_id: initial.id } : {}),
      }),
    })
    setSubmitting(false)

    if (res.ok) {
      toast.success(initial?.id ? 'Report updated!' : 'Report submitted!')
      onSuccess?.()
    } else {
      const { error } = await res.json().catch(() => ({ error: 'Unknown error' }))
      toast.error(error ?? 'Failed to submit. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Week ending */}
      <div className="flex items-center gap-3">
        <div>
          <p className="text-xs text-brand-muted uppercase tracking-wider mb-0.5">Week ending</p>
          <p className="text-sm font-semibold text-brand-light">{weekEnding}</p>
        </div>
        <div className="ml-auto">
          <p className="text-xs text-brand-muted">Total hours</p>
          <p className={`text-2xl font-display font-bold tabular-nums ${totalHours > 0 ? 'text-brand-accent' : 'text-brand-muted'}`}>
            {totalHours.toFixed(1)}h
          </p>
        </div>
      </div>

      {/* 7-row table */}
      <div className="overflow-x-auto rounded-xl border border-brand-muted/20">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-muted/20 bg-brand-dark/50">
              <th className="text-left px-3 py-2.5 text-xs font-medium text-brand-muted w-12">Day</th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-brand-muted">Task / work done</th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-brand-muted w-20">Hours</th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-brand-muted">Output / deliverable</th>
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day, i) => (
              <tr key={day} className="border-b border-brand-muted/10 last:border-0">
                <td className="px-3 py-2 text-xs font-semibold text-brand-muted">{day}</td>
                <td className="px-1 py-1">
                  <input
                    value={rows[i].task_name}
                    onChange={(e) => updateRow(i, 'task_name', e.target.value)}
                    placeholder="What did you work on?"
                    className="w-full bg-transparent px-2 py-1.5 text-sm text-brand-light placeholder:text-brand-muted/40 focus:outline-none focus:bg-brand-dark/30 rounded"
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={rows[i].hours}
                    onChange={(e) => updateRow(i, 'hours', e.target.value)}
                    className="w-16 bg-transparent px-2 py-1.5 text-sm text-brand-light text-center focus:outline-none focus:bg-brand-dark/30 rounded"
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    value={rows[i].deliverable}
                    onChange={(e) => updateRow(i, 'deliverable', e.target.value)}
                    placeholder="Link, file, outcome…"
                    className="w-full bg-transparent px-2 py-1.5 text-sm text-brand-light placeholder:text-brand-muted/40 focus:outline-none focus:bg-brand-dark/30 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Blockers */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">Blockers (optional)</label>
        <textarea
          value={blockers}
          onChange={(e) => setBlockers(e.target.value)}
          rows={2}
          placeholder="Any obstacles or blockers this week?"
          className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent resize-none"
        />
      </div>

      {/* Next week */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">Plan for next week (optional)</label>
        <textarea
          value={nextWeek}
          onChange={(e) => setNextWeek(e.target.value)}
          rows={2}
          placeholder="What are you planning to work on next week?"
          className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent resize-none"
        />
      </div>

      <Button type="submit" variant="primary" loading={submitting} className="self-start">
        {initial?.id ? 'Resubmit report' : 'Submit report'}
      </Button>
    </form>
  )
}

function parseNotes(notes: string): { blockers: string; nextWeek: string } {
  const blockers = notes.match(/Blockers: ([\s\S]*?)(?:\n\n|$)/)?.[1]?.trim() ?? ''
  const nextWeek = notes.match(/Next week: ([\s\S]*?)(?:\n\n|$)/)?.[1]?.trim() ?? ''
  return { blockers, nextWeek }
}
