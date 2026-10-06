'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/app/superadmin/superadmin_system/Sidebar';
import Header from '@/app/superadmin/superadmin_system/Header';
import '@/app/superadmin/superadmin.css';
import '@/app/superadmin/superadmin_system/system.css';
import { getCurrentUser } from '@/lib/auth';

// ALL system routes — including ones previously missing from the guard
const SYSTEM_ROUTES = [
  '/system/bulk-import',
  '/system/data-export',
  '/system/backups',
  '/system/settings',
  '/system/profile',
  '/system/branding',
  '/system/whatsapp-integration',
  '/system/auto-scale',
  '/system/gap-filling',
  '/system/maintenance',
  '/system/offline',
  '/system/power-saving',
  '/system/smart-id',
  '/system/waitlist-automation',
];

const ALLOWED_ROLES = ['admin', 'superadmin'];

export function SystemRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const isSystemRoute = SYSTEM_ROUTES.some(r => pathname.startsWith(r));

  useEffect(() => {
    if (!isSystemRoute) {
      setIsVerified(true);
      return;
    }

    // Client-side backup check (middleware is the real guard)
    const user = getCurrentUser();
    if (!user) {
      router.replace(`/auth/login?returnTo=${encodeURIComponent(pathname)}&reason=unauthenticated`);
      return;
    }
    if (!ALLOWED_ROLES.includes(user.role)) {
      router.replace('/403');
      return;
    }
    setIsVerified(true);
  }, [pathname, isSystemRoute, router]);

  if (!isSystemRoute) return <>{children}</>;
  if (!isVerified) return null;

  const sidebarWidth = collapsed ? 60 : 240;

  return (
    <div className="admin-theme admin-shell-flex">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="admin-main-offset" style={{ marginLeft: sidebarWidth }}>
        <Header sidebarWidth={sidebarWidth} onMobileOpen={() => setMobileOpen(true)} />
        <main className="admin-shell-content">
          {children}
        </main>
      </div>
    </div>
  );
}
