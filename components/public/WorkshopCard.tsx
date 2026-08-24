'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Event } from '@/lib/types/app.types'
import { formatDate } from '@/lib/utils/formatDate'

// Editorial-bold workshop card.
// - 3px black border, no border-radius, no drop shadow.
// - Red top strip carries the type + price in Bebas Neue.
// - Hover: shifts to off-white background; red left accent border animates in.

interface WorkshopCardProps {
  event: Event
}

export default function WorkshopCard({ event }: WorkshopCardProps) {
  const isUpcoming = event.date ? new Date(event.date) > new Date() : false
  const seatsLeft  = event.seats != null ? event.seats - event.seats_taken : null

  const priceLabel = event.is_paid ? `Rs ${event.price}` : 'FREE'
  const statusLabel = isUpcoming ? 'UPCOMING' : 'PAST'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="group flex flex-col border-[3px] border-black bg-white transition-colors duration-200 hover:bg-[color:var(--color-off-white)]"
    >
      {/* Top red strip */}
      <div className="bg-red text-white flex items-center justify-between px-4 py-2 border-b-[3px] border-black">
        <span className="font-editorial text-lg tracking-[2px]">
          {priceLabel}
        </span>
        <span className="text-[0.68rem] font-semibold uppercase tracking-[2px]">
          {statusLabel}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5 sm:p-6 gap-3 relative">
        {/* Left accent that appears on hover */}
        <span className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-[6px] bg-red transition-all duration-200" />

        {/* Brand tag */}
        <span className="text-[0.68rem] font-semibold uppercase tracking-[2px] text-[color:var(--color-gray-mid)]">
          {event.brand === 'skillit' ? 'skillIT' : 'skillSYNC'}
          {event.date && ` · ${formatDate(event.date)}`}
        </span>

        {/* Title */}
        <h3 className="font-editorial text-black text-[1.8rem] leading-[1] tracking-[1px] line-clamp-2">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-[0.82rem] text-[color:var(--color-gray-dark)] leading-[1.7] line-clamp-3 flex-1">
            {event.description}
          </p>
        )}

        {/* Tools */}
        {event.tools_covered && event.tools_covered.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {event.tools_covered.slice(0, 4).map((tool) => (
              <span
                key={tool}
                className="text-[0.68rem] px-2 py-0.5 border border-black text-black uppercase tracking-[1px]"
              >
                {tool}
              </span>
            ))}
          </div>
        )}

        {/* Stats row (past = attendees, upcoming = seats) */}
        {!event.hide_seats_display && (
          <div className="text-[0.78rem] text-[color:var(--color-gray-dark)]">
            {!isUpcoming && event.seats_taken > 0 && (
              <span>
                <span className="text-red font-semibold">{event.seats_taken}</span> people attended
              </span>
            )}
            {isUpcoming && seatsLeft !== null && (
              <span>
                <span className="text-red font-semibold">{seatsLeft}</span> seats left
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-4 border-t-[3px] border-black flex items-center justify-between gap-3">
          {isUpcoming && event.is_paid ? (
            event.external_registration_url ? (
              <a
                href={event.external_registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ed-primary btn-ed-sm"
              >
                Register — Rs {event.price}
              </a>
            ) : (
              <Link href="/workshops/register" className="btn-ed-primary btn-ed-sm">
                Register — Rs {event.price}
              </Link>
            )
          ) : (
            <Link
              href={`/workshops/${event.slug}`}
              className="text-[0.78rem] font-semibold uppercase tracking-[1px] text-black hover:text-red transition-colors"
            >
              View details →
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
