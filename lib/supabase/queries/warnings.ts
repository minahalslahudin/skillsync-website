import { createServerClient } from '@/lib/supabase/server'
import type { Warning } from '@/lib/types/app.types'

export interface WarningWithDetails extends Warning {
  user_full_name: string
  user_avatar_url: string | null
  user_role: string
  issued_by_name: string
  warning_number: number
}

const SEVERITY_NUMBER: Record<Warning['severity'], number> = {
  minor: 1,
  major: 2,
  final: 3,
}

export async function getAllWarnings(): Promise<WarningWithDetails[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('warnings')
    .select('*')
    .order('issued_at', { ascending: false })
  if (error) console.error('[warnings] getAllWarnings:', error.message)

  const warnings = (data ?? []) as Warning[]
  if (warnings.length === 0) return []

  const userIds = new Set<string>()
  for (const w of warnings) {
    userIds.add(w.user_id)
    userIds.add(w.issued_by)
  }

  const { data: users } = await supabase
    .from('users')
    .select('id, full_name, avatar_url, role')
    .in('id', Array.from(userIds))

  const userMap: Record<string, { full_name: string; avatar_url: string | null; role: string }> = {}
  for (const u of (users ?? []) as Array<{ id: string; full_name: string; avatar_url: string | null; role: string }>) {
    userMap[u.id] = u
  }

  return warnings.map((w) => ({
    ...w,
    user_full_name: userMap[w.user_id]?.full_name ?? 'Unknown',
    user_avatar_url: userMap[w.user_id]?.avatar_url ?? null,
    user_role: userMap[w.user_id]?.role ?? '',
    issued_by_name: userMap[w.issued_by]?.full_name ?? 'System',
    warning_number: SEVERITY_NUMBER[w.severity],
  }))
}

export async function getActiveWarnings(): Promise<WarningWithDetails[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('warnings')
    .select('*')
    .is('acknowledged_at', null)
    .order('issued_at', { ascending: false })
  if (error) console.error('[warnings] getActiveWarnings:', error.message)

  const warnings = (data ?? []) as Warning[]
  if (warnings.length === 0) return []

  const userIds = new Set<string>()
  for (const w of warnings) {
    userIds.add(w.user_id)
    userIds.add(w.issued_by)
  }

  const { data: users } = await supabase
    .from('users')
    .select('id, full_name, avatar_url, role')
    .in('id', Array.from(userIds))

  const userMap: Record<string, { full_name: string; avatar_url: string | null; role: string }> = {}
  for (const u of (users ?? []) as Array<{ id: string; full_name: string; avatar_url: string | null; role: string }>) {
    userMap[u.id] = u
  }

  return warnings.map((w) => ({
    ...w,
    user_full_name: userMap[w.user_id]?.full_name ?? 'Unknown',
    user_avatar_url: userMap[w.user_id]?.avatar_url ?? null,
    user_role: userMap[w.user_id]?.role ?? '',
    issued_by_name: userMap[w.issued_by]?.full_name ?? 'System',
    warning_number: SEVERITY_NUMBER[w.severity],
  }))
}

export async function getWarningSummary(): Promise<{
  activeTotal: number
  atWarning2: number
  atWarning3: number
}> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('warnings')
    .select('user_id, severity')
    .is('acknowledged_at', null)

  const warnings = (data ?? []) as Array<{ user_id: string; severity: string }>
  const userSeverities: Record<string, Set<string>> = {}
  for (const w of warnings) {
    if (!userSeverities[w.user_id]) userSeverities[w.user_id] = new Set()
    userSeverities[w.user_id].add(w.severity)
  }

  const uniqueUsers = Object.keys(userSeverities)
  return {
    activeTotal: uniqueUsers.length,
    atWarning2: uniqueUsers.filter((id) => userSeverities[id].has('major')).length,
    atWarning3: uniqueUsers.filter((id) => userSeverities[id].has('final')).length,
  }
}
