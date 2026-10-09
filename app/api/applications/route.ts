import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { checkRateLimit, getClientIp, rateLimitResponse, RATE_LIMITS } from '@/lib/security/rateLimit'
import { sanitizePlain, sanitizeEmail, MAX_LEN, isValidEmail } from '@/lib/security/sanitize'
import { CV_PATH_RE } from '@/lib/utils/fileValidation'

// cv_url is a storage path, not a URL. It was generated server-side by
// /api/cv-upload/sign (buildStoragePath) and the file was uploaded directly
// to Supabase by the browser. The strict regex prevents clients from injecting
// arbitrary storage paths — only paths in our uploads/ prefix with a UUID
// basename and a whitelisted extension are accepted. See CV_PATH_RE.

const schema = z.object({
  full_name:           z.string().min(2, 'Enter your full name').max(MAX_LEN.name),
  email:               z.string().email('Enter a valid email address').max(MAX_LEN.email),
  phone:               z.string().max(MAX_LEN.phone).optional().nullable(),
  city:                z.string().max(MAX_LEN.city).optional().nullable(),
  university:          z.string().max(MAX_LEN.university).optional().nullable(),
  semester:            z.string().max(MAX_LEN.semester).optional().nullable(),
  department_interest: z.string().max(MAX_LEN.short_answer).optional().nullable(),
  current_skills:      z.array(z.string().max(MAX_LEN.short_answer)).min(1, 'Add at least one skill').max(30),
  motivation:          z.string().min(100, 'Motivation must be at least 100 characters').max(MAX_LEN.motivation),
  can_commit:          z.boolean(),
  linkedin:            z.string().max(MAX_LEN.url).optional().nullable(),
  github:              z.string().max(MAX_LEN.url).optional().nullable(),
  portfolio:           z.string().max(MAX_LEN.url).optional().nullable(),
  referral_source:     z.string().max(MAX_LEN.short_answer).optional().nullable(),
  cv_url:              z.string().regex(CV_PATH_RE, 'Invalid CV reference.'),
})

export async function POST(req: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────────────────────
  const ip = getClientIp(req)
  const rl = checkRateLimit(`applications:${ip}`, RATE_LIMITS.formSubmit.limit, RATE_LIMITS.formSubmit.windowMs)
  if (!rl.ok) return rateLimitResponse(rl.resetAt)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed.' },
      { status: 422 }
    )
  }

  if (!parsed.data.can_commit) {
    return NextResponse.json({ error: '20 hrs/week commitment is required.' }, { status: 422 })
  }

  // ── Sanitize every free-text field ────────────────────────────────────────
  const clean = {
    full_name:           sanitizePlain(parsed.data.full_name),
    email:               sanitizeEmail(parsed.data.email),
    phone:               parsed.data.phone ? sanitizePlain(parsed.data.phone) : null,
    city:                parsed.data.city ? sanitizePlain(parsed.data.city) : null,
    university:          parsed.data.university ? sanitizePlain(parsed.data.university) : null,
    semester:            parsed.data.semester ? sanitizePlain(parsed.data.semester) : null,
    department_interest: parsed.data.department_interest ? sanitizePlain(parsed.data.department_interest) : null,
    current_skills:      parsed.data.current_skills.map((s) => sanitizePlain(s)).filter(Boolean),
    motivation:          sanitizePlain(parsed.data.motivation),
    can_commit:          parsed.data.can_commit,
    linkedin:            parsed.data.linkedin ? sanitizePlain(parsed.data.linkedin) : null,
    github:              parsed.data.github ? sanitizePlain(parsed.data.github) : null,
    portfolio:           parsed.data.portfolio ? sanitizePlain(parsed.data.portfolio) : null,
    referral_source:     parsed.data.referral_source ? sanitizePlain(parsed.data.referral_source) : null,
    cv_url:              parsed.data.cv_url,  // already regex-validated
  }

  // Sanitization can shorten a value — re-verify email is still well-formed.
  if (!isValidEmail(clean.email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 422 })
  }
  // Motivation must still meet minimum length after sanitization strips markup.
  if (clean.motivation.length < 100) {
    return NextResponse.json({ error: 'Motivation must be at least 100 characters (plain text).' }, { status: 422 })
  }

  const supabase = createServerClient()
  const { error } = await supabase.from('applications').insert({
    ...clean,
    status: 'pending',
  })

  if (error) {
    console.error('[api/applications]', error)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }

  // Admin email notification (non-fatal)
  const apiKey     = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.CONTACT_EMAIL ?? 'admin@skillsync.pk'
  const from       = process.env.RESEND_FROM ?? 'onboarding@resend.dev'

  if (apiKey) {
    fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: adminEmail,
        subject: `[Application] New volunteer application — ${clean.full_name}`,
        text: [
          `Name:         ${clean.full_name}`,
          `Email:        ${clean.email}`,
          `City:         ${clean.city ?? '—'}`,
          `University:   ${clean.university ?? '—'}`,
          `Department:   ${clean.department_interest ?? '—'}`,
          `Skills:       ${clean.current_skills.join(', ')}`,
          `CV:           Available in admin panel`,
          '',
          'Motivation:',
          clean.motivation,
        ].join('\n'),
      }),
    }).catch((err) => console.error('[api/applications] Resend:', err))
  }

  return NextResponse.json({ success: true })
}
