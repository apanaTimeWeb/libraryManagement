'use client';
import { usePathname } from 'next/navigation';
import '@/app/admin/admin_communication/communication.css';

const COMMUNICATION_ROUTES = ['/communication'];

// ManagerRoute already provides the shell for all /communication/* paths.
export function CommunicationRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isCommunicationRoute = COMMUNICATION_ROUTES.some(r => pathname.startsWith(r));
  if (!isCommunicationRoute) return <>{children}</>;

  return <>{children}</>;
}
