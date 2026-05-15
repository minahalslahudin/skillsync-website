import { notFound } from 'next/navigation'
import { getEventBySlug } from '@/lib/supabase/queries/events'
import { formatDate } from '@/lib/utils/formatDate'
import Badge from '@/components/ui/Badge'
import DynamicEventForm from '@/components/forms/DynamicEventForm'

interface Props {
  params: { slug: string }
}

const TYPE_LABEL: Record<string, string> = {
  event:  'Event',
  cohort: 'Cohort',
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEventBySlug(params.slug)
  if (!event || event.type === 'workshop') notFound()

  const seatsLeft = event.seats != null ? event.seats - event.seats_taken : null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {event.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.cover_image} alt={event.title} className="w-full h-64 object-cover rounded-2xl mb-10" />
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={event.type === 'cohort' ? 'info' : 'neutral'}>
              {TYPE_LABEL[event.type] ?? event.type}
            </Badge>
            {event.is_paid
              ? <Badge variant="warning">R{event.price}</Badge>
              : <Badge variant="success">Free</Badge>
            }
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-light">{event.title}</h1>

          {event.description && (
            <p className="mt-4 text-gray-400 leading-relaxed">{event.description}</p>
          )}

          {event.content && (
            <div
              className="mt-8 prose prose-invert prose-sm max-w-none text-gray-400"
              dangerouslySetInnerHTML={{ __html: event.content }}
            />
          )}
        </div>

        <div className="lg:w-80 flex-shrink-0">
          <div className="rounded-xl border border-brand-muted/20 bg-brand-mid p-6 sticky top-24">
            <div className="flex flex-col gap-3 mb-6 text-sm text-brand-muted">
              {event.date && (
                <div className="flex justify-between">
                  <span>Starts</span>
                  <span className="text-brand-light">{formatDate(event.date)}</span>
                </div>
              )}
              {event.end_date && (
                <div className="flex justify-between">
                  <span>Ends</span>
                  <span className="text-brand-light">{formatDate(event.end_date)}</span>
                </div>
              )}
              {event.location && (
                <div className="flex justify-between">
                  <span>Location</span>
                  <span className="text-brand-light">{event.is_online ? 'Online' : event.location}</span>
                </div>
              )}
              {seatsLeft != null && (
                <div className="flex justify-between">
                  <span>Seats left</span>
                  <span className={seatsLeft <= 5 ? 'text-red-400' : 'text-brand-light'}>{seatsLeft}</span>
                </div>
              )}
            </div>

            {event.registration_open ? (
              <>
                <p className="text-sm font-medium text-brand-light mb-4">Register</p>
                <DynamicEventForm event={event} />
              </>
            ) : (
              <p className="text-sm text-brand-muted text-center py-4">Registration is closed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
