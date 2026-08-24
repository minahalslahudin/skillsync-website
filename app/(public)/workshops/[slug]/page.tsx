import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getEventBySlug } from '@/lib/supabase/queries/events'
import { formatDate } from '@/lib/utils/formatDate'
import DynamicEventForm from '@/components/forms/DynamicEventForm'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventBySlug(params.slug)
  if (!event) return { title: 'Workshop Not Found | skillSYNC' }
  return {
    title: `${event.title} | skillSYNC Workshops`,
    description: event.description ?? undefined,
    openGraph: {
      title: event.title,
      description: event.description ?? undefined,
      images: event.cover_image ? [event.cover_image] : [],
    },
  }
}

export default async function WorkshopDetailPage({ params }: Props) {
  const event = await getEventBySlug(params.slug)
  if (!event || event.type !== 'workshop') notFound()

  const now             = new Date()
  const isUpcomingEvent = event.date ? new Date(event.date) > now : false
  const deadlinePassed  = event.registration_deadline ? new Date(event.registration_deadline) < now : false
  const registrationActive = event.registration_open && isUpcomingEvent && !deadlinePassed
  const seatsLeft = event.seats != null ? event.seats - event.seats_taken : null

  return (
    <>
      {/* Cover strip */}
      {event.cover_image && (
        <div className="relative w-full h-64 sm:h-80 border-b-[3px] border-black">
          <Image src={event.cover_image} alt={event.title} fill className="object-cover" priority />
        </div>
      )}

      {/* Header */}
      <div className="border-b-[3px] border-black bg-white px-6 sm:px-10 py-10">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-[0.62rem] font-semibold uppercase tracking-[2px] px-2 py-0.5 border border-black text-black">
            Workshop
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
        {/* Left/main: content (2 cols) */}
        <div className="lg:col-span-2 p-6 sm:p-10 lg:border-r-[3px] lg:border-black">
          {event.tools_covered?.length > 0 && (
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[2px] text-red mb-3">
                Tools covered
              </p>
              <div className="flex flex-wrap gap-2">
                {event.tools_covered.map((tool) => (
                  <span key={tool} className="text-[0.7rem] uppercase tracking-[1px] px-2 py-1 border border-black text-black">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!event.external_registration_url && (event.seats_taken > 0 || seatsLeft !== null) && (
            <div className="mt-8 grid grid-cols-2 border-[3px] border-black">
              <div className="p-5 border-r-[3px] border-black">
                <p className="font-editorial text-red text-[2.5rem] leading-none">{event.seats_taken}</p>
                <p className="text-[0.72rem] uppercase tracking-[2px] text-[color:var(--color-gray-mid)] mt-1">
                  Registered
                </p>
              </div>
              {seatsLeft !== null && (
                <div className="p-5">
                  <p className={`font-editorial text-[2.5rem] leading-none ${seatsLeft <= 5 ? 'text-red' : 'text-black'}`}>
                    {seatsLeft}
                  </p>
                  <p className="text-[0.72rem] uppercase tracking-[2px] text-[color:var(--color-gray-mid)] mt-1">
                    Seats left
                  </p>
                </div>
              )}
            </div>
          )}

          {event.resources_url && (
            <a
              href={event.resources_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ed-outline btn-ed-sm mt-8 inline-flex"
            >
              Workshop Resources ↗
            </a>
          )}

          {event.content && (
            <div
              className="mt-10 text-[0.95rem] text-[color:var(--color-gray-dark)] leading-[1.8] [&_p]:mb-4 [&_h2]:font-editorial [&_h2]:text-black [&_h2]:text-2xl [&_h2]:tracking-[1px] [&_h2]:mt-6 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: event.content }}
            />
          )}
        </div>

        {/* Right: sticky sidebar */}
        <aside className="p-6 sm:p-10 bg-[color:var(--color-off-white)] border-t-[3px] lg:border-t-0 border-black">
          <div className="border-[3px] border-black bg-white p-6 sticky top-24">
            <div className="flex flex-col gap-3 mb-6 text-[0.85rem]">
              {event.date && (
                <Row label="Date" value={formatDate(event.date)} />
              )}
              {event.location && (
                <Row label="Location" value={event.is_online ? 'Online' : event.location} />
              )}
              {seatsLeft != null && !event.external_registration_url && (
                <Row label="Seats left" value={String(seatsLeft)} accent={seatsLeft <= 5} />
              )}
              {event.registration_deadline && (
                <Row label="Register by" value={formatDate(event.registration_deadline)} />
              )}
            </div>

            {event.external_registration_url ? (
              <a
                href={event.external_registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ed-primary w-full"
              >
                Register Now
              </a>
            ) : (
              <>
                {registrationActive && !event.is_paid && (
                  <>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[2px] text-red mb-4">Register</p>
                    <DynamicEventForm event={event} />
                  </>
                )}

                {registrationActive && event.is_paid && (
                  <div className="flex flex-col gap-3">
                    <p className="text-[0.85rem] text-[color:var(--color-gray-dark)] leading-[1.7]">
                      Registration is open. Complete your registration and payment to secure your seat.
                    </p>
                    <Link href="/workshops/register" className="btn-ed-primary w-full">
                      Register — Rs {event.price}
                    </Link>
                    <p className="text-[0.7rem] uppercase tracking-[1px] text-[color:var(--color-gray-mid)] text-center">
                      Seats are limited · Confirmed after payment verification
                    </p>
                  </div>
                )}

                {!registrationActive && (
                  <p className="text-[0.85rem] text-[color:var(--color-gray-mid)] text-center py-4 uppercase tracking-[2px]">
                    {deadlinePassed ? 'Deadline has passed.' : 'Registration closed.'}
                  </p>
                )}
              </>
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
