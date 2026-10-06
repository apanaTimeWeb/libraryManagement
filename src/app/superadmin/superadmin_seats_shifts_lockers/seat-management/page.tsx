'use client';
import { useState, useMemo } from 'react';
import { Plus, Search, ChevronDown, Wrench, Edit, AlertTriangle, CheckCircle } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, type ColDef } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_seats_shifts_lockers/reusable/gridTheme';
import toast from 'react-hot-toast';

ModuleRegistry.registerModules([AllCommunityModule]);

type SeatStatus = 'Working' | 'Maintenance' | 'Broken';

interface Seat {
  id: string;
  seatNo: string;
  branch: string;
  status: SeatStatus;
  assignedTo: string;
  lastMaintenance: string;
}

const INITIAL_SEATS: Seat[] = [
  { id: '1', seatNo: 'S-042', branch: 'North Wing', status: 'Working', assignedTo: 'Elias Hawthorne', lastMaintenance: 'Oct 14, 2024' },
  { id: '2', seatNo: 'S-109', branch: 'South Archive', status: 'Maintenance', assignedTo: '—', lastMaintenance: 'Today' },
  { id: '3', seatNo: 'S-012', branch: 'Main Reading', status: 'Broken', assignedTo: '—', lastMaintenance: 'Pending' },
  { id: '4', seatNo: 'S-088', branch: 'North Wing', status: 'Working', assignedTo: 'Seraphina Vane', lastMaintenance: 'Nov 02, 2024' },
];

const STATUS_CLASS: Record<SeatStatus, string> = {
  Working: 'ss-badge ss-badge--success',
  Maintenance: 'ss-badge ss-badge--warning',
  Broken: 'ss-badge ss-badge--danger',
};

const EMPTY_FORM = { seatNo: '', branch: '', status: 'Working' as SeatStatus };

function SeatNoCell({ value }: { value: string }) {
  return <span className="ss-table__seat-no">{value}</span>;
}

function BranchCell({ data }: { data: Seat }) {
  return <span className="ss-cell-primary">{data.branch}</span>;
}

function SeatStatusCell({ value }: { value: string }) {
  return (
    <span className={STATUS_CLASS[value as SeatStatus] ?? 'ss-badge ss-badge--inactive'}>
      <span className="ss-badge__dot" />{value}
    </span>
  );
}

