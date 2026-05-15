'use client'

import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

type Settings = Record<string, string>

function useSettings() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data: Settings) => { setSettings(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const save = useCallback(async (patch: Settings) => {
    const res = await fetch('/api/admin/settings', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(patch),
    })
    if (res.ok) {
      setSettings((prev) => ({ ...prev, ...patch }))
      toast.success('Saved')
    } else {
      toast.error('Failed to save')
    }
  }, [])

  return { settings, setSettings, loading, save }
}

// ── Small helpers ──────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  type = 'text',
  rows,
  placeholder,
}: {
  label:        string
  value:        string
  onChange:     (v: string) => void
  type?:        string
  rows?:        number
  placeholder?: string
}) {
  return (
    <div>
      <label className="label-sm">{label}</label>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="input-field w-full mt-1 resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field w-full mt-1"
        />
      )}
    </div>
  )
}

function Toggle({ label, description, value, onChange }: {
  label:       string
  description: string
  value:       boolean
  onChange:    (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex w-11 h-6 rounded-full transition-colors focus:outline-none ${value ? 'bg-brand-accent' : 'bg-zinc-700'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  )
}

function Section({ title, children, onSave, saving }: {
  title:    string
  children: React.ReactNode
  onSave:   () => void
  saving:   boolean
}) {
  return (
    <div className="p-5 rounded-xl border border-brand-muted/20 bg-brand-surface/50 space-y-4">
      <h2 className="text-base font-semibold text-zinc-200">{title}</h2>
      {children}
      <div className="pt-2 border-t border-brand-muted/20">
        <button
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2 rounded-lg bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const { settings, setSettings, loading, save } = useSettings()
  const [savingSection, setSavingSection] = useState<string | null>(null)

  function get(key: string) { return settings[key] ?? '' }
  function set(key: string) { return (v: string) => setSettings((p) => ({ ...p, [key]: v })) }
  function getBool(key: string) { return settings[key] === 'true' }
  function setBool(key: string) { return (v: boolean) => setSettings((p) => ({ ...p, [key]: v ? 'true' : 'false' })) }

  async function saveSection(id: string, keys: string[]) {
    setSavingSection(id)
    const patch: Settings = {}
    for (const k of keys) patch[k] = settings[k] ?? ''
    await save(patch)
    setSavingSection(null)
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-zinc-500 text-sm text-center py-16">Loading settings…</div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Settings</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Site-wide configuration</p>
      </div>

      {/* 1 — Site Content */}
      <Section
        title="Site Content"
        saving={savingSection === 'content'}
        onSave={() => saveSection('content', ['hero_tagline_skillsync', 'hero_tagline_skillit', 'about_text', 'mission_statement'])}
      >
        <Field label="Hero Tagline — skillSYNC" value={get('hero_tagline_skillsync')} onChange={set('hero_tagline_skillsync')} placeholder="Build. Learn. Earn." />
        <Field label="Hero Tagline — skillIT"   value={get('hero_tagline_skillit')}   onChange={set('hero_tagline_skillit')}   placeholder="We Build. You Scale." />
        <Field label="About Section Text"        value={get('about_text')}             onChange={set('about_text')}             rows={4} />
        <Field label="Mission Statement"         value={get('mission_statement')}      onChange={set('mission_statement')}      rows={3} />
      </Section>

      {/* 2 — Social Links */}
      <Section
        title="Social Links"
        saving={savingSection === 'social'}
        onSave={() => saveSection('social', ['linkedin_url', 'instagram_url', 'youtube_url', 'github_url', 'whatsapp_link'])}
      >
        <Field label="LinkedIn URL"  value={get('linkedin_url')}  onChange={set('linkedin_url')}  placeholder="https://linkedin.com/company/…" />
        <Field label="Instagram URL" value={get('instagram_url')} onChange={set('instagram_url')} placeholder="https://instagram.com/…" />
        <Field label="YouTube URL"   value={get('youtube_url')}   onChange={set('youtube_url')}   placeholder="https://youtube.com/@…" />
        <Field label="GitHub URL"    value={get('github_url')}    onChange={set('github_url')}    placeholder="https://github.com/…" />
        <Field label="WhatsApp Link" value={get('whatsapp_link')} onChange={set('whatsapp_link')} placeholder="https://wa.me/…" />
      </Section>

      {/* 3 — Feature Toggles */}
      <Section
        title="Feature Toggles"
        saving={savingSection === 'features'}
        onSave={() => saveSection('features', ['show_reviews', 'show_join_form', 'maintenance_mode'])}
      >
        <Toggle
          label="Show Reviews Section"
          description="Display the testimonials/reviews section on public pages"
          value={getBool('show_reviews')}
          onChange={setBool('show_reviews')}
        />
        <Toggle
          label="Show Join Form"
          description="Allow new volunteers to submit applications via the Join page"
          value={getBool('show_join_form')}
          onChange={setBool('show_join_form')}
        />
        <div className="rounded-lg border border-red-900/40 bg-red-950/20 p-3">
          <Toggle
            label="Maintenance Mode"
            description="Redirects all public routes to /maintenance. Admin panel and API remain accessible."
            value={getBool('maintenance_mode')}
            onChange={setBool('maintenance_mode')}
          />
          {getBool('maintenance_mode') && (
            <p className="text-xs text-red-400 mt-1">⚠ Maintenance mode is ON — public visitors see the maintenance page.</p>
          )}
        </div>
      </Section>

      {/* 4 — Notification Settings */}
      <Section
        title="Notification Emails"
        saving={savingSection === 'notifications'}
        onSave={() => saveSection('notifications', ['admin_email_applications', 'admin_email_reviews'])}
      >
        <Field
          label="Admin Email — New Applications"
          value={get('admin_email_applications')}
          onChange={set('admin_email_applications')}
          type="email"
          placeholder="admin@example.com"
        />
        <Field
          label="Admin Email — New Reviews"
          value={get('admin_email_reviews')}
          onChange={set('admin_email_reviews')}
          type="email"
          placeholder="admin@example.com"
        />
      </Section>
    </div>
  )
}
