import { createServerClient } from '@/lib/supabase/server'

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
