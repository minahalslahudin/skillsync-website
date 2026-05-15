'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { createClient } from '@/lib/supabase/client'

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconHome({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
}
function IconUsers({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}
function IconInbox({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
}
function IconBriefcase({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
}
function IconCalendar({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
}
function IconFolder({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
}
function IconStar({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}
function IconClipboard({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4M12 16h4M8 11h.01M8 16h.01"/></svg>
}
function IconAward({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
}
function IconAlertTriangle({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
}
function IconBarChart({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
}
function IconSettings({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
}
function IconLogOut({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
}

// ── Nav ────────────────────────────────────────────────────────────────────────

interface NavItem { label: string; href: string; Icon: React.FC<{ className?: string }> }

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',    href: '/admin',               Icon: IconHome },
  { label: 'Volunteers',   href: '/admin/volunteers',    Icon: IconUsers },
  { label: 'Applications', href: '/admin/applications',  Icon: IconInbox },
  { label: 'Work',         href: '/admin/work',          Icon: IconBriefcase },
  { label: 'Events',       href: '/admin/events',        Icon: IconCalendar },
  { label: 'Projects',     href: '/admin/projects',      Icon: IconFolder },
  { label: 'Reviews',      href: '/admin/reviews',       Icon: IconStar },
  { label: 'Reports',      href: '/admin/reports',       Icon: IconClipboard },
  { label: 'Certificates', href: '/admin/certificates',  Icon: IconAward },
  { label: 'Warnings',     href: '/admin/warnings',      Icon: IconAlertTriangle },
  { label: 'Analytics',    href: '/admin/analytics',     Icon: IconBarChart },
  { label: 'Settings',     href: '/admin/settings',      Icon: IconSettings },
]

function NavLink({ item, active, collapsed }: { item: NavItem; active: boolean; collapsed: boolean }) {
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
        active
          ? 'bg-red-950/60 text-red-400 border border-red-800/40'
          : 'text-brand-muted hover:bg-brand-mid hover:text-brand-light border border-transparent',
        collapsed && 'justify-center px-2'
      )}
    >
      <item.Icon className="h-4 w-4 flex-shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  )
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function isActive(href: string) {
    return href === '/admin' ? pathname === href : pathname.startsWith(href)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Desktop full sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-60 bg-brand-darker border-r border-red-900/20 z-40">
        <div className="flex items-center gap-2 h-16 px-5 border-b border-red-900/20 flex-shrink-0">
          <span className="text-lg font-display font-black text-brand-light">
            skill<span className="text-red-400">SYNC</span>
          </span>
          <span className="ml-1 text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-950/60 border border-red-800/40 rounded px-1.5 py-0.5">
            Admin
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} collapsed={false} />
          ))}
        </nav>
        <div className="px-3 py-3 border-t border-red-900/20 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-brand-muted transition-all duration-200 hover:bg-red-900/20 hover:text-red-400 border border-transparent"
          >
            <IconLogOut className="h-4 w-4 flex-shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Tablet icon-only sidebar */}
      <aside className="hidden sm:flex lg:hidden flex-col fixed left-0 top-0 bottom-0 w-14 bg-brand-darker border-r border-red-900/20 z-40">
        <div className="flex items-center justify-center h-16 border-b border-red-900/20 flex-shrink-0">
          <span className="text-base font-display font-black text-red-400">A</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 flex flex-col items-center gap-0.5 px-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} collapsed={true} />
          ))}
        </nav>
        <div className="py-3 border-t border-red-900/20 flex-shrink-0 flex justify-center px-1">
          <button
            onClick={handleLogout}
            title="Log out"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-brand-muted hover:bg-red-900/20 hover:text-red-400 transition-colors"
          >
            <IconLogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="flex sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-darker border-t border-red-900/20 h-14 items-center justify-around px-1">
        {NAV_ITEMS.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 p-2 rounded-lg transition-colors min-w-[44px]',
              isActive(item.href) ? 'text-red-400' : 'text-brand-muted hover:text-brand-light'
            )}
          >
            <item.Icon className="h-4 w-4" />
            <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}
