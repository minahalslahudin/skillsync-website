'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Brand = 'skillsync' | 'skillit'

interface BrandContextValue {
  brand: Brand
  setBrand: (b: Brand) => void
}

const BrandContext = createContext<BrandContextValue>({
  brand: 'skillsync',
  setBrand: () => {},
})

const ACCENT: Record<Brand, string> = {
  skillsync: '#E94560',
  skillit:   '#0F6B7A',
}

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrandState] = useState<Brand>('skillsync')

  function setBrand(b: Brand) {
    setBrandState(b)
    document.documentElement.style.setProperty('--active-accent', ACCENT[b])
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--active-accent', ACCENT.skillsync)
  }, [])

  return (
    <BrandContext.Provider value={{ brand, setBrand }}>
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  return useContext(BrandContext)
}

export default BrandContext