export default function SeatManagementPage() {
  const [seats, setSeats] = useState<Seat[]>(INITIAL_SEATS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [showModal, setShowModal] = useState(false);
  const [editSeat, setEditSeat] = useState<Seat | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmBroken, setConfirmBroken] = useState<Seat | null>(null);

  const filtered = seats.filter(s => {
    const matchSearch = s.seatNo.toLowerCase().includes(search.toLowerCase()) ||
      s.branch.toLowerCase().includes(search.toLowerCase()) ||
      s.assignedTo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All Statuses' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function openAdd() {
    setEditSeat(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowModal(true);
  }

  function openEdit(seat: Seat) {
    setEditSeat(seat);
    setForm({ seatNo: seat.seatNo, branch: seat.branch, status: seat.status });
    setErrors({});
    setShowModal(true);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.seatNo.trim()) e.seatNo = 'Seat number is required';
    if (!form.branch.trim()) e.branch = 'Branch is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    if (editSeat) {
      setSeats(prev => prev.map((s: any) => s.id === editSeat.id ? { ...s, ...form } : s));
      toast.success('Seat updated.');
    } else {
      setSeats(prev => [...prev, { id: Date.now().toString(), ...form, assignedTo: '—', lastMaintenance: '—' }]);
      toast.success('Seat added.');
    }
    setShowModal(false);
  }

  function handleMarkFixed(seat: Seat) {
    setSeats(prev => prev.map((s: any) => s.id === seat.id ? { ...s, status: 'Working' } : s));
    toast.success(`Seat ${seat.seatNo} marked as Working.`);
  }

  function confirmMarkBroken() {
    if (!confirmBroken) return;
    setSeats(prev => prev.map((s: any) => s.id === confirmBroken.id ? { ...s, status: 'Broken' } : s));
    toast.success(`Seat ${confirmBroken.seatNo} marked as Broken.`);
    setConfirmBroken(null);
  }

  const colDefs = useMemo<any[]>(() => [
    { field: 'seatNo', headerName: 'SEAT #', flex: 1, cellRenderer: SeatNoCell },
    { field: 'branch', headerName: 'BRANCH', flex: 2, cellRenderer: BranchCell },
    { field: 'status', headerName: 'STATUS', flex: 1.2, cellRenderer: SeatStatusCell },
    { field: 'assignedTo', headerName: 'ASSIGNED TO', flex: 2, cellClass: 'ss-cell-secondary' },
    { field: 'lastMaintenance', headerName: 'LAST MAINTENANCE', flex: 1.5, cellClass: 'ss-cell-secondary' },
    {
      headerName: 'ACTIONS', flex: 1.5, sortable: false,
      cellRenderer: ({ data }: { data: Seat }) => (
        <div className="ss-cell-actions">
          <button className="ss-btn-icon" title="View Maintenance Log" onClick={() => toast.success(`Opening log for ${data.seatNo}`)}>
            <Wrench size={13} />
          </button>
          <button className="ss-btn-icon" title="Edit" onClick={() => openEdit(data)}>
            <Edit size={13} />
          </button>
          {data.status !== 'Broken' ? (
            <button className="ss-btn-icon" title="Mark Broken" onClick={() => setConfirmBroken(data)}>
              <AlertTriangle size={13} />
            </button>
          ) : (
            <button className="ss-btn-icon" title="Mark Fixed" onClick={() => handleMarkFixed(data)}>
              <CheckCircle size={13} />
            </button>
          )}
        </div>
      ),
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [seats, openEdit]);

  return (
    <>

      <div className="ss-page">
        <div className="ss-page-header">
          <div>
            <h1 className="ss-page-title">Seats</h1>
            <p className="ss-page-subtitle">Manage all library seats</p>
          </div>
          <button className="ss-btn-primary ss-btn-start" onClick={openAdd}>
            <Plus size={16} />Add Seat
          </button>
        </div>

        <div className="ss-filter-bar">
          <div className="ss-filter-bar__input-wrap">
            <Search size={14} className="ss-input-icon" />
            <input type="text" placeholder="Search by seat #, branch or student..." className="ss-input" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="ss-filter-bar__select-wrap">
            <select className="ss-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All Statuses</option>
              <option>Working</option>
              <option>Maintenance</option>
              <option>Broken</option>
            </select>
            <ChevronDown size={14} className="ss-select-icon" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="ss-empty-state">
            <p className="ss-empty-state__icon">🪑</p>
            <p className="ss-empty-state__title">No seats found.</p>
            <p className="ss-empty-state__sub">Add your first seat to get started.</p>
            <button className="ss-btn-primary" onClick={openAdd}><Plus size={15} />Add Seat</button>
          </div>
        ) : (
          <div className="ss-table-wrapper ss-grid-h-400">
            <AgGridReact theme={gridTheme} rowData={filtered} columnDefs={colDefs as any} rowHeight={52} headerHeight={40} suppressMovableColumns suppressCellFocus defaultColDef={{ resizable: false, sortable: true }} />
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="ss-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="ss-modal" onClick={e => e.stopPropagation()}>
            <h2 className="ss-modal-title">{editSeat ? '✏️ Edit Seat' : '➕ Add Seat'}</h2>
            <div className="ss-form-grid">
              <div className="ss-form-field">
                <label className="ss-label">Seat Number <span className="ss-text-danger">*</span></label>
                <input className={`ss-input ss-input--no-icon${errors.seatNo ? ' ss-input--error' : ''}`} placeholder="e.g. A-01" value={form.seatNo} onChange={e => setForm(p => ({ ...p, seatNo: e.target.value }))} />
                {errors.seatNo && <p className="ss-error">{errors.seatNo}</p>}
              </div>
              <div className="ss-form-field">
                <label className="ss-label">Branch <span className="ss-text-danger">*</span></label>
                <input className={`ss-input ss-input--no-icon${errors.branch ? ' ss-input--error' : ''}`} placeholder="e.g. North Wing" value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value }))} />
                {errors.branch && <p className="ss-error">{errors.branch}</p>}
              </div>
              <div className="ss-form-field ss-form-field--full">
                <label className="ss-label">Status</label>
                <div className="ss-select-wrap">
                  <select className="ss-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as SeatStatus }))}>
                    <option>Working</option>
                    <option>Maintenance</option>
                    <option>Broken</option>
                  </select>
                  <ChevronDown size={14} className="ss-select-icon" />
                </div>
              </div>
            </div>
            <div className="ss-modal-footer">
              <button className="ss-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="ss-btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Mark Broken Confirm */}
      {confirmBroken && (
        <div className="ss-modal-overlay" onClick={() => setConfirmBroken(null)}>
          <div className="ss-modal" onClick={e => e.stopPropagation()}>
            <h2 className="ss-modal-title">⚠️ Mark Seat as Broken</h2>
            <p className="ss-modal-desc">Mark Seat <strong>{confirmBroken.seatNo}</strong> as broken? It will be unavailable for assignment.</p>
            <div className="ss-modal-footer">
              <button className="ss-btn-ghost" onClick={() => setConfirmBroken(null)}>Cancel</button>
              <button className="ss-btn-danger" onClick={confirmMarkBroken}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
