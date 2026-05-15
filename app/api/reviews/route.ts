import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { submitReview } from '@/lib/supabase/mutations/reviews'

const schema = z.object({
  reviewer_name: z.string().min(2),
  reviewer_role: z.string().optional().nullable(),
  rating:        z.number().int().min(1).max(5),
  body:          z.string().min(20),
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

  const { error } = await submitReview({
    ...parsed.data,
    reviewer_role: parsed.data.reviewer_role ?? null,
  })

  if (error) {
    console.error('[api/reviews]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
