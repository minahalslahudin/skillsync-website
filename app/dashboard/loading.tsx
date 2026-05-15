import Skeleton, { SkeletonTableRow } from '@/components/ui/Skeleton'

export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-brand-muted/20 bg-brand-surface p-4 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-12" />
          </div>
        ))}
      </div>
      {/* Table area */}
      <div className="rounded-xl border border-brand-muted/20 bg-brand-surface p-4">
        <Skeleton className="h-5 w-32 mb-4" />
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonTableRow key={i} cols={4} />
        ))}
      </div>
    </div>
  )
}
