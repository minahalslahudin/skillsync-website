import { getPublicTeamMembers } from '@/lib/supabase/queries/users'
import TeamSection from '@/components/public/TeamSection'

export const metadata = {
  title: 'Team | skillSYNC',
  description: 'The people building skillSYNC and skillIT.',
}

export default async function TeamPage() {
  const members = await getPublicTeamMembers()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12 text-center">
        <p className="text-brand-accent text-sm font-semibold tracking-widest uppercase mb-3">Our people</p>
        <h1 className="text-4xl md:text-5xl font-display font-black text-brand-light">
          Meet the Team
        </h1>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto">
          The people building skillSYNC and skillIT.
        </p>
        {members.length > 0 && (
          <p className="mt-2 text-sm text-brand-muted">
            {members.length} members
          </p>
        )}
      </div>

      <TeamSection members={members} />
    </div>
  )
}
