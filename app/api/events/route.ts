import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { registerForEvent } from '@/lib/supabase/mutations/events'
import { createServerClient } from '@/lib/supabase/server'
import { checkRateLimit, getClientIp, rateLimitResponse, RATE_LIMITS } from '@/lib/security/rateLimit'
import { sanitizePlain, MAX_LEN } from '@/lib/security/sanitize'

const schema = z.object({
  event_id:  z.string().uuid(),
  form_data: z.record(z.string(), z.unknown()),
})

// Recursively sanitize free-text values inside form_data (schema is dynamic).
// Depth-capped at 6 to prevent runaway recursion on adversarial input.
function sanitizeFormData(obj: Record<string, unknown>, depth = 0): Record<string, unknown> {
  if (depth > 6) return {}
  const out: Record<string, unknown> = {}
  for (const [key, v] of Object.entries(obj)) {
    if (typeof v === 'string') {
      const clean = sanitizePlain(v)
      if (clean.length > MAX_LEN.motivation) continue // silently drop absurd values
      out[key] = clean
    } else if (Array.isArray(v)) {
      out[key] = v.slice(0, 50).map((x) =>
        typeof x === 'string' ? sanitizePlain(x).slice(0, MAX_LEN.short_answer) : x
      )
    } else if (v && typeof v === 'object') {
      out[key] = sanitizeFormData(v as Record<string, unknown>, depth + 1)
    } else {
      out[key] = v
    }
  }
  return out
}

export async function POST(req: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────────────────────
  const ip = getClientIp(req)
  const rl = checkRateLimit(`events:${ip}`, RATE_LIMITS.formSubmit.limit, RATE_LIMITS.formSubmit.windowMs)
  if (!rl.ok) return rateLimitResponse(rl.resetAt)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed' },
      { status: 422 }
    )
  }

  // Attach user_id if authenticated
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await registerForEvent({
    event_id:  parsed.data.event_id,
    user_id:   user?.id ?? null,
    form_data: sanitizeFormData(parsed.data.form_data as Record<string, unknown>),
  })

  if (error) {
    if (error.includes('unique') || error.includes('duplicate')) {
      return NextResponse.json({ error: 'You are already registered for this event.' }, { status: 409 })
    }
    console.error('[api/events]', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
