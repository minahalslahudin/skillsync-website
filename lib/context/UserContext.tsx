'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { User as AuthUser } from '@supabase/supabase-js'
import type { User as UserProfile } from '@/lib/types/app.types'
import { createClient } from '@/lib/supabase/client'

// Module-level singleton — createBrowserClient returns the same instance
// for the same URL+key pair, so this is safe to call once here.
const supabase = createClient()

interface UserContextValue {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  isAdmin: boolean
  refetchProfile: () => Promise<void>
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  refetchProfile: async () => {},
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) console.error('Profile fetch error:', error)
    setProfile((data as UserProfile) ?? null)
  }, [])

  const refetchProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id)
  }, [user, fetchProfile])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin: profile?.is_admin ?? false,
        refetchProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  return useContext(UserContext)
}
