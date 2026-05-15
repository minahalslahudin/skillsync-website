import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createProject, updateProject, deleteProject, toggleProjectPublished } from '@/lib/supabase/mutations/projects'

async function guardAdmin() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('users').select('is_admin').eq('id', user.id).single()
  return profile?.is_admin ? user : null
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
