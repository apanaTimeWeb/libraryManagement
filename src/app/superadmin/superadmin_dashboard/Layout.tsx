// src/app/superadmin/dashboard/Layout.tsx
// Note: This wrapper is imported by pages inside superadmin/dashboard/
import Sidebar from '@/app/superadmin/superadmin_dashboard/Sidebar';
import Header from '@/app/superadmin/superadmin_dashboard/Header';

export default function SuperAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface text-on-surface overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-[240px] min-h-screen">
        <Header />

        <main className="pt-20 p-8 min-h-screen space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
