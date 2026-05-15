'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { useUser } from '@/lib/hooks/useUser'
import { createClient } from '@/lib/supabase/client'

// ── Page title map ────────────────────────────────────────────────────────────

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

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconBell({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DashboardHeader() {
  const pathname = usePathname()
  const { user, profile } = useUser()
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch unread announcement count
  useEffect(() => {
    if (!user) return
    const supabase = createClient()

    async function fetchCount() {
      const { data } = await supabase.rpc('get_unread_announcement_count', {
        p_user_id: user!.id,
      })
      setUnreadCount(Number(data) ?? 0)
    }

    fetchCount()
  }, [user])

  const title = resolveTitle(pathname)

  // Avatar: use photo if available, else initials
  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between gap-4 px-4 md:px-6 bg-brand-dark/90 backdrop-blur-sm border-b border-brand-muted/20">

      {/* Page title */}
      <h1 className="text-lg md:text-xl font-display font-semibold text-brand-light truncate">
        {title}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-3 flex-shrink-0">

        {/* Notification bell */}
        <Link
          href="/dashboard"
          title="Announcements"
          className="relative flex items-center justify-center w-9 h-9 rounded-lg text-brand-muted transition-colors hover:bg-brand-mid hover:text-brand-light"
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
        </Link>

        {/* Divider */}
        <div className="h-6 w-px bg-brand-muted/30" />

        {/* User avatar + name */}
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
