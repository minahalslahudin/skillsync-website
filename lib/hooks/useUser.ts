'use client'

import { useUserContext } from '@/lib/context/UserContext'

export function useUser() {
  const { user, profile, loading, isAdmin, refetchProfile } = useUserContext()
  return { user, profile, loading, isAdmin, refetchProfile }
}
