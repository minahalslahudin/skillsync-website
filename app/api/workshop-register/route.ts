import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const full_name       = formData.get('full_name')?.toString().trim() ?? ''
  const email           = formData.get('email')?.toString().trim() ?? ''
  const phone           = formData.get('phone')?.toString().trim() ?? ''
  const university      = formData.get('university')?.toString().trim() ?? ''
  const semester        = formData.get('semester')?.toString().trim() ?? ''
  const skill_level     = formData.get('skill_level')?.toString().trim() ?? ''
  const reason          = formData.get('reason')?.toString().trim() ?? ''
  const committed       = formData.get('committed')?.toString() === 'true'
  const referral_source = formData.get('referral_source')?.toString().trim() ?? ''
  const workshop_id     = formData.get('workshop_id')?.toString().trim() || 'n8n-launchpad-may-2026'
  const receiptFile     = formData.get('payment_receipt') as File | null

  if (!full_name || !email || !phone || !university || !semester || !skill_level || !reason || !referral_source) {
    return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 422 })
  }
  if (reason.length < 50) {
    return NextResponse.json({ error: 'Reason must be at least 50 characters.' }, { status: 422 })
  }
  if (!committed) {
    return NextResponse.json({ error: 'Full commitment is required to secure your seat.' }, { status: 422 })
  }
  if (!receiptFile || receiptFile.size === 0) {
    return NextResponse.json({ error: 'Payment receipt is required.' }, { status: 422 })
  }

  const adminClient = createAdminClient()

  // Upload receipt to Supabase Storage using service role
  let payment_receipt_url: string | null = null
  try {
    const ext      = (receiptFile.name.split('.').pop() ?? 'jpg').toLowerCase()
    const safeName = email.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    const fileName = `${Date.now()}_${safeName}.${ext}`
    const buffer   = Buffer.from(await receiptFile.arrayBuffer())

    const { data: uploadData, error: uploadError } = await adminClient
      .storage
      .from('payment-receipts')
      .upload(fileName, buffer, { contentType: receiptFile.type, upsert: false })

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
    // Non-fatal: the registration was already saved; seats_taken will be corrected
    // by the next query that reads from workshop_registrations directly.
    console.warn('[workshop-register] increment_seats_taken skipped:', err)
  }

  return NextResponse.json({ success: true })
}
