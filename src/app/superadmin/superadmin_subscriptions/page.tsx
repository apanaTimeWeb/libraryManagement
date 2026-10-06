'use client';
import { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { Users, Package, Plus, CheckCircle, X } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const INITIAL_SUBS = [
  { id: '1', tenant: 'The Alexandria Modern', plan: 'Enterprise', cycle: 'Yearly',  mrr: 15000, status: 'Paid' },
  { id: '2', tenant: 'City Reading Hub',       plan: 'Pro',        cycle: 'Monthly', mrr: 2999,  status: 'Due Soon' },
];

const INITIAL_PLANS = [
  { id: 'P1', name: 'Starter', price: 999, branches: 1, members: 150, storage: '1GB', isPopular: false },
  { id: 'P2', name: 'Pro', price: 2999, branches: 5, members: 1000, storage: '10GB', isPopular: true },
];

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState('Active Subscribers');
  const [subs, setSubs] = useState(INITIAL_SUBS);
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [toast, setToast] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', price: 0, branches: 0, members: 0, storage: '' });

  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); }, []);

  const handleOpenAdd = useCallback(() => {
    setEditPlan(null);
    setFormData({ name: '', price: 0, branches: 0, members: 0, storage: '' });
    setShowModal(true);
  }, []);

  const handleOpenEdit = useCallback((plan: any) => {
    setEditPlan(plan);
    setFormData({ ...plan });
    setShowModal(true);
  }, []);

  const handleSavePlan = useCallback(() => {
    if (editPlan) {
      setPlans(p => p.map(x => x.id === editPlan.id ? { ...x, ...formData } : x));
      showToast(`Plan ${formData.name} updated!`);
    } else {
      setPlans(p => [...p, { id: Math.random().toString(), ...formData, isPopular: false }]);
      showToast(`New plan ${formData.name} created!`);
    }
    setShowModal(false);
  }, [editPlan, formData, showToast]);

  const toggleStatus = useCallback((id: string) => {
    setSubs(p => p.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Paid' ? 'Due Soon' : s.status === 'Due Soon' ? 'Overdue' : 'Paid';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
    showToast('Subscription status updated');
  }, [showToast]);

  const tabs = useMemo(() => [
    { name: 'Active Subscribers', icon: Users },
    { name: 'SaaS Pricing Plans', icon: Package },
  ], []);

  const colDefs = useMemo<any[]>(() => [
    { headerName: 'Tenant', field: 'tenant', flex: 2, cellClass: () => 'sa-cell-primary-bold' },
    { headerName: 'Plan', field: 'plan', flex: 1.5, cellClass: () => 'sa-cell-plan' },
    { headerName: 'Cycle & MRR', field: 'mrr', flex: 1,
      cellRenderer: (p: ICellRendererParams) => (
        <div>
          <p className="text-sm font-medium text-primary">₹{p.data?.mrr?.toLocaleString()}</p>
          <p className="text-xs text-secondary">{p.data?.cycle}</p>
        </div>
      ),
    },
    { headerName: 'Status', field: 'status', flex: 1,
      cellRenderer: (p: ICellRendererParams) => (
        <span className={`sa-badge ${
          p.value === 'Paid' ? 'sa-badge--success' : 
          p.value === 'Due Soon' ? 'sa-badge--warning' : 'sa-badge--danger'
        }`}>{p.value}</span>
      ),
    },
    { headerName: 'Actions', flex: 1,
      cellRenderer: (p: ICellRendererParams) => {
        if (!p.data) return null;
        return (
          <button type="button" onClick={() => toggleStatus(p.data.id)} className="text-indigo-400 text-xs font-bold hover:text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded bg-indigo-500/10">Cycle Status</button>
        );
      }
    },
  ], [toggleStatus]);

  return (
    <div className="sa-page-animate relative">
      {toast && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Library OS</span><span>/</span><span>Super Admin</span><span>/</span><span>Subscriptions</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title">SaaS Subscriptions</h1>
          {activeTab === 'SaaS Pricing Plans' && (
            <button className="sa-btn-primary" onClick={handleOpenAdd}><Plus size={16} /> Create Plan</button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.name 
                ? 'bg-indigo-500/20 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon size={16} /> {tab.name}
          </button>
        ))}
      </div>

      <div className="sa-card p-0 overflow-hidden h-[600px] flex flex-col">
        {activeTab === 'Active Subscribers' && (
          <div className="flex-1 w-full animate-fade-in">
            <AgGridReact theme={gridTheme} rowData={subs} columnDefs={colDefs} headerHeight={48} rowHeight={64} suppressCellFocus domLayout="normal" />
          </div>
        )}

        {activeTab === 'SaaS Pricing Plans' && (
          <div className="p-6 h-full overflow-y-auto animate-fade-in">
            <div className="grid grid-cols-3 gap-6">
              {plans.map(p => (
                <div key={p.id} className={`p-6 rounded-2xl border ${p.isPopular ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5'} relative`}>
                  {p.isPopular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">MOST POPULAR</span>}
                  <h3 className="text-xl font-bold text-white mb-2">{p.name}</h3>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-3xl font-black text-primary">₹{p.price}</span>
                    <span className="text-sm text-secondary pb-1">/mo</span>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-sm"><span className="text-secondary">Branches</span><span className="text-white font-medium">{p.branches}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-secondary">Members</span><span className="text-white font-medium">{p.members}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-secondary">Storage</span><span className="text-white font-medium">{p.storage}</span></div>
                  </div>

                  <button className="w-full sa-btn-secondary" onClick={() => handleOpenEdit(p)}>Edit Limits & Pricing</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pricing Plan Modal */}
      {showModal && (
        <div className="sa-wizard-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sa-wizard-modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Package size={20} className="text-primary" /> {editPlan ? 'Edit Pricing Plan' : 'Create New Plan'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white"><X size={20}/></button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Plan Name</label>
                  <input type="text" className="sa-input" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Price (₹/mo)</label>
                  <input type="number" className="sa-input" value={formData.price} onChange={e => setFormData(p => ({...p, price: Number(e.target.value)}))} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Max Branches</label>
                  <input type="number" className="sa-input" value={formData.branches} onChange={e => setFormData(p => ({...p, branches: Number(e.target.value)}))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Max Members</label>
                  <input type="number" className="sa-input" value={formData.members} onChange={e => setFormData(p => ({...p, members: Number(e.target.value)}))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Storage</label>
                  <input type="text" className="sa-input" value={formData.storage} onChange={e => setFormData(p => ({...p, storage: e.target.value}))} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button className="sa-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="sa-btn-primary" onClick={handleSavePlan}>{editPlan ? 'Save Changes' : 'Create Plan'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
