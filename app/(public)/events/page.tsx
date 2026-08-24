import { Suspense } from 'react'
import { getAllUpcomingEvents } from '@/lib/supabase/queries/events'
import EventsFilterGrid from '@/components/public/EventsFilterGrid'
import SectionHeader from '@/components/public/SectionHeader'

export const metadata = {
  title: 'Events | skillSYNC × skillIT',
  description: 'Upcoming workshops, cohorts, and events open for registration.',
}

export default async function EventsPage() {
  const events = await getAllUpcomingEvents(50)

  return (
    <>
      <SectionHeader
        eyebrow="Events"
        title="What's Coming Up"
        subtitle="Cohorts, hackathons, and learning programmes open for registration."
      />

      <div className="p-6 sm:p-10 border-b-[3px] border-black bg-white">
        {events.length === 0 ? (
          <p className="text-center py-20 text-[color:var(--color-gray-mid)] uppercase tracking-[2px] text-sm">
            No upcoming events right now. Check back soon.
          </p>
        ) : (
          <Suspense fallback={null}>
            <EventsFilterGrid events={events} />
          </Suspense>
        )}
      </div>
    </>
  )
}
