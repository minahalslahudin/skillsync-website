import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { checkRateLimit, getClientIp, rateLimitResponse, RATE_LIMITS } from '@/lib/security/rateLimit'
import { sanitizeEmail, isValidEmail, MAX_LEN } from '@/lib/security/sanitize'

const schema = z.object({ email: z.string().email().max(MAX_LEN.email) })

export async function POST(req: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────────────────────
  const ip = getClientIp(req)
  const rl = checkRateLimit(`newsletter:${ip}`, RATE_LIMITS.formSubmit.limit, RATE_LIMITS.formSubmit.windowMs)
  if (!rl.ok) return rateLimitResponse(rl.resetAt)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const email = sanitizeEmail(parsed.data.email)
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { error } = await supabase
    .from('newsletter')
    .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true })

  if (error) {
    console.error('[newsletter]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
