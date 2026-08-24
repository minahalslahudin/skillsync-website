import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEventBySlug } from '@/lib/supabase/queries/events'
import { formatDate } from '@/lib/utils/formatDate'
import DynamicEventForm from '@/components/forms/DynamicEventForm'

interface Props { params: { slug: string } }

const TYPE_LABEL: Record<string, string> = {
  event:  'Event',
  cohort: 'Cohort',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventBySlug(params.slug)
  if (!event) return { title: 'Event Not Found | skillSYNC' }
  return {
    title: `${event.title} | skillSYNC Events`,
    description: event.description ?? undefined,
    openGraph: {
      title: event.title,
      description: event.description ?? undefined,
      images: event.cover_image ? [event.cover_image] : [],
    },
  }
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEventBySlug(params.slug)
  if (!event || event.type === 'workshop') notFound()

  const now            = new Date()
  const deadlinePassed = event.registration_deadline ? new Date(event.registration_deadline) < now : false
  const registrationActive = event.registration_open && !deadlinePassed
  const seatsLeft = event.seats != null ? event.seats - event.seats_taken : null

  return (
    <>
      {event.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.cover_image} alt={event.title} className="w-full h-64 sm:h-80 object-cover border-b-[3px] border-black" />
      )}

      <div className="border-b-[3px] border-black bg-white px-6 sm:px-10 py-10">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-[0.62rem] font-semibold uppercase tracking-[2px] px-2 py-0.5 border border-black text-black">
            {TYPE_LABEL[event.type] ?? event.type}
          </span>
          <span className={`text-[0.62rem] font-semibold uppercase tracking-[2px] px-2 py-0.5 ${event.is_paid ? 'bg-black text-white' : 'bg-red text-white'}`}>
            {event.is_paid ? `Rs ${event.price}` : 'FREE'}
          </span>
        </div>
        <h1 className="font-editorial text-black text-[2.5rem] sm:text-[4rem] leading-[0.95] tracking-[2px]">
          {event.title.toUpperCase()}
        </h1>
        {event.description && (
          <p className="mt-6 text-[0.95rem] text-[color:var(--color-gray-dark)] leading-[1.8] max-w-3xl">
            {event.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 border-b-[3px] border-black bg-white">
        <div className="lg:col-span-2 p-6 sm:p-10 lg:border-r-[3px] lg:border-black">
          {event.content && (
            <div
              className="text-[0.95rem] text-[color:var(--color-gray-dark)] leading-[1.8] [&_p]:mb-4 [&_h2]:font-editorial [&_h2]:text-black [&_h2]:text-2xl [&_h2]:tracking-[1px] [&_h2]:mt-6 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: event.content }}
            />
          )}
        </div>

        <aside className="p-6 sm:p-10 bg-[color:var(--color-off-white)] border-t-[3px] lg:border-t-0 border-black">
          <div className="border-[3px] border-black bg-white p-6 sticky top-24">
            <div className="flex flex-col gap-3 mb-6 text-[0.85rem]">
              {event.date && <Row label="Starts" value={formatDate(event.date)} />}
              {event.end_date && <Row label="Ends" value={formatDate(event.end_date)} />}
              {event.location && <Row label="Location" value={event.is_online ? 'Online' : event.location} />}
              {seatsLeft != null && <Row label="Seats left" value={String(seatsLeft)} accent={seatsLeft <= 5} />}
            </div>

            {registrationActive ? (
              <>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[2px] text-red mb-4">Register</p>
                <DynamicEventForm event={event} />
              </>
            ) : (
              <p className="text-[0.85rem] text-[color:var(--color-gray-mid)] text-center py-4 uppercase tracking-[2px]">
                {deadlinePassed ? 'Deadline has passed.' : 'Registration closed.'}
              </p>
            )}
          </div>
        </aside>
      </div>
    </>
  )
}

function Row({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between items-baseline gap-3 pb-2 border-b border-black/15">
      <span className="text-[0.7rem] uppercase tracking-[2px] text-[color:var(--color-gray-mid)]">{label}</span>
      <span className={`text-[0.85rem] font-semibold ${accent ? 'text-red' : 'text-black'}`}>{value}</span>
    </div>
  )
}
