import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateReview, deleteReview } from '@/lib/supabase/mutations/reviews'

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
  const tab = searchParams.get('tab') ?? 'pending'

  const db = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = db.from('reviews').select('*').order('submitted_at', { ascending: false })
  if (tab === 'pending')  q = q.eq('is_approved', false)
  if (tab === 'approved') q = q.eq('is_approved', true).eq('is_featured', false)
  if (tab === 'featured') q = q.eq('is_featured', true)

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const admin = await guardAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, ...data } = await req.json() as {
    id: string
    body?: string
    is_approved?: boolean
    is_featured?: boolean
  }
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 422 })

  const { error } = await updateReview(id, data)
  return error ? NextResponse.json({ error }, { status: 500 }) : NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const admin = await guardAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json() as { id: string }
  const { error } = await deleteReview(id)
  return error ? NextResponse.json({ error }, { status: 500 }) : NextResponse.json({ success: true })
}
