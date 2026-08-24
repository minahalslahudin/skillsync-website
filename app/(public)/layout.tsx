import { BrandProvider } from '@/lib/context/BrandContext'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  // `.public-shell` scopes the editorial-bold design system (white bg,
  // black text, Inter body font) so admin/dashboard/auth pages keep their
  // legacy dark theme intact.
  return (
    <BrandProvider>
      <div className="public-shell">
        <Navbar />
        {/* pt-[64px] compensates for the fixed navbar height */}
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
    </BrandProvider>
  )
}
