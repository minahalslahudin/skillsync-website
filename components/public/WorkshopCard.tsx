'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Event } from '@/lib/types/app.types'
import { formatDate } from '@/lib/utils/formatDate'
import Badge from '@/components/ui/Badge'

interface WorkshopCardProps {
  event: Event
}

export default function WorkshopCard({ event }: WorkshopCardProps) {
  const isUpcoming = event.date ? new Date(event.date) > new Date() : false
  const seatsLeft = event.seats != null ? event.seats - event.seats_taken : null
  const fillPct =
    event.seats && event.seats > 0
      ? Math.min((event.seats_taken / event.seats) * 100, 100)
      : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="group flex flex-col rounded-xl border border-brand-muted/20 bg-brand-mid overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-brand-accent/50"
    >
      {/* Colour bar */}
      <div className="h-1 bg-gradient-to-r from-brand-accent to-brand-accent/40" />

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="info" dot>
            {event.brand === 'skillit' ? 'skillIT' : 'skillSYNC'}
          </Badge>

          {isUpcoming && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-400 px-2 py-0.5 rounded-full bg-green-400/10 border border-green-400/20">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Upcoming
            </span>
          )}

          {event.is_paid ? (
            <Badge variant="warning">Paid · R{event.price}</Badge>
          ) : (
            <Badge variant="success">Free</Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-display font-semibold text-brand-light leading-snug group-hover:text-brand-accent transition-colors duration-200 line-clamp-2">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 flex-1">
            {event.description}
          </p>
        )}

        {/* Tools */}
        {event.tools_covered && event.tools_covered.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {event.tools_covered.slice(0, 4).map((tool) => (
              <span
                key={tool}
                className="text-xs px-2 py-0.5 rounded-full bg-brand-dark/60 text-brand-muted border border-brand-muted/20"
              >
                {tool}
              </span>
            ))}
          </div>
        )}

        {/* Seats progress bar */}
        {fillPct !== null && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-brand-muted">
              <span>{event.seats_taken} attending</span>
              {seatsLeft !== null && <span>{seatsLeft} seats left</span>}
            </div>
            <div className="h-1.5 rounded-full bg-brand-muted/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-accent transition-all duration-700"
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-brand-muted/15">
          {event.date && (
            <span className="text-xs text-brand-muted">{formatDate(event.date)}</span>
          )}
          <Link
            href={`/workshops/${event.slug}`}
            className="text-xs font-semibold text-brand-accent hover:underline transition-colors ml-auto"
          >
            View details →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
