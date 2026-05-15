import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { registerForEvent } from '@/lib/supabase/mutations/events'
import { createServerClient } from '@/lib/supabase/server'

const schema = z.object({
  event_id:  z.string().uuid(),
  form_data: z.record(z.string(), z.unknown()),
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

  // Attach user_id if authenticated
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await registerForEvent({
    event_id:  parsed.data.event_id,
    user_id:   user?.id ?? null,
    form_data: parsed.data.form_data,
  })

  if (error) {
    if (error.includes('unique') || error.includes('duplicate')) {
      return NextResponse.json({ error: 'You are already registered for this event.' }, { status: 409 })
    }
    console.error('[api/events]', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
