import { createAdminClient } from '@/lib/supabase/admin'
import type { Task } from '@/lib/types/app.types'

export async function updateTaskStatus(
  taskId: string,
  status: Task['status'],
): Promise<{ error: string | null }> {
  const supabase = createAdminClient()
  const update: Record<string, unknown> = { status }
  if (status === 'completed') update.completed_at = new Date().toISOString()
  const { error } = await supabase.from('tasks').update(update).eq('id', taskId)
  return { error: error?.message ?? null }
}

export async function createTask(data: {
  title: string
  description: string | null
  assigned_to: string
  assigned_by: string
  priority: Task['priority']
  due_date: string | null
}): Promise<{ error: string | null }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('tasks').insert({
    ...data,
    status: 'not_started',
    file_urls: [],
  })
  return { error: error?.message ?? null }
}

export async function closeTask(taskId: string): Promise<{ error: string | null }> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('tasks')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', taskId)
  return { error: error?.message ?? null }
}
