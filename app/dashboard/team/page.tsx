import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getAllTeamMembers } from '@/lib/supabase/queries/users'
import { Table, Thead, Tbody, Th, Tr } from '@/components/ui/Table'
import TeamMemberRow from '@/components/dashboard/TeamMemberRow'

const ALLOWED_ROLES = ['Lead', 'C-Suite', 'Admin']

export default async function TeamPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !ALLOWED_ROLES.includes(profile.role as string)) {
    redirect('/dashboard')
  }

  const members = await getAllTeamMembers()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-brand-light">Team</h2>
        <p className="text-gray-400 mt-1">All {members.length} team members.</p>
      </div>

      <Table>
        <Thead>
          <Tr>
            <Th>Member</Th>
            <Th>Role / Title</Th>
            <Th>Department</Th>
            <Th>Links</Th>
          </Tr>
        </Thead>
        <Tbody>
          {members.map((m) => <TeamMemberRow key={m.id} member={m} />)}
        </Tbody>
      </Table>
    </div>
  )
}
