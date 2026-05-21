'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogoutButton() {
  const router  = useRouter()
  const [busy, setBusy] = useState(false)

  async function handleLogout() {
    setBusy(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <button
      onClick={handleLogout}
      disabled={busy}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#E94560]/10 border border-[#E94560]/30 text-[#E94560] hover:bg-[#E94560]/20 disabled:opacity-50 transition-colors duration-200"
    >
      {busy ? 'Signing out…' : 'Logout'}
    </button>
  )
}
