'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Review } from '@/lib/types/app.types'
import { formatRelative } from '@/lib/utils/formatDate'

// Editorial-bold review carousel.
// Big bordered card, red stars, italic quote in grey Inter, author line below.

interface ReviewCarouselProps {
  reviews: Review[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-red' : 'text-black/15'}`}
          fill="currentColor" viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

const slideVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
}

export default function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const [active, setActive]     = useState(0)
  const [paused, setPaused]     = useState(false)
  const [direction, setDirection] = useState(1)

  const go = useCallback((idx: number) => {
    const next = (idx + reviews.length) % reviews.length
    setDirection(idx > active ? 1 : -1)
    setActive(next)
  }, [active, reviews.length])

  const next = useCallback(() => go(active + 1), [active, go])
  const prev = useCallback(() => go(active - 1), [active, go])

  useEffect(() => {
    if (paused || reviews.length <= 1) return
    const id = setInterval(next, 4500)
    return () => clearInterval(id)
  }, [paused, next, reviews.length])

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-[color:var(--color-gray-mid)] uppercase tracking-[2px] text-sm">
        No reviews yet. Be the first to share.
      </div>
    )
  }

  const review = reviews[active]

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden border-[3px] border-black bg-white min-h-[240px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={review.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="p-8 flex flex-col gap-5"
          >
            <StarRating rating={review.rating} />
            <p className="text-[0.95rem] text-[color:var(--color-gray-dark)] leading-[1.8] italic">
              &ldquo;{review.body}&rdquo;
            </p>

            <div className="flex items-center gap-3 pt-4 border-t-[3px] border-black">
              {review.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={review.photo_url} alt={review.reviewer_name} className="h-10 w-10 object-cover flex-shrink-0 border-[2px] border-black" />
              ) : (
                <div className="h-10 w-10 bg-black flex items-center justify-center flex-shrink-0">
                  <span className="font-editorial text-white text-lg">
                    {review.reviewer_name[0]}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[0.85rem] font-semibold text-black truncate">
                  {review.reviewer_name}
                </p>
                {review.reviewer_role && (
                  <p className="text-[0.7rem] uppercase tracking-[1px] text-[color:var(--color-gray-mid)] truncate">
                    {review.reviewer_role}
                  </p>
                )}
              </div>
              <span className="text-[0.7rem] uppercase tracking-[1px] text-[color:var(--color-gray-mid)] ml-auto flex-shrink-0">
                {formatRelative(review.submitted_at)}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {reviews.length > 1 && (
        <div className="flex items-center justify-between mt-5">
          <div className="flex">
            <button onClick={prev} aria-label="Previous review"
              className="h-10 w-10 border-[3px] border-black bg-white text-black hover:bg-black hover:text-white transition-colors">←</button>
            <button onClick={next} aria-label="Next review"
              className="h-10 w-10 border-[3px] border-l-0 border-black bg-white text-black hover:bg-black hover:text-white transition-colors">→</button>
          </div>

          <div className="flex gap-1.5 items-center">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to review ${i + 1}`}
                className={`h-2 transition-all duration-300 ${
                  i === active ? 'w-8 bg-red' : 'w-2 bg-black/20 hover:bg-black/40'
                }`}
              />
            ))}
          </div>

          <span className="text-[0.72rem] uppercase tracking-[1px] text-[color:var(--color-gray-mid)] tabular-nums">
            {active + 1} / {reviews.length}
          </span>
        </div>
      )}
    </div>
  )
}
