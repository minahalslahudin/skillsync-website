import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getMyTasks } from '@/lib/supabase/queries/tasks'
import TaskCard from '@/components/dashboard/TaskCard'
import Badge from '@/components/ui/Badge'

export default async function WorkPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const tasks = await getMyTasks(user.id)

  const pending     = tasks.filter((t) => t.status === 'pending')
  const in_progress = tasks.filter((t) => t.status === 'in_progress')
  const overdue     = tasks.filter((t) => t.status === 'overdue')
  const completed   = tasks.filter((t) => t.status === 'completed')

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-brand-light">My Work</h2>
        <p className="text-gray-400 mt-1">Tasks assigned to you across all projects.</p>
      </div>

      {tasks.length === 0 && (
        <p className="text-brand-muted text-sm py-12 text-center rounded-xl border border-brand-muted/20">
          No tasks assigned yet.
        </p>
      )}

      {overdue.length > 0 && (
        <Section title="Overdue" badge={<Badge variant="danger">{overdue.length}</Badge>}>
          {overdue.map((t) => <TaskCard key={t.id} task={t} />)}
        </Section>
      )}

      {in_progress.length > 0 && (
        <Section title="In progress" badge={<Badge variant="info">{in_progress.length}</Badge>}>
          {in_progress.map((t) => <TaskCard key={t.id} task={t} />)}
        </Section>
      )}

      {pending.length > 0 && (
        <Section title="Pending" badge={<Badge variant="neutral">{pending.length}</Badge>}>
          {pending.map((t) => <TaskCard key={t.id} task={t} />)}
        </Section>
      )}

      {completed.length > 0 && (
        <Section title="Completed" badge={<Badge variant="success">{completed.length}</Badge>}>
          {completed.map((t) => <TaskCard key={t.id} task={t} />)}
        </Section>
      )}
    </div>
  )
}

function Section({ title, badge, children }: {
  title: string
  badge?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-lg font-display font-semibold text-brand-light">{title}</h3>
        {badge}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}
