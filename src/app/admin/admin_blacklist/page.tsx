'use client';

// RESPONSIBILITY: Entry page for the admin_blacklist module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useMemo, useCallback, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Trash2, CheckCircle, AlertOctagon, ShieldAlert, X } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/admin/admin_reusable/gridTheme';
import toast, { Toaster } from 'react-hot-toast';

ModuleRegistry.registerModules([AllCommunityModule]);

interface BlacklistedStudent {
  id: string;
  name: string;
  phone: string;
  reason: string;
  blacklistedBy: string;
  blacklistedOn: string;
  previousSeat: string;
}

const BLACKLIST: BlacklistedStudent[] = [
  { id: 'BL1', name: 'Vikram Patel',  phone: '9876501234', reason: 'Repeated fee default (3 months)',    blacklistedBy: 'Rajesh Kumar', blacklistedOn: '25/07/25', previousSeat: 'S20' },
  { id: 'BL2', name: 'Suresh Yadav',  phone: '9876502345', reason: 'Property damage — broken chair',     blacklistedBy: 'Rajesh Kumar', blacklistedOn: '10/06/25', previousSeat: 'S7'  },
  { id: 'BL3', name: 'Kavita Mishra', phone: '9876503456', reason: 'Disruptive behavior — multiple warnings', blacklistedBy: 'Sunita Patil', blacklistedOn: '02/05/25', previousSeat: 'S14' },
];

interface FormState { name: string; phone: string; reason: string; previousSeat: string; }
const EMPTY: FormState = { name: '', phone: '', reason: '', previousSeat: '' };

function NameCell({ data }: { data: BlacklistedStudent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 32, width: 32, borderRadius: '50%', background: 'var(--danger-bg)', color: 'var(--danger)', flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700 }}>{data.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.3 }}>
        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{data.name}</span>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{data.phone}</span>
      </div>
    </div>
  );
}

function StatusCell() {
  return <span className="admin-badge admin-badge-danger">⛔ Blacklisted</span>;
}

