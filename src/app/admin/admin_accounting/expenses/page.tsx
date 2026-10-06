'use client';
// RESPONSIBILITY: Entry page for the admin_accounting module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/admin/admin_reusable/gridTheme';

ModuleRegistry.registerModules([AllCommunityModule]);

type Expense = {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  paidBy: string;
  mode: 'cash' | 'upi' | 'card' | 'bank';
};

const MOCK: Expense[] = [
  { id: 1, date: '2026-04-01', category: 'Electricity',   description: 'Monthly electricity bill',    amount: 4200,  paidBy: 'Manager', mode: 'bank' },
  { id: 2, date: '2026-04-03', category: 'Maintenance',   description: 'AC servicing — Hall A',       amount: 1800,  paidBy: 'Staff',   mode: 'cash' },
  { id: 3, date: '2026-04-05', category: 'Stationery',    description: 'Registers & pens',            amount: 650,   paidBy: 'Manager', mode: 'cash' },
  { id: 4, date: '2026-04-08', category: 'Internet',      description: 'Broadband monthly plan',      amount: 2200,  paidBy: 'Admin',   mode: 'upi'  },
  { id: 5, date: '2026-04-10', category: 'Cleaning',      description: 'Housekeeping supplies',       amount: 900,   paidBy: 'Staff',   mode: 'cash' },
  { id: 6, date: '2026-04-12', category: 'Miscellaneous', description: 'Courier charges',             amount: 320,   paidBy: 'Manager', mode: 'upi'  },
];

const CATEGORIES = ['Electricity', 'Maintenance', 'Stationery', 'Internet', 'Cleaning', 'Miscellaneous', 'Rent', 'Salary'];
const MODE_BADGE: Record<string, string> = {
  cash: 'fin-badge fin-badge--cash',
  upi:  'fin-badge fin-badge--upi',
  card: 'fin-badge fin-badge--card',
  bank: 'fin-badge fin-badge--bank',
};

