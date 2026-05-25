import { Suspense } from 'react'
import { getPublishedProjects } from '@/lib/supabase/queries/projects'
import ProjectsFilterGrid from '@/components/public/ProjectsFilterGrid'

export const metadata = {
  title: 'Projects | skillIT',
  description: 'Real automation workflows built by skillIT fellows — saving hours, cutting costs, running 24/7.',
}

export default async function ProjectsPage() {
  const projects = await getPublishedProjects(100)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12">
        <p className="text-[#7dd3da] text-sm font-semibold tracking-widest uppercase mb-3">
          Automation Portfolio
        </p>
        <h1 className="text-4xl md:text-5xl font-display font-black text-brand-light">
          Built by our fellows
        </h1>
        <p className="mt-4 text-gray-400 max-w-xl">
          Real automation workflows saving hours every day — built with Make.com and n8n by skillIT interns and specialists.
        </p>
      </div>

      {projects.length === 0 ? (
        <p className="text-center py-20 text-brand-muted">Projects coming soon.</p>
      ) : (
        <Suspense fallback={null}>
          <ProjectsFilterGrid projects={projects} />
        </Suspense>
      )}
    </div>
  )
}
