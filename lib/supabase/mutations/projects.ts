import { createAdminClient } from '@/lib/supabase/admin'
import type { Project } from '@/lib/types/app.types'

type ProjectInput = Omit<Project, 'id' | 'created_at'>

export async function createProject(
  data: Partial<ProjectInput>
): Promise<{ id: string | null; error: string | null }> {
  const supabase = createAdminClient()
  const { data: row, error } = await supabase
    .from('projects')
    .insert({ ...data, created_at: new Date().toISOString() })
    .select('id')
    .single()
  return { id: (row as { id: string } | null)?.id ?? null, error: error?.message ?? null }
}

export async function updateProject(
  id: string,
  data: Partial<ProjectInput>
): Promise<{ error: string | null }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('projects').update(data).eq('id', id)
  return { error: error?.message ?? null }
}

export async function deleteProject(id: string): Promise<{ error: string | null }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  return { error: error?.message ?? null }
}

export async function toggleProjectPublished(
  id: string,
  published: boolean
): Promise<{ error: string | null }> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('projects')
    .update({ is_published: published })
    .eq('id', id)
  return { error: error?.message ?? null }
}
