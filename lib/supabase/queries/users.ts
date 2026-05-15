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
