import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { adminReviewReport } from '@/lib/supabase/mutations/reports'

const schema = z.object({
  id:           z.string().uuid(),
  status:       z.enum(['approved', 'rejected']),
  adminComment: z.string().nullable().optional(),
})

async function guardAdmin() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClient()
  const { data: profile } = await admin.from('users').select('is_admin').eq('id', user.id).single()
  return profile?.is_admin ? user : null
}

export async function GET(req: NextRequest) {
  const admin = await guardAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const filterWeek   = searchParams.get('week')   ?? ''
  const filterUser   = searchParams.get('user')   ?? ''
  const filterStatus = searchParams.get('status') ?? ''

  const db = createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = db.from('reports').select('*').order('week_ending', { ascending: false }).order('submitted_at', { ascending: false })
  if (filterWeek)   q = q.eq('week_ending', filterWeek)
  if (filterUser)   q = q.eq('user_id', filterUser)
  if (filterStatus) q = q.eq('status', filterStatus)

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = (data ?? []) as Array<Record<string, unknown> & { user_id: string }>

  // Submission rate for current week
  const today = new Date()
  const daysToSunday = today.getDay() === 0 ? 0 : 7 - today.getDay()
  const sunday = new Date(today)
  sunday.setDate(today.getDate() + daysToSunday)
  const weekEnding = sunday.toISOString().split('T')[0]

  const [{ count: total }, { count: submitted }] = await Promise.all([
    db.from('users').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    db.from('reports').select('id', { count: 'exact', head: true }).eq('week_ending', weekEnding),
  ])

  if (rows.length === 0) {
    return NextResponse.json({ reports: [], rate: { submitted: submitted ?? 0, total: total ?? 0 } })
  }

  const userIds = Array.from(new Set(rows.map((r) => r.user_id)))
  const { data: usersData } = await db.from('users').select('id, full_name, avatar_url').in('id', userIds)

  const userMap: Record<string, { full_name: string; avatar_url: string | null }> = {}
  for (const u of (usersData ?? []) as Array<{ id: string; full_name: string; avatar_url: string | null }>) {
    userMap[u.id] = u
  }

  const reports = rows.map((r) => ({
    ...r,
    user_full_name:  userMap[r.user_id]?.full_name  ?? 'Unknown',
    user_avatar_url: userMap[r.user_id]?.avatar_url ?? null,
  }))

  return NextResponse.json({ reports, rate: { submitted: submitted ?? 0, total: total ?? 0 } })
}

export async function PATCH(req: NextRequest) {
  const admin = await guardAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 422 })

  const { id, status, adminComment } = parsed.data
  const { error } = await adminReviewReport(id, status, adminComment ?? null)
  return error ? NextResponse.json({ error }, { status: 500 }) : NextResponse.json({ success: true })
}
