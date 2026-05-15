import { Suspense } from 'react'
import { getPublishedProjects } from '@/lib/supabase/queries/projects'
import ProjectsFilterGrid from '@/components/public/ProjectsFilterGrid'

export const metadata = {
  title: 'Projects | skillIT',
  description: 'Real products built by our fellows — from concept to deployment.',
}

export default async function ProjectsPage() {
  const projects = await getPublishedProjects(100)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12">
        <p className="text-brand-accent text-sm font-semibold tracking-widest uppercase mb-3">
          Projects
        </p>
        <h1 className="text-4xl md:text-5xl font-display font-black text-brand-light">
          What we&apos;ve built
        </h1>
        <p className="mt-4 text-gray-400 max-w-xl">
          Real products built by our fellows — from concept to deployment.
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
