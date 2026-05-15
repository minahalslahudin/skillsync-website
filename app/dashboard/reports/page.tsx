'use client'

import { useState } from 'react'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUserContext } from '@/lib/context/UserContext'
import type { Report } from '@/lib/types/app.types'
import ReportCard from '@/components/dashboard/ReportCard'
import WeeklyReportForm from '@/components/forms/WeeklyReportForm'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

export default function ReportsPage() {
  const { user } = useUserContext()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  async function loadReports() {
    if (!user) return
    const supabase = createClient()
    const { data } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.id)
      .order('week_start', { ascending: false })
    setReports((data as Report[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { loadReports() }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-brand-light">Weekly Reports</h2>
          <p className="text-gray-400 mt-1">Log your work and track your contributions.</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Submit report
        </Button>
      </div>

      {loading ? (
        <p className="text-brand-muted text-sm">Loading…</p>
      ) : reports.length === 0 ? (
        <p className="text-brand-muted text-sm py-12 text-center rounded-xl border border-brand-muted/20">
          No reports submitted yet. Submit your first weekly report above.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((r) => <ReportCard key={r.id} report={r} />)}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Submit weekly report"
      >
        <WeeklyReportForm
          onSuccess={() => {
            setShowForm(false)
            loadReports()
          }}
        />
      </Modal>
    </div>
  )
}
