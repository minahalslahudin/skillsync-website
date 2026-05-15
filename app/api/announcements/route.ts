import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'

const createSchema = z.object({
  title:             z.string().min(1),
  body:              z.string().min(1),
  target:            z.string().min(1),
  target_department: z.string().nullable().optional(),
  target_user_id:    z.string().uuid().nullable().optional(),
})

export async function GET() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('users')
    .select('role, department')
    .eq('id', user.id)
    .single()

  const role       = (profile as { role: string } | null)?.role ?? ''
  const department = (profile as { department: string | null } | null)?.department ?? null

  // Build OR filter for announcements targeting this user
  const orParts: string[] = [
    'target.eq.all',
    `target.eq.${role}`,
    `target_user_id.eq.${user.id}`,
  ]
  if (department) orParts.push(`target_department.eq.${department}`)

  const [announcementsRes, readsRes] = await Promise.all([
    supabase
      .from('announcements')
      .select('*')
      .or(orParts.join(','))
      .order('sent_at', { ascending: false })
      .limit(20),
    supabase
      .from('announcement_reads')
      .select('announcement_id')
      .eq('user_id', user.id),
  ])

  const readIds = new Set(
    (readsRes.data ?? []).map((r: { announcement_id: string }) => r.announcement_id)
  )
  const announcements = (announcementsRes.data ?? []).map((a: { id: string }) => ({
    ...a,
    is_read: readIds.has(a.id),
  }))
  const unreadCount = announcements.filter((a: { is_read: boolean }) => !a.is_read).length

  return NextResponse.json({ announcements: announcements.slice(0, 5), unreadCount })
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('users').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 422 })

  const { error } = await supabase.from('announcements').insert({
    ...parsed.data,
    sent_by:  user.id,
    sent_at:  new Date().toISOString(),
    target_department: parsed.data.target_department ?? null,
    target_user_id:    parsed.data.target_user_id ?? null,
  })

  return error ? NextResponse.json({ error }, { status: 500 }) : NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { action: string; ids?: string[] }
  if (body.action !== 'mark_read') {
    return NextResponse.json({ error: 'Unknown action' }, { status: 422 })
  }

  // Fetch all announcement IDs targeting this user
  const { data: profile } = await supabase
    .from('users')
    .select('role, department')
    .eq('id', user.id)
    .single()

  const role       = (profile as { role: string } | null)?.role ?? ''
  const department = (profile as { department: string | null } | null)?.department ?? null
  const orParts    = ['target.eq.all', `target.eq.${role}`, `target_user_id.eq.${user.id}`]
  if (department) orParts.push(`target_department.eq.${department}`)

  const { data: all } = await supabase
    .from('announcements')
    .select('id')
    .or(orParts.join(','))

  const rows = (all ?? []).map((a: { id: string }) => ({
    announcement_id: a.id,
    user_id:         user.id,
  }))

  if (rows.length > 0) {
    await supabase.from('announcement_reads').upsert(rows, { ignoreDuplicates: true })
  }

  return NextResponse.json({ success: true })
}
