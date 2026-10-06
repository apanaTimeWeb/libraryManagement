'use client';
import { usePathname } from 'next/navigation';
import '@/app/admin/admin_crm/crm.css';

const CRM_ROUTES = ['/crm'];

// ManagerRoute already provides the shell (sidebar + header) for all /crm/* paths.
// This component only injects the CSS tokens — no duplicate shell.
export function CrmRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isCrmRoute = CRM_ROUTES.some(r => pathname.startsWith(r));
  if (!isCrmRoute) return <>{children}</>;

  return <>{children}</>;
}
