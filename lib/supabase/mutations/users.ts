import { createServerClient } from '@/lib/supabase/server'

export async function updateUserProfile(
  userId: string,
  data: {
    full_name?: string
    bio?: string | null
    linkedin?: string | null
    github?: string | null
    portfolio?: string | null
    department?: string | null
  }
): Promise<{ error: string | null }> {
  const supabase = createServerClient()
  const { error } = await supabase.from('users').update(data).eq('id', userId)
  return { error: error?.message ?? null }
}
