import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getDepartmentUsers } from '@/lib/supabase/queries/users'
import { getReportsThisMonth } from '@/lib/supabase/queries/reports'
import TeamView from '@/components/dashboard/TeamView'

const ALLOWED_ROLES = ['Lead', 'C-Suite', 'Admin']

async function getMemberLastActive(userId: string): Promise<string | null> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('reports')
    .select('week_ending')
    .eq('user_id', userId)
    .order('week_ending', { ascending: false })
    .limit(1)
    .single()
  return data?.week_ending ?? null
}

async function getMemberPendingTasks(userId: string): Promise<number> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('tasks')
    .select('status')
    .eq('assigned_to', userId)
    .in('status', ['not_started', 'in_progress', 'overdue'])
  return data?.length ?? 0
}

export default async function TeamPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('role, department')
    .eq('id', user.id)
    .single()

  if (!profile || !ALLOWED_ROLES.includes(profile.role as string)) {
    redirect('/dashboard')
  }

  const department = profile.department as string | null
  if (!department) redirect('/dashboard')

  const members = await getDepartmentUsers(department, user.id)

  const statsEntries = await Promise.all(
    members.map(async (m) => {
      const [lastActive, reportsMonth, tasksPending] = await Promise.all([
        getMemberLastActive(m.id),
        getReportsThisMonth(m.id),
        getMemberPendingTasks(m.id),
      ])
      return [m.id, { lastActive, reportsMonth, tasksPending }] as const
    })
  )

  const stats = Object.fromEntries(statsEntries)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-brand-light">My Team</h2>
        <p className="text-gray-400 mt-1">{department} — {members.length} member{members.length !== 1 ? 's' : ''}</p>
      </div>
      <TeamView members={members} stats={stats} />
    </div>
  )
}
