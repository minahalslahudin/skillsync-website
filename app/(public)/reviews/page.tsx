import { getApprovedReviews } from '@/lib/supabase/queries/reviews'
import ReviewCarousel from '@/components/public/ReviewCarousel'
import ReviewForm from '@/components/forms/ReviewForm'

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews(20)

  return (
    <div className="py-20">
      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="mb-10">
          <p className="text-brand-accent text-sm font-semibold tracking-widest uppercase mb-3">Community</p>
          <h1 className="text-4xl md:text-5xl font-display font-black text-brand-light">
            What people say
          </h1>
          <p className="mt-4 text-gray-400 max-w-xl">
            Honest words from our learners, builders, and contributors.
          </p>
        </div>
        <ReviewCarousel reviews={reviews} />
      </section>

      {/* Leave a review */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-brand-muted/20 bg-brand-mid p-8">
          <h2 className="text-2xl font-display font-bold text-brand-light mb-2">
            Share your experience
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Your review will appear after a quick approval. Takes less than 2 minutes.
          </p>
          <ReviewForm />
        </div>
      </section>
    </div>
  )
}
