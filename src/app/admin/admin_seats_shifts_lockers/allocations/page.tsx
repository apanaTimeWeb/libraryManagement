'use client';
// RESPONSIBILITY: Entry page for the admin_seats_shifts_lockers module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useMemo, useState } from 'react';
import { ChevronDown, Download, Eye, Printer, Upload, MessageSquare, Send, Mail } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, type ColDef } from 'ag-grid-community';
import { gridTheme } from '@/app/admin/admin_seats_shifts_lockers/admin_seats_shifts_lockers_components/AdminSeatsShiftsLockersgridTheme/AdminSeatsShiftsLockersgridTheme';
import toast from 'react-hot-toast';

ModuleRegistry.registerModules([AllCommunityModule]);

interface Allocation {
  studentName: string;
  smartId: string;
  phone: string;
  seatNo: string;
  shift: string;
  customSlots: string;
  lockerNo: string;
  feeStatus: 'Paid' | 'Due';
  validFrom: string;
  validTill: string;
  daysLeft: number;
  status: 'Active' | 'Expired' | 'Suspended';
}

const ALLOCATIONS: Allocation[] = [
  { studentName: 'Alex Rivera', smartId: 'LIB-001', phone: '+91 9876543210', seatNo: 'S-02', shift: 'Morning', customSlots: '8AM–10AM, 5PM–8PM', lockerNo: 'A01', feeStatus: 'Paid', validFrom: '01 Oct 2024', validTill: '31 Oct 2024', daysLeft: 7, status: 'Active' },
  { studentName: 'Priya Sharma', smartId: 'LIB-002', phone: '+91 9123456789', seatNo: 'S-11', shift: 'Evening', customSlots: '—', lockerNo: '—', feeStatus: 'Paid', validFrom: '15 Sep 2024', validTill: '14 Oct 2024', daysLeft: 3, status: 'Active' },
  { studentName: 'Rohan Mehta', smartId: 'LIB-003', phone: '+91 9988776655', seatNo: 'S-22', shift: 'Morning', customSlots: '—', lockerNo: 'B04', feeStatus: 'Due', validFrom: '01 Sep 2024', validTill: '30 Sep 2024', daysLeft: -5, status: 'Expired' },
  { studentName: 'Sneha Patel', smartId: 'LIB-004', phone: '+91 9001122334', seatNo: 'S-36', shift: 'Full Day', customSlots: '—', lockerNo: '—', feeStatus: 'Paid', validFrom: '10 Oct 2024', validTill: '09 Nov 2024', daysLeft: 20, status: 'Active' },
  { studentName: 'Vikram Rao', smartId: 'LIB-005', phone: '+91 9888123456', seatNo: 'S-45', shift: 'Evening', customSlots: '6PM–9PM', lockerNo: 'C10', feeStatus: 'Paid', validFrom: '20 Oct 2024', validTill: '19 Nov 2024', daysLeft: 30, status: 'Active' },
  { studentName: 'Ananya Gupta', smartId: 'LIB-006', phone: '+91 9777123456', seatNo: 'S-08', shift: 'Morning', customSlots: '—', lockerNo: '—', feeStatus: 'Due', validFrom: '05 Oct 2024', validTill: '04 Oct 2024', daysLeft: 12, status: 'Suspended' },
];

const STATUS_CLASS: Record<string, string> = {
  Active: 'ss-badge ss-badge--success',
  Expired: 'ss-badge ss-badge--danger',
  Suspended: 'ss-badge ss-badge--warning',
};

function StudentCell({ data }: { data: Allocation }) {
  return (
    <div className="ss-cell-stack">
      <p className="ss-cell-name">{data.studentName}</p>
      <p className="ss-table__cell-sub">{data.smartId} • {data.phone}</p>
    </div>
  );
}

function DaysLeftCell({ value }: { value: number }) {
  if (value < 0) return <span className="ss-badge ss-badge--danger">{Math.abs(value)}d ago</span>;
  if (value <= 7) return <span className="ss-badge ss-badge--danger">{value}d left</span>;
  if (value <= 15) return <span className="ss-badge ss-badge--warning">{value}d left</span>;
  return <span className="ss-badge ss-badge--success">{value}d left</span>;
}

