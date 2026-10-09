// Server-only utilities for CV upload handling.
//
// ── Security posture (post Aug 2026 hardening) ────────────────────────────
// - Max size reduced from 20 MB → 5 MB (bucket policy is 20 MB; app enforces
//   5 MB before signing an upload URL and rejects anything larger).
// - Storage paths use a server-generated UUID; the caller-supplied filename
//   is discarded entirely. This eliminates any filename-injection vector.
// - Extension is derived from the sanitized value of the caller-supplied
//   filename (only used to preserve the extension for downloads) — the base
//   name never appears on disk.

import { randomUUID } from 'node:crypto'

export const CV_MAX_BYTES          = 5 * 1024 * 1024  // 5 MB
export const CV_MAX_MB             = 5
export const CV_ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'] as const
export const CV_ALLOWED_MIME       = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const
type CVExt = typeof CV_ALLOWED_EXTENSIONS[number]

export function getExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() ?? ''
}

export function isAllowedExtension(ext: string): ext is CVExt {
  return (CV_ALLOWED_EXTENSIONS as readonly string[]).includes(ext)
}

/**
 * Server-generated storage path with a UUID basename. The caller-supplied
 * filename is completely discarded — we only keep the extension so downloads
 * open in the right application.
 *
 * Format: `uploads/<uuid>.<ext>`
 * Regex:  /^uploads\/[a-f0-9-]{36}\.(pdf|doc|docx)$/
 */
export function buildStoragePath(originalFilename: string): string {
  const ext = getExtension(originalFilename)
  const safeExt = isAllowedExtension(ext) ? ext : 'bin'
  return `uploads/${randomUUID()}.${safeExt}`
}

/**
 * Matching regex for the shape produced by buildStoragePath — used by
 * /api/applications to validate the cv_url a client submits after upload.
 * UUID v4 pattern is not enforced strictly; any 36-char hex/dash string in the
 * uploads/ prefix with an allowed extension passes.
 */
export const CV_PATH_RE = /^uploads\/[a-f0-9-]{36}\.(pdf|doc|docx)$/i
