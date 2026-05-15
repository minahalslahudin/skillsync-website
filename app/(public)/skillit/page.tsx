import { Suspense } from 'react'
import Link from 'next/link'
import { getPublishedProjects } from '@/lib/supabase/queries/projects'
import ProjectCard from '@/components/public/ProjectCard'
import { SkeletonCard } from '@/components/ui/Skeleton'

const SERVICES = [
  { icon: '🌐', title: 'Web Development',   body: 'Custom websites and web apps built with modern stacks — Next.js, React, and more.' },
  { icon: '🎨', title: 'UI/UX Design',      body: 'User-centred design from wireframes to polished, production-ready interfaces.' },
  { icon: '📱', title: 'Mobile Apps',       body: 'Cross-platform mobile experiences using React Native.' },
  { icon: '☁️', title: 'Cloud & DevOps',   body: 'Deployment, CI/CD pipelines, and infrastructure on Vercel, AWS, and GCP.' },
  { icon: '🤖', title: 'AI Integration',    body: 'LLM-powered features, chatbots, and data pipelines for modern products.' },
  { icon: '📊', title: 'Data & Analytics', body: 'Dashboards, reporting tools, and data visualisation tailored to your business.' },
]

async function FeaturedProjects() {
  const projects = await getPublishedProjects(3)
  if (projects.length === 0) return null
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
    </div>
  )
}

export default function SkillitPage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F6B7A]/20 border border-[#0F6B7A]/40 text-[#0F6B7A] text-xs font-semibold uppercase tracking-wider mb-6">
          skillIT Agency
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-black text-brand-light leading-tight">
          We build digital{' '}
          <span className="text-[#0F6B7A]">products</span>{' '}
          that matter.
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl leading-relaxed">
          skillIT is a student-run digital agency delivering professional web development, design, and tech solutions. We work with startups, NGOs, and established businesses who want results without enterprise price tags.
        </p>
        <div className="flex items-center gap-4 mt-8">
          <Link
            href="/contact"
            className="px-6 py-3 rounded-lg bg-[#0F6B7A] text-white font-semibold text-sm hover:bg-[#0F6B7A]/90 transition-colors"
          >
            Start a project
          </Link>
          <Link
            href="/projects"
            className="px-6 py-3 rounded-lg border border-brand-muted/30 text-brand-light font-semibold text-sm hover:border-[#0F6B7A]/50 transition-colors"
          >
            View portfolio
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="bg-brand-darker/50 border-t border-brand-muted/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-light text-center mb-12">
            What we do
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(({ icon, title, body }) => (
              <div key={title} className="rounded-xl border border-brand-muted/20 bg-brand-mid p-6 hover:border-[#0F6B7A]/40 transition-colors">
                <span className="text-3xl">{icon}</span>
                <h3 className="font-display font-semibold text-brand-light mt-3 mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-3xl font-display font-bold text-brand-light">Featured work</h2>
          <Link href="/projects" className="text-sm font-semibold text-brand-accent hover:underline">
            All projects →
          </Link>
        </div>
        <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-6">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>}>
          <FeaturedProjects />
        </Suspense>
      </section>

      {/* CTA */}
      <section className="bg-brand-darker/60 border-t border-brand-muted/10 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-brand-light mb-4">
            Ready to build something?
          </h2>
          <p className="text-gray-400 mb-8">
            Tell us about your project and we&apos;ll get back to you within 48 hours.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 rounded-lg bg-[#0F6B7A] text-white font-semibold hover:bg-[#0F6B7A]/90 transition-colors"
          >
            Get a free quote
          </Link>
        </div>
      </section>
    </>
  )
}
