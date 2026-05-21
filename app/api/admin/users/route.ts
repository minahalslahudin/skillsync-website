import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { ROLES } from '@/lib/constants/roles'
import { promoteUserRole, changeUserStatus } from '@/lib/supabase/mutations/users'
import { createAchievement } from '@/lib/supabase/mutations/achievements'
import { createAnnouncement } from '@/lib/supabase/mutations/announcements'

const schema = z.discriminatedUnion('action', [
  z.object({
    action:  z.literal('promote'),
    userId:  z.string().uuid(),
    role:    z.enum(ROLES),
    note:    z.string().optional().nullable(),
  }),
  z.object({
    action:  z.literal('status'),
    userId:  z.string().uuid(),
    status:  z.enum(['active', 'on_hold', 'removed']),
  }),
])

async function guardAdmin() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClient()
  const { data: profile } = await admin.from('users').select('is_admin, full_name').eq('id', user.id).single()
  return profile?.is_admin ? { user, adminName: (profile as { full_name?: string }).full_name ?? '' } : null
}

export async function GET(req: NextRequest) {
  const result = await guardAdmin()
  if (!result) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const db = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = db
    .from('users')
    .select('id, full_name, email, avatar_url, role, department, status, warning_count, joined_at, skills')
  if (status) q = q.eq('status', status)

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const result = await guardAdmin()
  if (!result) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { user } = result

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 422 })

  if (parsed.data.action === 'promote') {
    const { userId, role, note } = parsed.data

    const { error } = await promoteUserRole(userId, role)
    if (error) return NextResponse.json({ error }, { status: 500 })

    await createAchievement({
      user_id: userId,
      type: 'milestone',
      title: `Promoted to ${role}`,
      description: note ?? null,
    })

    await createAnnouncement({
      title: `You've been promoted to ${role}`,
      body: note ?? `Congratulations on your promotion to ${role} at skillSYNC!`,
      target: 'user',
      target_user_id: userId,
      sent_by: user.id,
    })

    return NextResponse.json({ success: true })
  }

  const { userId, status } = parsed.data
  const { error } = await changeUserStatus(userId, status)
  if (error) return NextResponse.json({ error }, { status: 500 })

  return NextResponse.json({ success: true })
}
