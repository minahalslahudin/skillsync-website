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

interface EventsFilterGridProps { events: Event[] }

export default function EventsFilterGrid({ events }: EventsFilterGridProps) {
  const router       = useRouter()
  const pathname     = usePathname()
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
      <div className="inline-flex flex-wrap">
        {FILTERS.map(({ label, value }, i) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={[
              'px-4 py-2 text-[0.78rem] uppercase tracking-[1px] font-semibold border-[3px] border-black transition-colors',
              i > 0 ? 'border-l-0' : '',
              filter === value
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-[color:var(--color-off-white)]',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-20 text-[color:var(--color-gray-mid)] uppercase tracking-[2px] text-sm">
          No events match this filter.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </div>
  )
}
