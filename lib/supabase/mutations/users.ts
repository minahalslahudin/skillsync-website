import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Role } from '@/lib/constants/roles'

export async function updateUserProfile(
  userId: string,
  data: {
    full_name?: string
    bio?: string | null
    linkedin?: string | null
    github?: string | null
    portfolio?: string | null
    department?: string | null
    skills?: string[]
    avatar_url?: string | null
  }
): Promise<{ error: string | null }> {
  const supabase = createServerClient()
  const { error } = await supabase.from('users').update(data).eq('id', userId)
  return { error: error?.message ?? null }
}

export async function promoteUserRole(
  userId: string,
  role: Role
): Promise<{ error: string | null }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('users').update({ role }).eq('id', userId)
  return { error: error?.message ?? null }
}

export async function changeUserStatus(
  userId: string,
  status: 'active' | 'on_hold' | 'removed'
): Promise<{ error: string | null }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('users').update({ status }).eq('id', userId)
  return { error: error?.message ?? null }
}
