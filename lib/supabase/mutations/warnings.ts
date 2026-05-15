import { createServerClient } from '@/lib/supabase/server'
import type { Warning } from '@/lib/types/app.types'

export async function issueWarning(data: {
  user_id: string
  issued_by: string
  reason: string
  severity: Warning['severity']
}): Promise<{ error: string | null }> {
  const supabase = createServerClient()

  const { error: wErr } = await supabase.from('warnings').insert({
    ...data,
    issued_at: new Date().toISOString(),
  })
  if (wErr) return { error: wErr.message }

  const { data: userRow } = await supabase
    .from('users')
    .select('warning_count')
    .eq('id', data.user_id)
    .single()

  const { error: uErr } = await supabase
    .from('users')
    .update({ warning_count: (userRow?.warning_count ?? 0) + 1 })
    .eq('id', data.user_id)

  if (uErr) console.error('[mutations/warnings] increment warning_count:', uErr.message)
  return { error: null }
}

export async function resolveWarning(warningId: string): Promise<{ error: string | null }> {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('warnings')
    .update({ acknowledged_at: new Date().toISOString() })
    .eq('id', warningId)
  return { error: error?.message ?? null }
}
