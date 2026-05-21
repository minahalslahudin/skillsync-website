import { createAdminClient } from '@/lib/supabase/admin'

export async function updateSetting(key: string, value: string): Promise<{ error: unknown }> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  if (error) console.error('[settings] updateSetting:', error.message)
  return { error }
}

export async function updateSettings(settings: Record<string, string>): Promise<{ error: unknown }> {
  const supabase = createAdminClient()
  const rows = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }))
  const { error } = await supabase
    .from('site_settings')
    .upsert(rows, { onConflict: 'key' })
  if (error) console.error('[settings] updateSettings:', error.message)
  return { error }
}
