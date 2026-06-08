'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { DEPARTMENTS } from '@/lib/constants/departments'

const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8']
const REFERRAL_SOURCES = [
  'Social Media',
  'Friend / Colleague',
  'University / College',
  'Workshop / Event',
  'LinkedIn',
  'Other',
]

const CV_MAX_BYTES   = 20 * 1024 * 1024
const CV_ALLOWED_EXT = ['pdf', 'doc', 'docx']
const CV_ACCEPT      = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

// Client-side magic-byte check (first 4 bytes of the file).
// Gives immediate feedback for renamed files (e.g. an .html renamed to .pdf).
// Supabase's allowed_mime_types on the bucket provides the server-side layer.
async function hasValidMagicBytes(file: File): Promise<boolean> {
  const buf    = new Uint8Array(await file.slice(0, 4).arrayBuffer())
  const isPDF  = buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46
  const isDOC  = buf[0] === 0xD0 && buf[1] === 0xCF && buf[2] === 0x11 && buf[3] === 0xE0
  const isDOCX = buf[0] === 0x50 && buf[1] === 0x4B && buf[2] === 0x03 && buf[3] === 0x04
  return isPDF || isDOC || isDOCX
}

// PUT the file directly to Supabase Storage via the signed upload URL.
// Using XHR (not fetch) so upload.onprogress events are available.
// Returns true on 2xx, false on any error.
function uploadToSignedUrl(
  file: File,
  signedUrl: string,
  onProgress: (pct: number) => void,
): Promise<boolean> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', signedUrl)
    // Content-Type must match the bucket's allowed_mime_types so Supabase
    // can enforce the server-side MIME restriction.
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload  = () => resolve(xhr.status >= 200 && xhr.status < 300)
    xhr.onerror = () => resolve(false)
    xhr.send(file)
  })
}

const SELECT_CLASS =
  'w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent'

