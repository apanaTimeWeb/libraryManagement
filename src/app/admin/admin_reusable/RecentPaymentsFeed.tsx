'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, type ColDef } from 'ag-grid-community';
import { gridTheme } from './gridTheme';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

ModuleRegistry.registerModules([AllCommunityModule]);

export interface Payment {
  name: string;
  initials: string;
  amount: string;
  mode: 'UPI' | 'Cash' | 'Card' | 'Bank Transfer';
  timeAgo: string;
  studentId?: string;
}

function NameCell({ value, data }: { value: string; data: Payment }) {
  return (
    <div className="flex items-center gap-3 h-full">
      <div className="flex items-center justify-center h-7 w-7 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold">
        {data.initials}
      </div>
      <span className="font-semibold text-sm text-[var(--text-primary)]">{value}</span>
    </div>
  );
}

function AmountCell({ value }: { value: string }) {
  return <span className="font-bold text-sm text-[var(--text-primary)]">{value}</span>;
}

function ModeCell({ value }: { value: string }) {
  let badgeClass = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  if (value === 'UPI') badgeClass = 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300';
  if (value === 'Cash') badgeClass = 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300';
  if (value === 'Card') badgeClass = 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300';
  if (value === 'Bank Transfer') badgeClass = 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/50 dark:text-orange-300';
  
  return <Badge variant="secondary" className={`${badgeClass} text-[10px] uppercase font-bold tracking-wider rounded-md border-none`}>{value}</Badge>;
}

function TimeCell({ value }: { value: string }) {
  return <span className="text-xs text-muted-foreground font-medium">{value}</span>;
}

export default function RecentPaymentsFeed({ payments }: { payments: Payment[] }) {
  const router = useRouter();

  const colDefs = useMemo<any[]>(() => [
    {
      field: 'name',
      headerName: 'STUDENT NAME',
      flex: 2,
      sortable: true,
      cellRenderer: NameCell,
    },
    {
      field: 'amount',
      headerName: 'AMOUNT',
      flex: 1,
      sortable: true,
      cellRenderer: AmountCell,
    },
    {
      field: 'mode',
      headerName: 'MODE',
      flex: 1,
      sortable: true,
      filter: true,
      cellRenderer: ModeCell,
    },
    {
      field: 'timeAgo',
      headerName: 'TIME',
      flex: 1,
      cellRenderer: TimeCell,
    },
  ], []);

  const onRowClicked = useCallback((e: any) => {
    const studentId = e.data?.studentId;
    if (studentId) router.push(`/manager/manager_students/${studentId}`);
  }, [router]);

  return (
    <Card className="overflow-hidden border-[var(--border)] bg-[var(--bg-card)] shadow-none flex flex-col h-full">
      <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">Recent Payments</CardTitle>
          <CardDescription className="text-xs mt-1">
            Last {payments.length} transactions today — click row to view student
          </CardDescription>
        </div>
        <Link
          href="/admin/admin_reports"
          className="flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline"
        >
          View Report <ExternalLink size={12} />
        </Link>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <div style={{ height: 300, width: '100%' }}>
          <AgGridReact
            theme={gridTheme}
            rowData={payments}
            columnDefs={colDefs as any}
            rowHeight={48}
            headerHeight={38}
            suppressMovableColumns
            suppressCellFocus
            onRowClicked={onRowClicked}
            rowStyle={{ cursor: 'pointer' }}
            pagination={false}
            defaultColDef={{ resizable: false }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
