'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import type { Task } from '@/lib/types/app.types'
import TaskCard from '@/components/dashboard/TaskCard'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils/formatDate'

const STATUS_VARIANT: Record<Task['status'], 'neutral' | 'info' | 'success' | 'danger' | 'warning'> = {
  not_started: 'neutral',
  in_progress: 'info',
  submitted:   'warning',
  completed:   'success',
  overdue:     'danger',
}

const STATUS_LABEL: Record<Task['status'], string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  submitted:   'Submitted',
  completed:   'Completed',
  overdue:     'Overdue',
}


interface TasksBoardProps {
  initialTasks: Task[]
}

export default function TasksBoard({ initialTasks }: TasksBoardProps) {
  const [tasks, setTasks]           = useState<Task[]>(initialTasks)
  const [tab, setTab]               = useState<'active' | 'completed'>('active')
  const [selected, setSelected]     = useState<Task | null>(null)
  const [showSubmit, setShowSubmit] = useState(false)
  const [showExtension, setShowExtension] = useState(false)
  const [submissionText, setSubmissionText] = useState('')
  const [extensionReason, setExtensionReason] = useState('')
  const [loading, setLoading]       = useState(false)

  const active    = tasks.filter((t) => t.status !== 'completed')
  const completed = tasks.filter((t) => t.status === 'completed')
  const displayed = tab === 'active' ? active : completed

  async function updateStatus(taskId: string, status: Task['status'], extra?: Record<string, unknown>) {
    setLoading(true)
    const supabase = createClient()
    const update: Record<string, unknown> = { status, ...extra }
    if (status === 'completed') update.completed_at = new Date().toISOString()
    const { error } = await supabase.from('tasks').update(update).eq('id', taskId)
    setLoading(false)
    if (error) {
      toast.error('Failed to update task.')
      return false
    }
    setTasks((prev) =>
      prev.map((t) => t.id === taskId ? { ...t, status, ...extra } as Task : t)
    )
    setSelected((prev) => prev?.id === taskId ? { ...prev, status, ...extra } as Task : prev)
    return true
  }

  async function handleMarkInProgress() {
    if (!selected) return
    const ok = await updateStatus(selected.id, 'in_progress')
    if (ok) toast.success('Marked as in progress.')
  }

  async function handleSubmitWork() {
    if (!selected || !submissionText.trim()) {
      toast.error('Please describe what you submitted.')
      return
    }
    const ok = await updateStatus(selected.id, 'submitted', { submission_text: submissionText.trim() })
    if (ok) {
      toast.success('Work submitted!')
      setShowSubmit(false)
      setSubmissionText('')
    }
  }

  async function handleRequestExtension() {
    if (!selected || !extensionReason.trim()) {
      toast.error('Please provide a reason for the extension.')
      return
    }
    // Note an extension request in the submission_text; admin reviews it
    const ok = await updateStatus(selected.id, selected.status, {
      submission_text: `[Extension request] ${extensionReason.trim()}`,
    })
    if (ok) {
      toast.success('Extension request logged. Your lead will review it.')
      setShowExtension(false)
      setExtensionReason('')
    }
  }

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-brand-mid border border-brand-muted/20 w-fit">
        {(['active', 'completed'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-1.5 text-sm rounded-lg font-medium capitalize transition-all duration-200 ${
              tab === t
                ? 'bg-brand-accent text-white shadow'
                : 'text-brand-muted hover:text-brand-light'
            }`}
          >
            {t === 'active' ? `Active (${active.length})` : `Completed (${completed.length})`}
          </button>
        ))}
      </div>

      {/* Task list */}
      {displayed.length === 0 ? (
        <p className="text-brand-muted text-sm py-12 text-center rounded-xl border border-brand-muted/20">
          {tab === 'active' ? 'No active tasks.' : 'No completed tasks yet.'}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {displayed.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => setSelected(task)} />
          ))}
        </div>
      )}

      {/* Task detail modal */}
      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title={selected.title} className="max-w-xl">
          <div className="flex flex-col gap-5">
            {/* Meta */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={STATUS_VARIANT[selected.status]}>{STATUS_LABEL[selected.status]}</Badge>
              <Badge variant={selected.priority === 'high' ? 'danger' : selected.priority === 'medium' ? 'warning' : 'neutral'}>
                {selected.priority} priority
              </Badge>
            </div>

            {selected.description && (
              <p className="text-sm text-gray-400 leading-relaxed">{selected.description}</p>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              {selected.due_date && (
                <div>
                  <p className="text-xs text-brand-muted uppercase tracking-wider mb-0.5">Due date</p>
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
              <div className="rounded-lg bg-brand-dark/50 border border-brand-muted/20 px-3 py-2">
                <p className="text-xs font-medium text-brand-muted uppercase tracking-wider mb-0.5">Submission</p>
                <p className="text-sm text-gray-300">{selected.submission_text}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-brand-muted/20">
              {selected.status === 'not_started' && (
                <Button variant="primary" size="sm" loading={loading} onClick={handleMarkInProgress}>
                  Mark in progress
                </Button>
              )}
              {selected.status === 'in_progress' && (
                <Button variant="primary" size="sm" onClick={() => setShowSubmit(true)}>
                  Submit work
                </Button>
              )}
              {(selected.status === 'not_started' || selected.status === 'in_progress') && (
                <Button variant="secondary" size="sm" onClick={() => setShowExtension(true)}>
                  Request extension
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Submit work sub-modal */}
      <Modal open={showSubmit} onClose={() => setShowSubmit(false)} title="Submit your work">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-light">What did you deliver?</label>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              rows={4}
              placeholder="Describe what you submitted — include links if applicable."
              className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 resize-none"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" loading={loading} onClick={handleSubmitWork}>
              Confirm submission
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowSubmit(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Request extension sub-modal */}
      <Modal open={showExtension} onClose={() => setShowExtension(false)} title="Request extension">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-light">Reason for extension</label>
            <textarea
              value={extensionReason}
              onChange={(e) => setExtensionReason(e.target.value)}
              rows={3}
              placeholder="Explain why you need more time…"
              className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 resize-none"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" loading={loading} onClick={handleRequestExtension}>
              Submit request
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowExtension(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
