'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { useUser } from '@/lib/hooks/useUser'
import type { Announcement } from '@/lib/types/app.types'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':              'Dashboard',
  '/dashboard/work':         'My Work',
  '/dashboard/reports':      'Reports',
  '/dashboard/achievements': 'Achievements',
  '/dashboard/profile':      'My Profile',
  '/dashboard/team':         'Team',
}

function resolveTitle(pathname: string): string {
  return PAGE_TITLES[pathname] ?? 'Dashboard'
}

function IconBell({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

type AnnouncementWithRead = Announcement & { is_read: boolean }

export default function DashboardHeader() {
  const pathname = usePathname()
  const { user, profile } = useUser()

  const [announcements, setAnnouncements] = useState<AnnouncementWithRead[]>([])
  const [unreadCount,   setUnreadCount]   = useState(0)
  const [dropdownOpen,  setDropdownOpen]  = useState(false)
  const [marking,       setMarking]       = useState(false)

  const dropRef = useRef<HTMLDivElement>(null)

  const fetchAnnouncements = useCallback(async () => {
    if (!user) return
    const res = await fetch('/api/announcements')
    if (!res.ok) return
    const data = await res.json() as { announcements: AnnouncementWithRead[]; unreadCount: number }
    setAnnouncements(data.announcements)
    setUnreadCount(data.unreadCount)
  }, [user])

  useEffect(() => { fetchAnnouncements() }, [fetchAnnouncements])

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  async function markAllRead() {
    setMarking(true)
    await fetch('/api/announcements', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ action: 'mark_read' }),
    })
    setMarking(false)
    setUnreadCount(0)
    setAnnouncements((prev) => prev.map((a) => ({ ...a, is_read: true })))
  }

  const title    = resolveTitle(pathname)
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between gap-4 px-4 md:px-6 bg-brand-dark/90 backdrop-blur-sm border-b border-brand-muted/20">

      <h1 className="text-lg md:text-xl font-display font-semibold text-brand-light truncate">
        {title}
      </h1>

      <div className="flex items-center gap-3 flex-shrink-0">

        {/* Notification bell */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg text-brand-muted transition-colors hover:bg-brand-mid hover:text-brand-light"
            aria-label="Announcements"
          >
            <IconBell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className={cn(
                'absolute -top-0.5 -right-0.5 flex items-center justify-center',
                'min-w-[16px] h-4 rounded-full bg-brand-accent text-white',
                'text-[10px] font-bold leading-none px-0.5'
              )}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-11 w-80 bg-brand-surface border border-brand-muted/20 rounded-xl shadow-2xl z-50">
              <div className="px-4 py-3 border-b border-brand-muted/20 flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-200">Announcements</p>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    disabled={marking}
                    className="text-xs text-brand-accent hover:underline disabled:opacity-50"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-brand-muted/10 max-h-72 overflow-y-auto">
                {announcements.length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center py-8">No announcements</p>
                ) : (
                  announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className={cn(
                        'px-4 py-3',
                        !ann.is_read && 'bg-brand-accent/5'
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {!ann.is_read && (
                          <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-accent" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-200 truncate">{ann.title}</p>
                          <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">{ann.body}</p>
                          <p className="text-xs text-zinc-600 mt-1">
                            {new Date(ann.sent_at).toLocaleDateString('en-PK', {
                              month: 'short', day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-brand-muted/20">
                <Link
                  href="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Go to dashboard →
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-brand-muted/30" />

        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-brand-mid"
        >
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-brand-muted/30"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-brand-accent">{initials}</span>
            </div>
          )}
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-brand-light leading-tight truncate max-w-[120px]">
              {profile?.full_name ?? 'Loading…'}
            </span>
            <span className="text-xs text-brand-muted leading-tight">
              {profile?.role ?? ''}
            </span>
          </div>
        </Link>

      </div>
    </header>
  )
}
