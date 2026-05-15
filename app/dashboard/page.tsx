import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { getTaskCounts } from '@/lib/supabase/queries/tasks'
import { getMyReports } from '@/lib/supabase/queries/reports'
import { getMyAchievements } from '@/lib/supabase/queries/achievements'
import { getMyTasks } from '@/lib/supabase/queries/tasks'
import TaskCard from '@/components/dashboard/TaskCard'

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-brand-muted/20 bg-brand-mid p-5">
      <p className="text-sm text-brand-muted">{label}</p>
      <p className="text-3xl font-display font-bold text-brand-accent mt-1">{value}</p>
      {sub && <p className="text-xs text-brand-muted mt-1">{sub}</p>}
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [counts, reports, achievements, tasks] = await Promise.all([
    getTaskCounts(user.id),
    getMyReports(user.id),
    getMyAchievements(user.id),
    getMyTasks(user.id),
  ])

  const { data: profile } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const activeTasks = tasks.filter((t) => t.status !== 'completed').slice(0, 4)
  const hoursThisMonth = reports
    .filter((r) => new Date(r.week_start).getMonth() === new Date().getMonth())
    .reduce((sum, r) => sum + r.total_hours, 0)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-brand-light">
          Welcome back, {firstName} 👋
        </h2>
        <p className="text-gray-400 mt-1">Here&apos;s what&apos;s on your plate.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tasks pending"    value={counts.pending}      />
        <StatCard label="In progress"      value={counts.in_progress}  />
        <StatCard label="Hours this month" value={`${hoursThisMonth}h`} />
        <StatCard label="Achievements"     value={achievements.length} />
      </div>

      {/* Active tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-semibold text-brand-light">Active tasks</h3>
          <Link href="/dashboard/work" className="text-sm text-brand-accent hover:underline">
            View all →
          </Link>
        </div>
        {activeTasks.length === 0 ? (
          <p className="text-brand-muted text-sm py-6 text-center rounded-xl border border-brand-muted/20">
            No active tasks. Nice work! 🎉
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {activeTasks.map((task) => <TaskCard key={task.id} task={task} />)}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div>
        <h3 className="text-lg font-display font-semibold text-brand-light mb-4">Quick actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { href: '/dashboard/reports',      label: 'Submit report',     emoji: '📋' },
            { href: '/dashboard/achievements', label: 'My achievements',   emoji: '🏆' },
            { href: '/dashboard/profile',      label: 'Edit profile',      emoji: '👤' },
          ].map(({ href, label, emoji }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl border border-brand-muted/20 bg-brand-mid p-4 text-sm font-medium text-brand-light hover:border-brand-accent/40 hover:text-brand-accent transition-all duration-200"
            >
              <span className="text-xl">{emoji}</span>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
