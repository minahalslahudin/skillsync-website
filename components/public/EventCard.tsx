'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Event } from '@/lib/types/app.types'
import { formatDate } from '@/lib/utils/formatDate'

// Editorial-bold event card: horizontal layout with a black date block on
// the left and a bordered content column on the right.

interface EventCardProps {
  event: Event
}

const TYPE_LABEL: Record<string, string> = {
  event:    'Event',
  cohort:   'Cohort',
  workshop: 'Workshop',
}

export default function EventCard({ event }: EventCardProps) {
  const seatsLeft = event.seats != null ? event.seats - event.seats_taken : null
  const isFull = seatsLeft !== null && seatsLeft <= 0

  const deadlineDate = event.registration_deadline
    ? new Date(event.registration_deadline)
    : event.date ? new Date(event.date) : null
  const isPastDeadline = deadlineDate ? deadlineDate < new Date() : false

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="group flex flex-col sm:flex-row border-[3px] border-black bg-white transition-colors duration-200 hover:bg-[color:var(--color-off-white)]"
    >
      {/* Date block */}
      {event.date && (
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-full sm:w-24 py-4 sm:py-0 bg-black text-white border-b-[3px] sm:border-b-0 sm:border-r-[3px] border-black">
          <span className="font-editorial text-red text-lg tracking-[2px] leading-none">
            {new Date(event.date).toLocaleString('en', { month: 'short' }).toUpperCase()}
          </span>
          <span className="font-editorial text-white text-[3rem] leading-none mt-1">
            {new Date(event.date).getDate()}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2 flex-1 min-w-0 p-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[0.62rem] font-semibold uppercase tracking-[2px] px-2 py-0.5 border border-black text-black">
            {TYPE_LABEL[event.type] ?? event.type}
          </span>
          <span
            className={`text-[0.62rem] font-semibold uppercase tracking-[2px] px-2 py-0.5 ${
              event.is_paid ? 'bg-black text-white' : 'bg-red text-white'
            }`}
          >
            {event.is_paid ? `R${event.price}` : 'FREE'}
          </span>
          {isFull && (
            <span className="text-[0.62rem] font-semibold uppercase tracking-[2px] px-2 py-0.5 bg-red text-white">
              Full
            </span>
          )}
        </div>

        <h3 className="font-editorial text-black text-[1.5rem] leading-[1.05] tracking-[1px] line-clamp-1">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-[0.82rem] text-[color:var(--color-gray-dark)] line-clamp-2">{event.description}</p>
        )}

        <div className="flex items-center justify-between mt-1 gap-3">
          <div className="flex items-center gap-3 text-[0.72rem] uppercase tracking-[1px] text-[color:var(--color-gray-mid)]">
            {event.date && <span>{formatDate(event.date)}</span>}
            {seatsLeft != null && !isFull && (
              <span className={seatsLeft <= 5 ? 'text-red' : ''}>{seatsLeft} seats left</span>
            )}
          </div>

          {isPastDeadline ? (
            <span className="text-[0.72rem] uppercase tracking-[1px] text-[color:var(--color-gray-mid)] flex-shrink-0">
              Closed
            </span>
          ) : (
            <Link
              href={`/events/${event.slug}`}
              className="text-[0.78rem] font-semibold uppercase tracking-[1px] text-black hover:text-red transition-colors flex-shrink-0"
            >
              {isFull ? 'Waitlist →' : 'Register →'}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
