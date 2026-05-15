import { createServerClient } from '@/lib/supabase/server'
import type { Project } from '@/lib/types/app.types'

export async function getAllProjects(): Promise<Project[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) console.error('[projects] getAllProjects:', error.message)
  return (data as Project[]) ?? []
}

export async function getPublishedProjects(limit = 6): Promise<Project[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .limit(limit)
  if (error) console.error('[projects] getPublishedProjects:', error.message)
  return (data as Project[]) ?? []
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (error) console.error('[projects] getProjectBySlug:', error.message)
  return (data as Project) ?? null
}
