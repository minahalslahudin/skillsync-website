import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'

const schema = z.object({
  full_name:           z.string().min(2),
  email:               z.string().email(),
  phone:               z.string().optional().nullable(),
  city:                z.string().optional().nullable(),
  university:          z.string().optional().nullable(),
  semester:            z.string().optional().nullable(),
  department_interest: z.string().optional().nullable(),
  current_skills:      z.array(z.string()).min(1),
  motivation:          z.string().min(100),
  can_commit:          z.boolean(),
  linkedin:            z.string().optional().nullable(),
  github:              z.string().optional().nullable(),
  portfolio:           z.string().optional().nullable(),
  referral_source:     z.string().optional().nullable(),
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

  if (!parsed.data.can_commit) {
    return NextResponse.json({ error: '20 hrs/week commitment is required' }, { status: 422 })
  }

  const supabase = createServerClient()
  const { error } = await supabase.from('applications').insert({
    ...parsed.data,
    status: 'pending',
  })

  if (error) {
    console.error('[api/applications]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  // Notify admin via Resend (non-fatal)
  const apiKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.CONTACT_EMAIL ?? 'admin@skillsync.co.za'
  const from = process.env.RESEND_FROM ?? 'onboarding@resend.dev'

  if (apiKey) {
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: adminEmail,
        subject: `[Application] New volunteer application — ${parsed.data.full_name}`,
        text: [
          `Name:         ${parsed.data.full_name}`,
          `Email:        ${parsed.data.email}`,
          `City:         ${parsed.data.city ?? '—'}`,
          `University:   ${parsed.data.university ?? '—'}`,
          `Department:   ${parsed.data.department_interest ?? '—'}`,
          `Skills:       ${parsed.data.current_skills.join(', ')}`,
          '',
          `Motivation:`,
          parsed.data.motivation,
        ].join('\n'),
      }),
    }).catch((err) => console.error('[api/applications] Resend:', err))
  } else {
    console.log('[api/applications] New application from', parsed.data.full_name, parsed.data.email)
  }

  return NextResponse.json({ success: true })
}
