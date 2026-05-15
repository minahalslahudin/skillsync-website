import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { getTaskCounts, getMyTasks } from '@/lib/supabase/queries/tasks'
import { getLatestReport, getReportsThisMonth } from '@/lib/supabase/queries/reports'
import { getMyAchievements } from '@/lib/supabase/queries/achievements'
import { getRecentAnnouncements } from '@/lib/supabase/queries/announcements'
import TaskCard from '@/components/dashboard/TaskCard'
import { formatDate } from '@/lib/utils/formatDate'

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-brand-muted/20 bg-brand-mid p-5">
      <p className="text-sm text-brand-muted">{label}</p>
      <p className="text-3xl font-display font-bold text-brand-accent mt-1">{value}</p>
      {sub && <p className="text-xs text-brand-muted mt-1">{sub}</p>}
    </div>
  )
}

function monthsSince(date: string): number {
  const joined = new Date(date)
  const now = new Date()
  return (now.getFullYear() - joined.getFullYear()) * 12 + (now.getMonth() - joined.getMonth())
}

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, role, department, joined_at, warning_count')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const [counts, latestReport, reportsThisMonth, achievements, tasks, announcements] =
    await Promise.all([
      getTaskCounts(user.id),
      getLatestReport(user.id),
      getReportsThisMonth(user.id),
      getMyAchievements(user.id),
      getMyTasks(user.id),
      getRecentAnnouncements(
        user.id,
        profile.role as string,
        profile.department as string | null,
        5,
      ),
    ])

  const firstName    = (profile.full_name as string).split(' ')[0]
  const months       = monthsSince(profile.joined_at as string)
  const hoursThisWeek = latestReport?.total_hours ?? 0
  const upcomingTasks = tasks
    .filter((t) => t.status !== 'completed')
    .slice(0, 3)

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome banner */}
      <div className="rounded-2xl border border-brand-muted/20 bg-brand-mid p-6">
        <h2 className="text-3xl font-display font-bold text-brand-light">
          Hello, {firstName} 👋
        </h2>
        <p className="text-gray-400 mt-1">
          {profile.role as string}
          {profile.department ? ` · ${profile.department as string}` : ''}
          {' · '}
          <span className="text-brand-muted">
            {months <= 0 ? 'Joined this month' : `Joined ${months} month${months !== 1 ? 's' : ''} ago`}
          </span>
        </p>
        {(profile.warning_count as number) > 0 && (
          <span className="inline-block mt-3 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400">
            ⚠️ {profile.warning_count} active warning{(profile.warning_count as number) !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Hours this week"    value={`${hoursThisWeek}h`} sub="from latest report" />
        <StatCard label="Pending tasks"      value={counts.not_started}  />
        <StatCard label="Reports this month" value={reportsThisMonth}     />
        <StatCard label="Achievements"       value={achievements.length}  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Announcements feed */}
        <div>
          <h3 className="text-lg font-display font-semibold text-brand-light mb-4">Announcements</h3>
          {announcements.length === 0 ? (
            <p className="text-brand-muted text-sm py-6 text-center rounded-xl border border-brand-muted/20">
              No announcements right now.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {announcements.map((a) => (
                <div key={a.id} className="rounded-xl border border-brand-muted/20 bg-brand-mid p-4">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-medium text-brand-light text-sm">{a.title}</p>
                    <span className="text-xs text-brand-muted flex-shrink-0">{formatDate(a.sent_at)}</span>
                  </div>
                  {a.body && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{a.body}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold text-brand-light">Upcoming tasks</h3>
            <Link href="/dashboard/work" className="text-sm text-brand-accent hover:underline">
              View all →
            </Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <p className="text-brand-muted text-sm py-6 text-center rounded-xl border border-brand-muted/20">
              No active tasks. Nice work! 🎉
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {upcomingTasks.map((task) => <TaskCard key={task.id} task={task} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
