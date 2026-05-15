import { createServerClient } from '@/lib/supabase/server'

export async function submitReview(data: {
  reviewer_name: string
  reviewer_role: string | null
  rating: number
  body: string
}): Promise<{ error: string | null }> {
  const supabase = createServerClient()
  const { error } = await supabase.from('reviews').insert({
    ...data,
    author_name: data.reviewer_name,
    author_role: data.reviewer_role,
    is_approved: false,
    submitted_at: new Date().toISOString(),
  })
  return { error: error?.message ?? null }
}
