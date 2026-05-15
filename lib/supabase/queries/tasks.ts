import { createServerClient } from '@/lib/supabase/server'
import type { Task } from '@/lib/types/app.types'

export async function getMyTasks(userId: string): Promise<Task[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('assigned_to', userId)
    .order('due_date', { ascending: true, nullsFirst: false })
  if (error) console.error('[tasks] getMyTasks:', error.message)
  return (data as Task[]) ?? []
}

export async function getTaskCounts(userId: string): Promise<{
  not_started: number
  in_progress: number
  submitted:   number
  completed:   number
  overdue:     number
}> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('status')
    .eq('assigned_to', userId)
  if (error) console.error('[tasks] getTaskCounts:', error.message)
  const tasks = (data ?? []) as { status: string }[]
  return {
    not_started: tasks.filter((t) => t.status === 'not_started').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    submitted:   tasks.filter((t) => t.status === 'submitted').length,
    completed:   tasks.filter((t) => t.status === 'completed').length,
    overdue:     tasks.filter((t) => t.status === 'overdue').length,
  }
}
