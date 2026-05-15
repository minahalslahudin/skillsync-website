import { createServerClient } from '@/lib/supabase/server'

export async function submitReview(data: {
  reviewer_name:       string
  reviewer_role:       string | null
  workshop_or_service: string | null
  rating:              number
  body:                string
  brand:               string | null
  photo_url:           string | null
}): Promise<{ error: string | null }> {
  const supabase = createServerClient()
  const { error } = await supabase.from('reviews').insert({
    reviewer_name:       data.reviewer_name,
    reviewer_role:       data.reviewer_role,
    workshop_or_service: data.workshop_or_service,
    rating:              data.rating,
    body:                data.body,
    brand:               data.brand,
    photo_url:           data.photo_url,
    is_approved:         false,
    submitted_at:        new Date().toISOString(),
  })
  return { error: error?.message ?? null }
}
