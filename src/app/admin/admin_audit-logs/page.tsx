'use client';

// RESPONSIBILITY: Entry page for the admin_audit-logs module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useMemo, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Search, ShieldAlert, ShieldCheck, Shield, AlertTriangle, Info } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/admin/admin_reusable/gridTheme';

ModuleRegistry.registerModules([AllCommunityModule]);

interface AuditLog {
  id: string;
  action: string;
  module: string;
  performedBy: string;
  role: string;
  details: string;
  severity: 'danger' | 'warning' | 'info' | 'success';
  timestamp: string;
  ip: string;
}

const LOGS: AuditLog[] = [
  { id: 'L1',  action: 'Deleted Receipt',        module: 'Finance',    performedBy: 'Rahul Sharma',  role: 'Staff',   details: 'Receipt #R-1042 of ₹500 deleted',          severity: 'danger',  timestamp: '25/07/25 16:30', ip: '192.168.1.10' },
  { id: 'L2',  action: 'Student Blacklisted',     module: 'Admin',      performedBy: 'Rajesh Kumar',  role: 'Admin',   details: 'Student Vikram Patel (ID #20) blacklisted',  severity: 'danger',  timestamp: '25/07/25 15:12', ip: '192.168.1.1'  },
  { id: 'L3',  action: 'Fee Collected',           module: 'Finance',    performedBy: 'Sunita Patil',  role: 'Manager', details: '₹1,500 collected from Arjun Sharma',         severity: 'success', timestamp: '25/07/25 14:45', ip: '192.168.1.5'  },
  { id: 'L4',  action: 'Student Added',           module: 'Students',   performedBy: 'Sunita Patil',  role: 'Manager', details: 'New student Riya Kapoor admitted (Seat S9)',  severity: 'info',    timestamp: '25/07/25 13:20', ip: '192.168.1.5'  },
  { id: 'L5',  action: 'Seat Marked Maintenance', module: 'Seats',      performedBy: 'Rajesh Kumar',  role: 'Admin',   details: 'Seat S5 marked under maintenance',           severity: 'warning', timestamp: '25/07/25 12:00', ip: '192.168.1.1'  },
  { id: 'L6',  action: 'Coupon Created',          module: 'Admin',      performedBy: 'Rajesh Kumar',  role: 'Admin',   details: 'Coupon SUMMER10 created (10% off, 30 uses)', severity: 'info',    timestamp: '25/07/25 11:30', ip: '192.168.1.1'  },
  { id: 'L7',  action: 'Student Exited',          module: 'Students',   performedBy: 'Sunita Patil',  role: 'Manager', details: 'Student Mohit Arya (ID #24) marked exit',    severity: 'warning', timestamp: '25/07/25 10:15', ip: '192.168.1.5'  },
  { id: 'L8',  action: 'Refund Issued',           module: 'Finance',    performedBy: 'Rajesh Kumar',  role: 'Admin',   details: '₹500 security deposit refunded to Divya Nair', severity: 'info',  timestamp: '24/07/25 18:00', ip: '192.168.1.1'  },
  { id: 'L9',  action: 'Staff Added',             module: 'Admin',      performedBy: 'Rajesh Kumar',  role: 'Admin',   details: 'New staff Priya Joshi added (Role: Staff)',   severity: 'success', timestamp: '24/07/25 16:45', ip: '192.168.1.1'  },
  { id: 'L10', action: 'Permissions Updated',     module: 'Admin',      performedBy: 'Rajesh Kumar',  role: 'Admin',   details: 'Manager role: finance.profit access revoked', severity: 'warning', timestamp: '24/07/25 15:30', ip: '192.168.1.1'  },
];

const SEV_BADGE_CLASS: Record<string, string> = {
  danger:  'admin-badge admin-badge-danger',
  warning: 'admin-badge admin-badge-warning',
  info:    'admin-badge admin-badge-info',
  success: 'admin-badge admin-badge-success',
};

const SEV_ICON: Record<string, React.ReactNode> = {
  danger:  <ShieldAlert size={12} />,
  warning: <AlertTriangle size={12} />,
  info:    <Info size={12} />,
  success: <ShieldCheck size={12} />,
};

