import { SkeletonCard } from '@/components/ui/Skeleton'
import Skeleton from '@/components/ui/Skeleton'

export default function ProjectsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Skeleton className="h-10 w-40 mb-2" />
      <Skeleton className="h-5 w-72 mb-10" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}
