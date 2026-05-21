import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Event } from '@/lib/types/app.types'

type EventInput = Omit<Event, 'id' | 'created_at' | 'seats_taken'>

export async function createEvent(
  data: Partial<EventInput>
): Promise<{ id: string | null; error: string | null }> {
  const supabase = createAdminClient()
  const { data: row, error } = await supabase
    .from('events')
    .insert({ ...data, seats_taken: 0, created_at: new Date().toISOString() })
    .select('id')
    .single()
  return { id: (row as { id: string } | null)?.id ?? null, error: error?.message ?? null }
}

export async function updateEvent(
  id: string,
  data: Partial<EventInput>
): Promise<{ error: string | null }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('events').update(data).eq('id', id)
  return { error: error?.message ?? null }
}

export async function deleteEvent(id: string): Promise<{ error: string | null }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('events').delete().eq('id', id)
  return { error: error?.message ?? null }
}

export async function toggleEventPublished(
  id: string,
  published: boolean
): Promise<{ error: string | null }> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('events')
    .update({ is_published: published })
    .eq('id', id)
  return { error: error?.message ?? null }
}

export async function registerForEvent(data: {
  event_id: string
  user_id: string | null
  form_data: Record<string, unknown>
}): Promise<{ error: string | null }> {
  const supabase = createServerClient()
  const { error } = await supabase.from('registrations').insert(data)
  return { error: error?.message ?? null }
}

export async function createRegistration(data: {
  event_id: string
  user_id: string | null
  form_data: Record<string, unknown>
}): Promise<{ error: string | null }> {
  const supabase = createServerClient()
  const { error } = await supabase.from('registrations').insert(data)
  if (error) return { error: error.message }
  // Increment seats_taken — call RPC if available, errors are non-fatal
  await supabase.rpc('increment_seats_taken', { event_id: data.event_id })
  return { error: null }
}
