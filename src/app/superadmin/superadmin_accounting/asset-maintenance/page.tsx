'use client';

import { useState } from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

type MaintenanceLog = {
  id: number;
  assetName: string;
  issue: string;
  reportedDate: string;
  scheduledDate: string;
  vendor: string;
  cost: number;
  status: 'pending' | 'in-progress' | 'completed';
};

const MOCK: MaintenanceLog[] = [
  { id: 1, assetName: 'AC Unit — Hall A',   issue: 'Gas refill & filter cleaning',  reportedDate: '2026-04-02', scheduledDate: '2026-04-08', vendor: 'CoolTech Services', cost: 1800, status: 'completed'   },
  { id: 2, assetName: 'Water Purifier',      issue: 'Filter replacement',            reportedDate: '2026-04-05', scheduledDate: '2026-04-10', vendor: 'AquaPure',          cost: 900,  status: 'in-progress' },
  { id: 3, assetName: 'CCTV Camera — B2',    issue: 'Camera not recording',          reportedDate: '2026-04-08', scheduledDate: '2026-04-12', vendor: 'SecureVision',      cost: 1200, status: 'pending'     },
  { id: 4, assetName: 'Biometric Scanner',   issue: 'Fingerprint sensor malfunction',reportedDate: '2026-04-09', scheduledDate: '2026-04-14', vendor: 'TechFix',           cost: 2500, status: 'pending'     },
  { id: 5, assetName: 'Inverter Battery',    issue: 'Battery backup reduced',        reportedDate: '2026-03-28', scheduledDate: '2026-04-03', vendor: 'PowerCare',         cost: 3500, status: 'completed'   },
];

const STATUS_BADGE: Record<string, string> = {
  pending:     'fin-badge--warning',
  'in-progress': 'fin-badge--info',
  completed:   'fin-badge--success',
};

export default function AssetMaintenancePage() {
  const [logs, setLogs] = useState(MOCK);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ assetName: '', issue: '', reportedDate: '', scheduledDate: '', vendor: '', cost: '' });

  const visible = statusFilter === 'all' ? logs : logs.filter(l => l.status === statusFilter);
  const totalCost = logs.filter(l => l.status === 'completed').reduce((s, l) => s + l.cost, 0);

  const handleComplete = (id: number) => {
    setLogs(p => p.map((l: any) => l.id === id ? { ...l, status: 'completed' } : l));
    toast.success('Marked as completed.');
  };

  const handleAdd = () => {
    if (!form.assetName || !form.issue || !form.reportedDate || !form.scheduledDate) return;
    setLogs(p => [{ id: Date.now(), assetName: form.assetName, issue: form.issue, reportedDate: form.reportedDate, scheduledDate: form.scheduledDate, vendor: form.vendor || '—', cost: parseFloat(form.cost) || 0, status: 'pending' }, ...p]);
    toast.success('Maintenance request added.');
    setShowAdd(false);
    setForm({ assetName: '', issue: '', reportedDate: '', scheduledDate: '', vendor: '', cost: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="fin-page-title">Asset Maintenance</h1>
          <p className="fin-page-subtitle">Track maintenance requests and service history.</p>
        </div>
        <button className="fin-badge fin-badge--info cursor-pointer" onClick={() => setShowAdd(true)}><Plus size={12} /> Log Request</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fin-kpi-card fin-kpi-card--warning"><p className="fin-kpi-label fin-kpi-label--warning">Pending</p><p className="fin-kpi-value fin-kpi-value--warning">{logs.filter(l=>l.status==='pending').length}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label fin-text-info">In Progress</p><p className="fin-kpi-value fin-text-info">{logs.filter(l=>l.status==='in-progress').length}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label fin-text-success">Completed</p><p className="fin-kpi-value fin-text-success">{logs.filter(l=>l.status==='completed').length}</p></div>
        <div className="fin-kpi-card fin-kpi-card--danger"><p className="fin-kpi-label fin-kpi-label--danger">Total Cost</p><p className="fin-kpi-value fin-kpi-value--danger">₹{totalCost.toLocaleString()}</p></div>
      </div>

      <div className="fin-filter-bar">
        <select className="fin-select w-44" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">Asset</th>
              <th className="text-left py-3 px-4">Issue</th>
              <th className="text-left py-3 px-4">Reported</th>
              <th className="text-left py-3 px-4">Scheduled</th>
              <th className="text-left py-3 px-4">Vendor</th>
              <th className="text-right py-3 px-4">Cost ₹</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={8}><div className="fin-empty-state"><div className="fin-empty-state__icon">🔧</div><p className="fin-empty-state__title">No maintenance records found.</p></div></td></tr>
            ) : visible.map((l: any) => (
              <tr key={l.id} className="fin-table-hover-row fin-table-row">
                <td className="py-3 px-4 fin-cell-name">{l.assetName}</td>
                <td className="py-3 px-4 fin-text-body">{l.issue}</td>
                <td className="py-3 px-4 fin-cell-subtext">{l.reportedDate}</td>
                <td className="py-3 px-4 fin-cell-subtext">{l.scheduledDate}</td>
                <td className="py-3 px-4 fin-cell-subtext">{l.vendor}</td>
                <td className="py-3 px-4 text-right font-semibold fin-text-body">₹{l.cost.toLocaleString()}</td>
                <td className="py-3 px-4"><span className={`fin-badge ${STATUS_BADGE[l.status]}`}>{l.status}</span></td>
                <td className="py-3 px-4 text-right">
                  {l.status !== 'completed' && (
                    <button className="fin-badge fin-badge--success cursor-pointer" onClick={() => handleComplete(l.id)}>
                      <CheckCircle size={11} /> Done
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fin-dialog-overlay">
          <div className="fin-dialog">
            <h2 className="fin-dialog__title">🔧 Log Maintenance Request</h2>
            <button className="fin-dialog__close" onClick={() => setShowAdd(false)}>✕</button>
            <div className="space-y-3">
              <div><label className="fin-label">Asset Name <span className="fin-text-danger">*</span></label><input className="fin-input" placeholder="e.g. AC Unit" value={form.assetName} onChange={e => setForm(p=>({...p,assetName:e.target.value}))} /></div>
              <div><label className="fin-label">Issue <span className="fin-text-danger">*</span></label><input className="fin-input" placeholder="Describe the issue" value={form.issue} onChange={e => setForm(p=>({...p,issue:e.target.value}))} /></div>
              <div><label className="fin-label">Reported Date <span className="fin-text-danger">*</span></label><input type="date" className="fin-input" value={form.reportedDate} onChange={e => setForm(p=>({...p,reportedDate:e.target.value}))} /></div>
              <div><label className="fin-label">Scheduled Date <span className="fin-text-danger">*</span></label><input type="date" className="fin-input" value={form.scheduledDate} onChange={e => setForm(p=>({...p,scheduledDate:e.target.value}))} /></div>
              <div><label className="fin-label">Vendor</label><input className="fin-input" placeholder="Vendor name" value={form.vendor} onChange={e => setForm(p=>({...p,vendor:e.target.value}))} /></div>
              <div><label className="fin-label">Estimated Cost ₹</label><input type="number" className="fin-input" placeholder="0" value={form.cost} onChange={e => setForm(p=>({...p,cost:e.target.value}))} /></div>
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
