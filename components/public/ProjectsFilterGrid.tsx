'use client'

import { useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import type { Project } from '@/lib/types/app.types'
import ProjectCard from '@/components/public/ProjectCard'

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
      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors duration-200 ${
              filter === value
                ? 'bg-[#0F6B7A] text-white border-[#0F6B7A]'
                : 'border-brand-muted/30 text-brand-muted hover:border-[#0F6B7A]/50 hover:text-brand-light'
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
