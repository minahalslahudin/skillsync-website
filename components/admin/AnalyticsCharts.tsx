'use client'

import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import type { AnalyticsData } from '@/lib/supabase/queries/analytics'

const ACCENT     = '#E94560'
const INDIGO     = '#6366f1'
const GREEN      = '#22c55e'
const AMBER      = '#f59e0b'
const WARN_FILL  = ['#3f3f46', '#f59e0b', '#f97316', '#ef4444']

const TT = {
  contentStyle: { backgroundColor: '#1A1A2E', border: '1px solid #4A4E69', borderRadius: 8, fontSize: 12 },
  labelStyle:   { color: '#d4d4d8' },
  itemStyle:    { color: '#d4d4d8' },
}

function Empty() {
  return <p className="text-zinc-500 text-sm text-center py-14">No data yet</p>
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl border border-brand-muted/20 bg-brand-surface/50 space-y-3">
      <h3 className="text-sm font-semibold text-zinc-300">{title}</h3>
      {children}
    </div>
  )
}

export default function AnalyticsCharts({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-6">

      {/* Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">

        <ChartCard title="Volunteer Growth (Cumulative)">
          {data.headcount.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.headcount}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 10 }} />
                <YAxis tick={{ fill: '#71717a', fontSize: 10 }} allowDecimals={false} />
                <Tooltip {...TT} />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke={ACCENT}
                  strokeWidth={2}
                  dot={{ fill: ACCENT, r: 3 }}
                  name="Total Volunteers"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Weekly Report Submission Rate">
          {data.submissionRates.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.submissionRates}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="week" tick={{ fill: '#71717a', fontSize: 10 }} />
                <YAxis tick={{ fill: '#71717a', fontSize: 10 }} unit="%" domain={[0, 100]} />
                <Tooltip
                  {...TT}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(_v: unknown, _n: unknown, props: any) => [
                    `${props.payload.rate}% (${props.payload.submitted}/${props.payload.total})`,
                    'Submission Rate',
                  ]}
                />
                <Bar dataKey="rate" fill={INDIGO} radius={[4, 4, 0, 0]} name="Rate %" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">

        <ChartCard title="Workshop Registrations">
          {data.workshopStats.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.workshopStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 10 }} />
                <YAxis tick={{ fill: '#71717a', fontSize: 10 }} allowDecimals={false} />
                <Tooltip {...TT} />
                <Bar dataKey="attendees" fill={GREEN} radius={[4, 4, 0, 0]} name="Registrations" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Warnings Distribution">
          {data.warningsDistribution.every((d) => d.value === 0) ? <Empty /> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data.warningsDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={82}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.warningsDistribution.map((entry, i) => (
                    <Cell key={entry.name} fill={WARN_FILL[i]} />
                  ))}
                </Pie>
                <Tooltip {...TT} />
                <Legend
                  formatter={(v) => (
                    <span style={{ color: '#a1a1aa', fontSize: 11 }}>{v}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Row 3 — top contributors */}
      <ChartCard title="Top Contributors This Month (Hours)">
        {data.topContributors.length === 0 ? <Empty /> : (
          <ResponsiveContainer
            width="100%"
            height={Math.max(200, data.topContributors.length * 38)}
          >
            <BarChart data={data.topContributors} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis type="number" tick={{ fill: '#71717a', fontSize: 10 }} unit="h" />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#a1a1aa', fontSize: 11 }}
                width={130}
              />
              <Tooltip {...TT} formatter={(v) => [`${v}h`, 'Hours']} />
              <Bar dataKey="hours" fill={AMBER} radius={[0, 4, 4, 0]} name="Hours" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

    </div>
  )
}
