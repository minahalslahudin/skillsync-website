import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getEventBySlug } from '@/lib/supabase/queries/events'
import { formatDate } from '@/lib/utils/formatDate'
import Badge from '@/components/ui/Badge'
import DynamicEventForm from '@/components/forms/DynamicEventForm'

interface Props {
  params: { slug: string }
}

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

  const isUpcomingEvent = event.date ? new Date(event.date) > new Date() : false
  const seatsLeft = event.seats != null ? event.seats - event.seats_taken : null
  const fillPct   = event.seats && event.seats > 0
    ? Math.min((event.seats_taken / event.seats) * 100, 100)
    : null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Cover */}
      {event.cover_image && (
        <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-10">
          <Image
            src={event.cover_image}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <Badge variant="info">Workshop</Badge>
            {event.is_paid
              ? <Badge variant="warning">R{event.price}</Badge>
              : <Badge variant="success">Free</Badge>
            }
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-light">
            {event.title}
          </h1>

          {event.description && (
            <p className="mt-4 text-gray-400 leading-relaxed">{event.description}</p>
          )}

          {/* Tools covered */}
          {event.tools_covered?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-brand-light mb-2">Tools covered</p>
              <div className="flex flex-wrap gap-2">
                {event.tools_covered.map((tool) => (
                  <span
                    key={tool}
                    className="text-xs px-2 py-1 rounded-full bg-brand-mid border border-brand-muted/20 text-brand-muted"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Attendee stats */}
          {(event.seats_taken > 0 || seatsLeft !== null) && (
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-brand-muted/20 bg-brand-mid p-4 text-center">
                <p className="text-2xl font-display font-black text-brand-accent">
                  {event.seats_taken}
                </p>
                <p className="text-xs text-brand-muted mt-0.5">Registered</p>
              </div>
              {seatsLeft !== null && (
                <div className="rounded-xl border border-brand-muted/20 bg-brand-mid p-4 text-center">
                  <p className={`text-2xl font-display font-black ${seatsLeft <= 5 ? 'text-red-400' : 'text-brand-accent'}`}>
                    {seatsLeft}
                  </p>
                  <p className="text-xs text-brand-muted mt-0.5">Seats left</p>
                </div>
              )}
            </div>
          )}

          {/* Capacity bar */}
          {fillPct !== null && (
            <div className="mt-4 flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-brand-muted">
                <span>Capacity</span>
                <span>{Math.round(fillPct)}% full</span>
              </div>
              <div className="h-1.5 rounded-full bg-brand-muted/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-accent transition-all duration-700"
                  style={{ width: `${fillPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Resources link */}
          {event.resources_url && (
            <div className="mt-6">
              <a
                href={event.resources_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-accent hover:underline"
              >
                Workshop resources ↗
              </a>
            </div>
          )}

          {/* Content body */}
          {event.content && (
            <div
              className="mt-10 prose prose-invert prose-sm max-w-none text-gray-400"
              dangerouslySetInnerHTML={{ __html: event.content }}
            />
          )}
        </div>

        {/* Right: sticky sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="rounded-xl border border-brand-muted/20 bg-brand-mid p-6 sticky top-24">
            <div className="flex flex-col gap-3 mb-6 text-sm text-brand-muted">
              {event.date && (
                <div className="flex justify-between">
                  <span>Date</span>
                  <span className="text-brand-light">{formatDate(event.date)}</span>
                </div>
              )}
              {event.location && (
                <div className="flex justify-between">
                  <span>Location</span>
                  <span className="text-brand-light">
                    {event.is_online ? 'Online' : event.location}
                  </span>
                </div>
              )}
              {seatsLeft != null && (
                <div className="flex justify-between">
                  <span>Seats left</span>
                  <span className={seatsLeft <= 5 ? 'text-red-400' : 'text-brand-light'}>
                    {seatsLeft}
                  </span>
                </div>
              )}
              {event.registration_deadline && (
                <div className="flex justify-between">
                  <span>Register by</span>
                  <span className="text-brand-light">
                    {formatDate(event.registration_deadline)}
                  </span>
                </div>
              )}
            </div>

            {event.registration_open && (
              <>
                <p className="text-sm font-medium text-brand-light mb-4">Register</p>
                <DynamicEventForm event={event} />
              </>
            )}

            {/* Upcoming paid workshop — custom registration form */}
            {!event.registration_open && isUpcomingEvent && event.is_paid && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-gray-400 leading-relaxed">
                  Registration is open. Complete your registration and payment to secure your seat.
                </p>
                <Link
                  href="/workshops/register"
                  className="w-full inline-flex items-center justify-center gap-2 font-bold text-white bg-brand-accent hover:bg-[#c73652] px-5 py-3 rounded-lg transition-colors duration-200 text-sm"
                >
                  Register Now — Rs {event.price}
                </Link>
                <p className="text-xs text-brand-muted text-center">
                  Seats are limited · Confirmed after payment verification
                </p>
              </div>
            )}

            {!event.registration_open && !(isUpcomingEvent && event.is_paid) && (
              <p className="text-sm text-brand-muted text-center py-4">
                Registration is closed.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
