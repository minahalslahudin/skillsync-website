import { createServerClient } from '@/lib/supabase/server'
import type { Achievement } from '@/lib/types/app.types'

export async function getMyAchievements(userId: string): Promise<Achievement[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('issued_at', { ascending: false })
  if (error) console.error('[achievements] getMyAchievements:', error.message)
  return (data as Achievement[]) ?? []
}
