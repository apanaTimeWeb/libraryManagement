'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { UserPlus, Users2, Download } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, type ColDef } from 'ag-grid-community';
import { gridTheme } from '../../manager_reusable/gridTheme';
import { useStudentsList } from '../manager_students_hooks/useStudentsList';
import { STUDENT_STATUS_OPTIONS, STUDENT_SHIFT_OPTIONS } from '../manager_students_constants';
import { MANAGER_ROUTES } from '../../manager_url_config';
import { NameCell, ShiftCell, StatusCell, DueCell, ActionsCell } from './StudentsTableCells';
import { ManagerStudentsEmptyState } from './ManagerStudentsEmptyState';

ModuleRegistry.registerModules([AllCommunityModule]);

// RESPONSIBILITY: Main Client view for the Manager Students directory.

export function ManagerStudentsClient() {
  const {
    students,
    filtered,
    status,
    error,
    search, setSearch,
    statusFilter, setStatusFilter,
    shiftFilter, setShiftFilter
  } = useStudentsList();

  const colDefs: ColDef[] = useMemo(() => [
    {
      field: 'smartId', headerName: 'SMART ID', width: 110,
      cellStyle: { color: 'var(--mgr-primary)', fontFamily: 'monospace', fontSize: '12px' },
    },
    { field: 'name',   headerName: 'STUDENT',      flex: 2, minWidth: 160, cellRenderer: NameCell },
    { field: 'shift',  headerName: 'SHIFT / SEAT', flex: 1, minWidth: 120, cellRenderer: ShiftCell },
    { field: 'status', headerName: 'STATUS',        width: 105, cellRenderer: StatusCell },
    { field: 'plan',   headerName: 'PLAN',          flex: 1, minWidth: 100, cellStyle: { color: 'var(--mgr-text-secondary)', fontSize: '13px', fontFamily: 'inherit' } },
    { field: 'due',    headerName: 'DUE',           width: 100, cellRenderer: DueCell },
    { field: 'joined', headerName: 'JOINED',        width: 100, cellStyle: { color: 'var(--mgr-text-secondary)', fontSize: '12px', fontFamily: 'inherit' } },
    {
      headerName: 'ACTIONS',
      width: 120,
      pinned: 'right' as const,
      sortable: false,
      resizable: false,
      cellRenderer: ActionsCell,
    },
  ], []);

  if (status === 'error') return <div className="p-8 text-[var(--danger)]">Failed to load: {error}</div>;

  return (
    <div className="mgr-page">
      <div className="mgr-page-header">
        <div>
          <p className="mgr-breadcrumb">Library OS › Students</p>
          <h1 className="mgr-page-title">Student Directory</h1>
          <p className="mgr-page-subtitle">Manage admissions, seating, and billing for all active learners.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="mgr-btn-ghost mgr-btn-sm"><Download size={14} /> Export</button>
          <Link href={MANAGER_ROUTES.STUDENTS_GROUP} className="mgr-btn-ghost mgr-btn-sm">
            <Users2 size={14} /> Group Admission
          </Link>
          <Link href={MANAGER_ROUTES.STUDENTS_NEW} className="mgr-btn-primary">
            <UserPlus size={14} /> New Admission
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="mgr-kpi-grid mgr-section-gap">
        {[
          { label: 'Total',     value: students.length },
          { label: 'Active',    value: students.filter(s => s.status === 'Active').length },
          { label: 'Suspended', value: students.filter(s => s.status === 'Suspended').length },
          { label: 'Fee Due',   value: students.filter(s => s.due > 0).length },
        ].map(k => (
          <div key={k.label} className="mgr-kpi-card">
            <p className="mgr-kpi-label">{k.label}</p>
            <p className="mgr-kpi-value">{status === 'loading' ? '...' : k.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
        <input
          className="mgr-input mgr-search-input"
          placeholder="Search name, phone, Smart ID…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="mgr-select" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {STUDENT_STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select className="mgr-select" style={{ width: 'auto' }} value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}>
          {STUDENT_SHIFT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ height: 480 }}>
          {status === 'loading' ? (
             <div className="flex items-center justify-center h-full">Loading table...</div>
          ) : filtered.length === 0 ? (
             <div className="flex items-center justify-center h-full bg-[var(--bg-card)]">
               <ManagerStudentsEmptyState />
             </div>
          ) : (
            <AgGridReact
              theme={gridTheme}
              rowData={filtered}
              columnDefs={colDefs}
              rowHeight={56}
              headerHeight={38}
              suppressMovableColumns
              suppressCellFocus
              defaultColDef={{ resizable: true, sortable: true }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
