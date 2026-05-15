// Server-only utilities used by API routes for CV upload handling.
// No Node.js-specific imports — safe to tree-shake if ever imported elsewhere.

export const CV_MAX_BYTES          = 20 * 1024 * 1024  // 20 MB
export const CV_MAX_MB             = 20
export const CV_ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'] as const
type CVExt = typeof CV_ALLOWED_EXTENSIONS[number]

export function getExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() ?? ''
}

export function isAllowedExtension(ext: string): ext is CVExt {
  return (CV_ALLOWED_EXTENSIONS as readonly string[]).includes(ext)
}

// Produces a URL-safe, filesystem-safe filename (lowercase, no traversal chars).
export function sanitizeFilename(filename: string): string {
  const ext  = getExtension(filename)
  const base = filename
    .slice(0, filename.lastIndexOf('.'))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60)

  return `${base || 'cv'}.${ext}`
}

// Unique storage object path: uploads/{13-digit-ts}_{5-char-rand}_{safe_name}
// Character set after "uploads/" is strictly [a-z0-9_.] — validated by the
// /api/applications route before the path is written to the database.
export function buildStoragePath(originalFilename: string): string {
  const safe = sanitizeFilename(originalFilename)
  const ts   = Date.now()
  const rand = Math.random().toString(36).slice(2, 7)
  return `uploads/${ts}_${rand}_${safe}`
}
