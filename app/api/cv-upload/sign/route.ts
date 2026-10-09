// Issues a Supabase signed upload URL so the browser can PUT the CV file
// directly to Supabase Storage — the file binary never passes through the
// Vercel serverless function, sidestepping the 4.5 MB request-body limit.
//
// Security guarantees in this flow:
//   • Extension validated here (server-side) before a URL is issued
//   • Storage path is a server-generated UUID — caller filename is discarded
//   • Supabase bucket enforces allowed_mime_types on every direct upload
//   • Bucket enforces size limit; client MUST also check size < 5MB before
//     requesting a URL (browser cannot bypass bucket policy)
//   • Client also validates extension, size, and magic bytes before calling here
//   • The signed URL is single-use and short-lived (Supabase default: ~60 s)
//   • Rate-limited to 5 requests / minute / IP (same bucket as form submits)

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { getExtension, isAllowedExtension, buildStoragePath } from '@/lib/utils/fileValidation'
import { checkRateLimit, getClientIp, rateLimitResponse, RATE_LIMITS } from '@/lib/security/rateLimit'

const schema = z.object({
  filename: z.string().min(1).max(255),
})

export async function POST(req: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────────────────────
  const ip = getClientIp(req)
  const rl = checkRateLimit(`cv-upload:${ip}`, RATE_LIMITS.formSubmit.limit, RATE_LIMITS.formSubmit.windowMs)
  if (!rl.ok) return rateLimitResponse(rl.resetAt)

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid filename.' }, { status: 422 })
  }

  // Server-side extension gate — prevents signed URLs for disallowed types
  // even if the client-side check is bypassed. (The bucket also enforces MIME
  // at upload time, but this rejects earlier without wasting a signed URL.)
  const ext = getExtension(parsed.data.filename)
  if (!isAllowedExtension(ext)) {
    return NextResponse.json(
      { error: 'Only PDF, DOC, and DOCX files are accepted.' },
      { status: 422 }
    )
  }

  // Path is a server-generated UUID + preserved extension — caller filename
  // is discarded entirely. See lib/utils/fileValidation.ts.
  const storagePath = buildStoragePath(parsed.data.filename)

  const admin = createAdminClient()
  const { data, error } = await admin.storage
    .from('cvs')
    .createSignedUploadUrl(storagePath)

  if (error || !data) {
    console.error('[api/cv-upload/sign]', error)
    return NextResponse.json({ error: 'Could not create upload URL.' }, { status: 500 })
  }

  // Return the signed URL and the final storage path.
  // The client will PUT the file to signedUrl, then pass path to /api/applications.
  return NextResponse.json({ signedUrl: data.signedUrl, path: storagePath })
}
