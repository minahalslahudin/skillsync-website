import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-brand-dark">
      <DashboardSidebar />

      {/* Content shifts right on sm+ for sidebar, extra bottom padding on mobile for bottom nav */}
      <div className="sm:pl-16 lg:pl-64 flex flex-col min-h-screen">
        <DashboardHeader />

        <main className="flex-1 p-4 md:p-6 pb-20 sm:pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}
