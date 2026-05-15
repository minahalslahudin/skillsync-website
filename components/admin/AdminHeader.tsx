'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/lib/hooks/useUser'
import { cn } from '@/lib/utils/cn'

const PAGE_TITLES: Record<string, string> = {
  '/admin':               'Dashboard',
  '/admin/volunteers':    'Volunteers',
  '/admin/applications':  'Applications',
  '/admin/work':          'Work',
  '/admin/events':        'Events',
  '/admin/projects':      'Projects',
  '/admin/reviews':       'Reviews',
  '/admin/reports':       'Reports',
  '/admin/certificates':  'Certificates',
  '/admin/warnings':      'Warnings',
  '/admin/analytics':     'Analytics',
  '/admin/settings':      'Settings',
}

function resolveTitle(pathname: string): string {
  return PAGE_TITLES[pathname] ?? 'Admin'
}

export default function AdminHeader() {
  const pathname = usePathname()
  const { profile } = useUser()
  const title = resolveTitle(pathname)

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A'

  return (
    <header className={cn(
      'sticky top-0 z-30 h-16 flex items-center justify-between gap-4 px-4 md:px-6',
      'bg-brand-dark/90 backdrop-blur-sm border-b border-red-900/20'
    )}>
      <div className="flex items-center gap-3">
        <h1 className="text-lg md:text-xl font-display font-semibold text-brand-light truncate">
          {title}
        </h1>
        <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-950/60 border border-red-800/40 rounded px-1.5 py-0.5">
          Admin Panel
        </span>
      </div>

      <Link
        href="/admin/settings"
        className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-brand-mid"
      >
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className="h-8 w-8 rounded-full object-cover ring-2 ring-red-800/40"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-red-950/60 border border-red-800/40 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-red-400">{initials}</span>
          </div>
        )}
        <div className="hidden md:flex flex-col">
          <span className="text-sm font-medium text-brand-light leading-tight truncate max-w-[120px]">
            {profile?.full_name ?? 'Admin'}
          </span>
          <span className="text-xs text-red-400 leading-tight">Administrator</span>
        </div>
      </Link>
    </header>
  )
}
