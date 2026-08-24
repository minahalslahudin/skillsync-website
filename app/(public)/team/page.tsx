import { getPublicTeamMembers } from '@/lib/supabase/queries/users'
import TeamSection from '@/components/public/TeamSection'
import SectionHeader from '@/components/public/SectionHeader'

export const metadata = {
  title: 'Team | skillSYNC',
  description: 'The people building skillSYNC and skillIT.',
}

export default async function TeamPage() {
  const members = await getPublicTeamMembers()

  return (
    <>
      <SectionHeader
        eyebrow="Our People"
        title="Meet The Team"
        subtitle={`${members.length > 0 ? members.length + ' members. ' : ''}The people building skillSYNC and skillIT.`}
      />

      <div className="p-6 sm:p-10 border-b-[3px] border-black bg-white">
        <TeamSection members={members} />
      </div>
    </>
  )
}
