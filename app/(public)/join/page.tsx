import VolunteerApplicationForm from '@/components/forms/VolunteerApplicationForm'
import OpenPositions from '@/components/public/OpenPositions'

const BENEFIT_CARDS = [
  {
    icon: '📜',
    title: 'Earn certificates',
    description: 'Receive verified certificates for contributions and completed milestones on your profile.',
  },
  {
    icon: '🛠️',
    title: 'Build real skills',
    description: 'Work on live projects across design, dev, marketing, and operations. Portfolio-worthy experience.',
  },
  {
    icon: '🌍',
    title: 'Join the community',
    description: 'Connect with 200+ alumni, mentors, and peers actively building careers and companies.',
  },
]

const ROADMAP_STAGES = [
  {
    icon: '🌱',
    name: 'Volunteer',
    duration: '3 months',
    description: 'Start by contributing to real projects. Learn how we work, build your portfolio, and prove your commitment.',
  },
  {
    icon: '🚀',
    name: 'Intern',
    duration: '3 months',
    description: 'Step up to a structured internship. You get a stipend, a defined role, and direct mentorship.',
  },
  {
    icon: '⭐',
    name: 'Permanent (Paid)',
    duration: 'Ongoing',
    description: "Full paid role at skillSYNC. You've earned it — now grow with the company.",
  },
]

export const metadata = {
  title: 'Join skillSYNC | Apply to Volunteer',
  description: 'Apply to become a skillSYNC volunteer and gain real-world experience, certificates, and community.',
}

export default function JoinPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-brand-accent text-sm font-semibold tracking-widest uppercase mb-4">Join us</p>
        <h1 className="text-4xl md:text-5xl font-display font-black text-brand-light leading-tight">
          Join skillSYNC
        </h1>
        <p className="mt-5 text-gray-400 leading-relaxed">
          We&apos;re always looking for passionate people. Whether you&apos;re a developer, designer, marketer,
          or content creator — there&apos;s a place for you here.
        </p>
      </div>

      {/* Benefit cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {BENEFIT_CARDS.map(({ icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-brand-muted/20 bg-brand-mid p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(233,69,96,0.15)] hover:border-brand-accent/40"
          >
            <span className="text-3xl">{icon}</span>
            <h3 className="text-base font-display font-semibold text-brand-light">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
          </div>
        ))}
      </div>

      {/* Career Roadmap */}
      <section className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-brand-accent text-xs font-semibold tracking-widest uppercase mb-3">Your career path</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-light">
            From volunteer to paid role
          </h2>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            A clear progression. Prove yourself, get supported, and grow into a full paid position.
          </p>
        </div>

        <div className="rounded-2xl border border-brand-muted/20 bg-brand-darker/40 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-2">
            {ROADMAP_STAGES.map((stage, idx) => (
              <div key={stage.name} className="flex flex-col lg:flex-row items-stretch flex-1 gap-4 lg:gap-2">
                {/* Stage card */}
                <div className="flex-1 rounded-xl border-2 border-brand-accent/30 bg-brand-mid p-5 sm:p-6 flex flex-col gap-3 relative transition-all duration-300 hover:border-brand-accent hover:shadow-[0_0_25px_rgba(233,69,96,0.15)]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-3xl sm:text-4xl">{stage.icon}</span>
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-accent/15 border border-brand-accent/40 text-brand-accent">
                      {stage.duration}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-mono text-brand-accent/70">0{idx + 1}</span>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-brand-light">
                      {stage.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{stage.description}</p>
                </div>

                {/* Connector arrow */}
                {idx < ROADMAP_STAGES.length - 1 && (
                  <div className="flex items-center justify-center flex-shrink-0 py-1 lg:py-0 lg:px-1">
                    {/* Mobile arrow (down) */}
                    <span className="lg:hidden text-brand-accent text-2xl" aria-hidden="true">↓</span>
                    {/* Desktop arrow (right) */}
                    <span className="hidden lg:inline text-brand-accent text-3xl" aria-hidden="true">→</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Stipend note */}
          <div className="mt-6 pt-6 border-t border-brand-muted/20 flex items-start gap-3">
            <span className="text-brand-accent text-lg flex-shrink-0">💸</span>
            <p className="text-sm text-gray-400 leading-relaxed">
              <span className="text-brand-light font-medium">All volunteer and intern roles are stipend-based.</span>{' '}
              Permanent roles are fully paid.
            </p>
          </div>
        </div>
      </section>

      {/* Commitment callout */}
      <div className="mb-14 rounded-xl border border-amber-500/40 bg-amber-500/10 p-5 max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          <span className="text-amber-400 text-xl flex-shrink-0">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-amber-300">Time commitment: 20 hrs / week</p>
            <p className="text-sm text-amber-200/70 mt-0.5">
              All volunteers are expected to commit a minimum of 20 hours per week.
              Please only apply if you can honour this commitment.
            </p>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <section className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-brand-accent text-xs font-semibold tracking-widest uppercase mb-3">We&apos;re hiring</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-light">
            Open Positions
          </h2>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            Find your fit. Every role is open to volunteers, interns, and experienced applicants.
          </p>
        </div>
        <OpenPositions />
      </section>

      {/* Application form */}
      <div className="max-w-3xl mx-auto rounded-2xl border border-brand-muted/20 bg-brand-mid p-8">
        <h2 className="text-xl font-display font-bold text-brand-light mb-1">Apply now</h2>
        <p className="text-sm text-brand-muted mb-8">Takes about 5 minutes. We review every application personally.</p>
        <VolunteerApplicationForm />
      </div>
    </div>
  )
}
