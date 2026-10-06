'use client';

// RESPONSIBILITY: Entry page for the admin_coupons module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useMemo, useCallback, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Plus, Trash2, CheckCircle, Tag } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/admin/admin_reusable/gridTheme';

ModuleRegistry.registerModules([AllCommunityModule]);

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'Flat' | 'Percent';
  usedCount: number;
  maxUses: number;
  expiry: string;
  status: 'Active' | 'Expired' | 'Exhausted';
}

const COUPONS: Coupon[] = [
  { id: 'C1', code: 'NEWYEAR50',  discount: 50,  type: 'Flat',    usedCount: 12, maxUses: 50,  expiry: '31/12/25', status: 'Active'    },
  { id: 'C2', code: 'FRIEND200',  discount: 200, type: 'Flat',    usedCount: 8,  maxUses: 100, expiry: '31/03/26', status: 'Active'    },
  { id: 'C3', code: 'SUMMER10',   discount: 10,  type: 'Percent', usedCount: 30, maxUses: 30,  expiry: '30/06/25', status: 'Exhausted' },
  { id: 'C4', code: 'WELCOME100', discount: 100, type: 'Flat',    usedCount: 5,  maxUses: 200, expiry: '31/12/25', status: 'Active'    },
  { id: 'C5', code: 'HOLI25',     discount: 25,  type: 'Percent', usedCount: 18, maxUses: 50,  expiry: '15/03/25', status: 'Expired'   },
];

interface FormState { code: string; discount: string; type: 'Flat' | 'Percent'; maxUses: string; expiry: string; }
const EMPTY: FormState = { code: '', discount: '', type: 'Flat', maxUses: '', expiry: '' };

function CodeCell({ value }: { value: string }) {
  return <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>;
}

function DiscountCell({ data }: { data: Coupon }) {
  return <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{data.type === 'Flat' ? `₹${data.discount}` : `${data.discount}%`} off</span>;
}

