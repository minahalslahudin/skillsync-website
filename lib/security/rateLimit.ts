// ─────────────────────────────────────────────────────────────────────────────
// In-memory rate limiter — per-IP, per-bucket, sliding-window (fixed epoch).
// ─────────────────────────────────────────────────────────────────────────────
// Suitable for a single Vercel serverless instance. On multi-instance / cold
// starts each instance starts fresh, so the practical ceiling per IP is
// `limit × instances_per_window`. Good enough as a first line of defence
// against form spam and brute force. Upgrade to `@upstash/ratelimit + Redis`
// (or Vercel KV) before serious production traffic.

import type { NextRequest } from 'next/server'

interface BucketState { count: number; resetAt: number }

// One shared Map for the process. Guarded on globalThis so hot-reload in dev
// doesn't create duplicate maps that let requests slip through.
const g = globalThis as unknown as { __rateLimitStore?: Map<string, BucketState> }
const store: Map<string, BucketState> = g.__rateLimitStore ?? new Map()
if (!g.__rateLimitStore) g.__rateLimitStore = store

// Best-effort real-IP extraction. On Vercel `x-forwarded-for` is the client
// chain; the first value is the actual client. We fall back to a static
// bucket to avoid crashing when running behind proxies that strip headers.
export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  const real = req.headers.get('x-real-ip')
  if (real) return real
  // NextRequest.ip is available on Edge runtime but its type varies by version.
  // Access via cast so the type-check works regardless of the shipped .d.ts.
  const ipProp = (req as unknown as { ip?: string }).ip
  return ipProp ?? 'unknown'
}

export interface RateLimitResult {
  ok: boolean
  remaining: number
  resetAt: number
}

/**
 * Check-and-increment. Returns ok:false when the caller has exceeded `limit`
 * within the current window. Windows are fixed at the epoch (`floor(now / ms)`)
 * so buckets across instances line up.
 *
 * @param key    caller identity (usually `${route}:${ip}`)
 * @param limit  max requests allowed in the window
 * @param windowMs  window size in ms (default 60_000 = 1 minute)
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs = 60_000,
): RateLimitResult {
  const now       = Date.now()
  const windowIdx = Math.floor(now / windowMs)
  const bucketKey = `${key}:${windowIdx}`
  const resetAt   = (windowIdx + 1) * windowMs

  // Cheap opportunistic GC — every ~200 calls, drop expired buckets.
  // (Array.from avoids the downlevelIteration TS constraint on Map iterators.)
  if (Math.random() < 0.005) {
    Array.from(store.entries()).forEach(([k, v]) => {
      if (v.resetAt <= now) store.delete(k)
    })
  }

  const cur = store.get(bucketKey)
  if (!cur) {
    store.set(bucketKey, { count: 1, resetAt })
    return { ok: true, remaining: limit - 1, resetAt }
  }

  if (cur.count >= limit) {
    return { ok: false, remaining: 0, resetAt: cur.resetAt }
  }

  cur.count += 1
  return { ok: true, remaining: limit - cur.count, resetAt: cur.resetAt }
}

// Standard 429 response shape used across every API route.
export function rateLimitResponse(resetAt: number) {
  const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000))
  return new Response(
    JSON.stringify({ error: 'Too many requests' }),
    {
      status: 429,
      headers: {
        'content-type': 'application/json',
        'retry-after':  String(retryAfter),
      },
    },
  )
}

// Preset limits per the security brief.
export const RATE_LIMITS = {
  // Public form submissions (contact, apply, register, review, newsletter…)
  formSubmit:  { limit: 5,  windowMs: 60_000 },
  // Authenticated write endpoints (report submission, mark-read, etc.)
  authedWrite: { limit: 20, windowMs: 60_000 },
  // Read endpoints (announcement fetch, admin GETs…)
  read:        { limit: 20, windowMs: 60_000 },
} as const
