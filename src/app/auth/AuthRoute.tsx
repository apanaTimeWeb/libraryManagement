'use client';
import { usePathname } from 'next/navigation';
import '@/app/auth/auth.css';

const AUTH_ROUTES = [
  '/auth'
];

export function AuthRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isAuthRoute = AUTH_ROUTES.some(r => pathname.startsWith(r));

  if (!isAuthRoute) return <>{children}</>;

  return (
    <div className="auth-theme min-h-screen">
      {children}
    </div>
  );
}
