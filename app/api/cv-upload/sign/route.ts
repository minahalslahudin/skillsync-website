// Issues a Supabase signed upload URL so the browser can PUT the CV file
// directly to Supabase Storage — the file binary never passes through the
// Vercel serverless function, sidestepping the 4.5 MB request-body limit.
//
// Security guarantees in this flow:
//   • Extension validated here (server-side) before a URL is issued
//   • Filename is sanitized before it becomes the storage path
//   • Supabase bucket enforces allowed_mime_types on every direct upload
//   • Client also validates extension, size, and magic bytes before calling here
//   • The signed URL is single-use and short-lived (Supabase default: ~60 s)

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { getExtension, isAllowedExtension, buildStoragePath } from '@/lib/utils/fileValidation'

const schema = z.object({
  filename: z.string().min(1).max(255),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid filename.' }, { status: 422 })
  }

  // Server-side extension gate — prevents signed URLs for disallowed types
  // even if the client-side check is bypassed.
  const ext = getExtension(parsed.data.filename)
  if (!isAllowedExtension(ext)) {
    return NextResponse.json(
      { error: 'Only PDF, DOC, and DOCX files are accepted.' },
      { status: 422 }
    )
  }

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
