// ─────────────────────────────────────────────────────────────────────────────
// Input sanitization + validation helpers used by every API route.
// ─────────────────────────────────────────────────────────────────────────────

import DOMPurify from 'isomorphic-dompurify'

/**
 * Strip ALL HTML/scripts from a text field and trim whitespace.
 * Use for names, subjects, single-line inputs that should never contain markup.
 */
export function sanitizePlain(value: unknown): string {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  // ALLOWED_TAGS: []  → drops every element, keeps text nodes
  // ALLOWED_ATTR: []  → drops every attribute
  return DOMPurify.sanitize(trimmed, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
}

/**
 * Same as sanitizePlain but for longer bodies (reviews, motivations, messages).
 * We STILL strip all HTML — user text is rendered as plain strings on the site,
 * never as HTML, so there's no reason to allow markup and every reason not to.
 */
export function sanitizeText(value: unknown): string {
  return sanitizePlain(value)
}

/** RFC-5322-ish practical email regex — matches what Zod's email() accepts. */
const EMAIL_RE =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export function isValidEmail(value: string): boolean {
  if (value.length > 254) return false // RFC 5321
  return EMAIL_RE.test(value)
}

/** Trim + lowercase + sanitize + length-check an email in one step. */
export function sanitizeEmail(value: unknown): string {
  if (typeof value !== 'string') return ''
  return sanitizePlain(value).toLowerCase()
}

/** Enforce a max character length. Returns null if the value is over the cap. */
export function withinLength(value: string, max: number): boolean {
  return value.length <= max
}

// ── Standard field caps used across the site ────────────────────────────────
// Keep these in sync with any DB CHECK constraints you add later.
export const MAX_LEN = {
  name:            100,
  email:           254,
  phone:           40,
  university:      120,
  semester:        40,
  city:            80,
  subject:         120,
  reviewer_role:   120,
  workshop_short:  120,
  short_answer:    500,
  message:         2000,
  motivation:      3000,
  review_body:     2000,
  report_notes:    2000,
  deliverable:     500,
  task_name:       200,
  url:             500,
  slug:            200,
  announcement:    5000,
  announcement_title: 200,
} as const

/**
 * Convenience: sanitize a value, then reject if it exceeds `max`.
 * Returns { ok, value } — caller returns 400 on !ok.
 */
export function sanitizeAndCap(value: unknown, max: number):
  | { ok: true;  value: string }
  | { ok: false; value: string }
{
  const clean = sanitizePlain(value)
  return { ok: clean.length <= max, value: clean }
}
