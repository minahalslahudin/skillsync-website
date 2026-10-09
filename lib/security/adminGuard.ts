// ─────────────────────────────────────────────────────────────────────────────
// Shared admin-guard + rate-limit helper for /api/admin/* routes.
// Replaces the copy-pasted `guardAdmin()` that lived in every admin route.
// ─────────────────────────────────────────────────────────────────────────────

import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit, getClientIp, rateLimitResponse, RATE_LIMITS } from './rateLimit'

export type AdminGuardBucket = 'read' | 'write'

export interface AdminGuardResult {
  ok: boolean
  /** 401/403/429 response to return immediately if !ok */
  response?: Response
  /** authenticated admin user; only present when ok:true */
  user?: { id: string; email?: string | null }
  /** admin name (for audit trails); best-effort */
  adminName?: string
}

/**
 * Verify the caller is a valid, admin-flagged user AND has not exceeded the
 * relevant per-IP rate limit. Uses `getUser()` (not `getSession()`) so the
 * check hits Supabase and can't be spoofed by cookie tampering.
 *
 * Usage:
 *   const guard = await guardAdmin(req, 'write')
 *   if (!guard.ok) return guard.response
 *   const admin = guard.user
 */
export async function guardAdmin(
  req: NextRequest,
  bucket: AdminGuardBucket = 'read',
): Promise<AdminGuardResult> {
  // ── Rate limit ────────────────────────────────────────────────────────────
  const ip     = getClientIp(req)
  const preset = bucket === 'write' ? RATE_LIMITS.authedWrite : RATE_LIMITS.read
  const rl     = checkRateLimit(`admin:${bucket}:${ip}`, preset.limit, preset.windowMs)
  if (!rl.ok) return { ok: false, response: rateLimitResponse(rl.resetAt) }

  // ── Session check via getUser() (verified against Supabase) ───────────────
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  // ── Admin role check ─────────────────────────────────────────────────────
  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('users')
    .select('is_admin, full_name')
    .eq('id', user.id)
    .single()

  const isAdmin = (profile as { is_admin?: boolean } | null)?.is_admin === true
  if (!isAdmin) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    }
  }

  return {
    ok:        true,
    user:      { id: user.id, email: user.email },
    adminName: (profile as { full_name?: string } | null)?.full_name ?? '',
  }
}
