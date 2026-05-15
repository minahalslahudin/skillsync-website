import { createServerClient } from '@/lib/supabase/server'

export type TeamMemberWithUser = {
  id: string
  user_id: string
  is_public: boolean
  display_order: number
  custom_title: string | null
  users: {
    full_name: string
    avatar_url: string | null
    role: string
    department: string | null
    bio: string | null
    linkedin: string | null
    github: string | null
    portfolio: string | null
  }
}

export async function getPublicTeamMembers(): Promise<TeamMemberWithUser[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('team_members')
    .select(`
      id,
      user_id,
      is_public,
      display_order,
      custom_title,
      users (
        full_name,
        avatar_url,
        role,
        department,
        bio,
        linkedin,
        github,
        portfolio
      )
    `)
    .eq('is_public', true)
    .order('display_order', { ascending: true })
  if (error) console.error('[users] getPublicTeamMembers:', error.message)
  return (data as unknown as TeamMemberWithUser[]) ?? []
}

export async function getAllTeamMembers(): Promise<TeamMemberWithUser[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('team_members')
    .select(`
      id,
      user_id,
      is_public,
      display_order,
      custom_title,
      users (
        full_name,
        avatar_url,
        role,
        department,
        bio,
        linkedin,
        github,
        portfolio
      )
    `)
    .order('display_order', { ascending: true })
  if (error) console.error('[users] getAllTeamMembers:', error.message)
  return (data as unknown as TeamMemberWithUser[]) ?? []
}

export type DepartmentUser = {
  id: string
  full_name: string
  email: string
  role: string
  department: string | null
  avatar_url: string | null
  joined_at: string
  warning_count: number
}

export type VolunteerRow = {
  id: string
  full_name: string
  email: string
  avatar_url: string | null
  role: string
  department: string | null
  status: string
  warning_count: number
  joined_at: string
  skills: string[]
  last_report_date: string | null
}

export async function getAllUsers(): Promise<VolunteerRow[]> {
  const supabase = createServerClient()
  const [usersRes, reportsRes] = await Promise.all([
    supabase
      .from('users')
      .select('id, full_name, email, avatar_url, role, department, status, warning_count, joined_at, skills')
      .order('joined_at', { ascending: false }),
    supabase
      .from('reports')
      .select('user_id, week_ending')
      .order('week_ending', { ascending: false }),
  ])
  if (usersRes.error) console.error('[users] getAllUsers:', usersRes.error.message)

  const latestByUser: Record<string, string> = {}
  for (const r of (reportsRes.data ?? []) as Array<{ user_id: string; week_ending: string }>) {
    if (!latestByUser[r.user_id]) latestByUser[r.user_id] = r.week_ending
  }

  return ((usersRes.data ?? []) as Omit<VolunteerRow, 'last_report_date'>[]).map((u) => ({
    ...u,
    skills: (u.skills as string[]) ?? [],
    last_report_date: latestByUser[u.id] ?? null,
  }))
}

export async function getDepartmentUsers(
  department: string,
  excludeUserId: string,
): Promise<DepartmentUser[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, email, role, department, avatar_url, joined_at, warning_count')
    .eq('department', department)
    .neq('id', excludeUserId)
    .order('role', { ascending: true })
  if (error) console.error('[users] getDepartmentUsers:', error.message)
  return (data as DepartmentUser[]) ?? []
}
