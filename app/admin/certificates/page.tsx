'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Event } from '@/lib/types/app.types'

interface RegRow {
  id:              string
  event_id:        string
  user_id:         string | null
  form_data:       Record<string, unknown>
  registered_at:   string
  user_full_name:  string
  user_email:      string
}

interface VolRow {
  id:        string
  full_name: string
  role:      string
}

export default function AdminCertificatesPage() {
  const [tab,             setTab]             = useState<'workshop' | 'letter'>('workshop')
  const [events,          setEvents]          = useState<Event[]>([])
  const [volunteers,      setVolunteers]       = useState<VolRow[]>([])
  const [selectedEvent,   setSelectedEvent]   = useState('')
  const [registrations,   setRegistrations]   = useState<RegRow[]>([])
  const [selected,        setSelected]        = useState<Set<string>>(new Set())
  const [loadingRegs,     setLoadingRegs]     = useState(false)
  const [generating,      setGenerating]      = useState(false)
  const [letterVolunteer, setLetterVolunteer] = useState('')
  const [letterType,      setLetterType]      = useState<'experience' | 'recommendation'>('experience')
  const [achDesc,         setAchDesc]         = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('events').select('*').eq('type', 'workshop').order('date', { ascending: false }).then(({ data }) => {
      setEvents((data as Event[]) ?? [])
    })
    supabase.from('users').select('id, full_name, role').eq('status', 'active').order('full_name').then(({ data }) => {
      setVolunteers((data as VolRow[]) ?? [])
    })
  }, [])

  const loadRegs = useCallback(async (eventId: string) => {
    if (!eventId) return
    setLoadingRegs(true)
    const supabase = createClient()
    const { data } = await supabase.from('registrations').select('*').eq('event_id', eventId)
    const rows = (data ?? []) as Array<{
      id: string; event_id: string; user_id: string | null; form_data: Record<string, unknown>; registered_at: string
    }>

    const userIds = rows.filter((r) => r.user_id).map((r) => r.user_id as string)
    const { data: usersData } = userIds.length
      ? await supabase.from('users').select('id, full_name, email').in('id', userIds)
      : { data: [] }

    const userMap: Record<string, { full_name: string; email: string }> = {}
    for (const u of (usersData ?? []) as Array<{ id: string; full_name: string; email: string }>) {
      userMap[u.id] = u
    }

    setRegistrations(rows.map((r) => ({
      ...r,
      user_full_name: r.user_id
        ? (userMap[r.user_id]?.full_name ?? ((r.form_data?.full_name as string) || 'Unknown'))
        : ((r.form_data?.full_name as string) || 'Anonymous'),
      user_email: r.user_id
        ? (userMap[r.user_id]?.email ?? ((r.form_data?.email as string) || ''))
        : ((r.form_data?.email as string) || ''),
    })))
    setSelected(new Set())
    setLoadingRegs(false)
  }, [])

  useEffect(() => {
    if (selectedEvent) loadRegs(selectedEvent)
  }, [selectedEvent, loadRegs])

  function toggleAll() {
    setSelected(
      selected.size === registrations.length
        ? new Set()
        : new Set(registrations.map((r) => r.id))
    )
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  async function generateCertificates() {
    if (selected.size === 0) return
    const event = events.find((e) => e.id === selectedEvent)
    if (!event) return
    setGenerating(true)
    try {
      const { pdf }                        = await import('@react-pdf/renderer')
      const { default: CertificateDocument } = await import('@/components/admin/CertificateDocument')
      const dateStr = new Date(event.date).toLocaleDateString('en-PK', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
      const recipients = registrations.filter((r) => selected.has(r.id))
      for (const reg of recipients) {
        const el   = CertificateDocument({ recipientName: reg.user_full_name, workshopName: event.title, date: dateStr })
        const blob = await pdf(el).toBlob()
        const url  = URL.createObjectURL(blob)
        const a    = document.createElement('a')
        a.href     = url
        a.download = `cert-${reg.user_full_name.replace(/\s+/g, '-')}.pdf`
        a.click()
        URL.revokeObjectURL(url)
      }
    } finally {
      setGenerating(false)
    }
  }

  async function generateLetter() {
    const vol = volunteers.find((v) => v.id === letterVolunteer)
    if (!vol || !achDesc.trim()) return
    setGenerating(true)
    try {
      const { pdf }                              = await import('@react-pdf/renderer')
      const { default: VolunteerLetterDocument } = await import('@/components/admin/VolunteerLetterDocument')
      const dateStr = new Date().toLocaleDateString('en-PK', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
      const el   = VolunteerLetterDocument({ volunteerName: vol.full_name, role: vol.role, type: letterType, achievementsDesc: achDesc, date: dateStr })
      const blob = await pdf(el).toBlob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `letter-${vol.full_name.replace(/\s+/g, '-')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Certificates & Letters</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Generate PDF documents for participants and volunteers</p>
      </div>

      <div className="flex gap-1 p-1 bg-brand-surface/50 rounded-lg w-fit border border-brand-muted/20">
        <button
          onClick={() => setTab('workshop')}
          className={`px-4 py-1.5 rounded text-sm transition-colors ${tab === 'workshop' ? 'bg-brand-accent text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Workshop Certificates
        </button>
        <button
          onClick={() => setTab('letter')}
          className={`px-4 py-1.5 rounded text-sm transition-colors ${tab === 'letter' ? 'bg-brand-accent text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Individual Letters
        </button>
      </div>

      {tab === 'workshop' && (
        <div className="space-y-4 max-w-xl">
          <div>
            <label className="label-sm">Select Workshop</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="input-field w-full mt-1"
            >
              <option value="">— Choose a workshop —</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>{e.title} ({e.date})</option>
              ))}
            </select>
          </div>

          {loadingRegs && <p className="text-zinc-500 text-sm">Loading registrations…</p>}

          {!loadingRegs && selectedEvent && registrations.length === 0 && (
            <p className="text-zinc-500 text-sm">No registrations for this workshop.</p>
          )}

          {registrations.length > 0 && (
            <>
              <div className="rounded-xl border border-brand-muted/20 overflow-hidden">
                <div className="px-4 py-3 border-b border-brand-muted/20 bg-brand-surface/50 flex items-center gap-3">
                  <input type="checkbox" checked={selected.size === registrations.length} onChange={toggleAll} className="rounded" />
                  <span className="text-sm text-zinc-400">
                    {selected.size === 0 ? `${registrations.length} participants` : `${selected.size} selected`}
                  </span>
                </div>
                <div className="divide-y divide-brand-muted/10 max-h-60 overflow-y-auto">
                  {registrations.map((reg) => (
                    <label key={reg.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-surface/30 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected.has(reg.id)}
                        onChange={() => toggleOne(reg.id)}
                        className="rounded"
                      />
                      <div>
                        <p className="text-sm text-zinc-200">{reg.user_full_name}</p>
                        {reg.user_email && <p className="text-xs text-zinc-500">{reg.user_email}</p>}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                disabled={selected.size === 0 || generating}
                onClick={generateCertificates}
                className="px-6 py-2.5 rounded-lg bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-50"
              >
                {generating
                  ? 'Generating PDFs…'
                  : `Generate ${selected.size > 0 ? selected.size : ''} Certificate${selected.size !== 1 ? 's' : ''}`}
              </button>
            </>
          )}
        </div>
      )}

      {tab === 'letter' && (
        <div className="space-y-4 max-w-md">
          <div>
            <label className="label-sm">Select Volunteer</label>
            <select
              value={letterVolunteer}
              onChange={(e) => setLetterVolunteer(e.target.value)}
              className="input-field w-full mt-1"
            >
              <option value="">— Choose a volunteer —</option>
              {volunteers.map((v) => (
                <option key={v.id} value={v.id}>{v.full_name} — {v.role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-sm">Letter Type</label>
            <div className="flex gap-4 mt-2">
              {(['experience', 'recommendation'] as const).map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                  <input
                    type="radio"
                    name="letterType"
                    value={t}
                    checked={letterType === t}
                    onChange={() => setLetterType(t)}
                  />
                  {t === 'experience' ? 'Experience Letter' : 'Recommendation Letter'}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label-sm">Achievements & Contributions</label>
            <textarea
              value={achDesc}
              onChange={(e) => setAchDesc(e.target.value)}
              rows={5}
              placeholder="Describe their key contributions, skills demonstrated, projects completed…"
              className="input-field w-full resize-none mt-1"
            />
          </div>

          <button
            disabled={!letterVolunteer || !achDesc.trim() || generating}
            onClick={generateLetter}
            className="px-6 py-2.5 rounded-lg bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-50"
          >
            {generating ? 'Generating PDF…' : 'Generate Letter'}
          </button>
        </div>
      )}
    </div>
  )
}
