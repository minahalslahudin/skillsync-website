import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ReportEntry, Report } from '@/lib/types/app.types'

export async function adminReviewReport(
  id: string,
  status: Extract<Report['status'], 'approved' | 'rejected'>,
  adminComment: string | null
): Promise<{ error: string | null }> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('reports')
    .update({ status, admin_comment: adminComment, reviewed_at: new Date().toISOString() })
    .eq('id', id)
  return { error: error?.message ?? null }
}

export async function insertReport(payload: {
  user_id:      string
  week_ending:  string
  entries:      ReportEntry[]
  total_hours:  number
  notes:        string | null
}): Promise<{ error: string | null }> {
  const supabase = createServerClient()
  const { error } = await supabase.from('reports').insert({
    ...payload,
    status:       'pending',
    submitted_at: new Date().toISOString(),
  })
  return { error: error?.message ?? null }
}

export async function updateReport(
  reportId: string,
  payload: {
    entries:     ReportEntry[]
    total_hours: number
    notes:       string | null
  },
): Promise<{ error: string | null }> {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('reports')
    .update({
      ...payload,
      status:       'pending',
      submitted_at: new Date().toISOString(),
    })
    .eq('id', reportId)
  return { error: error?.message ?? null }
}
