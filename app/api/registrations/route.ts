import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { createRegistration } from '@/lib/supabase/mutations/events'

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
      { status: 422 },
    )
  }

  const { event_id, form_data } = parsed.data
  const supabase = createServerClient()

  // Fetch event to verify seats + deadline
  const { data: event } = await supabase
    .from('events')
    .select('seats, seats_taken, registration_deadline, date, registration_open')
    .eq('id', event_id)
    .single()

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  if (!event.registration_open) {
    return NextResponse.json({ error: 'Registration is closed' }, { status: 422 })
  }

  // Check deadline
  const deadlineDate = event.registration_deadline
    ? new Date(event.registration_deadline as string)
    : event.date
    ? new Date(event.date as string)
    : null
  if (deadlineDate && deadlineDate < new Date()) {
    return NextResponse.json({ error: 'Registration deadline has passed' }, { status: 422 })
  }

  // Check capacity
  if (event.seats !== null && (event.seats_taken as number) >= (event.seats as number)) {
    return NextResponse.json({ error: 'This event is full' }, { status: 409 })
  }

  // Attach user_id if authenticated
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await createRegistration({
    event_id,
    user_id: user?.id ?? null,
    form_data,
  })

  if (error) {
    if (error.includes('unique') || error.includes('duplicate')) {
      return NextResponse.json(
        { error: 'You are already registered for this event.' },
        { status: 409 },
      )
    }
    console.error('[api/registrations]', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
