'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Review } from '@/lib/types/app.types'

type Tab = 'pending' | 'approved' | 'featured'

export default function AdminReviewsPage() {
  const [tab,      setTab]      = useState<Tab>('pending')
  const [reviews,  setReviews]  = useState<Review[]>([])
  const [loading,  setLoading]  = useState(true)
  const [editBody, setEditBody] = useState<{ id: string; body: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase.from('reviews').select('*').order('submitted_at', { ascending: false })
    if (tab === 'pending')  q = q.eq('is_approved', false)
    if (tab === 'approved') q = q.eq('is_approved', true).eq('is_featured', false)
    if (tab === 'featured') q = q.eq('is_featured', true)
    const { data } = await q
    setReviews((data as Review[]) ?? [])
    setLoading(false)
  }, [tab])

  useEffect(() => { load() }, [load])

  async function patch(id: string, body: Record<string, unknown>) {
    await fetch('/api/admin/reviews', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id, ...body }),
    })
    load()
  }

  async function del(id: string) {
    if (!confirm('Delete this review?')) return
    await fetch('/api/admin/reviews', {
      method:  'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id }),
    })
    load()
  }

  async function saveBody() {
    if (!editBody) return
    await patch(editBody.id, { body: editBody.body })
    setEditBody(null)
  }

  function stars(n: number) {
    return '★'.repeat(Math.max(0, Math.min(5, n))) + '☆'.repeat(5 - Math.max(0, Math.min(5, n)))
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'pending',  label: 'Pending'  },
    { key: 'approved', label: 'Approved' },
    { key: 'featured', label: 'Featured' },
  ]

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Reviews</h1>
        <p className="text-sm text-zinc-500 mt-0.5">{reviews.length} {tab}</p>
      </div>

      <div className="flex gap-1 p-1 bg-brand-surface/50 rounded-lg w-fit border border-brand-muted/20">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded text-sm transition-colors ${
              tab === t.key ? 'bg-brand-accent text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-zinc-500 text-sm text-center py-16">Loading…</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-xl border border-brand-muted/20 bg-brand-surface/50 space-y-3 flex flex-col"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-zinc-200 text-sm">{rev.reviewer_name}</p>
                  <p className="text-xs text-zinc-500">{rev.reviewer_role ?? 'Participant'}</p>
                </div>
                <span className="text-amber-400 text-xs font-mono shrink-0">{stars(rev.rating)}</span>
              </div>

              {editBody?.id === rev.id ? (
                <div className="space-y-2 flex-1">
                  <textarea
                    value={editBody.body}
                    onChange={(e) => setEditBody({ ...editBody, body: e.target.value })}
                    rows={4}
                    className="w-full text-xs bg-brand-bg border border-brand-muted/30 rounded px-2 py-1.5 text-zinc-300 resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={saveBody} className="text-xs px-2.5 py-1 rounded bg-brand-accent text-white">Save</button>
                    <button onClick={() => setEditBody(null)} className="text-xs px-2.5 py-1 rounded border border-brand-muted/30 text-zinc-400">Cancel</button>
                  </div>
                </div>
              ) : (
                <p
                  className="text-sm text-zinc-400 line-clamp-3 flex-1 cursor-pointer hover:text-zinc-300 transition-colors"
                  onClick={() => setEditBody({ id: rev.id, body: rev.body })}
                  title="Click to edit"
                >
                  {rev.body}
                </p>
              )}

              {(rev.workshop_or_service || rev.brand) && (
                <p className="text-xs text-zinc-500">
                  {rev.brand && <span className="text-brand-accent">{rev.brand}{rev.workshop_or_service ? ' · ' : ''}</span>}
                  {rev.workshop_or_service}
                </p>
              )}

              <div className="flex gap-2 pt-1 flex-wrap">
                {tab === 'pending' && (
                  <button
                    onClick={() => patch(rev.id, { is_approved: true })}
                    className="text-xs px-2.5 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                  >
                    Approve
                  </button>
                )}
                {tab === 'approved' && (
                  <>
                    <button
                      onClick={() => patch(rev.id, { is_featured: true })}
                      className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                    >
                      Feature
                    </button>
                    <button
                      onClick={() => patch(rev.id, { is_approved: false })}
                      className="text-xs px-2.5 py-1 rounded bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 hover:bg-zinc-500/20"
                    >
                      Un-approve
                    </button>
                  </>
                )}
                {tab === 'featured' && (
                  <button
                    onClick={() => patch(rev.id, { is_featured: false })}
                    className="text-xs px-2.5 py-1 rounded bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 hover:bg-zinc-500/20"
                  >
                    Un-feature
                  </button>
                )}
                <button
                  onClick={() => del(rev.id)}
                  className="text-xs px-2.5 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <p className="text-zinc-500 text-sm col-span-full text-center py-16">
              No {tab} reviews
            </p>
          )}
        </div>
      )}
    </div>
  )
}
