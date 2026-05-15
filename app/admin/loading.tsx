import Skeleton, { SkeletonTableRow } from '@/components/ui/Skeleton'

export default function AdminLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-brand-muted/20 bg-brand-surface p-4 space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-10" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-brand-muted/20 bg-brand-surface p-4">
        <Skeleton className="h-5 w-36 mb-4" />
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonTableRow key={i} cols={5} />
        ))}
      </div>
    </div>
  )
}
