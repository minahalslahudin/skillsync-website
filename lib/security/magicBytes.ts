// ─────────────────────────────────────────────────────────────────────────────
// File signature (magic bytes) verification.
// ─────────────────────────────────────────────────────────────────────────────
// Content-Type on multipart uploads is caller-controlled — the browser sends
// whatever it likes. Extension can be faked too. This module reads the actual
// bytes at the start of the file and checks them against the fingerprint of
// each allowed type. Anything unrecognised is rejected.

export type DetectedType =
  | 'pdf'
  | 'doc'   // legacy MS Word (OLE Compound Document)
  | 'docx'  // OOXML zip container
  | 'jpeg'
  | 'png'
  | null

function eq(bytes: Uint8Array, offset: number, sig: number[]): boolean {
  if (bytes.length < offset + sig.length) return false
  for (let i = 0; i < sig.length; i++) if (bytes[offset + i] !== sig[i]) return false
  return true
}

/**
 * Inspect the first bytes of a buffer and return the detected type,
 * or null if it doesn't match any allowed signature.
 */
export function detectFileType(bytes: Uint8Array): DetectedType {
  // ── PDF: %PDF-  (0x25 50 44 46 2D)
  if (eq(bytes, 0, [0x25, 0x50, 0x44, 0x46, 0x2D])) return 'pdf'

  // ── PNG: 89 50 4E 47 0D 0A 1A 0A
  if (eq(bytes, 0, [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) return 'png'

  // ── JPEG: FF D8 FF (any variant — JFIF/EXIF/etc)
  if (eq(bytes, 0, [0xFF, 0xD8, 0xFF])) return 'jpeg'

  // ── DOCX / OOXML: zip container — PK\x03\x04
  // Distinguish from generic zip only by extension/mime downstream; the zip
  // signature is what matters for "is this a plausible docx".
  if (eq(bytes, 0, [0x50, 0x4B, 0x03, 0x04])) return 'docx'

  // ── DOC (legacy OLE Compound Document): D0 CF 11 E0 A1 B1 1A E1
  if (eq(bytes, 0, [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1])) return 'doc'

  return null
}

// ── Allowed sets per upload flow ────────────────────────────────────────────
export const RECEIPT_ALLOWED_TYPES = ['pdf', 'jpeg', 'png'] as const
export const CV_ALLOWED_TYPES      = ['pdf', 'doc', 'docx']  as const

export const RECEIPT_ALLOWED_MIME = [
  'image/jpeg',
  'image/png',
  'application/pdf',
] as const

export const CV_ALLOWED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const

export function extensionForType(t: Exclude<DetectedType, null>): string {
  switch (t) {
    case 'pdf':  return 'pdf'
    case 'doc':  return 'doc'
    case 'docx': return 'docx'
    case 'jpeg': return 'jpg'
    case 'png':  return 'png'
  }
}

// Max upload size across the site (post-hardening). Applies to CV and receipt.
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5 MB
