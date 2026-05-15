'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Event } from '@/lib/types/app.types'
import { formatDate } from '@/lib/utils/formatDate'
import Badge from '@/components/ui/Badge'

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
    : event.date
    ? new Date(event.date)
    : null
  const isPastDeadline = deadlineDate ? deadlineDate < new Date() : false

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="group flex gap-5 rounded-xl border border-brand-muted/20 bg-brand-mid p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-brand-accent/50"
    >
      {/* Date block */}
      {event.date && (
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-brand-accent/10 border border-brand-accent/20 text-center">
          <span className="text-xs font-bold text-brand-accent uppercase leading-none">
            {new Date(event.date).toLocaleString('en', { month: 'short' })}
          </span>
          <span className="text-2xl font-display font-black text-brand-light leading-none mt-0.5">
            {new Date(event.date).getDate()}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={event.type === 'cohort' ? 'info' : 'neutral'}>
            {TYPE_LABEL[event.type] ?? event.type}
          </Badge>
          {event.is_paid ? (
            <Badge variant="warning">R{event.price}</Badge>
          ) : (
            <Badge variant="success">Free</Badge>
          )}
          {isFull && <Badge variant="danger">Full</Badge>}
        </div>

        <h3 className="font-display font-semibold text-brand-light group-hover:text-brand-accent transition-colors duration-200 line-clamp-1">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-sm text-gray-400 line-clamp-2">{event.description}</p>
        )}

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-3 text-xs text-brand-muted">
            {event.date && <span>{formatDate(event.date)}</span>}
            {seatsLeft != null && !isFull && (
              <span className={seatsLeft <= 5 ? 'text-red-400' : ''}>{seatsLeft} seats left</span>
            )}
          </div>

          {isPastDeadline ? (
            <span className="text-xs font-medium text-brand-muted/50 flex-shrink-0 cursor-not-allowed">
              Closed
            </span>
          ) : isFull ? (
            <Link
              href={`/events/${event.slug}`}
              className="text-xs font-semibold text-amber-400 hover:underline flex-shrink-0"
            >
              Join Waitlist →
            </Link>
          ) : (
            <Link
              href={`/events/${event.slug}`}
              className="text-xs font-semibold text-brand-accent hover:underline flex-shrink-0"
            >
              Register →
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
