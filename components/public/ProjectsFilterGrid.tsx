'use client'

import { useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import type { Project } from '@/lib/types/app.types'
import ProjectCard from '@/components/public/ProjectCard'

// Editorial filter row (see WorkshopsFilterGrid for pattern).

type FilterValue = 'all' | 'make' | 'n8n'

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All',      value: 'all' },
  { label: 'Make.com', value: 'make' },
  { label: 'n8n',      value: 'n8n' },
]

export default function ProjectsFilterGrid({ projects }: { projects: Project[] }) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const filter = (searchParams.get('filter') ?? 'all') as FilterValue

  const filtered = useMemo(() => {
    switch (filter) {
      case 'make': return projects.filter((p) => p.tool === 'Make.com')
      case 'n8n':  return projects.filter((p) => p.tool === 'n8n')
      default:     return projects
    }
  }, [projects, filter])

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
          No projects match this filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  )
}
