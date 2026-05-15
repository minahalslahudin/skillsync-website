import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { adminReviewReport } from '@/lib/supabase/mutations/reports'

const schema = z.object({
  id:           z.string().uuid(),
  status:       z.enum(['approved', 'rejected']),
  adminComment: z.string().nullable().optional(),
})

export async function PATCH(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('users').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

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
