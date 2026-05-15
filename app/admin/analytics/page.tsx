import { getAnalyticsData } from '@/lib/supabase/queries/analytics'
import AnalyticsCharts from '@/components/admin/AnalyticsCharts'

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsData()

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Analytics</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Team performance and engagement overview</p>
      </div>
      <AnalyticsCharts data={data} />
    </div>
  )
}
