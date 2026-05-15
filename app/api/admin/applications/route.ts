import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const schema = z.object({
  id:         z.string().uuid(),
  action:     z.enum(['approve', 'reject']),
  adminNotes: z.string().optional().nullable(),
})

function generatePassword(len = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function PATCH(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: adminProfile } = await supabase
    .from('users').select('is_admin').eq('id', user.id).single()
  if (!adminProfile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 422 })

  const { id, action, adminNotes } = parsed.data

  const { data: application } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .single()

  if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  const app = application as {
    id: string; full_name: string; email: string
    department_interest: string | null; current_skills: string[]
  }

  if (action === 'reject') {
    await supabase
      .from('applications')
      .update({ status: 'rejected', admin_notes: adminNotes ?? null })
      .eq('id', id)

    // Send rejection email (non-fatal)
    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.RESEND_FROM ?? 'onboarding@resend.dev'
    if (apiKey) {
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          to: app.email,
          subject: 'Your skillSYNC application',
          text: [
            `Hi ${app.full_name.split(' ')[0]},`,
            '',
            'Thank you for applying to skillSYNC. Unfortunately, we are unable to move forward with your application at this time.',
            '',
            adminNotes ? `Feedback: ${adminNotes}` : 'We encourage you to apply again in the future.',
            '',
            'Best regards,\nskillSYNC Team',
          ].join('\n'),
        }),
      }).catch((e) => console.error('[api/admin/applications] reject email:', e))
    }

    return NextResponse.json({ success: true })
  }

  // Approve: create auth user + insert into public.users
  const tempPassword = generatePassword()
  const adminClient = createAdminClient()

  const { data: authUser, error: authErr } = await adminClient.auth.admin.createUser({
    email: app.email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: app.full_name },
  })

  if (authErr || !authUser.user) {
    console.error('[api/admin/applications] create auth user:', authErr)
    return NextResponse.json({ error: authErr?.message ?? 'Failed to create account' }, { status: 500 })
  }

  const newUserId = authUser.user.id

  await supabase.from('users').insert({
    id: newUserId,
    email: app.email,
    full_name: app.full_name,
    role: 'Volunteer',
    department: app.department_interest ?? null,
    skills: app.current_skills ?? [],
    status: 'active',
    is_admin: false,
    warning_count: 0,
    joined_at: new Date().toISOString(),
  })

  await supabase
    .from('applications')
    .update({ status: 'approved', admin_notes: adminNotes ?? null })
    .eq('id', id)

  // Send welcome email (non-fatal)
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'onboarding@resend.dev'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  if (apiKey) {
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: app.email,
        subject: 'Welcome to skillSYNC! Your account is ready',
        text: [
          `Hi ${app.full_name.split(' ')[0]},`,
          '',
          'Congratulations! Your application has been approved. Here are your login details:',
          '',
          `Email:    ${app.email}`,
          `Password: ${tempPassword}`,
          `Login:    ${siteUrl}/login`,
          '',
          'Please change your password after your first login.',
          '',
          'Welcome aboard!\nskillSYNC Team',
        ].join('\n'),
      }),
    }).catch((e) => console.error('[api/admin/applications] welcome email:', e))
  }

  return NextResponse.json({ success: true, userId: newUserId })
}
