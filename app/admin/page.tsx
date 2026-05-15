import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { getAdminSummary, getRecentActivity } from '@/lib/supabase/queries/admin'
import { formatDate } from '@/lib/utils/formatDate'

const STAT_CARDS = [
  { key: 'totalVolunteers',   label: 'Total Volunteers',     href: '/admin/volunteers',   color: 'text-brand-accent' },
  { key: 'pendingApplications', label: 'Pending Applications', href: '/admin/applications', color: 'text-yellow-400' },
  { key: 'pendingReports',    label: 'Unread Reports',       href: '/admin/reports',      color: 'text-blue-400' },
  { key: 'openTasks',         label: 'Open Tasks',           href: '/admin/work',         color: 'text-purple-400' },
  { key: 'upcomingEvents',    label: 'Upcoming Events',      href: '/admin/events',       color: 'text-green-400' },
  { key: 'pendingReviews',    label: 'Pending Reviews',      href: '/admin/reviews',      color: 'text-orange-400' },
] as const

const QUICK_ACTIONS = [
  { label: 'Post Event',           href: '/admin/events',       emoji: '📅' },
  { label: 'Add Project',          href: '/admin/projects',     emoji: '🗂' },
  { label: 'Assign Work',          href: '/admin/work',         emoji: '📋' },
  { label: 'Review Applications',  href: '/admin/applications', emoji: '📥' },
]

const ACTIVITY_ICON: Record<string, string> = {
  report:      '📄',
  application: '📥',
  task:        '✅',
}

export default async function AdminPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('is_admin, full_name').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/dashboard')

  const [summary, activity] = await Promise.all([
    getAdminSummary(),
    getRecentActivity(20),
  ])

  const firstName = (profile.full_name as string).split(' ')[0]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-brand-light">
          Good to see you, <span className="text-red-400">{firstName}</span>
        </h2>
        <p className="text-gray-400 mt-1">Here&apos;s what&apos;s happening across skillSYNC today.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {STAT_CARDS.map(({ key, label, href, color }) => (
          <Link
            key={key}
            href={href}
            className="rounded-2xl border border-brand-muted/20 bg-brand-mid p-5 hover:border-red-800/40 transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <p className={`text-3xl font-display font-black ${color}`}>
              {summary[key]}
            </p>
            <p className="text-sm text-brand-muted mt-1 group-hover:text-brand-light transition-colors">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-lg font-display font-semibold text-brand-light mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {QUICK_ACTIONS.map(({ label, href, emoji }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-muted/20 bg-brand-mid text-sm font-medium text-brand-light hover:border-red-800/40 hover:bg-red-950/20 transition-all duration-200"
            >
              <span>{emoji}</span>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h3 className="text-lg font-display font-semibold text-brand-light mb-3">Recent Activity</h3>
        {activity.length === 0 ? (
          <p className="text-brand-muted text-sm py-8 text-center rounded-xl border border-brand-muted/20">
            No activity yet.
          </p>
        ) : (
          <div className="relative flex flex-col gap-0">
            <div className="absolute left-3.5 top-4 bottom-4 w-px bg-brand-muted/20" />
            {activity.map((item) => (
              <div key={item.id} className="relative flex gap-4 pb-4 last:pb-0">
                <div className="relative z-10 h-7 w-7 rounded-full bg-brand-mid border border-brand-muted/30 flex items-center justify-center flex-shrink-0 text-sm">
                  {ACTIVITY_ICON[item.type] ?? '•'}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm text-brand-light">
                      <span className="font-medium">{item.actor}</span>
                      {' '}
                      <span className="text-brand-muted">{item.description}</span>
                    </p>
                    <span className="text-xs text-brand-muted flex-shrink-0">{formatDate(item.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
