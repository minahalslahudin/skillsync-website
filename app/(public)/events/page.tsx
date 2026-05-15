import { getUpcomingEvents } from '@/lib/supabase/queries/events'
import EventCard from '@/components/public/EventCard'

export default async function EventsPage() {
  const events = await getUpcomingEvents(50)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12">
        <p className="text-brand-accent text-sm font-semibold tracking-widest uppercase mb-3">Events</p>
        <h1 className="text-4xl md:text-5xl font-display font-black text-brand-light">
          What&apos;s coming up
        </h1>
        <p className="mt-4 text-gray-400 max-w-xl">
          Cohorts, hackathons, and learning programmes open for registration.
        </p>
      </div>

      {events.length === 0 ? (
        <p className="text-center py-20 text-brand-muted">No upcoming events right now. Check back soon.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </div>
  )
}