function UsageCell({ data }: { data: Coupon }) {
  const pct = Math.round((data.usedCount / data.maxUses) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: '100%', width: '100%', maxWidth: 160 }}>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)', width: 42, textAlign: 'right' }}>{data.usedCount}/{data.maxUses}</span>
      <div className="admin-progress-track" style={{ flex: 1 }}>
        <div className="admin-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatusCell({ value }: { value: string }) {
  if (value === 'Active')    return <span className="admin-badge admin-badge-success">✅ Active</span>;
  if (value === 'Expired')   return <span className="admin-badge admin-badge-danger">🔴 Expired</span>;
  return <span className="admin-badge admin-badge-warning">⚠️ Exhausted</span>;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons]   = useState<Coupon[]>([]);

  useEffect(() => {
    fetchApi('/admin/admin_coupons').then(data => {
      const mapped = data.map((c: any) => ({
        id: c.id,
        code: c.code,
        discount: c.discountValue,
        type: c.discountType === 'percentage' ? 'Percent' : 'Flat',
        usedCount: 0,
        maxUses: 100,
        expiry: new Date(c.validUntil).toLocaleDateString(),
        status: c.isActive ? 'Active' : 'Expired',
      }));
      setCoupons(mapped);
    }).catch(console.error);
  }, []);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm]         = useState<FormState>(EMPTY);
  const [errors, setErrors]     = useState<Partial<FormState>>({});

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.code.trim())                              e.code     = 'Coupon code required';
    if (!form.discount || isNaN(Number(form.discount))) e.discount = 'Valid discount required';
    if (!form.maxUses || isNaN(Number(form.maxUses)))   e.maxUses  = 'Valid max uses required';
    if (!form.expiry.trim())                            e.expiry   = 'Expiry date required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    setCoupons(prev => [...prev, {
      id: `C${Date.now()}`, code: form.code.toUpperCase(), discount: Number(form.discount),
      type: form.type, usedCount: 0, maxUses: Number(form.maxUses),
      expiry: form.expiry, status: 'Active',
    }]);
    setShowForm(false);
    setForm(EMPTY);
  }

  function handleDelete() {
    if (deleteId) setCoupons(prev => prev.filter(c => c.id !== deleteId));
    setDeleteId(null);
  }

  const f = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value as any }));
    setErrors(p => ({ ...p, [k]: undefined }));
  };

  const colDefs = useMemo<any[]>(() => [
    { field: 'code',      headerName: 'CODE',     flex: 1.5, minWidth: 150, cellRenderer: CodeCell },
    { field: 'discount',  headerName: 'DISCOUNT', flex: 1,   minWidth: 120, cellRenderer: DiscountCell },
    { field: 'usedCount', headerName: 'USAGE',    flex: 1.5, minWidth: 150, cellRenderer: UsageCell },
    { field: 'expiry',    headerName: 'EXPIRY',   flex: 1,   minWidth: 120, cellStyle: { color: 'var(--text-secondary)', fontSize: 13 } },
    { field: 'status',    headerName: 'STATUS',   flex: 1,   minWidth: 120, cellRenderer: StatusCell },
    {
      headerName: 'ACTIONS', flex: 0.8, minWidth: 100, sortable: false,
      cellRenderer: ({ data }: { data: Coupon }) => (
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <button className="admin-btn-icon" onClick={() => setDeleteId(data.id)} title="Delete" style={{ color: 'var(--danger)' }}>
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ], []);

  const onRowClicked = useCallback(() => {}, []);

  const kpis = [
    { label: 'Total Coupons',  value: coupons.length,                                    iconBg: 'var(--icon-bg-primary)', iconColor: 'var(--primary)' },
    { label: 'Active',         value: coupons.filter(c => c.status === 'Active').length,  iconBg: 'var(--icon-bg-success)', iconColor: 'var(--success)' },
    { label: 'Expired',        value: coupons.filter(c => c.status === 'Expired').length, iconBg: 'var(--icon-bg-danger)',  iconColor: 'var(--danger)'  },
    { label: 'Total Uses',     value: coupons.reduce((s, c) => s + c.usedCount, 0),       iconBg: 'var(--icon-bg-warning)', iconColor: 'var(--warning)' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingBottom: 40 }}>
      {/* Page Header */}
      <div className="admin-page-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 24 }}>
        <div>
          <p className="admin-breadcrumb">Library OS › Admin › Coupons</p>
          <h1 className="admin-page-title">Coupons</h1>
          <p className="admin-page-subtitle">Create and track discount coupon codes.</p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn-primary" onClick={() => { setForm(EMPTY); setErrors({}); setShowForm(true); }}>
            <Plus size={15} /> Create Coupon
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {kpis.map(k => (
          <div key={k.label} className="admin-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="admin-kpi-icon" style={{ background: k.iconBg }}>
              <Tag size={18} style={{ color: k.iconColor }} />
            </div>
            <div>
              <p className="admin-kpi-label">{k.label}</p>
              <p className="admin-kpi-value">{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AG Grid */}
      <div className="admin-table-wrapper" style={{ flex: 1, minHeight: 400 }}>
        <AgGridReact
          theme={gridTheme}
          rowData={coupons}
          columnDefs={colDefs as any}
          rowHeight={48}
          headerHeight={38}
          suppressMovableColumns
          suppressCellFocus
          onRowClicked={onRowClicked}
          defaultColDef={{ resizable: false, sortable: true }}
        />
      </div>

      {/* Create Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2 className="admin-modal-title">Create Coupon</h2>
            <div className="admin-form-grid">
              <div className="admin-form-field admin-form-field-full">
                <label className="admin-label admin-label-required">Coupon Code</label>
                <input className={`admin-input${errors.code ? ' admin-input-error' : ''}`} style={{ textTransform: 'uppercase' }} value={form.code} onChange={f('code')} placeholder="e.g. SUMMER50" />
                {errors.code && <p className="admin-error">{errors.code}</p>}
              </div>
              <div className="admin-form-field">
                <label className="admin-label">Discount Type</label>
                <select className="admin-select" style={{ width: '100%', padding: '10px 14px' }} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))}>
                  <option value="Flat">Flat (₹)</option>
                  <option value="Percent">Percent (%)</option>
                </select>
              </div>
              <div className="admin-form-field">
                <label className="admin-label admin-label-required">Value</label>
                <input className={`admin-input${errors.discount ? ' admin-input-error' : ''}`} type="number" value={form.discount} onChange={f('discount')} placeholder={form.type === 'Flat' ? '100' : '10'} />
                {errors.discount && <p className="admin-error">{errors.discount}</p>}
              </div>
              <div className="admin-form-field">
                <label className="admin-label admin-label-required">Max Uses</label>
                <input className={`admin-input${errors.maxUses ? ' admin-input-error' : ''}`} type="number" value={form.maxUses} onChange={f('maxUses')} placeholder="50" />
                {errors.maxUses && <p className="admin-error">{errors.maxUses}</p>}
              </div>
              <div className="admin-form-field">
                <label className="admin-label admin-label-required">Expiry Date</label>
                <input className={`admin-input${errors.expiry ? ' admin-input-error' : ''}`} value={form.expiry} onChange={f('expiry')} placeholder="DD/MM/YY" />
                {errors.expiry && <p className="admin-error">{errors.expiry}</p>}
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="admin-btn-primary" onClick={handleSave}>
                <CheckCircle size={14} /> Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h2 className="admin-modal-title" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trash2 size={18} /> Delete Coupon
            </h2>
            <p className="admin-modal-desc">
              Delete coupon <strong>{coupons.find(c => c.id === deleteId)?.code}</strong>? This cannot be undone.
            </p>
            <div className="admin-modal-footer">
              <button className="admin-btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="admin-btn-danger" onClick={handleDelete}>Delete Coupon</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
