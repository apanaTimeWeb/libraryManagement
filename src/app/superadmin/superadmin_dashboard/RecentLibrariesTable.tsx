'use client';
import { useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { themeQuartz, AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { ExternalLink } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

import type { RecentLibrary as Library } from '@/app/superadmin/superadmin_dashboard/superadmin_dashboard_types';

interface Props { data: Library[]; }

const STATUS_CONFIG = {
  active:   { label: 'Active',    cls: 'sa-badge--success' },
  setup:    { label: 'Setup Due', cls: 'sa-badge--warning' },
  inactive: { label: 'Inactive',  cls: 'sa-badge--danger' },
};

const PLAN_CLS: Record<string, string> = {
  Basic:      'sa-badge--info',
  Pro:        'sa-badge--primary',
  Enterprise: 'sa-badge',
};

export default function RecentLibrariesTable({ data }: Props) {
  const gridRef = useRef<AgGridReact>(null);

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Library', field: 'name', flex: 2, minWidth: 180,
      cellRenderer: (p: ICellRendererParams<Library>) => (
        <div className="flex items-center gap-3">
          <div className="sa-avatar-cell">
            {p.data?.initials}
          </div>
          <span className="font-medium text-primary text-sm">{p.data?.name}</span>
        </div>
      ),
    },
    { headerName: 'Owner', field: 'owner', flex: 1.5, minWidth: 130,
      cellClass: () => 'sa-cell-muted' },
    {
      headerName: 'Students', field: 'students', flex: 0.8, minWidth: 90,
      cellRenderer: (p: ICellRendererParams<Library>) => (
        <span className="font-bold text-primary">{p.data?.students}</span>
      ),
    },
    {
      headerName: 'Plan', field: 'plan', flex: 0.8, minWidth: 100,
      cellRenderer: (p: ICellRendererParams<Library>) => {
        const cls = PLAN_CLS[p.data?.plan ?? ''] ?? 'sa-badge--info';
        return <span className={`sa-badge ${cls} text-xs uppercase tracking-tight`}>{p.data?.plan}</span>;
      },
    },
    {
      headerName: 'Status', field: 'status', flex: 0.9, minWidth: 100,
      cellRenderer: (p: ICellRendererParams<Library>) => {
        const s = STATUS_CONFIG[p.data?.status ?? 'inactive'];
        return <span className={`sa-badge ${s.cls} text-xs uppercase tracking-tight`}>{s.label}</span>;
      },
    },
    { headerName: 'Joined', field: 'joinedAt', flex: 0.9, minWidth: 100,
      cellClass: () => 'sa-cell-muted-sm' },
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  return (
    <div className="sa-card overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-border">
        <h2 className="text-base font-bold text-primary">Recently Registered Libraries</h2>
        <Link href="/superadmin/superadmin_libraries" className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
          View All <ExternalLink size={12} />
        </Link>
      </div>
      <div style={{ height: 300 }}>
        <AgGridReact
          ref={gridRef}
          theme={gridTheme}
          rowData={data}
          columnDefs={colDefs as any}
          rowHeight={52}
          headerHeight={44}
          onGridReady={onGridReady}
          suppressCellFocus={true}
          suppressPaginationPanel={true}
        />
      </div>
    </div>
  );
}
