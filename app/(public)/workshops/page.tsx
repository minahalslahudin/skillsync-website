import { Suspense } from 'react'
import { getPublishedWorkshops } from '@/lib/supabase/queries/events'
import WorkshopsFilterGrid from '@/components/public/WorkshopsFilterGrid'

export const metadata = {
  title: 'Workshops | skillSYNC',
  description: 'Hands-on sessions covering the tools and techniques you need to build real projects.',
}

export default async function WorkshopsPage() {
  const workshops = await getPublishedWorkshops(100)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12">
        <p className="text-brand-accent text-sm font-semibold tracking-widest uppercase mb-3">
          Workshops
        </p>
        <h1 className="text-4xl md:text-5xl font-display font-black text-brand-light">
          Learn something new
        </h1>
        <p className="mt-4 text-gray-400 max-w-xl">
          Hands-on sessions covering the tools and techniques you need to build real projects.
        </p>
      </div>

      {workshops.length === 0 ? (
        <p className="text-center py-20 text-brand-muted">
          Workshops coming soon. Check back shortly.
        </p>
      ) : (
        <Suspense fallback={null}>
          <WorkshopsFilterGrid workshops={workshops} />
        </Suspense>
      )}
    </div>
  )
}
