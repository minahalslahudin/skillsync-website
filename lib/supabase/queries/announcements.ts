import { createServerClient } from '@/lib/supabase/server'
import type { Announcement } from '@/lib/types/app.types'

export async function getRecentAnnouncements(
  userId: string,
  role: string,
  department: string | null,
  limit = 5,
): Promise<Announcement[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .or(
      [
        'target.eq.all',
        `target.eq.${role}`,
        department ? `target_department.eq.${department}` : null,
        `target_user_id.eq.${userId}`,
      ]
        .filter(Boolean)
        .join(',')
    )
    .order('sent_at', { ascending: false })
    .limit(limit)
  if (error) console.error('[announcements] getRecentAnnouncements:', error.message)
  return (data as Announcement[]) ?? []
}
