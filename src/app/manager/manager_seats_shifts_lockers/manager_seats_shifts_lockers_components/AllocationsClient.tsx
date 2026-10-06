'use client';
import { useMemo, useState, useEffect } from 'react';
import { ChevronDown, Download, Eye } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, type ColDef } from 'ag-grid-community';
import { gridTheme } from '@/app/manager/manager_seats_shifts_lockers/reusable/gridTheme';
import toast from 'react-hot-toast';
import { useSeatsStore } from '../manager_seats_shifts_lockers_context/manager_seats_shifts_lockers_store';

ModuleRegistry.registerModules([AllCommunityModule]);

interface Allocation {
  studentName: string;
  smartId: string;
  seatNo: string;
  shift: string;
  customSlots: string;
  lockerNo: string;
  validFrom: string;
  validTill: string;
  daysLeft: number;
  status: 'Active' | 'Expired' | 'Suspended';
}

const STATUS_CLASS: Record<string, string> = {
  Active: 'ss-badge ss-badge--success',
  Expired: 'ss-badge ss-badge--danger',
  Suspended: 'ss-badge ss-badge--warning',
};

function StudentCell(props: { data: Allocation }) {
  return (
    <div className="ss-cell-stack">
      <p className="ss-cell-name">{props.data.studentName}</p>
      <p className="ss-table__cell-sub">{props.data.smartId}</p>
    </div>
  );
}

function DaysLeftCell(props: { value: number }) {
  if (props.value < 0) return <span className="ss-badge ss-badge--danger">{Math.abs(props.value)}d ago</span>;
  if (props.value <= 7) return <span className="ss-badge ss-badge--danger">{props.value}d left</span>;
  if (props.value <= 15) return <span className="ss-badge ss-badge--warning">{props.value}d left</span>;
  return <span className="ss-badge ss-badge--success">{props.value}d left</span>;
}

function StatusCell(props: { value: string }) {
  return <span className={STATUS_CLASS[props.value] ?? 'ss-badge ss-badge--inactive'}><span className="ss-badge__dot" />{props.value}</span>;
}

function ActionsCell(props: { data: Allocation }) {
  return (
    <div className="ss-cell-actions">
      <button className="ss-btn-icon" title="View Student" onClick={() => toast.success(`Viewing ${props.data.studentName}`)}>
        <Eye size={13} />
      </button>
    </div>
  );
}

export function AllocationsClient() {
  const [shiftFilter, setShiftFilter] = useState('All Shifts');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { allocationsData, status, fetchAllocationsData } = useSeatsStore();

  useEffect(() => {
    if (status === 'idle' || allocationsData.length === 0) {
      fetchAllocationsData();
    }
  }, [status, allocationsData.length, fetchAllocationsData]);

  const filtered = allocationsData.filter((a: any) => {
    const matchShift = shiftFilter === 'All Shifts' || a.shift === shiftFilter;
    const matchStatus = statusFilter === 'All Statuses' || a.status === statusFilter;
    const matchFrom = !dateFrom || a.validFrom >= dateFrom;
    const matchTo = !dateTo || a.validTill <= dateTo;
    return matchShift && matchStatus && matchFrom && matchTo;
  });

  const colDefs: ColDef<Allocation>[] = useMemo(() => [
    { field: 'studentName', headerName: 'STUDENT', flex: 2, cellRenderer: StudentCell },
    { field: 'seatNo', headerName: 'SEAT #', flex: 0.8, cellClass: 'ss-table__seat-no' },
    { field: 'shift', headerName: 'SHIFT', flex: 1, cellClass: 'ss-cell-secondary' },
    { field: 'customSlots', headerName: 'CUSTOM SLOTS', flex: 1.8, cellClass: 'ss-cell-secondary' },
    { field: 'lockerNo', headerName: 'LOCKER #', flex: 0.8, cellClass: 'ss-cell-secondary' },
    { field: 'validFrom', headerName: 'FROM', flex: 1.3, cellClass: 'ss-cell-secondary' },
    { field: 'validTill', headerName: 'TILL', flex: 1.3, cellClass: 'ss-cell-secondary' },
    { field: 'daysLeft', headerName: 'DAYS LEFT', flex: 1, cellRenderer: DaysLeftCell },
    { field: 'status', headerName: 'STATUS', flex: 1.2, cellRenderer: StatusCell },
    { headerName: 'ACTIONS', flex: 0.8, sortable: false, cellRenderer: ActionsCell },
  ], []);

  return (
    <>
      <div className="ss-page">
        <div className="ss-page-header">
          <div>
            <h1 className="ss-page-title">Allocations</h1>
            <p className="ss-page-subtitle">All active and past seat allocations</p>
          </div>
          <button className="ss-btn-ghost ss-btn-start" onClick={() => toast.success('Exporting...')}>
            <Download size={15} />Export
          </button>
        </div>

        <div className="ss-filter-bar">
          <div className="ss-filter-bar__select-wrap">
            <select className="ss-select" value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}>
              <option>All Shifts</option>
              <option>Morning</option>
              <option>Evening</option>
              <option>Full Day</option>
            </select>
            <ChevronDown size={14} className="ss-select-icon" />
          </div>
          <div className="ss-filter-bar__select-wrap">
            <select className="ss-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All Statuses</option>
              <option>Active</option>
              <option>Expired</option>
              <option>Suspended</option>
            </select>
            <ChevronDown size={14} className="ss-select-icon" />
          </div>
          <div className="ss-filter-bar__input-wrap">
            <input type="date" className="ss-input ss-input--no-icon" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div className="ss-filter-bar__input-wrap">
            <input type="date" className="ss-input ss-input--no-icon" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="ss-empty-state">
            <p className="ss-empty-state__icon">📋</p>
            <p className="ss-empty-state__title">No allocations found.</p>
          </div>
        ) : (
          <div className="ss-table-wrapper ss-grid-h-400">
            <AgGridReact theme={gridTheme} rowData={filtered} columnDefs={colDefs} rowHeight={52} headerHeight={40} suppressMovableColumns suppressCellFocus defaultColDef={{ resizable: false, sortable: true }} />
          </div>
        )}
      </div>
    </>
  );
}
