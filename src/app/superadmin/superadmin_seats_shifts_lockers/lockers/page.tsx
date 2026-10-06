'use client';
import { useState, useMemo } from 'react';
import { Plus, ChevronDown, Search, UserPlus, Unlock, Wrench } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, type ColDef } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_seats_shifts_lockers/reusable/gridTheme';
import toast from 'react-hot-toast';

ModuleRegistry.registerModules([AllCommunityModule]);

type LockerStatus = 'Free' | 'Occupied' | 'Maintenance';

interface Locker {
  id: string;
  lockerId: string;
  status: LockerStatus;
  assignedTo: string;
  studentId: string;
  assignedSince: string;
}

const INITIAL_LOCKERS: Locker[] = [
  { id: '1', lockerId: 'A01', status: 'Occupied', assignedTo: 'Alex Chen', studentId: 'LIB-021', assignedSince: '01 Oct 2024' },
  { id: '2', lockerId: 'A02', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—' },
  { id: '3', lockerId: 'A05', status: 'Maintenance', assignedTo: '—', studentId: '—', assignedSince: '—' },
  { id: '4', lockerId: 'B04', status: 'Occupied', assignedTo: 'Maria Vargas', studentId: 'LIB-055', assignedSince: '15 Sep 2024' },
  { id: '5', lockerId: 'B06', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—' },
  { id: '6', lockerId: 'C10', status: 'Occupied', assignedTo: 'Ravi Kumar', studentId: 'LIB-099', assignedSince: '10 Oct 2024' },
];

const STATUS_CLASS: Record<LockerStatus, string> = {
  Free: 'ss-badge ss-badge--success',
  Occupied: 'ss-badge ss-badge--danger',
  Maintenance: 'ss-badge ss-badge--warning',
};

function LockerIdCell({ value }: { value: string }) {
  return <span className="ss-table__seat-no">{value}</span>;
}

function LockerStatusCell({ value }: { value: string }) {
  return (
    <span className={STATUS_CLASS[value as LockerStatus] ?? 'ss-badge ss-badge--inactive'}>
      <span className="ss-badge__dot" />{value}
    </span>
  );
}

function AssignedToCell({ data }: { data: Locker }) {
  if (data.assignedTo === '—') return <span className="ss-table__cell-muted">Unassigned</span>;
  return (
    <div className="ss-cell-stack">
      <p className="ss-cell-name">{data.assignedTo}</p>
      <p className="ss-table__cell-sub">{data.studentId}</p>
    </div>
  );
}

export default function LockersPage() {
  const [lockers, setLockers] = useState<Locker[]>(INITIAL_LOCKERS);
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [showAssign, setShowAssign] = useState<Locker | null>(null);
  const [assignSearch, setAssignSearch] = useState('');
  const [freeTarget, setFreeTarget] = useState<Locker | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLockerId, setNewLockerId] = useState('');
  const [addError, setAddError] = useState('');

  const filtered = lockers.filter(l => statusFilter === 'All Statuses' || l.status === statusFilter);

  function handleAssign() {
    if (!showAssign || !assignSearch.trim()) return;
    setLockers(prev => prev.map((l: any) => l.id === showAssign.id
      ? { ...l, status: 'Occupied', assignedTo: assignSearch, studentId: 'LIB-NEW', assignedSince: 'Today' }
      : l
    ));
    toast.success(`Locker ${showAssign.lockerId} assigned to ${assignSearch}.`);
    setShowAssign(null);
    setAssignSearch('');
  }

  function handleFreeLocker() {
    if (!freeTarget) return;
    setLockers(prev => prev.map((l: any) => l.id === freeTarget.id
      ? { ...l, status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—' }
      : l
    ));
    toast.success(`Locker ${freeTarget.lockerId} is now free.`);
    setFreeTarget(null);
  }

  function handleMarkMaintenance(locker: Locker) {
    setLockers(prev => prev.map((l: any) => l.id === locker.id ? { ...l, status: 'Maintenance' } : l));
    toast.success(`Locker ${locker.lockerId} marked as Maintenance.`);
  }

  function handleAddLocker() {
    if (!newLockerId.trim()) { setAddError('Locker ID is required'); return; }
    if (lockers.some(l => l.lockerId === newLockerId.trim())) { setAddError('Locker ID already exists'); return; }
    setLockers(prev => [...prev, {
      id: Date.now().toString(), lockerId: newLockerId.trim(),
      status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—',
    }]);
    toast.success(`Locker ${newLockerId.trim()} added.`);
    setShowAddModal(false);
    setNewLockerId('');
    setAddError('');
  }

  const colDefs = useMemo<any[]>(() => [
    { field: 'lockerId', headerName: 'LOCKER #', flex: 1, cellRenderer: LockerIdCell },
    { field: 'status', headerName: 'STATUS', flex: 1.2, cellRenderer: LockerStatusCell },
    { field: 'assignedTo', headerName: 'ASSIGNED TO', flex: 2, cellRenderer: AssignedToCell },
    { field: 'assignedSince', headerName: 'SINCE', flex: 1.3, cellClass: 'ss-cell-secondary' },
    {
      headerName: 'ACTIONS', flex: 1.2, sortable: false,
      cellRenderer: ({ data }: { data: Locker }) => (
        <div className="ss-cell-actions">
          {data.status === 'Free' && (
            <button className="ss-btn-icon" title="Assign Student" onClick={() => setShowAssign(data)}>
              <UserPlus size={13} />
            </button>
          )}
          {data.status === 'Occupied' && (
            <button className="ss-btn-icon" title="Free Locker" onClick={() => setFreeTarget(data)}>
              <Unlock size={13} />
            </button>
          )}
          {data.status !== 'Maintenance' && (
            <button className="ss-btn-icon" title="Mark Maintenance" onClick={() => handleMarkMaintenance(data)}>
              <Wrench size={13} />
            </button>
          )}
        </div>
      ),
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [lockers]);

  return (
    <>

      <div className="ss-page">
        <div className="ss-page-header">
          <div>
            <h1 className="ss-page-title">Lockers</h1>
            <p className="ss-page-subtitle">Manage locker assignments and availability</p>
          </div>
          <button className="ss-btn-primary ss-btn-start" onClick={() => { setNewLockerId(''); setAddError(''); setShowAddModal(true); }}>
            <Plus size={16} />Add Locker
          </button>
        </div>

        <div className="ss-filter-bar">
          <div className="ss-filter-bar__select-wrap">
            <select className="ss-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All Statuses</option>
              <option>Free</option>
              <option>Occupied</option>
              <option>Maintenance</option>
            </select>
            <ChevronDown size={14} className="ss-select-icon" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="ss-empty-state">
            <p className="ss-empty-state__icon">🔒</p>
            <p className="ss-empty-state__title">No lockers added yet.</p>
            <button className="ss-btn-primary" onClick={() => { setNewLockerId(''); setAddError(''); setShowAddModal(true); }}>
              <Plus size={15} />Add Locker
            </button>
          </div>
        ) : (
          <div className="ss-table-wrapper ss-grid-h-400">
            <AgGridReact theme={gridTheme} rowData={filtered} columnDefs={colDefs as any} rowHeight={52} headerHeight={40} suppressMovableColumns suppressCellFocus defaultColDef={{ resizable: false, sortable: true }} />
          </div>
        )}
      </div>

      {/* Add Locker Modal */}
      {showAddModal && (
        <div className="ss-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="ss-modal" onClick={e => e.stopPropagation()}>
            <h2 className="ss-modal-title">➕ Add Locker</h2>
            <div className="ss-form-field">
              <label className="ss-label">Locker ID <span className="ss-text-danger">*</span></label>
              <input
                className={`ss-input ss-input--no-icon${addError ? ' ss-input--error' : ''}`}
                placeholder="e.g. D01"
                value={newLockerId}
                onChange={e => { setNewLockerId(e.target.value); setAddError(''); }}
              />
              {addError && <p className="ss-error">{addError}</p>}
            </div>
            <div className="ss-modal-footer">
              <button className="ss-btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="ss-btn-primary" onClick={handleAddLocker}><Plus size={14} />Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssign && (
        <div className="ss-modal-overlay" onClick={() => setShowAssign(null)}>
          <div className="ss-modal" onClick={e => e.stopPropagation()}>
            <h2 className="ss-modal-title">👤 Assign Locker {showAssign.lockerId}</h2>
            <div className="ss-form-field">
              <label className="ss-label">Student <span className="ss-text-danger">*</span></label>
              <div className="ss-filter-bar__input-wrap">
                <Search size={14} className="ss-input-icon" />
                <input className="ss-input" placeholder="Search by name or Smart ID..." value={assignSearch} onChange={e => setAssignSearch(e.target.value)} />
              </div>
            </div>
            <div className="ss-modal-footer">
              <button className="ss-btn-ghost" onClick={() => setShowAssign(null)}>Cancel</button>
              <button className="ss-btn-primary" onClick={handleAssign} disabled={!assignSearch.trim()}>
                <UserPlus size={14} />Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Free Locker Confirm */}
      {freeTarget && (
        <div className="ss-modal-overlay" onClick={() => setFreeTarget(null)}>
          <div className="ss-modal" onClick={e => e.stopPropagation()}>
            <h2 className="ss-modal-title">🔓 Free Locker {freeTarget.lockerId}</h2>
            <p className="ss-modal-desc">
              Free Locker <strong>{freeTarget.lockerId}</strong> from <strong>{freeTarget.assignedTo}</strong>? Locker becomes available immediately.
            </p>
            <div className="ss-modal-footer">
              <button className="ss-btn-ghost" onClick={() => setFreeTarget(null)}>Cancel</button>
              <button className="ss-btn-danger" onClick={handleFreeLocker}>Free Locker</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
