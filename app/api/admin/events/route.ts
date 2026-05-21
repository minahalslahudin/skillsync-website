import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createEvent, updateEvent, deleteEvent, toggleEventPublished } from '@/lib/supabase/mutations/events'

async function guardAdmin() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClient()
  const { data: profile } = await admin.from('users').select('is_admin').eq('id', user.id).single()
  return profile?.is_admin ? user : null
}

const createSchema = z.object({
  title:                 z.string().min(2),
  slug:                  z.string().min(2),
  description:           z.string().min(1),
  type:                  z.enum(['workshop', 'event', 'cohort']),
  brand:                 z.string().nullable().optional(),
  date:                  z.string(),
  registration_deadline: z.string().nullable().optional(),
  seats:                 z.number().nullable().optional(),
  is_paid:               z.boolean().optional(),
  price:                 z.number().optional(),
  tools_covered:         z.array(z.string()).optional(),
  resources_url:         z.string().nullable().optional(),
  cover_image:           z.string().nullable().optional(),
  form_schema:           z.unknown().optional(),
  is_published:          z.boolean().optional(),
  content:               z.string().nullable().optional(),
})

export async function GET(_req: NextRequest) {
  const admin = await guardAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createAdminClient()
  const { data, error } = await db
    .from('events')
    .select('*, registrations(count)')
    .order('date', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const admin = await guardAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 422 })

  const { is_published, ...rest } = parsed.data
  const { id, error } = await createEvent({
    ...rest,
    is_published:      is_published ?? false,
    registration_open: is_published ?? false,
    is_online:         false,
    tools_covered:     rest.tools_covered ?? [],
    price:             rest.price ?? 0,
    is_paid:           rest.is_paid ?? false,
    form_schema:       (rest.form_schema as Record<string, unknown> | null) ?? null,
  })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ id })
}

export async function PATCH(req: NextRequest) {
  const admin = await guardAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { id, action, ...data } = body as { id: string; action?: string; [k: string]: unknown }
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 422 })

  if (action === 'toggle_published') {
    const { error } = await toggleEventPublished(id, data.published as boolean)
    return error ? NextResponse.json({ error }, { status: 500 }) : NextResponse.json({ success: true })
  }

  const { error } = await updateEvent(id, data as Parameters<typeof updateEvent>[1])
  return error ? NextResponse.json({ error }, { status: 500 }) : NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const admin = await guardAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json() as { id: string }
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 422 })

  const { error } = await deleteEvent(id)
  return error ? NextResponse.json({ error }, { status: 500 }) : NextResponse.json({ success: true })
}
