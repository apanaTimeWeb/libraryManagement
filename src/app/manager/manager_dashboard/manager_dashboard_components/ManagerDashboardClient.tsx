'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, type ColDef } from 'ag-grid-community';
import { gridTheme } from '../../manager_reusable/gridTheme';
import { useDashboardData } from '../manager_dashboard_hooks/useDashboardData';
import { DashboardKpiGrid } from './DashboardKpiGrid';
import { DashboardSeatMatrix } from './DashboardSeatMatrix';
import { STATUS_CLASS, QUICK_LINKS } from '../manager_dashboard_constants';
import { MANAGER_ROUTES } from '../../manager_url_config';

ModuleRegistry.registerModules([AllCommunityModule]);

// RESPONSIBILITY: Main Client view for the Manager Dashboard. Glues data and components together.

function SmartIdCell({ value }: { value: string }) {
  return <span className="mgr-table-id">{value}</span>;
}
function ShiftCell({ value }: { value: string }) {
  return <span className="mgr-badge mgr-badge--info">{value}</span>;
}
function StatusCell({ value }: { value: string }) {
  const cls = STATUS_CLASS[value] ?? 'mgr-badge--info';
  return <span className={`mgr-badge ${cls}`}>{value}</span>;
}
function PhoneCell({ value }: { value: string }) {
  return <span className="mgr-text-secondary">{value}</span>;
}

export function ManagerDashboardClient() {
  const { data, status, error } = useDashboardData();

  const admissionCols: ColDef[] = useMemo(() => [
    { field: 'name',    headerName: 'NAME',     flex: 2, sortable: true },
    { field: 'smartId', headerName: 'SMART ID', flex: 1, sortable: true, cellRenderer: SmartIdCell },
    { field: 'shift',   headerName: 'SHIFT',    flex: 1, sortable: true, cellRenderer: ShiftCell  },
  ], []);

  const enquiryCols: ColDef[] = useMemo(() => [
    { field: 'name',   headerName: 'NAME',   flex: 2, sortable: true },
    { field: 'phone',  headerName: 'PHONE',  flex: 1, cellRenderer: PhoneCell },
    { field: 'status', headerName: 'STATUS', flex: 1, sortable: true, cellRenderer: StatusCell },
  ], []);

  if (status === 'loading') return <div className="p-8 animate-pulse">Loading dashboard...</div>;
  if (status === 'error') return <div className="p-8 text-[var(--danger)]">Failed to load: {error}</div>;
  if (!data) return null;

  return (
    <div>
      {/* Page Header */}
      <div className="mgr-page-header">
        <div>
          <p className="mgr-breadcrumb">Manager › Dashboard</p>
          <h1 className="mgr-page-title">Manager Dashboard</h1>
          <p className="mgr-page-subtitle">Good morning, Manager — aaj ka quick overview</p>
        </div>
        <div className="mgr-page-actions">
          <Link href={MANAGER_ROUTES.REPORTS} className="mgr-btn-ghost mgr-btn-sm">
            <TrendingUp size={14} /> View Reports
          </Link>
        </div>
      </div>

      <DashboardKpiGrid kpiData={data.kpiData} />

      {/* Row 2 — Seat Matrix + Action Items */}
      <div className="mgr-dashboard-row2 mgr-section-gap">
        <DashboardSeatMatrix seatData={data.seatData} />

        <div className="mgr-card">
          <div className="mgr-card-header">
            <h2 className="mgr-section-title">My Action Items</h2>
          </div>
          <div className="mgr-card-body">
            {data.actionItems?.map((item) => (
              <div key={item.title} className="mgr-action-item">
                <span className="mgr-action-label">{item.title}</span>
                <div className="mgr-action-right">
                  <span className={item.countClass}>{item.count}</span>
                  {item.showRenew ? (
                    <Link href={item.href} className="mgr-btn-primary mgr-btn-sm">Renew</Link>
                  ) : (
                    <Link href={item.href} className="mgr-action-link">View</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 — Recent Activity */}
      <div className="mgr-dashboard-row3 mgr-section-gap">
        <div className="mgr-card">
          <div className="mgr-card-header">
            <h2 className="mgr-section-title">Recent New Admissions</h2>
            <Link href={MANAGER_ROUTES.STUDENTS} className="mgr-action-link">View all</Link>
          </div>
          <div style={{ height: 280 }}>
            <AgGridReact
              theme={gridTheme}
              rowData={data.recentAdmissions || []}
              columnDefs={admissionCols}
              rowHeight={48}
              headerHeight={38}
              suppressMovableColumns
              suppressCellFocus
              defaultColDef={{ resizable: false }}
            />
          </div>
        </div>

        <div className="mgr-card">
          <div className="mgr-card-header">
            <h2 className="mgr-section-title">Recent Enquiries</h2>
            <Link href={MANAGER_ROUTES.CRM_ENQUIRIES} className="mgr-action-link">View all</Link>
          </div>
          <div style={{ height: 280 }}>
            <AgGridReact
              theme={gridTheme}
              rowData={data.recentEnquiries || []}
              columnDefs={enquiryCols}
              rowHeight={48}
              headerHeight={38}
              suppressMovableColumns
              suppressCellFocus
              defaultColDef={{ resizable: false }}
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mgr-card">
        <div className="mgr-card-header">
          <h2 className="mgr-section-title">Quick Links</h2>
        </div>
        <div className="mgr-card-body">
          <div className="mgr-quick-links-grid">
            {QUICK_LINKS.map((link) => (
              <Link key={link.title} href={link.href} className="mgr-action-link">
                <ChevronRight size={14} />{link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
