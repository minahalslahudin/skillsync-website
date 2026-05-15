'use client'

import { useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import type { Project } from '@/lib/types/app.types'
import ProjectCard from '@/components/public/ProjectCard'

type FilterValue = 'all' | 'skillit' | 'skillsync' | 'ongoing'

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All',       value: 'all' },
  { label: 'skillIT',   value: 'skillit' },
  { label: 'skillSYNC', value: 'skillsync' },
  { label: 'Ongoing',   value: 'ongoing' },
]

interface ProjectsFilterGridProps {
  projects: Project[]
}

export default function ProjectsFilterGrid({ projects }: ProjectsFilterGridProps) {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()
  const filter = (searchParams.get('filter') ?? 'all') as FilterValue

  const filtered = useMemo(() => {
    switch (filter) {
      case 'skillit':   return projects.filter((p) => p.brand === 'skillit')
      case 'skillsync': return projects.filter((p) => p.brand === 'skillsync')
      case 'ongoing':   return projects.filter((p) => p.is_ongoing)
      default:          return projects
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
        <p className="text-center py-20 text-brand-muted">No projects match this filter.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  )
}
