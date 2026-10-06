'use client';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

const ACCOUNTING_ROUTES = [
  '/accounting/expenses', '/accounting/expense-categories', '/accounting/financial-reports',
  '/accounting/daily-settlement', '/accounting/seat-gap-report', '/accounting/shift-gap-analyzer',
  '/accounting/assets', '/accounting/asset-maintenance',
];

// ManagerRoute already provides the shell for all accounting paths.
// This component only injects the Toaster — no duplicate shell or wrapper div.
export function AccountingRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAccountingRoute = ACCOUNTING_ROUTES.some(r => pathname.startsWith(r));
  if (!isAccountingRoute) return <>{children}</>;

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
