import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { createRegistration } from '@/lib/supabase/mutations/events'
import { checkRateLimit, getClientIp, rateLimitResponse, RATE_LIMITS } from '@/lib/security/rateLimit'
import { sanitizePlain, MAX_LEN } from '@/lib/security/sanitize'

const schema = z.object({
  event_id:  z.string().uuid(),
  form_data: z.record(z.string(), z.unknown()),
})

// Same recursive sanitizer as /api/events — kept local so each route can
// evolve independently.
function sanitizeFormData(obj: Record<string, unknown>, depth = 0): Record<string, unknown> {
  if (depth > 6) return {}
  const out: Record<string, unknown> = {}
  for (const [key, v] of Object.entries(obj)) {
    if (typeof v === 'string') {
      const clean = sanitizePlain(v)
      if (clean.length > MAX_LEN.motivation) continue
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
  const rl = checkRateLimit(`registrations:${ip}`, RATE_LIMITS.formSubmit.limit, RATE_LIMITS.formSubmit.windowMs)
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
      { status: 422 },
    )
  }

  const { event_id } = parsed.data
  const form_data    = sanitizeFormData(parsed.data.form_data as Record<string, unknown>)
  const supabase     = createServerClient()

  // Fetch event to verify seats + deadline
  const { data: event } = await supabase
    .from('events')
    .select('seats, seats_taken, registration_deadline, date, registration_open')
    .eq('id', event_id)
    .single()

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  if (!event.registration_open) {
    return NextResponse.json({ error: 'Registration is closed' }, { status: 422 })
  }

  const deadlineDate = event.registration_deadline
    ? new Date(event.registration_deadline as string)
    : event.date
    ? new Date(event.date as string)
    : null
  if (deadlineDate && deadlineDate < new Date()) {
    return NextResponse.json({ error: 'Registration deadline has passed' }, { status: 422 })
  }

  if (event.seats !== null && (event.seats_taken as number) >= (event.seats as number)) {
    return NextResponse.json({ error: 'This event is full' }, { status: 409 })
  }

  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await createRegistration({
    event_id,
    user_id: user?.id ?? null,
    form_data,
  })

  if (error) {
    if (error.includes('unique') || error.includes('duplicate')) {
      return NextResponse.json(
        { error: 'You are already registered for this event.' },
        { status: 409 },
      )
    }
    console.error('[api/registrations]', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
