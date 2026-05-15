import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getSiteSettings } from '@/lib/supabase/queries/settings'
import { updateSettings } from '@/lib/supabase/mutations/settings'

async function guardAdmin() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('users').select('is_admin').eq('id', user.id).single()
  return profile?.is_admin ? user : null
}

export async function GET() {
  const admin = await guardAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const settings = await getSiteSettings()
  return NextResponse.json(settings)
}

export async function PATCH(req: NextRequest) {
  const admin = await guardAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const settings = body as Record<string, string>
  if (typeof settings !== 'object' || Array.isArray(settings)) {
    return NextResponse.json({ error: 'Expected object of key/value pairs' }, { status: 422 })
  }

  const { error } = await updateSettings(settings)
  return error ? NextResponse.json({ error }, { status: 500 }) : NextResponse.json({ success: true })
}
