import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { submitReview } from '@/lib/supabase/mutations/reviews'
import { checkRateLimit, getClientIp, rateLimitResponse, RATE_LIMITS } from '@/lib/security/rateLimit'
import { sanitizePlain, MAX_LEN } from '@/lib/security/sanitize'

const schema = z.object({
  reviewer_name:       z.string().min(2).max(MAX_LEN.name),
  reviewer_role:       z.string().max(MAX_LEN.reviewer_role).optional().nullable(),
  workshop_or_service: z.string().max(MAX_LEN.workshop_short).optional().nullable(),
  rating:              z.number().int().min(1).max(5),
  body:                z.string().min(50).max(MAX_LEN.review_body),
  brand:               z.string().max(40).optional().nullable(),
  photo_url:           z.string().max(MAX_LEN.url).optional().nullable(),
})

export async function POST(req: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────────────────────
  const ip = getClientIp(req)
  const rl = checkRateLimit(`reviews:${ip}`, RATE_LIMITS.formSubmit.limit, RATE_LIMITS.formSubmit.windowMs)
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

  // ── Sanitize free-text fields ─────────────────────────────────────────────
  const reviewer_name       = sanitizePlain(parsed.data.reviewer_name)
  const reviewer_role       = parsed.data.reviewer_role ? sanitizePlain(parsed.data.reviewer_role) : null
  const workshop_or_service = parsed.data.workshop_or_service ? sanitizePlain(parsed.data.workshop_or_service) : null
  const reviewBody          = sanitizePlain(parsed.data.body)
  const brand               = parsed.data.brand ? sanitizePlain(parsed.data.brand) : null

  if (reviewer_name.length < 2)  return NextResponse.json({ error: 'Enter your name.' }, { status: 422 })
  if (reviewBody.length < 50)    return NextResponse.json({ error: 'Review must be at least 50 characters (plain text).' }, { status: 422 })

  const { error } = await submitReview({
    reviewer_name,
    reviewer_role,
    workshop_or_service,
    rating:    parsed.data.rating,
    body:      reviewBody,
    brand,
    photo_url: parsed.data.photo_url ?? null,
  })

  if (error) {
    console.error('[api/reviews]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
