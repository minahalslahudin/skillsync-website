import { createServerClient } from '@/lib/supabase/server'

export interface HeadcountPoint {
  month:      string
  total:      number
  cumulative: number
}

export interface WorkshopBar {
  name:      string
  attendees: number
}

export interface SubmissionRateBar {
  week:      string
  rate:      number
  submitted: number
  total:     number
}

export interface WarningSlice {
  name:  string
  value: number
}

export interface ContributorBar {
  name:  string
  hours: number
}

export interface AnalyticsData {
  headcount:             HeadcountPoint[]
  workshopStats:         WorkshopBar[]
  submissionRates:       SubmissionRateBar[]
  warningsDistribution:  WarningSlice[]
  topContributors:       ContributorBar[]
}

function getLastNSundays(n: number): string[] {
  const dates: string[] = []
  const today = new Date()
  const lastSunday = new Date(today)
  lastSunday.setDate(today.getDate() - today.getDay())
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(lastSunday)
    d.setDate(lastSunday.getDate() - i * 7)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const supabase   = createServerClient()
  const sundays    = getLastNSundays(8)
  const now        = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [
    usersRes,
    workshopsRes,
    regsRes,
    reportWeekRes,
    activeCountRes,
    warningsRes,
    contributorsRes,
    userNamesRes,
  ] = await Promise.all([
    supabase.from('users').select('joined_at').neq('status', 'removed').order('joined_at'),
    supabase.from('events').select('id, title').eq('type', 'workshop').eq('is_published', true),
    supabase.from('registrations').select('event_id'),
    supabase.from('reports').select('week_ending').in('week_ending', sundays),
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('users').select('warning_count').neq('status', 'removed'),
    supabase.from('reports').select('user_id, total_hours').gte('submitted_at', monthStart),
    supabase.from('users').select('id, full_name').neq('status', 'removed'),
  ])

  // 1 — Headcount over time (cumulative)
  const byMonth: Record<string, number> = {}
  for (const row of (usersRes.data ?? []) as Array<{ joined_at: string }>) {
    const m = row.joined_at.slice(0, 7)
    byMonth[m] = (byMonth[m] ?? 0) + 1
  }
  let cumulative = 0
  const headcount: HeadcountPoint[] = Object.keys(byMonth).sort().map((m) => {
    cumulative += byMonth[m]
    return {
      month: new Date(m + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      total: byMonth[m],
      cumulative,
    }
  })

  // 2 — Workshop registrations
  const regsByEvent: Record<string, number> = {}
  for (const r of (regsRes.data ?? []) as Array<{ event_id: string }>) {
    regsByEvent[r.event_id] = (regsByEvent[r.event_id] ?? 0) + 1
  }
  const workshopStats: WorkshopBar[] = (workshopsRes.data ?? []).map(
    (w: { id: string; title: string }) => ({
      name:      w.title.length > 18 ? w.title.slice(0, 18) + '…' : w.title,
      attendees: regsByEvent[w.id] ?? 0,
    })
  )

  // 3 — Weekly submission rates
  const submittedByWeek: Record<string, number> = {}
  for (const r of (reportWeekRes.data ?? []) as Array<{ week_ending: string }>) {
    submittedByWeek[r.week_ending] = (submittedByWeek[r.week_ending] ?? 0) + 1
  }
  const activeTotal = activeCountRes.count ?? 0
  const submissionRates: SubmissionRateBar[] = sundays.map((sunday) => {
    const submitted = submittedByWeek[sunday] ?? 0
    return {
      week:      new Date(sunday).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rate:      activeTotal > 0 ? Math.round((submitted / activeTotal) * 100) : 0,
      submitted,
      total:     activeTotal,
    }
  })

  // 4 — Warnings distribution
  const wc = [0, 0, 0, 0] // index = warning count (3+ capped)
  for (const u of (warningsRes.data ?? []) as Array<{ warning_count: number }>) {
    wc[Math.min(u.warning_count, 3)]++
  }
  const warningsDistribution: WarningSlice[] = [
    { name: 'No Warning', value: wc[0] },
    { name: 'Warning 1',  value: wc[1] },
    { name: 'Warning 2',  value: wc[2] },
    { name: 'Warning 3',  value: wc[3] },
  ]

  // 5 — Top contributors this month
  const nameMap: Record<string, string> = {}
  for (const u of (userNamesRes.data ?? []) as Array<{ id: string; full_name: string }>) {
    nameMap[u.id] = u.full_name
  }
  const hoursByUser: Record<string, number> = {}
  for (const r of (contributorsRes.data ?? []) as Array<{ user_id: string; total_hours: number }>) {
    hoursByUser[r.user_id] = (hoursByUser[r.user_id] ?? 0) + (r.total_hours ?? 0)
  }
  const topContributors: ContributorBar[] = Object.entries(hoursByUser)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([uid, hours]) => ({
      name:  nameMap[uid] ?? 'Unknown',
      hours,
    }))

  return { headcount, workshopStats, submissionRates, warningsDistribution, topContributors }
}
