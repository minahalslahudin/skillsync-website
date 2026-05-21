import { createAdminClient } from '@/lib/supabase/admin'

export async function createAchievement(data: {
  user_id: string
  type: 'certificate' | 'milestone' | 'award'
  title: string
  description: string | null
  badge_icon?: string | null
  certificate_url?: string | null
}): Promise<{ error: string | null }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('achievements').insert({
    ...data,
    earned_at: new Date().toISOString(),
  })
  return { error: error?.message ?? null }
}
