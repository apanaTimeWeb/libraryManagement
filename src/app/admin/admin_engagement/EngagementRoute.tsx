'use client';
import { usePathname } from 'next/navigation';
import '@/app/admin/admin_engagement/engagement.css';

const ENGAGEMENT_ROUTES = ['/engagement'];

// ManagerRoute already provides the shell for all /engagement/* paths.
export function EngagementRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isEngagementRoute = ENGAGEMENT_ROUTES.some(r => pathname.startsWith(r));
  if (!isEngagementRoute) return <>{children}</>;

  return <>{children}</>;
}
