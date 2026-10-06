'use client';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import '@/app/manager/manager_seats_shifts_lockers/seat_shift.css';

const SEATS_ROUTES = ['/seats_shifts_lockers'];

// ManagerRoute already provides the shell (sidebar + header) for all /seats_shifts_lockers/* paths.
// This component only injects the CSS tokens and Toaster — no duplicate shell.
export function SeatsRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isSeatsRoute = SEATS_ROUTES.some(r => pathname.startsWith(r));
  if (!isSeatsRoute) return <>{children}</>;

  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#10B981', secondary: '#064E3B' } },
          error:   { iconTheme: { primary: '#EF4444', secondary: '#450A0A' } },
        }}
      />
    </>
  );
}
