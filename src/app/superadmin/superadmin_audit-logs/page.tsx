'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { Eye, X, Shield } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const MOCK_LOGS = [
  { id: 'log_99123', time: '11 Apr 2026, 14:30', user: 'Super Admin',  entity: 'Subscription',   target: 'City Reading Hub',    action: 'Created',       ip: '192.168.1.42', detail: 'New Enterprise (Annual) subscription created for City Reading Hub. Amount: ₹15,000.' },
  { id: 'log_99122', time: '10 Apr 2026, 09:15', user: 'System Auto',  entity: 'Payment',        target: 'REC-2026-0410',       action: 'Fee_Collected', ip: 'internal',     detail: 'Automated fee collection triggered. Invoice REC-2026-0410 marked as Paid via UPI.' },
  { id: 'log_99121', time: '09 Apr 2026, 18:45', user: 'Rahul Sharma', entity: 'Branch',         target: 'Quiet Corner Lib',    action: 'Updated',       ip: '10.0.0.5',     detail: 'Branch address updated from old address to new address. Changed by staff Rahul Sharma.' },
  { id: 'log_99120', time: '08 Apr 2026, 11:20', user: 'Super Admin',  entity: 'Support Ticket', target: 'TKT-980',             action: 'Deleted',       ip: '192.168.1.42', detail: 'Support ticket TKT-980 deleted after resolution. Reason: Duplicate entry.' },
  { id: 'log_99119', time: '05 Apr 2026, 16:05', user: 'Super Admin',  entity: 'Plan',           target: 'Enterprise (Annual)', action: 'Created',       ip: '192.168.1.42', detail: 'New SaaS plan "Enterprise (Annual)" created. Price: ₹15,000/year. Max seats: 200.' },
  { id: 'log_99118', time: '04 Apr 2026, 10:00', user: 'System Auto',  entity: 'Backup',         target: 'DB Snapshot',         action: 'Created',       ip: 'internal',     detail: 'Nightly automated backup completed successfully. Snapshot stored in AWS S3.' },
  { id: 'log_99117', time: '03 Apr 2026, 15:30', user: 'Super Admin',  entity: 'Library',        target: 'Scholar Spaces',      action: 'Updated',       ip: '192.168.1.42', detail: 'Library status changed from Active to Maintenance for scheduled renovation.' },
];

type Log = typeof MOCK_LOGS[0];

function ActionBadge({ action }: { action: string }) {
  if (action === 'Created')       return <span className="sa-action-badge sa-action-badge--created">CREATED</span>;
  if (action === 'Updated')       return <span className="sa-action-badge sa-action-badge--updated">UPDATED</span>;
  if (action === 'Deleted')       return <span className="sa-action-badge sa-action-badge--deleted">DELETED</span>;
  if (action === 'Fee_Collected') return <span className="sa-action-badge sa-action-badge--fee">FEE_COLLECTED</span>;
  return null;
}

function LogPanel({ log, onClose }: { log: Log; onClose: () => void }) {
  return (
    <div className="sa-panel-overlay" onClick={onClose}>
      <div className="sa-panel-backdrop" />
      <div className="sa-panel-drawer" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            <span className="font-mono text-xs text-secondary">{log.id}</span>
          </div>
          <button className="sa-btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="sa-card p-4">
          <p className="text-sm text-secondary leading-relaxed">{log.detail}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[['Timestamp',log.time],['Performed By',log.user],['Entity',log.entity],['Target',log.target],['IP Address',log.ip],['Action',log.action]].map(([label,val]) => (
            <div key={label} className="sa-panel-info-cell">
              <p className="sa-panel-info-label">{label}</p>
              <p className="sa-panel-info-value--mono">{val}</p>
            </div>
          ))}
        </div>

        <ActionBadge action={log.action} />
      </div>
    </div>
  );
}

export default function AuditLogsPage() {
  const [actionFilter, setActionFilter] = useState('All Actions');
  const [selected, setSelected] = useState<Log | null>(null);
  const gridRef = useRef<AgGridReact>(null);

  const filtered = actionFilter === 'All Actions'
    ? MOCK_LOGS
    : MOCK_LOGS.filter(l => l.action === actionFilter);

  const colDefs = useMemo<any[]>(() => [
    { headerName: 'Timestamp', field: 'time', flex: 1.2, minWidth: 150,
      cellClass: () => 'sa-cell-mono-muted' },
    { headerName: 'Performed By', field: 'user', flex: 1, minWidth: 130,
      cellClass: () => 'sa-cell-primary-medium' },
    {
      headerName: 'Target Entity', field: 'target', flex: 1.5, minWidth: 160,
      cellRenderer: (p: ICellRendererParams<Log>) => (
        <div>
          <span className="text-xs font-semibold text-secondary mr-1.5">{p.data?.entity}:</span>
          <span className="text-sm text-primary">{p.data?.target}</span>
        </div>
      ),
    },
    {
      headerName: 'Action', field: 'action', flex: 1, minWidth: 130,
      cellRenderer: (p: ICellRendererParams<Log>) => <ActionBadge action={p.data?.action ?? ''} />,
    },
    { headerName: 'IP Address', field: 'ip', flex: 0.9, minWidth: 120,
      cellClass: () => 'sa-cell-mono-muted-sm' },
    {
      headerName: 'View', field: 'id', flex: 0.5, minWidth: 70, sortable: false, filter: false,
      cellRenderer: (p: ICellRendererParams<Log>) => (
        <button className="sa-btn-icon sa-btn-icon--reveal" onClick={e => { e.stopPropagation(); setSelected(p.data!); }}>
          <Eye size={15} />
        </button>
      ),
    },
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  return (
    <>
      {selected && <LogPanel log={selected} onClose={() => setSelected(null)} />}

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Library OS</span><span>/</span><span>Super Admin</span><span>/</span><span>Audit Logs</span>
        </div>
        <h1 className="sa-page-title">System Audit Logs</h1>
      </div>

      <div className="sa-card overflow-hidden">
        <div className="sa-actions-bar">
          <input type="text" placeholder="Search by target or user..." className="sa-input w-64"
            onChange={e => gridRef.current?.api.setGridOption('quickFilterText', e.target.value)} />
          <select className="sa-select" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
            <option>All Actions</option>
            <option>Created</option>
            <option>Updated</option>
            <option>Deleted</option>
            <option>Fee_Collected</option>
          </select>
          <span className="ml-auto text-xs text-secondary">{filtered.length} entries</span>
        </div>
        <div style={{ height: 420 }}>
          <AgGridReact
            ref={gridRef}
            theme={gridTheme}
            rowData={filtered}
            columnDefs={colDefs as any}
            rowHeight={52}
            headerHeight={44}
            onGridReady={onGridReady}
            onRowClicked={p => setSelected(p.data)}
            pagination={true}
            paginationPageSize={10}
            suppressCellFocus={true}
          />
        </div>
      </div>
    </>
  );
}
