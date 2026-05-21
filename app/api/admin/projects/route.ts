import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createProject, updateProject, deleteProject, toggleProjectPublished } from '@/lib/supabase/mutations/projects'

async function guardAdmin() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClient()
  const { data: profile } = await admin.from('users').select('is_admin').eq('id', user.id).single()
  return profile?.is_admin ? user : null
}

export async function GET(_req: NextRequest) {
  const admin = await guardAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createAdminClient()
  const { data, error } = await db.from('projects').select('*').order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const admin = await guardAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const { id, error } = await createProject(data)
  return error ? NextResponse.json({ error }, { status: 500 }) : NextResponse.json({ id })
}

export async function PATCH(req: NextRequest) {
  const admin = await guardAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, action, ...data } = await req.json() as { id: string; action?: string; [k: string]: unknown }
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 422 })

  if (action === 'toggle_published') {
    const { error } = await toggleProjectPublished(id, data.published as boolean)
    return error ? NextResponse.json({ error }, { status: 500 }) : NextResponse.json({ success: true })
  }

  const { error } = await updateProject(id, data as Parameters<typeof updateProject>[1])
  return error ? NextResponse.json({ error }, { status: 500 }) : NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const admin = await guardAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json() as { id: string }
  const { error } = await deleteProject(id)
  return error ? NextResponse.json({ error }, { status: 500 }) : NextResponse.json({ success: true })
}
