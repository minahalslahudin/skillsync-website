import { createServerClient } from '@/lib/supabase/server'

export async function createAnnouncement(data: {
  title: string
  body: string
  target: string
  target_department?: string | null
  target_user_id?: string | null
  sent_by: string
}): Promise<{ error: string | null }> {
  const supabase = createServerClient()
  const { error } = await supabase.from('announcements').insert({
    ...data,
    sent_at: new Date().toISOString(),
  })
  return { error: error?.message ?? null }
}
