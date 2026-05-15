'use client'

import { UserProvider } from '@/lib/context/UserContext'
import { Toaster } from 'react-hot-toast'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#2C2C54',
            color: '#F0F4FF',
            border: '1px solid rgba(74,78,105,0.5)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#2C2C54' },
          },
          error: {
            iconTheme: { primary: '#E94560', secondary: '#2C2C54' },
          },
        }}
      />
    </UserProvider>
  )
}
