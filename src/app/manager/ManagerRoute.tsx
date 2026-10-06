'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import ManagerSidebar from './ManagerSidebar';
import ManagerHeader from './ManagerHeader';
import './manager.css';
import '@/app/manager/manager_communication/communication.css';
import '@/app/manager/manager_crm/crm.css';
import '@/app/manager/manager_engagement/engagement.css';
import '@/app/manager/manager_finance/finance.css';
import '@/app/manager/manager_seats_shifts_lockers/seat_shift.css';
const MANAGER_ROUTES = [
  '/manager',
];

export function ManagerRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isManagerRoute = MANAGER_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/') || pathname.startsWith(r));
  if (!isManagerRoute) return <>{children}</>;

  const sidebarWidth = collapsed ? 60 : 240;

  return (
    <div className="mgr-theme">
      <div className="mgr-shell-flex">
        <ManagerSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="mgr-main-offset" style={{ marginLeft: sidebarWidth }}>
          <ManagerHeader
            sidebarWidth={sidebarWidth}
            onMobileOpen={() => setMobileOpen(true)}
          />
          <main className="mgr-shell-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
