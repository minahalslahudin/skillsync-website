'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData.user) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    // Verify admin access — check both is_admin flag and role field
    const { data: profile } = await supabase
      .from('users')
      .select('is_admin, role')
      .eq('id', authData.user.id)
      .single()

    const isAdmin =
      (profile as { is_admin: boolean; role: string } | null)?.is_admin === true ||
      (profile as { is_admin: boolean; role: string } | null)?.role === 'Admin'

    if (!isAdmin) {
      await supabase.auth.signOut()
      setError('You do not have admin access.')
      setLoading(false)
      return
    }

    router.refresh()
    router.push('/admin/dashboard')
  }

  return (
    <main className="min-h-screen bg-[#1A1A2E] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-white tracking-tight">
            skill<span className="text-[#E94560]">SYNC</span>
          </span>
          <p className="mt-1 text-sm text-gray-500">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-700/50 bg-[#2C2C54] p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Admin Sign In</h1>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <Input
              label="Email address"
              type="email"
              placeholder="admin@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="rounded-lg bg-[#E94560]/10 border border-[#E94560]/30 px-4 py-3">
                <p className="text-sm text-[#E94560]">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-1"
            >
              Sign in
            </Button>
          </form>
        </div>

      </div>
    </main>
  )
}
