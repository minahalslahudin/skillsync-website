import { createServerClient } from '@/lib/supabase/server'

export interface AdminSummary {
  totalVolunteers: number
  pendingApplications: number
  pendingReports: number
  openTasks: number
  upcomingEvents: number
  pendingReviews: number
}

export async function getAdminSummary(): Promise<AdminSummary> {
  const supabase = createServerClient()
  const today = new Date().toISOString()

  const [
    { count: totalVolunteers },
    { count: pendingApplications },
    { count: pendingReports },
    { count: openTasks },
    { count: upcomingEvents },
    { count: pendingReviews },
  ] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('tasks').select('id', { count: 'exact', head: true }).in('status', ['not_started', 'in_progress']),
    supabase.from('events').select('id', { count: 'exact', head: true }).eq('is_published', true).gte('date', today),
    supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('is_approved', false),
  ])

  return {
    totalVolunteers: totalVolunteers ?? 0,
    pendingApplications: pendingApplications ?? 0,
    pendingReports: pendingReports ?? 0,
    openTasks: openTasks ?? 0,
    upcomingEvents: upcomingEvents ?? 0,
    pendingReviews: pendingReviews ?? 0,
  }
}

export interface ActivityItem {
  id: string
  type: 'report' | 'application' | 'task'
  description: string
  actor: string
  timestamp: string
}

export async function getRecentActivity(limit = 20): Promise<ActivityItem[]> {
  const supabase = createServerClient()

  const [reportsRes, appsRes, tasksRes] = await Promise.all([
    supabase
      .from('reports')
      .select('id, submitted_at, user_id')
      .order('submitted_at', { ascending: false })
      .limit(10),
    supabase
      .from('applications')
      .select('id, full_name, applied_at')
      .order('applied_at', { ascending: false })
      .limit(10),
    supabase
      .from('tasks')
      .select('id, title, created_at, assigned_to')
      .eq('status', 'submitted')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  // Batch-fetch user names for reports and tasks
  const userIds = new Set<string>()
  for (const r of reportsRes.data ?? []) userIds.add((r as { user_id: string }).user_id)
  for (const t of tasksRes.data ?? []) userIds.add((t as { assigned_to: string }).assigned_to)

  const { data: usersData } = await supabase
    .from('users')
    .select('id, full_name')
    .in('id', Array.from(userIds))

  const nameById: Record<string, string> = {}
  for (const u of usersData ?? []) {
    nameById[(u as { id: string; full_name: string }).id] = (u as { id: string; full_name: string }).full_name
  }

  const items: ActivityItem[] = []

  for (const r of (reportsRes.data ?? []) as Array<{ id: string; submitted_at: string; user_id: string }>) {
    items.push({
      id: `report-${r.id}`,
      type: 'report',
      description: 'Submitted weekly report',
      actor: nameById[r.user_id] ?? 'Unknown',
      timestamp: r.submitted_at,
    })
  }

  for (const a of (appsRes.data ?? []) as Array<{ id: string; full_name: string; applied_at: string }>) {
    items.push({
      id: `app-${a.id}`,
      type: 'application',
      description: 'New volunteer application',
      actor: a.full_name,
      timestamp: a.applied_at,
    })
  }

  for (const t of (tasksRes.data ?? []) as Array<{ id: string; title: string; created_at: string; assigned_to: string }>) {
    items.push({
      id: `task-${t.id}`,
      type: 'task',
      description: `Submitted task: ${t.title}`,
      actor: nameById[t.assigned_to] ?? 'Unknown',
      timestamp: t.created_at,
    })
  }

  return items
    .filter((i) => i.timestamp)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}
