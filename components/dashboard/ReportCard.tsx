import type { Report } from '@/lib/types/app.types'
import { formatDate } from '@/lib/utils/formatDate'

export default function ReportCard({ report }: { report: Report }) {
  return (
    <div className="rounded-xl border border-brand-muted/20 bg-brand-mid p-5 flex items-center justify-between gap-4 transition-all duration-200 hover:border-brand-accent/30">
      <div className="min-w-0">
        <p className="font-medium text-brand-light">
          Week of {formatDate(report.week_start)}
        </p>
        <p className="text-sm text-brand-muted mt-0.5">
          {report.entries.length} {report.entries.length === 1 ? 'entry' : 'entries'} · {report.total_hours}h logged
        </p>
        {report.notes && (
          <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">{report.notes}</p>
        )}
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-2xl font-display font-bold text-brand-accent">{report.total_hours}h</p>
        <p className="text-xs text-brand-muted">{formatDate(report.submitted_at)}</p>
      </div>
    </div>
  )
}
