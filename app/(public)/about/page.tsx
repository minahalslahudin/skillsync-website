import { Suspense } from 'react'
import Link from 'next/link'
import { getPublicTeamMembers } from '@/lib/supabase/queries/users'
import TeamSection from '@/components/public/TeamSection'
import SectionHeader from '@/components/public/SectionHeader'

const VALUES = [
  { title: 'Learn By Doing',   body: 'The best education comes from building real things. Every workshop, cohort, and project is hands-on.' },
  { title: 'Community First',  body: 'We grow together. Our volunteers, mentors, and alumni are the backbone of everything we do.' },
  { title: 'Radical Inclusion',body: 'Tech skills should be accessible to everyone — regardless of background, location, or means.' },
  { title: 'Ship It',          body: 'We value execution. Ideas are worthless without action; we help people take ideas all the way to deploy.' },
]

async function TeamPreview() {
  const members = await getPublicTeamMembers()
  return <TeamSection members={members.slice(0, 6)} />
}

export default function AboutPage() {
  return (
    <>
      <SectionHeader
        eyebrow="About Us"
        title="Two Brands. One Mission."
        subtitle="skillIT is our digital agency — building products for real clients. skillSYNC is our training platform — teaching young people the skills to build them. Together, we create a cycle: learn, build, grow."
      >
        <div className="flex items-center gap-3 flex-wrap mt-4">
          <Link href="/join" className="btn-ed-primary btn-ed-sm">Join us</Link>
          <Link href="/contact" className="btn-ed-outline btn-ed-sm">Get in touch</Link>
        </div>
      </SectionHeader>

      {/* Values — 4-col bordered grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b-[3px] border-black bg-white">
        {VALUES.map((v, i) => (
          <div
            key={v.title}
            className={[
              'p-6 sm:p-8 border-b-[3px] border-black',
              'sm:[&:nth-child(odd)]:border-r-[3px] sm:[&:nth-child(odd)]:border-black',
              'lg:!border-r-[3px] lg:border-black lg:[&:last-child]:!border-r-0',
              i >= VALUES.length - 2 ? 'sm:border-b-0' : '',
              i >= VALUES.length - 1 ? 'sm:border-b-0' : '',
            ].join(' ')}
          >
            <div className="font-editorial text-red text-[2.5rem] leading-none">0{i + 1}</div>
            <h3 className="font-editorial text-black text-[1.4rem] tracking-[1px] mt-3">{v.title.toUpperCase()}</h3>
            <p className="text-[0.85rem] text-[color:var(--color-gray-dark)] leading-[1.7] mt-2">{v.body}</p>
          </div>
        ))}
      </div>

      {/* Story */}
      <SectionHeader
        eyebrow="Our Story"
        title="How We Got Here"
      />
      <div className="p-6 sm:p-10 border-b-[3px] border-black bg-white">
        <div className="max-w-3xl mx-auto flex flex-col gap-5 text-[color:var(--color-gray-dark)] leading-[1.85]">
          <p>
            skillSYNC started as a small study group — a handful of students who wanted to learn web development
            but couldn&apos;t find affordable, practical resources. We started running workshops, sharing what we
            learned, and inviting others to contribute.
          </p>
          <p>
            As the community grew, so did the demand for actual projects. skillIT was born to give our best
            students a place to apply their skills on real client work — and get paid for it. Today, both brands
            operate as complementary parts of the same ecosystem.
          </p>
          <p>
            We&apos;re run entirely by volunteers. Every coach, designer, developer, and organiser does this because
            they believe in what we&apos;re building.
          </p>
        </div>
      </div>

      {/* Team preview */}
      <SectionHeader
        eyebrow="Our People"
        title="Meet The Team"
        href="/team"
        linkLabel="Full team"
      />
      <div className="p-6 sm:p-10 border-b-[3px] border-black bg-white">
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="border-[3px] border-black h-72 animate-pulse bg-[color:var(--color-off-white)]" />)}
          </div>
        }>
          <TeamPreview />
        </Suspense>
      </div>
    </>
  )
}
