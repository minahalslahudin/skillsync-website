import type { Report } from '@/lib/types/app.types'
import { formatDate } from '@/lib/utils/formatDate'
import Badge from '@/components/ui/Badge'

const STATUS_VARIANT = {
  pending:  'neutral',
  approved: 'success',
  rejected: 'danger',
} as const

const STATUS_LABEL: Record<Report['status'], string> = {
  pending:  'Pending',
  approved: 'Accepted',
  rejected: 'Needs Revision',
}

interface ReportCardProps {
  report: Report
  onResubmit?: () => void
}

export default function ReportCard({ report, onResubmit }: ReportCardProps) {
  const hasEntries = report.entries.filter((e) => e.hours > 0).length
  return (
    <div className="rounded-xl border border-brand-muted/20 bg-brand-mid p-5 transition-all duration-200 hover:border-brand-accent/30">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-medium text-brand-light">
            Week ending {formatDate(report.week_ending)}
          </p>
          <p className="text-sm text-brand-muted mt-0.5">
            {hasEntries} {hasEntries === 1 ? 'entry' : 'entries'} · {report.total_hours}h logged
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <Badge variant={STATUS_VARIANT[report.status]}>
            {STATUS_LABEL[report.status]}
          </Badge>
          <p className="text-2xl font-display font-bold text-brand-accent">{report.total_hours}h</p>
        </div>
      </div>

      {report.admin_comment && (
        <div className="mt-3 rounded-lg bg-brand-dark/50 border border-brand-muted/20 px-3 py-2">
          <p className="text-xs font-medium text-brand-muted uppercase tracking-wider mb-0.5">Admin note</p>
          <p className="text-sm text-gray-300">{report.admin_comment}</p>
        </div>
      )}

      {report.status === 'rejected' && onResubmit && (
        <button
          onClick={onResubmit}
          className="mt-3 text-sm font-semibold text-brand-accent hover:underline"
        >
          Resubmit →
        </button>
      )}
    </div>
  )
}