function SeverityCell({ data }: { data: AuditLog }) {
  return (
    <span className={SEV_BADGE_CLASS[data.severity]}>
      {SEV_ICON[data.severity]} {data.severity.charAt(0).toUpperCase() + data.severity.slice(1)}
    </span>
  );
}

function ActionCell({ value }: { value: string }) {
  return <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>;
}

function UserCell({ data }: { data: AuditLog }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
      <span style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.3, color: 'var(--text-primary)' }}>{data.performedBy}</span>
      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{data.role}</span>
    </div>
  );
}

const TABS = ['all', 'danger', 'warning', 'info', 'success'] as const;
type FilterType = typeof TABS[number];

export default function AdminAuditLogsPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    fetchApi('/admin/admin_audit-logs').then(data => {
      const mapped = data.map((l: any) => ({
        id: l.id,
        action: l.action,
        module: l.entity,
        performedBy: 'Staff User',
        role: 'Admin',
        details: l.details,
        severity: 'info',
        timestamp: new Date(l.createdAt).toLocaleString(),
        ip: '192.168.1.1'
      }));
      setLogs(mapped);
    }).catch(console.error);
  }, []);

  const filtered = logs.filter(l => {
    const sevMatch = filter === 'all' || l.severity === filter;
    const searchMatch = !search || l.action.toLowerCase().includes(search.toLowerCase()) || l.performedBy.toLowerCase().includes(search.toLowerCase());
    return sevMatch && searchMatch;
  });

  const colDefs = useMemo<any[]>(() => [
    { field: 'timestamp',   headerName: 'TIME',         flex: 1.2, minWidth: 120, cellStyle: { color: 'var(--text-secondary)', fontSize: 12 } },
    { field: 'action',      headerName: 'ACTION',       flex: 2,   minWidth: 180, cellRenderer: ActionCell },
    { field: 'module',      headerName: 'MODULE',       flex: 1,   minWidth: 100, cellStyle: { color: 'var(--text-secondary)', fontSize: 13 } },
    { field: 'performedBy', headerName: 'PERFORMED BY', flex: 1.5, minWidth: 150, cellRenderer: UserCell },
    { field: 'details',     headerName: 'DETAILS',      flex: 2.5, minWidth: 250, cellStyle: { color: 'var(--text-secondary)', fontSize: 12 } },
    { field: 'severity',    headerName: 'SEVERITY',     flex: 1,   minWidth: 120, cellRenderer: SeverityCell },
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingBottom: 40 }}>
      {/* Page Header */}
      <div className="admin-page-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 24 }}>
        <div>
          <p className="admin-breadcrumb">Library OS › Admin › Audit Logs</p>
          <h1 className="admin-page-title">Audit Logs</h1>
          <p className="admin-page-subtitle">Track all sensitive actions performed in the system.</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 300, width: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            className="admin-input"
            style={{ paddingLeft: 38 }}
            placeholder="Search action or user…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-tab-bar">
          {TABS.map(s => (
            <button
              key={s}
              className={`admin-tab${filter === s ? ' active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* AG Grid */}
      <div className="admin-table-wrapper" style={{ flex: 1, minHeight: 400 }}>
        <AgGridReact
          theme={gridTheme}
          rowData={filtered}
          columnDefs={colDefs as any}
          rowHeight={52}
          headerHeight={38}
          suppressMovableColumns
          suppressCellFocus
          defaultColDef={{ resizable: false, sortable: true }}
        />
      </div>

      {/* Info Tip */}
      <div style={{
        marginTop: 20,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 16px',
        borderRadius: 10,
        background: 'var(--info-bg)',
        border: '1px solid color-mix(in srgb, var(--info) 30%, transparent)',
        color: 'var(--info)',
      }}>
        <Shield size={18} style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0, color: 'var(--text-secondary)' }}>
          Audit logs are retained for 90 days. Use the severity filter to quickly identify suspicious activity like deleted receipts or unauthorized access attempts.
        </p>
      </div>
    </div>
  );
}
