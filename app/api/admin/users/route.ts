import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
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

export async function PATCH(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: adminProfile } = await supabase
    .from('users').select('is_admin, full_name').eq('id', user.id).single()
  if (!adminProfile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

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

    // Achievement record
    await createAchievement({
      user_id: userId,
      type: 'milestone',
      title: `Promoted to ${role}`,
      description: note ?? null,
    })

    // Announcement to the promoted user
    await createAnnouncement({
      title: `You've been promoted to ${role}`,
      body: note ?? `Congratulations on your promotion to ${role} at skillSYNC!`,
      target: 'user',
      target_user_id: userId,
      sent_by: user.id,
    })

    return NextResponse.json({ success: true })
  }

  // status change
  const { userId, status } = parsed.data
  const { error } = await changeUserStatus(userId, status)
  if (error) return NextResponse.json({ error }, { status: 500 })

  return NextResponse.json({ success: true })
}
