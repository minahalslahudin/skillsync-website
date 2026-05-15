import VolunteerApplicationForm from '@/components/forms/VolunteerApplicationForm'

const PERKS = [
  { emoji: '🛠️', text: 'Work on real projects with real impact' },
  { emoji: '📚', text: 'Free access to all workshops and cohorts' },
  { emoji: '🤝', text: 'Mentorship from industry professionals' },
  { emoji: '📜', text: 'Certificates and achievements on your profile' },
  { emoji: '🌍', text: 'A thriving community of 200+ alumni' },
  { emoji: '💼', text: 'Portfolio-worthy experience for your CV' },
]

export default function JoinPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: pitch */}
        <div>
          <p className="text-brand-accent text-sm font-semibold tracking-widest uppercase mb-4">Join us</p>
          <h1 className="text-4xl md:text-5xl font-display font-black text-brand-light leading-tight">
            Become a skillSYNC volunteer
          </h1>
          <p className="mt-5 text-gray-400 leading-relaxed">
            We&apos;re always looking for passionate people to join our team. Whether you&apos;re a developer, designer, marketer, or content creator — there&apos;s a place for you here.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {PERKS.map(({ emoji, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-gray-400">
                <span className="text-xl flex-shrink-0">{emoji}</span>
                {text}
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 rounded-xl border border-brand-muted/20 bg-brand-mid">
            <p className="text-sm font-medium text-brand-light mb-1">Time commitment</p>
            <p className="text-sm text-gray-400">
              We ask for a minimum of 4–6 hours per week. Most roles are flexible and async-friendly.
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="rounded-2xl border border-brand-muted/20 bg-brand-mid p-8">
          <h2 className="text-xl font-display font-bold text-brand-light mb-6">Apply now</h2>
          <VolunteerApplicationForm />
        </div>
      </div>
    </div>
  )
}
