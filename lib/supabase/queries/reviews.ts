import { createServerClient } from '@/lib/supabase/server'
import type { Review } from '@/lib/types/app.types'

export async function getApprovedReviews(limit = 10): Promise<Review[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_approved', true)
    .order('is_featured', { ascending: false })
    .order('submitted_at', { ascending: false })
    .limit(limit)
  if (error) console.error('[reviews] getApprovedReviews:', error.message)
  return (data as Review[]) ?? []
}
