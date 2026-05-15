'use client'

import { useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import type { Event } from '@/lib/types/app.types'
import WorkshopCard from '@/components/public/WorkshopCard'

type FilterValue = 'all' | 'upcoming' | 'completed' | 'free' | 'paid'

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All',       value: 'all' },
  { label: 'Upcoming',  value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
  { label: 'Free',      value: 'free' },
  { label: 'Paid',      value: 'paid' },
]

interface WorkshopsFilterGridProps {
  workshops: Event[]
}

export default function WorkshopsFilterGrid({ workshops }: WorkshopsFilterGridProps) {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()
  const filter = (searchParams.get('filter') ?? 'all') as FilterValue

  const filtered = useMemo(() => {
    const now = new Date()
    switch (filter) {
      case 'upcoming':  return workshops.filter((w) => w.date && new Date(w.date) > now)
      case 'completed': return workshops.filter((w) => w.date && new Date(w.date) <= now)
      case 'free':      return workshops.filter((w) => !w.is_paid)
      case 'paid':      return workshops.filter((w) => w.is_paid)
      default:          return workshops
    }
  }, [workshops, filter])

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
        <p className="text-center py-20 text-brand-muted">No workshops match this filter.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((w) => <WorkshopCard key={w.id} event={w} />)}
        </div>
      )}
    </div>
  )
}
