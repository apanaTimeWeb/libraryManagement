'use client';

// RESPONSIBILITY: Entry page for the admin_accounting module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

type Asset = {
  id: number;
  name: string;
  category: string;
  purchaseDate: string;
  purchaseValue: number;
  currentValue: number;
  location: string;
  status: 'active' | 'maintenance' | 'disposed';
};

const MOCK: Asset[] = [
  { id: 1, name: 'AC Unit — Hall A',       category: 'Appliance',  purchaseDate: '2023-06-01', purchaseValue: 45000, currentValue: 32000, location: 'Ground Floor', status: 'active'      },
  { id: 2, name: 'CCTV Camera Set (8)',     category: 'Security',   purchaseDate: '2022-11-15', purchaseValue: 28000, currentValue: 18000, location: 'All Floors',   status: 'active'      },
  { id: 3, name: 'Water Purifier',          category: 'Appliance',  purchaseDate: '2024-01-10', purchaseValue: 12000, currentValue: 10000, location: 'Ground Floor', status: 'maintenance' },
  { id: 4, name: 'Study Tables (20)',       category: 'Furniture',  purchaseDate: '2021-08-20', purchaseValue: 60000, currentValue: 35000, location: 'First Floor',  status: 'active'      },
  { id: 5, name: 'Biometric Scanner',       category: 'Security',   purchaseDate: '2023-03-05', purchaseValue: 8500,  currentValue: 6000,  location: 'Entrance',     status: 'active'      },
  { id: 6, name: 'Old Printer',             category: 'Electronics',purchaseDate: '2020-05-12', purchaseValue: 15000, currentValue: 0,     location: 'Store Room',   status: 'disposed'    },
];

const STATUS_BADGE: Record<string, string> = {
  active:      'fin-badge--success',
  maintenance: 'fin-badge--warning',
  disposed:    'fin-badge--neutral',
};

export default function AssetsPage() {
  const [assets, setAssets] = useState(MOCK);
  const [catFilter, setCatFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Furniture', purchaseDate: '', purchaseValue: '', location: '' });

  const categories = [...new Set(MOCK.map(a => a.category))];
  const visible = catFilter === 'all' ? assets : assets.filter(a => a.category === catFilter);
  const totalValue = assets.filter(a => a.status !== 'disposed').reduce((s, a) => s + a.currentValue, 0);

  const handleAdd = () => {
    if (!form.name || !form.purchaseDate || !form.purchaseValue || !form.location) return;
    const val = parseFloat(form.purchaseValue);
    setAssets(p => [{ id: Date.now(), name: form.name, category: form.category, purchaseDate: form.purchaseDate, purchaseValue: val, currentValue: val, location: form.location, status: 'active' }, ...p]);
    toast.success('Asset added.');
    setShowAdd(false);
    setForm({ name: '', category: 'Furniture', purchaseDate: '', purchaseValue: '', location: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="fin-page-title">Asset Manager</h1>
          <p className="fin-page-subtitle">Track all library assets and their current value.</p>
        </div>
        <button className="fin-badge fin-badge--info cursor-pointer" onClick={() => setShowAdd(true)}><Plus size={12} /> Add Asset</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fin-kpi-card"><p className="fin-kpi-label">Total Assets</p><p className="fin-kpi-value">{assets.length}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label fin-text-success">Current Value</p><p className="fin-kpi-value fin-text-success">₹{totalValue.toLocaleString()}</p></div>
        <div className="fin-kpi-card fin-kpi-card--warning"><p className="fin-kpi-label fin-kpi-label--warning">Under Maintenance</p><p className="fin-kpi-value fin-kpi-value--warning">{assets.filter(a=>a.status==='maintenance').length}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label fin-text-muted">Disposed</p><p className="fin-kpi-value fin-text-muted">{assets.filter(a=>a.status==='disposed').length}</p></div>
      </div>

      <div className="fin-filter-bar">
        <select className="fin-select w-44" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">Asset Name</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Purchase Date</th>
              <th className="text-right py-3 px-4">Purchase Value ₹</th>
              <th className="text-right py-3 px-4">Current Value ₹</th>
              <th className="text-left py-3 px-4">Location</th>
              <th className="text-left py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={7}><div className="fin-empty-state"><div className="fin-empty-state__icon">🏷️</div><p className="fin-empty-state__title">No assets found.</p></div></td></tr>
            ) : visible.map(a => (
              <tr key={a.id} className={`fin-table-hover-row fin-table-row ${a.status === 'disposed' ? 'opacity-50' : ''}`}>
                <td className="py-3 px-4 fin-cell-name">{a.name}</td>
                <td className="py-3 px-4"><span className="fin-badge fin-badge--neutral">{a.category}</span></td>
                <td className="py-3 px-4 fin-cell-subtext">{a.purchaseDate}</td>
                <td className="py-3 px-4 text-right fin-cell-subtext">₹{a.purchaseValue.toLocaleString()}</td>
                <td className="py-3 px-4 text-right font-semibold fin-text-body">₹{a.currentValue.toLocaleString()}</td>
                <td className="py-3 px-4 fin-cell-subtext">{a.location}</td>
                <td className="py-3 px-4"><span className={`fin-badge ${STATUS_BADGE[a.status]}`}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fin-dialog-overlay">
          <div className="fin-dialog">
            <h2 className="fin-dialog__title">➕ Add Asset</h2>
            <button className="fin-dialog__close" onClick={() => setShowAdd(false)}>✕</button>
            <div className="space-y-3">
              <div><label className="fin-label">Asset Name <span className="fin-text-danger">*</span></label><input className="fin-input" placeholder="e.g. AC Unit" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} /></div>
              <div><label className="fin-label">Category</label><select className="fin-select" value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))}>{[...categories,'Other'].map(c=><option key={c}>{c}</option>)}</select></div>
              <div><label className="fin-label">Purchase Date <span className="fin-text-danger">*</span></label><input type="date" className="fin-input" value={form.purchaseDate} onChange={e => setForm(p=>({...p,purchaseDate:e.target.value}))} /></div>
              <div><label className="fin-label">Purchase Value ₹ <span className="fin-text-danger">*</span></label><input type="number" className="fin-input" placeholder="0" value={form.purchaseValue} onChange={e => setForm(p=>({...p,purchaseValue:e.target.value}))} /></div>
              <div><label className="fin-label">Location <span className="fin-text-danger">*</span></label><input className="fin-input" placeholder="e.g. Ground Floor" value={form.location} onChange={e => setForm(p=>({...p,location:e.target.value}))} /></div>
            </div>
            <div className="fin-dialog__footer">
              <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="fin-badge fin-badge--success cursor-pointer" onClick={handleAdd}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
