import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { updateReview, deleteReview } from '@/lib/supabase/mutations/reviews'

async function guardAdmin() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('users').select('is_admin').eq('id', user.id).single()
  return profile?.is_admin ? user : null
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
