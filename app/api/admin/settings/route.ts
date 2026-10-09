import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit, getClientIp, rateLimitResponse, RATE_LIMITS } from '@/lib/security/rateLimit'
import { getSiteSettings } from '@/lib/supabase/queries/settings'
import { updateSettings } from '@/lib/supabase/mutations/settings'

async function guardAdmin() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClient()
  const { data: profile } = await admin.from('users').select('is_admin').eq('id', user.id).single()
  return profile?.is_admin ? user : null
}

export async function GET(req: NextRequest) {
  const _rlIp = getClientIp(req)
  const _rl = checkRateLimit(`admin:settings:get:${_rlIp}`, RATE_LIMITS.read.limit, RATE_LIMITS.read.windowMs)
  if (!_rl.ok) return rateLimitResponse(_rl.resetAt)

  const admin = await guardAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const settings = await getSiteSettings()
  return NextResponse.json(settings)
}

export async function PATCH(req: NextRequest) {
  const _rlIp = getClientIp(req)
  const _rl = checkRateLimit(`admin:settings:patch:${_rlIp}`, RATE_LIMITS.authedWrite.limit, RATE_LIMITS.authedWrite.windowMs)
  if (!_rl.ok) return rateLimitResponse(_rl.resetAt)

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
