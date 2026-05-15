import { createServerClient } from '@/lib/supabase/server'
import type { Report } from '@/lib/types/app.types'

export async function getMyReports(userId: string): Promise<Report[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('week_start', { ascending: false })
  if (error) console.error('[reports] getMyReports:', error.message)
  return (data as Report[]) ?? []
}

export async function getLatestReport(userId: string): Promise<Report | null> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('week_start', { ascending: false })
    .limit(1)
    .single()
  if (error) return null
  return data as Report
}
