'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/app/superadmin/superadmin_dashboard/Sidebar';
import Header from '@/app/superadmin/superadmin_dashboard/Header';
import '@/app/superadmin/superadmin.css';
import '@/app/superadmin/sa-components.css';
import { getCurrentUser, clearAuthState } from '@/lib/auth';

const SUPERADMIN_ROUTES = ['/superadmin'];

export function SuperadminRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const isSuperadminRoute = SUPERADMIN_ROUTES.some(r => pathname.startsWith(r));

  useEffect(() => {
    if (!isSuperadminRoute) {
      setIsVerified(true);
      return;
    }

    // Client-side backup check (middleware is the real guard)
    const user = getCurrentUser();
    if (!user) {
      router.replace(`/auth/login?returnTo=${encodeURIComponent(pathname)}&reason=unauthenticated`);
      return;
    }
    if (user.role !== 'superadmin') {
      // Wrong role — redirect to 403
      router.replace('/403');
      return;
    }
    setIsVerified(true);
  }, [pathname, isSuperadminRoute, router]);

  if (!isSuperadminRoute) return <>{children}</>;

  // Show nothing while verifying (middleware already handled server-side)
  if (!isVerified) return null;

  // Setup wizard is explicitly standalone
  if (pathname.startsWith('/superadmin/superadmin_setup-wizard')) {
    return <div className="superadmin-theme">{children}</div>;
  }

  return (
    <div className="superadmin-theme">
      <div className="sa-shell">
        <div
          className={`sa-sidebar-mobile-overlay ${sidebarOpen ? 'sa-sidebar-mobile-overlay--visible' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />
        <Sidebar open={sidebarOpen} />
        <div className="sa-shell-content">
          <Header onMenuClick={() => setSidebarOpen(o => !o)} />
          <main className="sa-shell-main sa-page-animate">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
