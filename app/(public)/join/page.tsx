import VolunteerApplicationForm from '@/components/forms/VolunteerApplicationForm'

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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

      {/* Application form */}
      <div className="max-w-3xl mx-auto rounded-2xl border border-brand-muted/20 bg-brand-mid p-8">
        <h2 className="text-xl font-display font-bold text-brand-light mb-1">Apply now</h2>
        <p className="text-sm text-brand-muted mb-8">Takes about 5 minutes. We review every application personally.</p>
        <VolunteerApplicationForm />
      </div>
    </div>
  )
}