export default function ExpensesPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState(MOCK);
  const [catFilter, setCatFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ date: '', category: CATEGORIES[0], description: '', amount: '', paidBy: '', mode: 'cash' as Expense['mode'] });

  const visible = catFilter === 'all' ? expenses : expenses.filter(e => e.category === catFilter);
  const total = visible.reduce((s, e) => s + e.amount, 0);

  const handleAdd = () => {
    if (!form.date || !form.description || !form.amount || !form.paidBy) return;
    const newExp: Expense = { id: Date.now(), date: form.date, category: form.category, description: form.description, amount: parseFloat(form.amount), paidBy: form.paidBy, mode: form.mode };
    setExpenses(p => [newExp, ...p]);
    toast.success('Expense recorded.');
    setShowAdd(false);
    setForm({ date: '', category: CATEGORIES[0], description: '', amount: '', paidBy: '', mode: 'cash' });
  };

  const handleDelete = (id: number) => {
    setExpenses(p => p.filter(e => e.id !== id));
    toast.success('Expense deleted.');
  };

  const colDefs = [
    { field: 'date', headerName: 'Date', width: 130, cellRenderer: (p: any) => <span className="fin-cell-subtext">{p.value}</span> },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 150,
      cellRenderer: (p: any) => (
        <span className="fin-badge fin-badge--neutral mt-2 inline-block">
          {p.value}
        </span>
      )
    },
    { field: 'description', headerName: 'Description', flex: 1, minWidth: 200, cellRenderer: (p: any) => <span className="fin-text-body">{p.value}</span> },
    { 
      field: 'amount', 
      headerName: 'Amount ₹', 
      width: 140,
      cellStyle: { textAlign: 'right', fontWeight: 600 },
      cellRenderer: (p: any) => (
        <span className="fin-text-danger">
          ₹{p.value.toLocaleString()}
        </span>
      )
    },
    { 
      field: 'mode', 
      headerName: 'Mode', 
      width: 120,
      cellRenderer: (p: any) => (
        <span className={`${MODE_BADGE[p.value]} mt-2 inline-block capitalize`}>
          {p.value}
        </span>
      )
    },
    { field: 'paidBy', headerName: 'Paid By', width: 140, cellRenderer: (p: any) => <span className="fin-text-body">{p.value}</span> },
    {
      headerName: 'Actions',
      width: 100,
      sortable: false,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (params: any) => (
        <div className="h-full flex justify-end items-center">
          <button 
            className="fin-badge fin-badge--danger cursor-pointer hover:bg-red-600 hover:text-white transition-colors duration-200" 
            onClick={() => handleDelete(params.data.id)}
            title="Delete Expense"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="fin-page-title">Expense Ledger</h1>
          <p className="fin-page-subtitle">Track all library operational expenses.</p>
        </div>
        <button className="fin-badge fin-badge--info cursor-pointer flex items-center gap-1 hover:border-[var(--mgr-primary)]" onClick={() => setShowAdd(true)}>
          <Plus size={14} /> Add Expense
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fin-kpi-card">
          <p className="fin-kpi-label">Total Expenses</p>
          <p className="fin-kpi-value fin-text-danger">₹{expenses.reduce((s,e)=>s+e.amount,0).toLocaleString()}</p>
        </div>
        <div className="fin-kpi-card">
          <p className="fin-kpi-label">This Month</p>
          <p className="fin-kpi-value">₹{visible.reduce((s,e)=>s+e.amount,0).toLocaleString()}</p>
        </div>
        <div className="fin-kpi-card">
          <p className="fin-kpi-label">Entries</p>
          <p className="fin-kpi-value">{expenses.length}</p>
        </div>
        <div className="fin-kpi-card">
          <p className="fin-kpi-label">Categories</p>
          <p className="fin-kpi-value">{new Set(expenses.map(e=>e.category)).size}</p>
        </div>
      </div>

      <div className="fin-filter-bar flex items-center justify-between p-4 bg-[var(--mgr-bg-card)] border border-[var(--mgr-border)] rounded-lg">
        <div className="flex flex-col">
          <label className="fin-label text-xs mb-1">Filter by Category</label>
          <select className="fin-select w-48" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button className="fin-badge fin-badge--neutral cursor-pointer hover:border-[var(--mgr-primary)] flex items-center gap-1" onClick={() => router.push('/admin/admin_accounting/expenses/add')}>
          <TrendingUp size={14} /> View Categories
        </button>
      </div>

      <div className="fin-card p-4">
        {visible.length === 0 ? (
          <div className="fin-empty-state py-12">
            <div className="fin-empty-state__icon">💸</div>
            <p className="fin-empty-state__title">No expenses found.</p>
          </div>
        ) : (
          <div className="mgr-table-wrapper h-[450px]">
            <AgGridReact
              theme={gridTheme}
              rowData={visible}
              columnDefs={colDefs as any}
              rowHeight={56}
              headerHeight={48}
              pagination={true}
              paginationPageSize={10}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true
              }}
            />
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fin-dialog-overlay">
          <div className="fin-dialog bg-[var(--mgr-bg-card)]">
            <h2 className="fin-dialog__title mb-4 font-bold text-[var(--mgr-text-primary)]">➕ Add Expense</h2>
            <button className="fin-dialog__close hover:text-red-500" onClick={() => setShowAdd(false)}>✕</button>
            <div className="space-y-4">
              <div><label className="fin-label text-sm font-semibold mb-1 block">Date <span className="fin-text-danger">*</span></label><input type="date" className="fin-input w-full" value={form.date} onChange={e => setForm(p=>({...p,date:e.target.value}))} /></div>
              <div><label className="fin-label text-sm font-semibold mb-1 block">Category</label><select className="fin-select w-full" value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
              <div><label className="fin-label text-sm font-semibold mb-1 block">Description <span className="fin-text-danger">*</span></label><input className="fin-input w-full" placeholder="Enter description" value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} /></div>
              <div><label className="fin-label text-sm font-semibold mb-1 block">Amount ₹ <span className="fin-text-danger">*</span></label><input type="number" className="fin-input w-full" placeholder="0" value={form.amount} onChange={e => setForm(p=>({...p,amount:e.target.value}))} /></div>
              <div><label className="fin-label text-sm font-semibold mb-1 block">Paid By <span className="fin-text-danger">*</span></label><input className="fin-input w-full" placeholder="Name" value={form.paidBy} onChange={e => setForm(p=>({...p,paidBy:e.target.value}))} /></div>
              <div><label className="fin-label text-sm font-semibold mb-1 block">Mode</label><select className="fin-select w-full" value={form.mode} onChange={e => setForm(p=>({...p,mode:e.target.value as Expense['mode']}))}>
                <option value="cash">Cash</option><option value="upi">UPI</option><option value="card">Card</option><option value="bank">Bank Transfer</option>
              </select></div>
            </div>
            <div className="fin-dialog__footer mt-6 flex justify-end gap-3">
              <button className="px-4 py-2 border border-[var(--mgr-border)] text-[var(--mgr-text-primary)] rounded hover:bg-[var(--mgr-border)] transition-colors" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors" onClick={handleAdd}>Save Expense</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
