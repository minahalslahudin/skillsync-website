import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'

const VALID_SUBJECTS = ['General', 'Partnership', 'Client Enquiry', 'Workshop', 'Other'] as const

const schema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  subject: z.enum(VALID_SUBJECTS, { message: 'Invalid subject' }),
  message: z.string().min(20),
})

export async function POST(req: NextRequest) {
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

  const { name, email, subject, message } = parsed.data

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
