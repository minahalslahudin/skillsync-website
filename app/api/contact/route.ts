import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { checkRateLimit, getClientIp, rateLimitResponse, RATE_LIMITS } from '@/lib/security/rateLimit'
import { sanitizePlain, sanitizeEmail, isValidEmail, MAX_LEN } from '@/lib/security/sanitize'

const VALID_SUBJECTS = ['General', 'Partnership', 'Client Enquiry', 'Workshop', 'Other'] as const

const schema = z.object({
  name:    z.string().min(2).max(MAX_LEN.name),
  email:   z.string().email().max(MAX_LEN.email),
  subject: z.enum(VALID_SUBJECTS, { message: 'Invalid subject' }),
  message: z.string().min(20).max(MAX_LEN.message),
})

export async function POST(req: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────────────────────
  const ip = getClientIp(req)
  const rl = checkRateLimit(`contact:${ip}`, RATE_LIMITS.formSubmit.limit, RATE_LIMITS.formSubmit.windowMs)
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

  // ── Sanitize ──────────────────────────────────────────────────────────────
  const name    = sanitizePlain(parsed.data.name)
  const email   = sanitizeEmail(parsed.data.email)
  const subject = parsed.data.subject       // enum, already safe
  const message = sanitizePlain(parsed.data.message)

  if (name.length < 2)                 return NextResponse.json({ error: 'Enter your name.' }, { status: 422 })
  if (!isValidEmail(email))            return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 422 })
  if (message.length < 20)             return NextResponse.json({ error: 'Message must be at least 20 characters.' }, { status: 422 })

  // Store in DB
  const supabase = createServerClient()
  const { error: dbError } = await supabase
    .from('contacts')
    .insert({ name, email, subject, message })

  if (dbError) {
    console.error('[api/contact] DB error:', dbError)
    // Non-fatal — still attempt email
  }

  // Send email via Resend
  const apiKey  = process.env.RESEND_API_KEY
  const to      = process.env.CONTACT_EMAIL ?? 'contact@skillsync.co.za'
  const from    = process.env.RESEND_FROM   ?? 'onboarding@resend.dev'

  if (apiKey) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to,
        subject:  `[Contact] ${subject} — ${name}`,
        text:     `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
        reply_to: email,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[api/contact] Resend error:', err)
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }
  } else {
    console.log('[api/contact] No RESEND_API_KEY — message stored in DB only')
  }

  return NextResponse.json({ success: true })
}
