'use client'

import { useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import type { Event } from '@/lib/types/app.types'
import EventCard from '@/components/public/EventCard'

type FilterValue = 'all' | 'workshop' | 'event' | 'cohort'

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All',       value: 'all' },
  { label: 'Workshops', value: 'workshop' },
  { label: 'Events',    value: 'event' },
  { label: 'Cohorts',   value: 'cohort' },
]

interface EventsFilterGridProps {
  events: Event[]
}

export default function EventsFilterGrid({ events }: EventsFilterGridProps) {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()
  const filter = (searchParams.get('filter') ?? 'all') as FilterValue

  const filtered = useMemo(() => {
    if (filter === 'all') return events
    return events.filter((e) => e.type === filter)
  }, [events, filter])

  function setFilter(f: FilterValue) {
    const params = new URLSearchParams(searchParams.toString())
    if (f === 'all') params.delete('filter')
    else             params.set('filter', f)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors duration-200 ${
              filter === value
                ? 'bg-brand-accent text-white border-brand-accent'
                : 'border-brand-muted/30 text-brand-muted hover:border-brand-accent/50 hover:text-brand-light'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-20 text-brand-muted">No events match this filter.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </div>
  )
}
