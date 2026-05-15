import { createServerClient } from '@/lib/supabase/server'
import type { Event } from '@/lib/types/app.types'

export type EventWithCount = Event & { registrations: Array<{ count: number }> }

export async function getAllEvents(): Promise<EventWithCount[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('events')
    .select('*, registrations(count)')
    .order('date', { ascending: false })
  if (error) console.error('[events] getAllEvents:', error.message)
  return (data as EventWithCount[]) ?? []
}

export type RegistrationWithUser = {
  id: string
  event_id: string
  user_id: string | null
  form_data: Record<string, unknown>
  registered_at: string
  user_full_name: string
  user_email: string
}

export async function getEventRegistrations(eventId: string): Promise<RegistrationWithUser[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('event_id', eventId)
    .order('registered_at', { ascending: true })
  if (error) console.error('[events] getEventRegistrations:', error.message)

  const rows = (data ?? []) as Array<{
    id: string; event_id: string; user_id: string | null; form_data: Record<string, unknown>; registered_at: string
  }>
  if (rows.length === 0) return []

  const userIds = rows.filter((r) => r.user_id).map((r) => r.user_id as string)
  const { data: users } = userIds.length
    ? await supabase.from('users').select('id, full_name, email').in('id', userIds)
    : { data: [] }

  const userMap: Record<string, { full_name: string; email: string }> = {}
  for (const u of (users ?? []) as Array<{ id: string; full_name: string; email: string }>) {
    userMap[u.id] = u
  }

  return rows.map((r) => ({
    ...r,
    user_full_name: r.user_id
      ? (userMap[r.user_id]?.full_name ?? ((r.form_data?.full_name as string) || 'Unknown'))
      : ((r.form_data?.full_name as string) || 'Anonymous'),
    user_email: r.user_id
      ? (userMap[r.user_id]?.email ?? ((r.form_data?.email as string) || ''))
      : ((r.form_data?.email as string) || ''),
  }))
}

export async function getPublishedWorkshops(limit = 6): Promise<Event[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('type', 'workshop')
    .eq('is_published', true)
    .order('date', { ascending: true })
    .limit(limit)
  if (error) console.error('[events] getPublishedWorkshops:', error.message)
  return (data as Event[]) ?? []
}

export async function getUpcomingEvents(limit = 6): Promise<Event[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .in('type', ['event', 'cohort'])
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(limit)
  if (error) console.error('[events] getUpcomingEvents:', error.message)
  return (data as Event[]) ?? []
}

export async function getAllUpcomingEvents(limit = 50): Promise<Event[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(limit)
  if (error) console.error('[events] getAllUpcomingEvents:', error.message)
  return (data as Event[]) ?? []
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (error) console.error('[events] getEventBySlug:', error.message)
  return (data as Event) ?? null
}
