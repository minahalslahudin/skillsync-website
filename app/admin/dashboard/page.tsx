import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import type { WorkshopRegistration } from '@/lib/types/app.types'
import WorkshopRegistrationsTable from '@/components/admin/WorkshopRegistrationsTable'
import AdminLogoutButton from '@/components/admin/AdminLogoutButton'

export const metadata = {
  title: 'Workshop Registrations | Admin',
}

export default async function AdminDashboardPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('users')
    .select('is_admin, role')
    .eq('id', user.id)
    .single()

  const isAdmin =
    (profile as { is_admin: boolean; role: string } | null)?.is_admin === true ||
    (profile as { is_admin: boolean; role: string } | null)?.role === 'Admin'

  if (!isAdmin) redirect('/admin/login')

  const { data: registrations } = await supabase
    .from('workshop_registrations')
    .select('*')
    .order('created_at', { ascending: false })

  const rows = (registrations as WorkshopRegistration[]) ?? []

  const counts = {
    total:     rows.length,
    pending:   rows.filter((r) => r.status === 'pending').length,
    confirmed: rows.filter((r) => r.status === 'confirmed').length,
    rejected:  rows.filter((r) => r.status === 'rejected').length,
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-white">Workshop Registrations</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            Verify payment receipts and confirm or reject each applicant&apos;s seat.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      {/* Status counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total',     value: counts.total,     color: 'text-white' },
          { label: 'Pending',   value: counts.pending,   color: 'text-yellow-400' },
          { label: 'Confirmed', value: counts.confirmed, color: 'text-green-400' },
          { label: 'Rejected',  value: counts.rejected,  color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-700/40 bg-[#2C2C54] px-5 py-4"
          >
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <WorkshopRegistrationsTable registrations={rows} />

    </div>
  )
}
