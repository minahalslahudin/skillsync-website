import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getAllUsers } from '@/lib/supabase/queries/users'
import VolunteerTable from '@/components/admin/VolunteerTable'

export default async function AdminVolunteersPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/dashboard')

  const volunteers = await getAllUsers()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-display font-bold text-brand-light">Volunteers</h2>
        <p className="text-gray-400 mt-1">{volunteers.length} total members</p>
      </div>
      <VolunteerTable initialVolunteers={volunteers} currentUserId={user.id} />
    </div>
  )
}
