import { Suspense } from 'react'
import Link from 'next/link'
import { getPublishedProjects } from '@/lib/supabase/queries/projects'
import ProjectCard from '@/components/public/ProjectCard'
import SectionHeader from '@/components/public/SectionHeader'
import Ticker from '@/components/public/Ticker'

const SERVICES = [
  { title: 'Web Development',  body: 'Custom websites and web apps built with modern stacks — Next.js, React, and more.' },
  { title: 'UI/UX Design',     body: 'User-centred design from wireframes to polished, production-ready interfaces.' },
  { title: 'Mobile Apps',      body: 'Cross-platform mobile experiences using React Native.' },
  { title: 'Cloud & DevOps',   body: 'Deployment, CI/CD pipelines, infrastructure on Vercel, AWS, and GCP.' },
  { title: 'AI Integration',   body: 'LLM-powered features, chatbots, and data pipelines for modern products.' },
  { title: 'Data & Analytics', body: 'Dashboards, reporting tools, data visualisation tailored to your business.' },
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
      <SectionHeader
        eyebrow="skillIT Agency"
        title="We Build Digital Products That Matter."
        subtitle="A student-run digital agency delivering professional web development, design, and tech solutions. We work with startups, NGOs, and established businesses who want results without enterprise price tags."
      >
        <div className="flex items-center gap-3 flex-wrap mt-4">
          <Link href="/contact" className="btn-ed-primary btn-ed-sm">Start a project</Link>
          <Link href="/projects" className="btn-ed-outline btn-ed-sm">View portfolio</Link>
        </div>
      </SectionHeader>

      <Ticker
        items={['Next.js', 'React', 'React Native', 'Supabase', 'Vercel', 'AWS', 'GCP', 'LangChain', 'OpenAI']}
        variant="black"
      />

      {/* Services — 6 in a 3-col bordered grid */}
      <SectionHeader eyebrow="What We Do" title="Our Services" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-b-[3px] border-black bg-white">
        {SERVICES.map((s, i) => (
          <div
            key={s.title}
            className={[
              'p-6 sm:p-8 border-b-[3px] border-black',
              'sm:[&:nth-child(odd)]:border-r-[3px] sm:[&:nth-child(odd)]:border-black',
              'lg:!border-r-[3px] lg:border-black lg:[&:nth-child(3n)]:!border-r-0',
              i >= SERVICES.length - 3 ? 'lg:border-b-0' : '',
            ].join(' ')}
          >
            <div className="font-editorial text-red text-[2.5rem] leading-none">0{i + 1}</div>
            <h3 className="font-editorial text-black text-[1.4rem] tracking-[1px] mt-3">{s.title.toUpperCase()}</h3>
            <p className="text-[0.85rem] text-[color:var(--color-gray-dark)] leading-[1.7] mt-2">{s.body}</p>
          </div>
        ))}
      </div>

      {/* Featured projects */}
      <SectionHeader
        eyebrow="Selected Work"
        title="Recent Projects"
        href="/projects"
        linkLabel="All projects"
      />
      <div className="p-6 sm:p-10 border-b-[3px] border-black bg-white">
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="border-[3px] border-black h-64 animate-pulse bg-[color:var(--color-off-white)]" />)}
          </div>
        }>
          <FeaturedProjects />
        </Suspense>
      </div>

      {/* CTA panel */}
      <div className="p-8 sm:p-16 border-b-[3px] border-black bg-black text-white text-center">
        <h2 className="font-editorial text-white text-[3rem] sm:text-[4.5rem] leading-[0.95] tracking-[2px]">
          READY TO BUILD SOMETHING?
        </h2>
        <p className="mt-4 text-white/75 max-w-xl mx-auto">
          Tell us about your project and we&apos;ll get back to you within 48 hours.
        </p>
        <Link href="/contact" className="btn-ed-red mt-8 inline-flex">
          Get a free quote →
        </Link>
      </div>
    </>
  )
}
