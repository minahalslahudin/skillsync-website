'use client'

import { useMemo, useState } from 'react'
import type { Review } from '@/lib/types/app.types'
import { formatRelative } from '@/lib/utils/formatDate'

// Editorial-bold reviews grid — 2 columns of bordered cards.
// Red stars, italic quote, bold name, grey role.

type Tab = 'all' | 'skillsync' | 'skillit'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`h-4 w-4 ${i < rating ? 'text-red' : 'text-black/15'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

interface ReviewsGridProps { reviews: Review[] }

export default function ReviewsGrid({ reviews }: ReviewsGridProps) {
  const [tab, setTab] = useState<Tab>('all')
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
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="inline-flex border-[3px] border-black">
          {TABS.map(({ label, value }, i) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={[
                'px-5 py-2 text-[0.78rem] uppercase tracking-[1px] font-semibold transition-colors',
                i > 0 ? 'border-l-[3px] border-black' : '',
                tab === value ? 'bg-black text-white' : 'bg-white text-black hover:bg-[color:var(--color-off-white)]',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setOnlyHighRated((v) => !v)}
          className={[
            'flex items-center gap-2 text-[0.78rem] uppercase tracking-[1px] font-semibold px-4 py-2 border-[3px] border-black transition-colors',
            onlyHighRated ? 'bg-red text-white' : 'bg-white text-black hover:bg-[color:var(--color-off-white)]',
          ].join(' ')}
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          4★ &amp; above{onlyHighRated ? ' · on' : ''}
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-20 text-[color:var(--color-gray-mid)] uppercase tracking-[2px] text-sm">
          No reviews match this filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((review) => (
            <div
              key={review.id}
              className="group border-[3px] border-black bg-white p-6 flex flex-col gap-4 relative transition-colors duration-200 hover:bg-[color:var(--color-off-white)]"
            >
              <span className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-[6px] bg-red transition-all duration-200" />

              <div className="flex items-center justify-between">
                <StarRating rating={review.rating} />
                {review.brand && (
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[2px] px-2 py-0.5 border border-black text-black">
                    {review.brand === 'skillit' ? 'skillIT' : 'skillSYNC'}
                  </span>
                )}
              </div>

              <p className="text-[0.88rem] text-[color:var(--color-gray-dark)] leading-[1.7] italic flex-1">
                &ldquo;{review.body}&rdquo;
              </p>

              {review.workshop_or_service && (
                <span className="text-[0.62rem] uppercase tracking-[2px] text-[color:var(--color-gray-mid)] w-fit">
                  {review.workshop_or_service}
                </span>
              )}

              <div className="flex items-center gap-3 pt-4 border-t-[3px] border-black">
                {review.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={review.photo_url} alt={review.reviewer_name} className="h-9 w-9 object-cover flex-shrink-0 border-[2px] border-black" />
                ) : (
                  <div className="h-9 w-9 bg-black flex items-center justify-center flex-shrink-0">
                    <span className="font-editorial text-white">{review.reviewer_name[0]}</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[0.85rem] font-semibold text-black truncate">{review.reviewer_name}</p>
                  {review.reviewer_role && (
                    <p className="text-[0.7rem] uppercase tracking-[1px] text-[color:var(--color-gray-mid)] truncate">
                      {review.reviewer_role}
                    </p>
                  )}
                </div>
                <span className="text-[0.7rem] uppercase tracking-[1px] text-[color:var(--color-gray-mid)] flex-shrink-0">
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
