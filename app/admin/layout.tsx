import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-dark">
      <AdminSidebar />
      <div className="sm:pl-14 lg:pl-60 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-4 md:p-6 pb-20 sm:pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}
