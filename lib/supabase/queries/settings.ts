import { createServerClient } from '@/lib/supabase/server'

export async function getSiteSettings(): Promise<Record<string, string>> {
  const supabase = createServerClient()
  const { data, error } = await supabase.from('site_settings').select('key, value')
  if (error) console.error('[settings] getSiteSettings:', error.message)
  const out: Record<string, string> = {}
  for (const row of (data ?? []) as Array<{ key: string; value: string }>) {
    out[row.key] = row.value
  }
  return out
}

export async function getSettingValue(key: string): Promise<string | null> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle()
  return (data as { value: string } | null)?.value ?? null
}
