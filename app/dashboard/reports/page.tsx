'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUserContext } from '@/lib/context/UserContext'
import type { Report } from '@/lib/types/app.types'
import ReportCard from '@/components/dashboard/ReportCard'
import WeeklyReportForm from '@/components/forms/WeeklyReportForm'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

function getComingSunday(): string {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  const sunday = new Date(today)
  sunday.setDate(today.getDate() + daysUntilSunday)
  return sunday.toISOString().split('T')[0]
}

export default function ReportsPage() {
  const { user } = useUserContext()
  const [reports, setReports]         = useState<Report[]>([])
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [resubmitReport, setResubmitReport] = useState<Report | null>(null)

  const currentWeekEnding = getComingSunday()

  const loadReports = useCallback(async () => {
    if (!user) return
    const supabase = createClient()
    const { data } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.id)
      .order('week_ending', { ascending: false })
    setReports((data as Report[]) ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { loadReports() }, [loadReports])

  const currentWeekSubmitted = reports.some((r) => r.week_ending === currentWeekEnding)

  function handleSuccess() {
    setShowForm(false)
    setResubmitReport(null)
    loadReports()
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-brand-light">Weekly Reports</h2>
          <p className="text-gray-400 mt-1">Log your work and track your contributions.</p>
        </div>
        {!currentWeekSubmitted && (
          <Button variant="primary" onClick={() => setShowForm(true)}>
            Submit report
          </Button>
        )}
        {currentWeekSubmitted && (
          <span className="text-sm text-green-400 mt-1">✓ This week submitted</span>
        )}
      </div>

      {loading ? (
        <p className="text-brand-muted text-sm">Loading…</p>
      ) : reports.length === 0 ? (
        <p className="text-brand-muted text-sm py-12 text-center rounded-xl border border-brand-muted/20">
          No reports submitted yet. Submit your first weekly report above.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((r) => (
            <ReportCard
              key={r.id}
              report={r}
              onResubmit={r.status === 'rejected' ? () => setResubmitReport(r) : undefined}
            />
          ))}
        </div>
      )}

      {/* New report modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Submit weekly report" className="max-w-2xl">
        <WeeklyReportForm onSuccess={handleSuccess} />
      </Modal>

      {/* Resubmit modal */}
      <Modal
        open={!!resubmitReport}
        onClose={() => setResubmitReport(null)}
        title="Resubmit report"
        className="max-w-2xl"
      >
        <WeeklyReportForm initial={resubmitReport} onSuccess={handleSuccess} />
      </Modal>
    </div>
  )
}
