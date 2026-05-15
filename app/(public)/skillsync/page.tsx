import { Suspense } from 'react'
import Link from 'next/link'
import { getPublishedWorkshops } from '@/lib/supabase/queries/events'
import WorkshopCard from '@/components/public/WorkshopCard'
import { SkeletonCard } from '@/components/ui/Skeleton'

const PROGRAMS = [
  { icon: '🧑‍💻', title: 'Workshops',  body: 'Short, focused sessions on specific tools and skills — from Git basics to deploying full-stack apps.' },
  { icon: '🚀', title: 'Cohorts',    body: '8–12 week structured programs where you build a real project with a team and a dedicated mentor.' },
  { icon: '🤝', title: 'Mentorship', body: 'One-on-one guidance from experienced developers, designers, and founders in our network.' },
  { icon: '🌍', title: 'Community',  body: 'Slack groups, study sessions, coworking days, and a network of alumni who have your back.' },
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
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/20 border border-brand-accent/40 text-brand-accent text-xs font-semibold uppercase tracking-wider mb-6">
          skillSYNC Training
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-black text-brand-light leading-tight">
          Skills that{' '}
          <span className="text-brand-accent">actually</span>{' '}
          get you hired.
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl leading-relaxed">
          skillSYNC is a community-led training platform that teaches practical tech skills through workshops, cohorts, and real projects. We focus on what employers actually want — not just theory.
        </p>
        <div className="flex items-center gap-4 mt-8">
          <Link
            href="/workshops"
            className="px-6 py-3 rounded-lg bg-brand-accent text-white font-semibold text-sm hover:bg-brand-accent/90 transition-colors"
          >
            Browse workshops
          </Link>
          <Link
            href="/join"
            className="px-6 py-3 rounded-lg border border-brand-muted/30 text-brand-light font-semibold text-sm hover:border-brand-accent/50 transition-colors"
          >
            Join as volunteer
          </Link>
        </div>
      </section>

      {/* Programs */}
      <section className="bg-brand-darker/50 border-t border-brand-muted/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-light text-center mb-12">
            How we teach
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROGRAMS.map(({ icon, title, body }) => (
              <div key={title} className="rounded-xl border border-brand-muted/20 bg-brand-mid p-6 hover:border-brand-accent/40 transition-colors">
                <span className="text-3xl">{icon}</span>
                <h3 className="font-display font-semibold text-brand-light mt-3 mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured workshops */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-3xl font-display font-bold text-brand-light">Upcoming workshops</h2>
          <Link href="/workshops" className="text-sm font-semibold text-brand-accent hover:underline">
            All workshops →
          </Link>
        </div>
        <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-6">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>}>
          <FeaturedWorkshops />
        </Suspense>
      </section>

      {/* CTA */}
      <section className="bg-brand-darker/60 border-t border-brand-muted/10 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-brand-light mb-4">
            Ready to level up?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of learners building real skills with skillSYNC.
          </p>
          <Link
            href="/events"
            className="inline-block px-8 py-4 rounded-lg bg-brand-accent text-white font-semibold hover:bg-brand-accent/90 transition-colors"
          >
            See all programmes
          </Link>
        </div>
      </section>
    </>
  )
}
