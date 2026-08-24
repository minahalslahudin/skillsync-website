import { Suspense } from 'react'
import { getPublishedWorkshops } from '@/lib/supabase/queries/events'
import WorkshopsFilterGrid from '@/components/public/WorkshopsFilterGrid'
import SectionHeader from '@/components/public/SectionHeader'

export const metadata = {
  title: 'Workshops | skillSYNC',
  description: 'Hands-on sessions covering the tools and techniques you need to build real projects.',
}

export default async function WorkshopsPage() {
  const workshops = await getPublishedWorkshops(100)

  return (
    <>
      <SectionHeader
        eyebrow="Workshops"
        title="Learn Something New"
        subtitle="Hands-on sessions covering the tools and techniques you need to build real projects."
      />

      <div className="p-6 sm:p-10 border-b-[3px] border-black bg-white">
        {workshops.length === 0 ? (
          <p className="text-center py-20 text-[color:var(--color-gray-mid)] uppercase tracking-[2px] text-sm">
            Workshops coming soon. Check back shortly.
          </p>
        ) : (
          <Suspense fallback={null}>
            <WorkshopsFilterGrid workshops={workshops} />
          </Suspense>
        )}
      </div>
    </>
  )
}