const schema = z.object({
  full_name:           z.string().min(2, 'Enter your full name'),
  email:               z.string().email('Enter a valid email address'),
  phone:               z.string().optional(),
  city:                z.string().optional(),
  university:          z.string().optional(),
  semester:            z.string().optional(),
  department_interest: z.string().optional(),
  motivation:          z.string().min(100, 'Write at least 100 characters about your motivation'),
  can_commit:          z.boolean(),
  linkedin:            z.string().optional(),
  github:              z.string().optional(),
  portfolio:           z.string().optional(),
  referral_source:     z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function VolunteerApplicationForm() {
  const [submitted, setSubmitted]     = useState(false)
  const [skills, setSkills]           = useState<string[]>([])
  const [skillInput, setSkillInput]   = useState('')
  const [skillsError, setSkillsError] = useState('')
  const [cvFile, setCvFile]           = useState<File | null>(null)
  const [cvError, setCvError]         = useState('')
  const [progress, setProgress]       = useState(0)
  const skillInputRef                 = useRef<HTMLInputElement>(null)
  const fileInputRef                  = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { can_commit: false },
  })

  const motivation    = watch('motivation') ?? ''
  const canCommit     = watch('can_commit')
  const motivationLen = motivation.length

  // ── Skills tag input ──────────────────────────────────────────────────────

  function addSkill(raw: string) {
    const tag = raw.trim()
    if (!tag) return
    if (skills.includes(tag)) { setSkillInput(''); return }
    setSkills((prev) => [...prev, tag])
    setSkillInput('')
    setSkillsError('')
  }

  function removeSkill(tag: string) {
    setSkills((prev) => prev.filter((s) => s !== tag))
  }

  function onSkillKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(skillInput)
    }
    if (e.key === 'Backspace' && skillInput === '' && skills.length > 0) {
      setSkills((prev) => prev.slice(0, -1))
    }
  }

  // ── CV file input ─────────────────────────────────────────────────────────

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setCvError('')
    setCvFile(null)
    if (!file) return

    if (file.size > CV_MAX_BYTES) {
      setCvError('File too large — maximum 20 MB allowed.')
      e.target.value = ''
      return
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!CV_ALLOWED_EXT.includes(ext)) {
      setCvError('Only PDF, DOC, and DOCX files are accepted.')
      e.target.value = ''
      return
    }

    if (!await hasValidMagicBytes(file)) {
      setCvError('File content does not match the expected format. Please upload a valid PDF, DOC, or DOCX.')
      e.target.value = ''
      return
    }

    setCvFile(file)
  }

  // ── Form submit (three steps) ─────────────────────────────────────────────
  //
  // 1. POST /api/cv-upload/sign  →  { signedUrl, path }   (no file bytes sent)
  // 2. PUT  signedUrl            →  file goes directly to Supabase Storage
  //                                 (Supabase enforces allowed_mime_types here)
  // 3. POST /api/applications    →  JSON form fields + cv_url storage path

  async function onSubmit(values: FormValues) {
    if (skills.length === 0) { setSkillsError('Add at least one skill'); return }
    if (!values.can_commit) return
    if (!cvFile) { setCvError('Please upload your CV.'); return }

    setProgress(0)

    // Step 1 ── get signed upload URL (lightweight JSON request)
    const signRes = await fetch('/api/cv-upload/sign', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ filename: cvFile.name }),
    })
    if (!signRes.ok) {
      const json = await signRes.json().catch(() => ({})) as { error?: string }
      toast.error(json.error ?? 'Could not prepare upload. Please try again.')
      return
    }
    const { signedUrl, path } = await signRes.json() as { signedUrl: string; path: string }

    // Step 2 ── upload file directly to Supabase (shows progress bar)
    const uploaded = await uploadToSignedUrl(cvFile, signedUrl, setProgress)
    if (!uploaded) {
      toast.error('CV upload failed — the file may be an unsupported format. Please try again.')
      setProgress(0)
      return
    }

    // Step 3 ── submit form fields as JSON; cv is already in storage
    const res = await fetch('/api/applications', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...values, current_skills: skills, cv_url: path }),
    })

    const data = await res.json().catch(() => ({})) as { error?: string }
    if (res.ok) {
      setSubmitted(true)
    } else {
      toast.error(data.error ?? 'Something went wrong. Please try again.')
      setProgress(0)
    }
  }

  // ── Success state ─────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="rounded-xl border border-brand-accent/30 bg-brand-accent/5 p-8 text-center">
        <p className="text-3xl mb-3">🎉</p>
        <h3 className="text-xl font-display font-bold text-brand-light mb-2">Application received!</h3>
        <p className="text-gray-400 mb-4">
          We review every application personally and will get back to you within 5–7 business days.
        </p>
        <div className="text-sm text-brand-muted space-y-1 text-left max-w-xs mx-auto">
          <p>✅ Application submitted</p>
          <p>📎 CV uploaded successfully</p>
          <p>📧 Confirmation email on its way</p>
          <p>👀 Team review within 7 days</p>
          <p>🗓 Interview invite if shortlisted</p>
        </div>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

      {/* Personal */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-xs font-semibold text-brand-muted uppercase tracking-widest mb-1">Personal details</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Full name"
            placeholder="Your full name"
            error={errors.full_name?.message}
            {...register('full_name')}
          />
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Phone (optional)"
            type="tel"
            placeholder="+92 XXX XXXXXXX"
            {...register('phone')}
          />
          <Input
            label="City"
            placeholder="Karachi, Lahore, Islamabad…"
            {...register('city')}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="University / College (optional)"
            placeholder="LUMS, NUST, IBA…"
            {...register('university')}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-light">Semester (optional)</label>
            <select {...register('semester')} className={SELECT_CLASS}>
              <option value="">Select…</option>
              {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
        </div>
      </fieldset>

      {/* Department */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-xs font-semibold text-brand-muted uppercase tracking-widest mb-1">Department</legend>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-light">Department interest (optional)</label>
          <select {...register('department_interest')} className={SELECT_CLASS}>
            <option value="">No preference</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </fieldset>

      {/* Skills */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-xs font-semibold text-brand-muted uppercase tracking-widest mb-1">Skills</legend>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-light">
            Your skills <span className="text-red-400">*</span>
            <span className="text-brand-muted font-normal ml-1">(type and press Enter)</span>
          </label>
          <div
            onClick={() => skillInputRef.current?.focus()}
            className="min-h-[44px] w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2 flex flex-wrap gap-1.5 items-center cursor-text focus-within:ring-2 focus-within:ring-brand-accent/50 focus-within:border-brand-accent"
          >
            {skills.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-accent/15 border border-brand-accent/30 text-xs text-brand-accent"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeSkill(tag)}
                  className="text-brand-accent/60 hover:text-brand-accent transition-colors leading-none"
                  aria-label={`Remove ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              ref={skillInputRef}
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={onSkillKeyDown}
              onBlur={() => { if (skillInput.trim()) addSkill(skillInput) }}
              placeholder={skills.length === 0 ? 'React, Figma, Python…' : ''}
              className="flex-1 min-w-[120px] bg-transparent text-sm text-brand-light placeholder:text-brand-muted/60 outline-none"
            />
          </div>
          {skillsError && <p className="text-xs text-red-400">{skillsError}</p>}
        </div>
      </fieldset>

      {/* Motivation */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-xs font-semibold text-brand-muted uppercase tracking-widest mb-1">Motivation</legend>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline">
            <label className="text-sm font-medium text-brand-light">
              Why do you want to join and which role are you interested in? <span className="text-red-400">*</span>
            </label>
            <span className={`text-xs tabular-nums ${motivationLen >= 100 ? 'text-green-400' : 'text-brand-muted'}`}>
              {motivationLen} / 100
            </span>
          </div>
          <textarea
            {...register('motivation')}
            rows={5}
            placeholder="Tell us about yourself, your goals, and why you want to be part of skillSYNC / skillIT…"
            className="w-full rounded-lg border border-brand-muted/30 bg-brand-dark px-3 py-2.5 text-sm text-brand-light placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent resize-none"
          />
          {errors.motivation && <p className="text-xs text-red-400">{errors.motivation.message}</p>}
        </div>
      </fieldset>

      {/* Links */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-xs font-semibold text-brand-muted uppercase tracking-widest mb-1">Links (optional)</legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Input label="LinkedIn URL" placeholder="linkedin.com/in/…" {...register('linkedin')} />
          <Input label="GitHub URL"   placeholder="github.com/…"    {...register('github')} />
          <Input label="Portfolio"    placeholder="yoursite.com"    {...register('portfolio')} />
        </div>
      </fieldset>

      {/* CV Upload */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-xs font-semibold text-brand-muted uppercase tracking-widest mb-1">CV / Resume</legend>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-brand-light">
            Upload your CV / Resume <span className="text-red-400">*</span>
          </label>
          <p className="text-xs text-brand-muted -mt-1">PDF, DOC, or DOCX — maximum 20 MB</p>

          {/* Hidden native file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={CV_ACCEPT}
            onChange={onFileChange}
            className="sr-only"
            id="cv-upload"
            aria-describedby={cvError ? 'cv-error' : undefined}
          />

          {/* Styled trigger */}
          <label
            htmlFor="cv-upload"
            className={`flex items-center gap-3 w-full rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
              cvError
                ? 'border-red-500/50 bg-red-950/20'
                : cvFile
                ? 'border-green-600/40 bg-green-950/20'
                : 'border-brand-muted/30 bg-brand-dark hover:border-brand-accent/40 hover:bg-brand-accent/5'
            }`}
          >
            <span className="flex-shrink-0 text-lg">{cvFile ? '📎' : '📄'}</span>
            <span className="flex-1 min-w-0 text-sm">
              {cvFile
                ? <span className="text-green-400 font-medium truncate block">{cvFile.name}</span>
                : <span className="text-brand-muted">Click to choose a file…</span>
              }
            </span>
            <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-md border border-brand-muted/30 text-brand-muted">
              {cvFile ? 'Change' : 'Browse'}
            </span>
          </label>

          {cvError && <p id="cv-error" className="text-xs text-red-400">{cvError}</p>}
          {cvFile && !cvError && (
            <p className="text-xs text-brand-muted">
              {(cvFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          )}
        </div>
      </fieldset>

      {/* How did you hear */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-light">How did you hear about us? (optional)</label>
        <select {...register('referral_source')} className={SELECT_CLASS}>
          <option value="">Select…</option>
          {REFERRAL_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Commitment checkbox */}
      <div className="rounded-xl border border-brand-muted/20 bg-brand-dark p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('can_commit')}
            className="mt-0.5 h-4 w-4 rounded border-brand-muted/30 bg-brand-dark accent-brand-accent"
          />
          <span className="text-sm text-brand-light">
            I can commit a minimum of <strong>20 hours per week</strong> to skillSYNC.
          </span>
        </label>
        {!canCommit && (
          <p className="mt-3 text-xs text-amber-400 ml-7">
            Unfortunately 20 hrs/week is required to join skillSYNC. Please only apply if you can honour this.
          </p>
        )}
      </div>

      {/* Upload progress bar — visible during the three-step submit */}
      {isSubmitting && (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs text-brand-muted">
            <span>
              {progress === 0
                ? 'Preparing…'
                : progress < 100
                ? 'Uploading CV…'
                : 'Submitting…'}
            </span>
            {progress > 0 && progress < 100 && (
              <span className="tabular-nums">{progress}%</span>
            )}
          </div>
          <div className="h-1.5 w-full rounded-full bg-brand-mid overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-accent transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isSubmitting}
        disabled={!canCommit || isSubmitting}
        className="self-start"
      >
        Submit application
      </Button>
    </form>
  )
}
