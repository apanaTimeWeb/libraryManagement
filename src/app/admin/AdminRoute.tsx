'use client';

// RESPONSIBILITY: The application shell for the admin module, wrapping children with the Sidebar and Header.
// DATA FLOW: layout.tsx -> AdminRoute -> (AdminProvider, AdminSidebar, AdminHeader, children)

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/app/admin/admin_components/AdminSidebar/AdminSidebar';
import AdminHeader from '@/app/admin/admin_components/AdminHeader/AdminHeader';
import { AdminProvider } from '@/app/admin/admin_context/AdminContext';
import { ADMIN_ROUTES } from '@/app/admin/admin_url_config';
import '@/app/admin/admin.css';

// All route prefixes that belong to admin shell
const ADMIN_ROUTE_PREFIXES = [
  ADMIN_ROUTES.PREFIX
];

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdminRoute = ADMIN_ROUTE_PREFIXES.some(r => pathname.startsWith(r));
  if (!isAdminRoute) return <>{children}</>;

  const sidebarWidth = collapsed ? 60 : 240;

  return (
    <AdminProvider>
      <div className="admin-theme admin-shell-flex">
        <AdminSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        
        <div
          className="admin-main-offset"
          style={{ marginLeft: sidebarWidth }}
        >
        <AdminHeader
          sidebarWidth={sidebarWidth}
          onMobileOpen={() => setMobileOpen(true)}
        />
        <main className="admin-shell-content">
          <div className="ad-page-animate">
            {children}
          </div>
        </main>
      </div>
    </div>
    </AdminProvider>
  );
}
