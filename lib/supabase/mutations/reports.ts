import { createServerClient } from '@/lib/supabase/server'
import type { ReportEntry } from '@/lib/types/app.types'

export async function insertReport(payload: {
  user_id: string
  week_start: string
  week_end: string
  entries: ReportEntry[]
  total_hours: number
  notes: string | null
}): Promise<{ error: string | null }> {
  const supabase = createServerClient()
  const { error } = await supabase.from('reports').insert({
    ...payload,
    submitted_at: new Date().toISOString(),
  })
  return { error: error?.message ?? null }
}
