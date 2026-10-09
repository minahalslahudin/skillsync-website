import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { checkRateLimit, getClientIp, rateLimitResponse, RATE_LIMITS } from '@/lib/security/rateLimit'
import { sanitizePlain, MAX_LEN } from '@/lib/security/sanitize'

const entrySchema = z.object({
  day:         z.string().min(1).max(30),
  task_name:   z.string().max(MAX_LEN.task_name),
  hours:       z.number().min(0).max(24),
  deliverable: z.string().max(MAX_LEN.deliverable),
})

const schema = z.object({
  week_ending: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  entries:     z.array(entrySchema).min(1).max(14),
  total_hours: z.number().min(0).max(168), // 7*24 = 168, absolute ceiling
  notes:       z.string().max(MAX_LEN.report_notes).optional().nullable(),
  report_id:   z.string().uuid().optional(),
})

export async function POST(req: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────────────────────
  // Report submission is authenticated — use the authedWrite bucket (20/min).
  const ip = getClientIp(req)
  const rl = checkRateLimit(`reports:${ip}`, RATE_LIMITS.authedWrite.limit, RATE_LIMITS.authedWrite.windowMs)
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

  if (parsed.data.total_hours <= 0) {
    return NextResponse.json({ error: 'Total hours must be greater than 0' }, { status: 422 })
  }

  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { week_ending, entries, total_hours, notes, report_id } = parsed.data

  // ── Sanitize free-text inside every entry + notes ─────────────────────────
  const cleanEntries = entries.map((e) => ({
    day:         sanitizePlain(e.day),
    task_name:   sanitizePlain(e.task_name),
    hours:       e.hours,
    deliverable: sanitizePlain(e.deliverable),
  }))
  const cleanNotes = notes ? sanitizePlain(notes) : null

  if (report_id) {
    // Resubmit — update existing report (must belong to this user)
    const { error } = await supabase
      .from('reports')
      .update({
        entries:      cleanEntries,
        total_hours,
        notes:        cleanNotes,
        status:       'pending',
        submitted_at: new Date().toISOString(),
      })
      .eq('id', report_id)
      .eq('user_id', user.id)

    if (error) {
      console.error('[api/reports] update:', error)
      return NextResponse.json({ error: 'Failed to update report' }, { status: 500 })
    }
  } else {
    // New report — check for duplicate week
    const { data: existing } = await supabase
      .from('reports')
      .select('id')
      .eq('user_id', user.id)
      .eq('week_ending', week_ending)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'A report for this week already exists.' },
        { status: 409 }
      )
    }

    const { error } = await supabase.from('reports').insert({
      user_id:      user.id,
      week_ending,
      entries:      cleanEntries,
      total_hours,
      notes:        cleanNotes,
      status:       'pending',
      submitted_at: new Date().toISOString(),
    })

    if (error) {
      console.error('[api/reports] insert:', error)
      return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
