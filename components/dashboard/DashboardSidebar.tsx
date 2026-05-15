'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { useUser } from '@/lib/hooks/useUser'
import { createClient } from '@/lib/supabase/client'

// ── SVG icon helpers (private, not exported) ──────────────────────────────────

function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconBriefcase({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

function IconClipboard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
    </svg>
  )
}

function IconTrophy({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  )
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconLogOut({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

// ── Nav item definition ───────────────────────────────────────────────────────

interface NavItem {
  label: string
  href: string
  Icon: React.FC<{ className?: string }>
  roles?: string[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',    href: '/dashboard',              Icon: IconHome },
  { label: 'My Work',      href: '/dashboard/work',         Icon: IconBriefcase },
  { label: 'Reports',      href: '/dashboard/reports',      Icon: IconClipboard },
  { label: 'Achievements', href: '/dashboard/achievements', Icon: IconTrophy },
  { label: 'Profile',      href: '/dashboard/profile',      Icon: IconUser },
  { label: 'Team',         href: '/dashboard/team',         Icon: IconUsers, roles: ['Lead', 'C-Suite', 'Admin'] },
]

// ── Shared link renderer ──────────────────────────────────────────────────────

function NavLink({
  item,
  active,
  collapsed,
}: {
  item: NavItem
  active: boolean
  collapsed: boolean
}) {
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        active
          ? 'bg-brand-accent/15 text-brand-accent border border-brand-accent/30'
          : 'text-brand-muted hover:bg-brand-mid hover:text-brand-light border border-transparent',
        collapsed && 'justify-center px-2'
      )}
    >
      <item.Icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { profile } = useUser()

  const userRole = profile?.role ?? 'Volunteer'

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  )

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function isActive(href: string) {
    return href === '/dashboard' ? pathname === href : pathname.startsWith(href)
  }

  return (
    <>
      {/* ── Desktop full sidebar (lg+) ─────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-brand-darker border-r border-brand-muted/20 z-40">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-brand-muted/20 flex-shrink-0">
          <span className="text-xl font-display font-black text-brand-light">
            skill<span className="text-brand-accent">SYNC</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
              collapsed={false}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-brand-muted/20 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-muted transition-all duration-200 hover:bg-red-900/20 hover:text-red-400 border border-transparent hover:border-red-900/30"
          >
            <IconLogOut className="h-5 w-5 flex-shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* ── Tablet icon-only sidebar (sm → lg) ────────────────────────── */}
      <aside className="hidden sm:flex lg:hidden flex-col fixed left-0 top-0 bottom-0 w-16 bg-brand-darker border-r border-brand-muted/20 z-40">
        {/* Logo icon */}
        <div className="flex items-center justify-center h-16 border-b border-brand-muted/20 flex-shrink-0">
          <span className="text-lg font-display font-black text-brand-accent">S</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col items-center gap-1 px-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
              collapsed={true}
            />
          ))}
        </nav>

        {/* Logout icon */}
        <div className="py-4 border-t border-brand-muted/20 flex-shrink-0 flex justify-center px-1">
          <button
            onClick={handleLogout}
            title="Log out"
            className="flex items-center justify-center w-10 h-10 rounded-lg text-brand-muted transition-all duration-200 hover:bg-red-900/20 hover:text-red-400"
          >
            <IconLogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom nav (below sm) ──────────────────────────────── */}
      <nav className="flex sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-darker border-t border-brand-muted/20 h-16 items-center justify-around px-2">
        {visibleItems.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 p-2 rounded-lg transition-colors duration-200 min-w-[48px]',
              isActive(item.href) ? 'text-brand-accent' : 'text-brand-muted hover:text-brand-light'
            )}
          >
            <item.Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}
