import { Suspense } from 'react'
import Link from 'next/link'
import { getPublicTeamMembers } from '@/lib/supabase/queries/users'
import TeamSection from '@/components/public/TeamSection'
import { SkeletonCard } from '@/components/ui/Skeleton'

const VALUES = [
  { title: 'Learn by doing',   body: 'We believe the best education comes from building real things. Every workshop, cohort, and project is hands-on.' },
  { title: 'Community first',  body: 'We grow together. Our volunteers, mentors, and alumni are the backbone of everything we do.' },
  { title: 'Radical inclusion', body: 'Tech skills should be accessible to everyone — regardless of background, location, or financial situation.' },
  { title: 'Ship it',          body: 'We value execution. Ideas are worthless without action; we help people take ideas all the way to deployment.' },
]

async function TeamPreview() {
  const members = await getPublicTeamMembers()
  return <TeamSection members={members.slice(0, 8)} />
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-brand-accent text-sm font-semibold tracking-widest uppercase mb-4">About us</p>
        <h1 className="text-5xl md:text-6xl font-display font-black text-brand-light leading-tight">
          Two brands. <br className="hidden sm:block" />
          One mission.
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          <span className="text-brand-light font-semibold">skillIT</span> is our digital agency — building web products for real clients.{' '}
          <span className="text-brand-light font-semibold">skillSYNC</span> is our training platform — teaching young people the skills to build them. Together, we create a cycle: learn, build, grow.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link href="/join" className="px-6 py-3 rounded-lg bg-brand-accent text-white font-semibold text-sm hover:bg-brand-accent/90 transition-colors">
            Join us
          </Link>
          <Link href="/contact" className="px-6 py-3 rounded-lg border border-brand-muted/30 text-brand-light font-semibold text-sm hover:border-brand-accent/50 transition-colors">
            Get in touch
          </Link>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-darker/50 border-t border-brand-muted/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-light text-center mb-12">
            What we stand for
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ title, body }) => (
              <div key={title} className="rounded-xl border border-brand-muted/20 bg-brand-mid p-6">
                <h3 className="font-display font-semibold text-brand-accent mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-display font-bold text-brand-light mb-6">Our story</h2>
        <div className="flex flex-col gap-4 text-gray-400 leading-relaxed">
          <p>
            skillSYNC started as a small study group — a handful of students who wanted to learn web development but couldn&apos;t find affordable, practical resources. We started running workshops, sharing what we learned, and inviting others to contribute.
          </p>
          <p>
            As the community grew, so did the demand for actual projects. skillIT was born to give our best students a place to apply their skills on real client work — and get paid for it. Today, both brands operate as complementary parts of the same ecosystem.
          </p>
          <p>
            We&apos;re run entirely by volunteers. Every coach, designer, developer, and organiser does this because they believe in what we&apos;re building.
          </p>
        </div>
      </section>

      {/* Team preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-brand-muted/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <h2 className="text-3xl font-display font-bold text-brand-light">Meet the team</h2>
          <Link href="/team" className="text-sm font-semibold text-brand-accent hover:underline">
            Full team →
          </Link>
        </div>
        <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>}>
          <TeamPreview />
        </Suspense>
      </section>
    </>
  )
}
