import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getMyTasks } from '@/lib/supabase/queries/tasks'
import TasksBoard from '@/components/dashboard/TasksBoard'

export default async function WorkPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const tasks = await getMyTasks(user.id)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-brand-light">My Work</h2>
        <p className="text-gray-400 mt-1">Tasks assigned to you across all projects.</p>
      </div>
      <TasksBoard initialTasks={tasks} />
    </div>
  )
}
