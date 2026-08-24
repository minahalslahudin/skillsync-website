import { Suspense } from 'react'
import { getApprovedReviews } from '@/lib/supabase/queries/reviews'
import ReviewsGrid from '@/components/public/ReviewsGrid'
import ReviewForm from '@/components/forms/ReviewForm'
import SectionHeader from '@/components/public/SectionHeader'

export const metadata = {
  title: 'Reviews | skillSYNC × skillIT',
  description: 'Honest words from our learners, builders, and contributors.',
}

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews(100)

  return (
    <>
      <SectionHeader
        eyebrow="Community"
        title="What People Say"
        subtitle="Honest words from our learners, builders, and contributors."
      />

      <div className="p-6 sm:p-10 border-b-[3px] border-black bg-white">
        {reviews.length === 0 ? (
          <p className="text-center py-20 text-[color:var(--color-gray-mid)] uppercase tracking-[2px] text-sm">
            No reviews yet. Be the first to share your experience!
          </p>
        ) : (
          <Suspense fallback={null}>
            <ReviewsGrid reviews={reviews} />
          </Suspense>
        )}
      </div>

      {/* Leave a review */}
      <section>
        <SectionHeader
          eyebrow="Share"
          title="Leave A Review"
          subtitle="Your review will appear after a quick approval. Takes less than 2 minutes."
        />
        <div className="p-6 sm:p-10 border-b-[3px] border-black bg-white">
          <div className="max-w-2xl mx-auto border-[3px] border-black bg-white p-8">
            <ReviewForm />
          </div>
        </div>
      </section>
    </>
  )
}
