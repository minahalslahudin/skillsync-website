import { Suspense } from 'react'
import Link from 'next/link'
import { getPublishedWorkshops } from '@/lib/supabase/queries/events'
import WorkshopCard from '@/components/public/WorkshopCard'
import SectionHeader from '@/components/public/SectionHeader'
import Ticker from '@/components/public/Ticker'

const PROGRAMS = [
  { title: 'Workshops',  body: 'Short, focused sessions on specific tools and skills — from Git basics to full-stack apps.' },
  { title: 'Cohorts',    body: '8–12 week structured programs where you build a real project with a team and mentor.' },
  { title: 'Mentorship', body: 'One-on-one guidance from experienced developers, designers, and founders in our network.' },
  { title: 'Community',  body: 'Slack groups, study sessions, coworking days, alumni network — people who have your back.' },
]

async function FeaturedWorkshops() {
  const workshops = await getPublishedWorkshops(3)
  if (workshops.length === 0) return null
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {workshops.map((w) => <WorkshopCard key={w.id} event={w} />)}
    </div>
  )
}

export default function SkillsyncPage() {
  return (
    <>
      <SectionHeader
        eyebrow="skillSYNC Training"
        title="Skills That Actually Get You Hired."
        subtitle="A community-led training platform teaching practical tech skills through workshops, cohorts, and real projects. We focus on what employers actually want — not just theory."
      >
        <div className="flex items-center gap-3 flex-wrap mt-4">
          <Link href="/workshops" className="btn-ed-primary btn-ed-sm">Browse workshops</Link>
          <Link href="/join" className="btn-ed-outline btn-ed-sm">Join as volunteer</Link>
        </div>
      </SectionHeader>

      <Ticker
        items={['n8n', 'Make.com', 'LLM Engineering', 'Full-Stack', 'Automation', 'Robotics', 'AI Workflows']}
        variant="red"
      />

      {/* Programs */}
      <SectionHeader eyebrow="How We Teach" title="Four Ways In" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b-[3px] border-black bg-white">
        {PROGRAMS.map((p, i) => (
          <div
            key={p.title}
            className={[
              'p-6 sm:p-8 border-b-[3px] border-black',
              'sm:[&:nth-child(odd)]:border-r-[3px] sm:[&:nth-child(odd)]:border-black',
              'lg:!border-r-[3px] lg:border-black lg:[&:last-child]:!border-r-0',
              i >= PROGRAMS.length - 2 ? 'sm:border-b-0' : '',
            ].join(' ')}
          >
            <div className="font-editorial text-red text-[2.5rem] leading-none">0{i + 1}</div>
            <h3 className="font-editorial text-black text-[1.4rem] tracking-[1px] mt-3">{p.title.toUpperCase()}</h3>
            <p className="text-[0.85rem] text-[color:var(--color-gray-dark)] leading-[1.7] mt-2">{p.body}</p>
          </div>
        ))}
      </div>

      {/* Featured workshops */}
      <SectionHeader
        eyebrow="Upcoming"
        title="Featured Workshops"
        href="/workshops"
        linkLabel="All workshops"
      />
      <div className="p-6 sm:p-10 border-b-[3px] border-black bg-white">
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="border-[3px] border-black h-64 animate-pulse bg-[color:var(--color-off-white)]" />)}
          </div>
        }>
          <FeaturedWorkshops />
        </Suspense>
      </div>

      {/* CTA panel */}
      <div className="p-8 sm:p-16 border-b-[3px] border-black bg-red text-white text-center">
        <h2 className="font-editorial text-white text-[3rem] sm:text-[4.5rem] leading-[0.95] tracking-[2px]">
          READY TO LEVEL UP?
        </h2>
        <p className="mt-4 text-white/85 max-w-xl mx-auto">
          Join thousands of learners building real skills with skillSYNC.
        </p>
        <Link href="/events" className="btn-ed-red mt-8 inline-flex">
          See all programmes →
        </Link>
      </div>
    </>
  )
}
