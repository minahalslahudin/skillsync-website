import { createServerClient } from '@/lib/supabase/server'
import type { Report } from '@/lib/types/app.types'

export type ReportWithUser = Report & {
  user_full_name: string
  user_avatar_url: string | null
}

export async function getAllReports(filters?: {
  week_ending?: string
  user_id?: string
  status?: Report['status']
}): Promise<ReportWithUser[]> {
  const supabase = createServerClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('reports')
    .select('*')
    .order('week_ending', { ascending: false })
    .order('submitted_at', { ascending: false })

  if (filters?.week_ending) query = query.eq('week_ending', filters.week_ending)
  if (filters?.user_id)     query = query.eq('user_id', filters.user_id)
  if (filters?.status)      query = query.eq('status', filters.status)

  const { data, error } = await query
  if (error) console.error('[reports] getAllReports:', error.message)

  const reports = (data ?? []) as Report[]
  if (reports.length === 0) return []

  const userIds = Array.from(new Set(reports.map((r) => r.user_id)))
  const { data: users } = await supabase
    .from('users')
    .select('id, full_name, avatar_url')
    .in('id', userIds)

  const userMap: Record<string, { full_name: string; avatar_url: string | null }> = {}
  for (const u of (users ?? []) as Array<{ id: string; full_name: string; avatar_url: string | null }>) {
    userMap[u.id] = u
  }

  return reports.map((r) => ({
    ...r,
    user_full_name: userMap[r.user_id]?.full_name ?? 'Unknown',
    user_avatar_url: userMap[r.user_id]?.avatar_url ?? null,
  }))
}

export async function getSubmissionRateThisWeek(): Promise<{ submitted: number; total: number }> {
  const supabase = createServerClient()
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  const sunday = new Date(today)
  sunday.setDate(today.getDate() + daysUntilSunday)
  const weekEnding = sunday.toISOString().split('T')[0]

  const [{ count: total }, { count: submitted }] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('reports').select('id', { count: 'exact', head: true }).eq('week_ending', weekEnding),
  ])

  return { submitted: submitted ?? 0, total: total ?? 0 }
}

export async function getMyReports(userId: string): Promise<Report[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('week_ending', { ascending: false })
  if (error) console.error('[reports] getMyReports:', error.message)
  return (data as Report[]) ?? []
}

export async function getLatestReport(userId: string): Promise<Report | null> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('week_ending', { ascending: false })
    .limit(1)
    .single()
  if (error) return null
  return data as Report
}

export async function getReportsThisMonth(userId: string): Promise<number> {
  const supabase = createServerClient()
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString().split('T')[0]
  const { count, error } = await supabase
    .from('reports')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('week_ending', monthStart)
  if (error) console.error('[reports] getReportsThisMonth:', error.message)
  return count ?? 0
}