function StatusCell({ value }: { value: string }) {
  return <span className={STATUS_CLASS[value] ?? 'ss-badge ss-badge--inactive'}><span className="ss-badge__dot" />{value}</span>;
}

function FeeStatusCell({ value }: { value: string }) {
  const isPaid = value === 'Paid';
  return (
    <span className={`ss-badge ${isPaid ? 'ss-badge--success' : 'ss-badge--danger'}`}>
      {value}
    </span>
  );
}

function ActionsCell({ data }: { data: Allocation }) {
  return (
    <div className="ss-cell-actions">
      <button className="ss-btn-icon" title="View Student" onClick={() => toast.success(`Viewing ${data.studentName}`)}>
        <Eye size={13} />
      </button>
    </div>
  );
}

export default function AllocationsPage() {
  const [shiftFilter, setShiftFilter] = useState('All Shifts');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = ALLOCATIONS.filter(a => {
    const matchShift = shiftFilter === 'All Shifts' || a.shift === shiftFilter;
    const matchStatus = statusFilter === 'All Statuses' || a.status === statusFilter;
    const matchFrom = !dateFrom || a.validFrom >= dateFrom;
    const matchTo = !dateTo || a.validTill <= dateTo;
    return matchShift && matchStatus && matchFrom && matchTo;
  });
  const colDefs = useMemo<any[]>(() => [
    { field: 'studentName', headerName: 'STUDENT', flex: 2, minWidth: 200, cellRenderer: StudentCell },
    { field: 'seatNo', headerName: 'SEAT #', flex: 0.8, cellClass: 'ss-table__seat-no' },
    { field: 'shift', headerName: 'SHIFT', flex: 1, cellClass: 'ss-cell-secondary' },
    { field: 'customSlots', headerName: 'CUSTOM SLOTS', flex: 1.5, cellClass: 'ss-cell-secondary' },
    { field: 'lockerNo', headerName: 'LOCKER #', flex: 0.8, cellClass: 'ss-cell-secondary' },
    { field: 'feeStatus', headerName: 'FEE', flex: 0.8, cellRenderer: FeeStatusCell },
    { field: 'validFrom', headerName: 'FROM', flex: 1.2, cellClass: 'ss-cell-secondary' },
    { field: 'validTill', headerName: 'TILL', flex: 1.2, cellClass: 'ss-cell-secondary' },
    { field: 'daysLeft', headerName: 'DAYS LEFT', flex: 1, cellRenderer: DaysLeftCell },
    { field: 'status', headerName: 'STATUS', flex: 1, cellRenderer: StatusCell },
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
          <div className="ss-page-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="ss-btn-ghost ss-btn-start" onClick={() => toast.success('Importing...')}>
              <Upload size={14} /> Import
            </button>
            <button className="ss-btn-ghost ss-btn-start" onClick={() => toast.success('Exporting CSV...')}>
              <Download size={14} /> CSV
            </button>
            <button className="ss-btn-ghost ss-btn-start" onClick={() => toast.success('Printing...')}>
              <Printer size={14} /> Print
            </button>
            <button className="ss-btn-ghost ss-btn-start" style={{ color: '#10B981' }} onClick={() => toast.success('WhatsApp...')}>
              <MessageSquare size={14} /> WhatsApp
            </button>
            <button className="ss-btn-ghost ss-btn-start" style={{ color: '#3B82F6' }} onClick={() => toast.success('Telegram...')}>
              <Send size={14} /> Telegram
            </button>
            <button className="ss-btn-ghost ss-btn-start" style={{ color: '#6366F1' }} onClick={() => toast.success('Email...')}>
              <Mail size={14} /> Email
            </button>
          </div>
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
            <AgGridReact theme={gridTheme} rowData={filtered} columnDefs={colDefs as any} rowHeight={52} headerHeight={40} suppressMovableColumns suppressCellFocus defaultColDef={{ resizable: false, sortable: true }} />
          </div>
        )}
      </div>
    </>
  );
}
