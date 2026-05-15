import { createServerClient } from '@/lib/supabase/server'
import type { Event } from '@/lib/types/app.types'

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
