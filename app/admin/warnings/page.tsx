import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getAllWarnings, getActiveWarnings, getWarningSummary } from '@/lib/supabase/queries/warnings'
import WarningsClient from './WarningsClient'

export default async function AdminWarningsPage({
  searchParams,
}: {
  searchParams: { filter?: string }
}) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/dashboard')

  const showAll = searchParams.filter === 'all'
  const [warnings, summary] = await Promise.all([
    showAll ? getAllWarnings() : getActiveWarnings(),
    getWarningSummary(),
  ])

  return (
    <WarningsClient
      initialWarnings={warnings}
      summary={summary}
      showAll={showAll}
    />
  )
}
