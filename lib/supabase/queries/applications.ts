import { createServerClient } from '@/lib/supabase/server'
import type { Application } from '@/lib/types/app.types'

export async function getApplications(): Promise<Application[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('applied_at', { ascending: false })
  if (error) console.error('[applications] getApplications:', error.message)
  return (data as Application[]) ?? []
}

export async function getApplicationsByStatus(
  status: Application['status']
): Promise<Application[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('status', status)
    .order('applied_at', { ascending: false })
  if (error) console.error('[applications] getApplicationsByStatus:', error.message)
  return (data as Application[]) ?? []
}

export async function getApplicationById(id: string): Promise<Application | null> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as Application
}
