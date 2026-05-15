import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  subject: z.string().min(5),
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
  const apiKey = process.env.RESEND_API_KEY
  const to     = process.env.CONTACT_EMAIL ?? 'contact@skillsync.co.za'
  const from   = process.env.RESEND_FROM   ?? 'onboarding@resend.dev'

  if (!apiKey) {
    console.error('[api/contact] RESEND_API_KEY not set')
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject:  `[Contact] ${subject}`,
      text:     `From: ${name} <${email}>\n\n${message}`,
      reply_to: email,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[api/contact] Resend error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
