import VolunteerApplicationForm from '@/components/forms/VolunteerApplicationForm'
import OpenPositions from '@/components/public/OpenPositions'
import SectionHeader from '@/components/public/SectionHeader'
import Ticker from '@/components/public/Ticker'

// Editorial-bold /join page.
// Section header → benefit cells → roadmap (3 bordered steps) → open
// positions accordion → application form. Backend/form logic untouched.

const BENEFITS = [
  { title: 'Earn Certificates', body: 'Verified certificates for contributions and completed milestones — pinned to your profile.' },
  { title: 'Build Real Skills', body: 'Live projects across design, dev, marketing, ops — portfolio-worthy from day one.' },
  { title: 'Join The Community', body: 'Connect with 200+ alumni, mentors, and peers building careers and companies.' },
]

const ROADMAP = [
  { stage: '01', name: 'Volunteer',         duration: '3 months', desc: 'Contribute to real projects, learn how we work, build your portfolio, prove your commitment.' },
  { stage: '02', name: 'Intern',            duration: '3 months', desc: 'Structured internship with a stipend, defined role, and direct mentorship.' },
  { stage: '03', name: 'Permanent (Paid)',  duration: 'Ongoing',  desc: "You've earned it — full paid role at skillSYNC. Grow with the company." },
]

export const metadata = {
  title: 'Join skillSYNC | Apply to Volunteer',
  description: 'Apply to become a skillSYNC volunteer and gain real-world experience, certificates, and community.',
}

export default function JoinPage() {
  return (
    <>
      <SectionHeader
        eyebrow="Join Us"
        title="Join skillSYNC"
        subtitle="We're always looking for passionate people. Developer, designer, marketer, content creator — there's a place for you here."
      />

      {/* Benefits — 3-col bordered grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b-[3px] border-black bg-white">
        {BENEFITS.map((b, i) => (
          <div
            key={b.title}
            className={[
              'p-6 sm:p-8 border-b-[3px] border-black md:border-b-0',
              i < BENEFITS.length - 1 ? 'md:border-r-[3px] md:border-black' : '',
            ].join(' ')}
          >
            <div className="font-editorial text-red text-[2.5rem] leading-none">
              0{i + 1}
            </div>
            <h3 className="font-editorial text-black text-[1.4rem] tracking-[1px] mt-3">
              {b.title.toUpperCase()}
            </h3>
            <p className="text-[0.85rem] text-[color:var(--color-gray-dark)] leading-[1.7] mt-2">
              {b.body}
            </p>
          </div>
        ))}
      </div>

      {/* Roadmap header */}
      <SectionHeader
        eyebrow="Your Career Path"
        title="From Volunteer To Paid Role"
        subtitle="A clear progression. Prove yourself, get supported, grow into a full paid position."
      />

      {/* Roadmap — 3 connected bordered boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 border-b-[3px] border-black bg-white">
        {ROADMAP.map((s, i) => (
          <div
            key={s.name}
            className={[
              'p-6 sm:p-8 border-b-[3px] border-black lg:border-b-0 relative',
              i < ROADMAP.length - 1 ? 'lg:border-r-[3px] lg:border-black' : '',
              i === ROADMAP.length - 1 ? 'bg-red text-white' : 'bg-white',
            ].join(' ')}
          >
            <div className="flex items-start justify-between">
              <span className={`font-editorial text-[3rem] leading-none ${i === ROADMAP.length - 1 ? 'text-white' : 'text-red'}`}>
                {s.stage}
              </span>
              <span
                className={[
                  'text-[0.68rem] font-semibold uppercase tracking-[2px] px-2 py-1 border-[2px]',
                  i === ROADMAP.length - 1 ? 'border-white text-white' : 'border-black text-black',
                ].join(' ')}
              >
                {s.duration}
              </span>
            </div>
            <h3 className={`font-editorial text-[1.8rem] tracking-[1px] leading-none mt-4 ${i === ROADMAP.length - 1 ? 'text-white' : 'text-black'}`}>
              {s.name.toUpperCase()}
            </h3>
            <p className={`text-[0.85rem] leading-[1.7] mt-3 ${i === ROADMAP.length - 1 ? 'text-white/85' : 'text-[color:var(--color-gray-dark)]'}`}>
              {s.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Commitment ticker */}
      <Ticker
        items={['20 hrs / week commitment', 'Stipend-based interns', 'Paid permanent roles', '3-month probation', 'Certificates issued']}
        variant="red"
      />

      {/* Open Positions */}
      <SectionHeader
        eyebrow="We're Hiring"
        title="Open Positions"
        subtitle="Find your fit. Every role is open to volunteers, interns, and experienced applicants."
      />
      <div className="p-6 sm:p-10 border-b-[3px] border-black bg-white">
        <OpenPositions />
      </div>

      {/* Application form */}
      <SectionHeader
        eyebrow="Apply Now"
        title="Application Form"
        subtitle="Takes about 5 minutes. We review every application personally."
      />
      <div className="p-6 sm:p-10 border-b-[3px] border-black bg-white">
        <div className="max-w-3xl mx-auto border-[3px] border-black bg-white p-8">
          <VolunteerApplicationForm />
        </div>
      </div>
    </>
  )
}
