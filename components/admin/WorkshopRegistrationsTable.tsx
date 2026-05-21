'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { WorkshopRegistration } from '@/lib/types/app.types'

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-yellow-400/10 border-yellow-400/30 text-yellow-400',
  confirmed: 'bg-green-400/10  border-green-400/30  text-green-400',
  rejected:  'bg-red-500/10   border-red-500/30   text-red-400',
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function WorkshopRegistrationsTable({
  registrations,
}: {
  registrations: WorkshopRegistration[]
}) {
  const router = useRouter()
  const [updating, setUpdating] = useState<string | null>(null)

  async function setStatus(id: string, status: 'confirmed' | 'rejected') {
    setUpdating(id)
    const supabase = createClient()
    const { error } = await supabase
      .from('workshop_registrations')
      .update({ status })
      .eq('id', id)

    if (error) {
      alert(`Update failed: ${error.message}`)
    } else {
      router.refresh()
    }
    setUpdating(null)
  }

  if (registrations.length === 0) {
    return (
      <div className="rounded-xl border border-gray-700/40 bg-[#2C2C54] p-16 text-center">
        <p className="text-gray-500 text-sm">No registrations yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-700/40">
      <table className="w-full text-sm min-w-[900px]">
        <thead>
          <tr className="bg-[#2C2C54] border-b border-gray-700/40">
            {[
              'Full Name', 'Email', 'Phone', 'University',
              'Workshop', 'Submitted', 'Receipt', 'Status', 'Actions',
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/30">
          {registrations.map((row) => {
            const busy = updating === row.id
            return (
              <tr
                key={row.id}
                className="bg-[#1A1A2E] hover:bg-[#2C2C54]/40 transition-colors duration-150"
              >
                {/* Full Name */}
                <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                  {row.full_name}
                </td>

                {/* Email */}
                <td className="px-4 py-3 text-gray-300">
                  <a href={`mailto:${row.email}`} className="hover:text-[#E94560] transition-colors">
                    {row.email}
                  </a>
                </td>

                {/* Phone */}
                <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{row.phone}</td>

                {/* University */}
                <td className="px-4 py-3 text-gray-300 max-w-[160px] truncate" title={row.university}>
                  {row.university}
                </td>

                {/* Workshop */}
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                  {row.workshop_id}
                </td>

                {/* Submitted At */}
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                  {fmt(row.created_at)}
                </td>

                {/* Payment Receipt */}
                <td className="px-4 py-3">
                  {row.payment_receipt_url ? (
                    <a
                      href={row.payment_receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E94560] hover:underline text-xs font-medium whitespace-nowrap"
                    >
                      View ↗
                    </a>
                  ) : (
                    <span className="text-gray-600 text-xs">—</span>
                  )}
                </td>

                {/* Status Badge */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-semibold capitalize ${STATUS_STYLES[row.status] ?? STATUS_STYLES.pending}`}
                  >
                    {row.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    {row.status !== 'confirmed' && (
                      <button
                        disabled={busy}
                        onClick={() => setStatus(row.id, 'confirmed')}
                        className="px-2.5 py-1 rounded text-xs font-semibold bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 disabled:opacity-40 transition-colors"
                      >
                        {busy ? '…' : 'Confirm'}
                      </button>
                    )}
                    {row.status !== 'rejected' && (
                      <button
                        disabled={busy}
                        onClick={() => setStatus(row.id, 'rejected')}
                        className="px-2.5 py-1 rounded text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 disabled:opacity-40 transition-colors"
                      >
                        {busy ? '…' : 'Reject'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
