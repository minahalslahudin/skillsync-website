import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { issueWarning, resolveWarning } from '@/lib/supabase/mutations/warnings'
import { createAnnouncement } from '@/lib/supabase/mutations/announcements'

const issueSchema = z.object({
  userId:   z.string().uuid(),
  reason:   z.string().min(10),
  severity: z.enum(['minor', 'major', 'final']),
})

const resolveSchema = z.object({
  warningId: z.string().uuid(),
})

async function guardAdmin(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('users').select('is_admin').eq('id', user.id).single()
  return profile?.is_admin ? user : null
}

export async function POST(req: NextRequest) {
  const adminUser = await guardAdmin(req)
  if (!adminUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const parsed = issueSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 422 })

  const { userId, reason, severity } = parsed.data
  const { error } = await issueWarning({ user_id: userId, issued_by: adminUser.id, reason, severity })
  if (error) return NextResponse.json({ error }, { status: 500 })

  const numberLabel = severity === 'minor' ? '1st' : severity === 'major' ? '2nd' : '3rd'
  await createAnnouncement({
    title: `Warning issued (${numberLabel})`,
    body: `A formal warning has been issued to your account. Reason: ${reason}`,
    target: 'user',
    target_user_id: userId,
    sent_by: adminUser.id,
  })

  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const adminUser = await guardAdmin(req)
  if (!adminUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const parsed = resolveSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 422 })

  const { error } = await resolveWarning(parsed.data.warningId)
  if (error) return NextResponse.json({ error }, { status: 500 })

  return NextResponse.json({ success: true })
}
