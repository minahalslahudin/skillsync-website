'use client'

import { useMemo, useState } from 'react'
import type { Review } from '@/lib/types/app.types'
import { formatRelative } from '@/lib/utils/formatDate'

type Tab = 'all' | 'skillsync' | 'skillit'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-brand-muted/30'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

interface ReviewsGridProps {
  reviews: Review[]
}

export default function ReviewsGrid({ reviews }: ReviewsGridProps) {
  const [tab, setTab]             = useState<Tab>('all')
  const [onlyHighRated, setOnlyHighRated] = useState(false)

  const filtered = useMemo(() => {
    let result = reviews
    if (tab === 'skillsync') result = result.filter((r) => !r.brand || r.brand === 'skillsync')
    if (tab === 'skillit')   result = result.filter((r) => r.brand === 'skillit')
    if (onlyHighRated)       result = result.filter((r) => r.rating >= 4)
    return result
  }, [reviews, tab, onlyHighRated])

  const TABS: { label: string; value: Tab }[] = [
    { label: 'All',       value: 'all' },
    { label: 'skillSYNC', value: 'skillsync' },
    { label: 'skillIT',   value: 'skillit' },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        {/* Tab switcher */}
        <div className="flex gap-1 p-1 rounded-xl bg-brand-mid border border-brand-muted/20">
          {TABS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 ${
                tab === value
                  ? 'bg-brand-accent text-white shadow'
                  : 'text-brand-muted hover:text-brand-light'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Star filter */}
        <button
          onClick={() => setOnlyHighRated((v) => !v)}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors duration-200 ${
            onlyHighRated
              ? 'bg-yellow-400/10 border-yellow-400/40 text-yellow-400'
              : 'border-brand-muted/30 text-brand-muted hover:border-yellow-400/40 hover:text-yellow-400'
          }`}
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          4 stars and above{onlyHighRated ? ' (on)' : ''}
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center py-20 text-brand-muted">No reviews match this filter.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-brand-muted/20 bg-brand-mid p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(233,69,96,0.1)] hover:border-brand-accent/30"
            >
              {/* Rating + brand */}
              <div className="flex items-center justify-between">
                <StarRating rating={review.rating} />
                {review.brand && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    review.brand === 'skillit'
                      ? 'text-[#7dd3da] bg-[#0F6B7A]/10 border-[#0F6B7A]/30'
                      : 'text-brand-accent bg-brand-accent/10 border-brand-accent/20'
                  }`}>
                    {review.brand === 'skillit' ? 'skillIT' : 'skillSYNC'}
                  </span>
                )}
              </div>

              {/* Body */}
              <p className="text-sm text-gray-300 leading-relaxed flex-1">
                &ldquo;{review.body}&rdquo;
              </p>

              {/* Workshop/service tag */}
              {review.workshop_or_service && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-muted/10 border border-brand-muted/20 text-brand-muted w-fit">
                  {review.workshop_or_service}
                </span>
              )}

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-brand-muted/15">
                {review.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={review.photo_url}
                    alt={review.reviewer_name}
                    className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-brand-accent">
                      {review.reviewer_name[0]}
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-brand-light truncate">{review.reviewer_name}</p>
                  {review.reviewer_role && (
                    <p className="text-xs text-brand-muted truncate">{review.reviewer_role}</p>
                  )}
                </div>
                <span className="text-xs text-brand-muted flex-shrink-0">
                  {formatRelative(review.submitted_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