export default function AdminBlacklistPage() {
  const [list, setList]         = useState<BlacklistedStudent[]>([]);

  useEffect(() => {
    fetchApi('/admin/admin_blacklist').then(data => {
      const mapped = data.map((b: any) => ({
        id: b.id,
        name: 'Blacklisted Student', // mock
        phone: '9999999999',
        reason: b.reason,
        blacklistedBy: 'Admin',
        blacklistedOn: new Date(b.date).toLocaleDateString(),
        previousSeat: 'S-10'
      }));
      setList(mapped);
    }).catch(console.error);
  }, []);
  const [showForm, setShowForm] = useState(false);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [form, setForm]         = useState<FormState>(EMPTY);
  const [errors, setErrors]     = useState<Partial<FormState>>({});

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.name.trim())   e.name   = 'Name is required';
    if (!form.phone.trim())  e.phone  = 'Phone is required';
    if (!form.reason.trim()) e.reason = 'Reason is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleAdd() {
    if (!validate()) return;
    setList(prev => [...prev, {
      id: `BL${Date.now()}`, ...form,
      blacklistedBy: 'Library Admin',
      blacklistedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }),
    }]);
    setShowForm(false);
    setForm(EMPTY);
    toast.success('Student blacklisted successfully.');
  }

  function handleRemove() {
    if (removeId) {
      setList(prev => prev.filter(s => s.id !== removeId));
      toast.success('Student removed from blacklist.');
    }
    setRemoveId(null);
  }

  const f = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    setErrors(p => ({ ...p, [k]: undefined }));
  };

  const colDefs = useMemo<any[]>(() => [
    { field: 'name',          headerName: 'STUDENT',        flex: 2,   minWidth: 180, cellRenderer: NameCell },
    { field: 'reason',        headerName: 'REASON',         flex: 2.5, minWidth: 200, cellStyle: { color: 'var(--text-secondary)', fontSize: 13 } },
    { field: 'blacklistedBy', headerName: 'BLACKLISTED BY', flex: 1.5, minWidth: 150, cellStyle: { color: 'var(--text-secondary)', fontSize: 13 } },
    { field: 'blacklistedOn', headerName: 'DATE',           flex: 1,   minWidth: 100, cellStyle: { color: 'var(--text-secondary)', fontSize: 13 } },
    { field: 'previousSeat',  headerName: 'PREV SEAT',      flex: 0.8, minWidth: 100, cellStyle: { color: 'var(--text-secondary)', fontSize: 13 } },
    { headerName: 'STATUS',   flex: 1,   minWidth: 120, sortable: false, cellRenderer: StatusCell },
    {
      headerName: 'ACTIONS', flex: 0.8, minWidth: 80, sortable: false,
      cellRenderer: ({ data }: { data: BlacklistedStudent }) => (
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <button
            className="admin-btn-icon"
            onClick={() => setRemoveId(data.id)}
            title="Remove from blacklist"
            style={{ color: 'var(--success)' }}
          >
            <X size={15} />
          </button>
        </div>
      ),
    },
  ], []);

  const onRowClicked = useCallback(() => {}, []);

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontSize: 13,
          },
        }}
      />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingBottom: 40 }}>
        {/* Page Header */}
        <div className="admin-page-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 24 }}>
          <div>
            <p className="admin-breadcrumb">Library OS › Admin › Blacklist</p>
            <h1 className="admin-page-title">Blacklist</h1>
            <p className="admin-page-subtitle">Students banned from re-joining the library.</p>
          </div>
          <div className="admin-page-actions">
            <button className="admin-btn-danger" onClick={() => { setForm(EMPTY); setErrors({}); setShowForm(true); }}>
              <AlertOctagon size={15} /> Blacklist Student
            </button>
          </div>
        </div>

        {/* Warning Banner */}
        <div style={{
          marginBottom: 20,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          padding: '14px 16px',
          borderRadius: 10,
          background: 'var(--danger-bg)',
          border: '1px solid color-mix(in srgb, var(--danger) 30%, transparent)',
          color: 'var(--danger)',
        }}>
          <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>
            <strong>{list.length} student{list.length !== 1 ? 's' : ''}</strong> currently blacklisted. Blacklisted students cannot be re-admitted unless removed from this list.
          </p>
        </div>

        {/* AG Grid */}
        <div className="admin-table-wrapper" style={{ flex: 1, minHeight: 400 }}>
          <AgGridReact
            theme={gridTheme}
            rowData={list}
            columnDefs={colDefs as any}
            rowHeight={56}
            headerHeight={38}
            suppressMovableColumns
            suppressCellFocus
            onRowClicked={onRowClicked}
            defaultColDef={{ resizable: false, sortable: true }}
          />
        </div>

        {/* Blacklist Add Modal */}
        {showForm && (
          <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <h2 className="admin-modal-title" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertOctagon size={18} /> Blacklist Student
              </h2>
              <p className="admin-modal-desc">
                This student will be banned from re-joining. Provide a clear reason for the record.
              </p>
              <div className="admin-form-grid">
                <div className="admin-form-field">
                  <label className="admin-label admin-label-required">Student Name</label>
                  <input className={`admin-input${errors.name ? ' admin-input-error' : ''}`} value={form.name} onChange={f('name')} placeholder="Full name" />
                  {errors.name && <p className="admin-error">{errors.name}</p>}
                </div>
                <div className="admin-form-field">
                  <label className="admin-label admin-label-required">Phone</label>
                  <input className={`admin-input${errors.phone ? ' admin-input-error' : ''}`} value={form.phone} onChange={f('phone')} placeholder="9876543210" />
                  {errors.phone && <p className="admin-error">{errors.phone}</p>}
                </div>
                <div className="admin-form-field admin-form-field-full">
                  <label className="admin-label">Previous Seat</label>
                  <input className="admin-input" value={form.previousSeat} onChange={f('previousSeat')} placeholder="e.g. S12" />
                </div>
                <div className="admin-form-field admin-form-field-full">
                  <label className="admin-label admin-label-required">Reason</label>
                  <textarea
                    className={`admin-textarea${errors.reason ? ' admin-input-error' : ''}`}
                    value={form.reason}
                    onChange={f('reason')}
                    placeholder="Describe the reason for blacklisting…"
                    rows={3}
                    style={{ resize: 'none' }}
                  />
                  {errors.reason && <p className="admin-error">{errors.reason}</p>}
                </div>
              </div>
              <div className="admin-modal-footer">
                <button className="admin-btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="admin-btn-danger" onClick={handleAdd}>
                  <CheckCircle size={14} /> Confirm Blacklist
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Remove Confirm Modal */}
        {removeId && (
          <div className="admin-modal-overlay" onClick={() => setRemoveId(null)}>
            <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
              <h2 className="admin-modal-title" style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertOctagon size={18} /> Remove from Blacklist
              </h2>
              <p className="admin-modal-desc">
                Remove <strong>{list.find(s => s.id === removeId)?.name}</strong> from the blacklist? They will be eligible to re-join the library.
              </p>
              <div className="admin-modal-footer">
                <button className="admin-btn-ghost" onClick={() => setRemoveId(null)}>Cancel</button>
                <button className="admin-btn-primary" onClick={handleRemove}>Remove</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
