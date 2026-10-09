import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerClient } from '@/lib/supabase/server'
import { checkRateLimit, getClientIp, rateLimitResponse, RATE_LIMITS } from '@/lib/security/rateLimit'
import { sanitizePlain, sanitizeEmail, isValidEmail, MAX_LEN } from '@/lib/security/sanitize'
import {
  detectFileType,
  extensionForType,
  RECEIPT_ALLOWED_TYPES,
  RECEIPT_ALLOWED_MIME,
  MAX_UPLOAD_BYTES,
} from '@/lib/security/magicBytes'

// ─────────────────────────────────────────────────────────────────────────────
// Paid workshop registration + payment receipt upload.
//
// Security posture (post Aug 2026 hardening):
//   • Rate-limited: 5 submissions per minute per IP.
//   • Every text field sanitized (HTML stripped) and length-capped.
//   • Receipt file: <= 5 MB, magic-byte signature verified (jpeg/png/pdf),
//     Content-Type also checked, filename discarded and replaced with UUID.
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────────────────────
  const ip = getClientIp(req)
  const rl = checkRateLimit(`workshop-register:${ip}`, RATE_LIMITS.formSubmit.limit, RATE_LIMITS.formSubmit.windowMs)
  if (!rl.ok) return rateLimitResponse(rl.resetAt)

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  // ── Extract + sanitize inputs ────────────────────────────────────────────
  const full_name       = sanitizePlain(formData.get('full_name'))
  const email           = sanitizeEmail(formData.get('email'))
  const phone           = sanitizePlain(formData.get('phone'))
  const university      = sanitizePlain(formData.get('university'))
  const semester        = sanitizePlain(formData.get('semester'))
  const skill_level     = sanitizePlain(formData.get('skill_level'))
  const reason          = sanitizePlain(formData.get('reason'))
  const committed       = formData.get('committed')?.toString() === 'true'
  const referral_source = sanitizePlain(formData.get('referral_source'))
  const workshop_id     = sanitizePlain(formData.get('workshop_id')) || 'n8n-launchpad-may-2026'
  const receiptFile     = formData.get('payment_receipt') as File | null

  // Length caps — reject anything absurd BEFORE hitting the DB.
  if (full_name.length > MAX_LEN.name || full_name.length < 2)          return bad('Enter your full name.')
  if (!isValidEmail(email))                                             return bad('Enter a valid email address.')
  if (phone.length > MAX_LEN.phone || phone.length < 5)                 return bad('Enter a valid phone number.')
  if (university.length > MAX_LEN.university || university.length < 2)  return bad('University is required.')
  if (semester.length > MAX_LEN.semester)                               return bad('Semester value is too long.')
  if (skill_level.length > MAX_LEN.short_answer)                        return bad('Skill level value is too long.')
  if (referral_source.length > MAX_LEN.short_answer)                    return bad('Referral source is too long.')
  if (workshop_id.length > MAX_LEN.slug)                                return bad('Invalid workshop.')

  if (!full_name || !email || !phone || !university || !semester || !skill_level || !reason || !referral_source) {
    return bad('All required fields must be filled.', 422)
  }
  if (reason.length < 50)          return bad('Reason must be at least 50 characters.', 422)
  if (reason.length > MAX_LEN.motivation) return bad('Reason is too long.', 422)
  if (!committed)                  return bad('Full commitment is required to secure your seat.', 422)
  if (!receiptFile || receiptFile.size === 0) return bad('Payment receipt is required.', 422)

  // ── Server-side file validation ──────────────────────────────────────────
  //
  //  1. Size cap: 5 MB.
  if (receiptFile.size > MAX_UPLOAD_BYTES) {
    return bad('Receipt is too large — max 5 MB.', 413)
  }

  //  2. Content-Type: only jpeg/png/pdf allowed. (Header is caller-controlled;
  //     this is a first-line check — real check is magic bytes below.)
  const contentType = (receiptFile.type || '').toLowerCase()
  if (!(RECEIPT_ALLOWED_MIME as readonly string[]).includes(contentType)) {
    return bad('Receipt must be a JPEG, PNG, or PDF.', 415)
  }

  //  3. Magic bytes: read the first bytes and verify the fingerprint.
  const buffer = Buffer.from(await receiptFile.arrayBuffer())
  const kind   = detectFileType(new Uint8Array(buffer.subarray(0, 16)))
  if (!kind || !(RECEIPT_ALLOWED_TYPES as readonly string[]).includes(kind)) {
    return bad('Receipt file signature does not match an accepted type (JPEG/PNG/PDF).', 415)
  }
  //  Cross-check MIME/magic mismatch (e.g. .png bytes labelled as pdf).
  const expectedMime =
    kind === 'pdf'  ? 'application/pdf' :
    kind === 'jpeg' ? 'image/jpeg' :
                      'image/png'
  if (contentType !== expectedMime) {
    return bad('Receipt file type and content do not match.', 415)
  }

  //  4. Rename to UUID — caller filename is discarded.
  const fileName = `${randomUUID()}.${extensionForType(kind)}`

  const adminClient = createAdminClient()

  // Upload receipt to Supabase Storage using service role
  let payment_receipt_url: string | null = null
  try {
    const { data: uploadData, error: uploadError } = await adminClient
      .storage
      .from('payment-receipts')
      .upload(fileName, buffer, { contentType: expectedMime, upsert: false })

    if (uploadError) {
      console.error('[workshop-register] storage:', uploadError.message)
      return NextResponse.json({ error: 'Failed to upload receipt. Please try again.' }, { status: 500 })
    }

    const { data: { publicUrl } } = adminClient
      .storage
      .from('payment-receipts')
      .getPublicUrl(uploadData.path)

    payment_receipt_url = publicUrl
  } catch (err) {
    console.error('[workshop-register] file processing:', err)
    return NextResponse.json({ error: 'Failed to process receipt file.' }, { status: 500 })
  }

  // Insert registration (use server client so RLS insert policy applies)
  const supabase = createServerClient()
  const { error: insertError } = await supabase
    .from('workshop_registrations')
    .insert({
      full_name,
      email,
      phone,
      university,
      semester,
      skill_level,
      reason,
      committed,
      referral_source,
      payment_receipt_url,
      workshop_id,
      status: 'pending',
    })

  if (insertError) {
    console.error('[workshop-register] insert:', insertError.message)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }

  // Keep events.seats_taken in sync so capacity checks elsewhere stay accurate
  try {
    const { data: eventRow } = await adminClient
      .from('events')
      .select('id')
      .eq('slug', workshop_id)
      .single()
    if (eventRow) {
      await adminClient.rpc('increment_seats_taken', { event_id: eventRow.id })
    }
  } catch (err) {
    console.warn('[workshop-register] increment_seats_taken skipped:', err)
  }

  return NextResponse.json({ success: true })
}

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}
