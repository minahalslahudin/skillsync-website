import { Suspense } from 'react'
import { getPublishedProjects } from '@/lib/supabase/queries/projects'
import ProjectsFilterGrid from '@/components/public/ProjectsFilterGrid'
import SectionHeader from '@/components/public/SectionHeader'

export const metadata = {
  title: 'Projects | skillIT',
  description: 'Real automation workflows built by skillIT fellows — saving hours, cutting costs, running 24/7.',
}

export default async function ProjectsPage() {
  const projects = await getPublishedProjects(100)

  return (
    <>
      <SectionHeader
        eyebrow="Automation Portfolio"
        title="Built By Our Fellows"
        subtitle="Real automation workflows saving hours every day — built with Make.com and n8n by skillIT interns and specialists."
      />

      <div className="p-6 sm:p-10 border-b-[3px] border-black bg-white">
        {projects.length === 0 ? (
          <p className="text-center py-20 text-[color:var(--color-gray-mid)] uppercase tracking-[2px] text-sm">
            Projects coming soon.
          </p>
        ) : (
          <Suspense fallback={null}>
            <ProjectsFilterGrid projects={projects} />
          </Suspense>
        )}
      </div>
    </>
  )
}
