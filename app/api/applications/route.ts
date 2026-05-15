import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'

const schema = z.object({
  full_name:             z.string().min(2),
  email:                 z.string().email(),
  phone:                 z.string().optional().nullable(),
  role_applied:          z.string().min(1),
  department_preference: z.string().optional().nullable(),
  motivation:            z.string().min(50),
  skills:                z.array(z.string()).min(1),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed' },
      { status: 422 }
    )
  }

  const supabase = createServerClient()
  const { error } = await supabase.from('applications').insert({
    ...parsed.data,
    status:       'pending',
    submitted_at: new Date().toISOString(),
  })

  if (error) {
    console.error('[api/applications]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
