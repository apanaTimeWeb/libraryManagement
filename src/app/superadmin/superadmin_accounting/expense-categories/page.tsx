'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

type Category = { id: number; name: string; budget: number; spent: number; color: string };

const COLORS = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--danger)', 'var(--info)', 'var(--purple)'];

const MOCK: Category[] = [
  { id: 1, name: 'Electricity',   budget: 5000,  spent: 4200,  color: 'var(--warning)' },
  { id: 2, name: 'Maintenance',   budget: 4000,  spent: 3600,  color: 'var(--danger)' },
  { id: 3, name: 'Internet',      budget: 2500,  spent: 2200,  color: 'var(--info)' },
  { id: 4, name: 'Salary',        budget: 15000, spent: 12000, color: 'var(--primary)' },
  { id: 5, name: 'Stationery',    budget: 1000,  spent: 650,   color: 'var(--success)' },
  { id: 6, name: 'Cleaning',      budget: 1200,  spent: 900,   color: 'var(--purple)' },
];

export default function ExpenseCategoriesPage() {
  const [categories, setCategories] = useState(MOCK);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', budget: '', color: COLORS[0] });

  const handleAdd = () => {
    if (!form.name || !form.budget) return;
    setCategories(p => [...p, { id: Date.now(), name: form.name, budget: parseFloat(form.budget), spent: 0, color: form.color }]);
    toast.success('Category added.');
    setShowAdd(false);
    setForm({ name: '', budget: '', color: COLORS[0] });
  };

  const handleDelete = (id: number) => {
    setCategories(p => p.filter(c => c.id !== id));
    toast.success('Category deleted.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="fin-page-title">Expense Categories</h1>
          <p className="fin-page-subtitle">Manage budget allocation per expense category.</p>
        </div>
        <button className="fin-badge fin-badge--info cursor-pointer" onClick={() => setShowAdd(true)}><Plus size={12} /> Add Category</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c: any) => {
          const pct = Math.min(Math.round((c.spent / c.budget) * 100), 100);
          const over = c.spent > c.budget;
          return (
            <div key={c.id} className="fin-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="fin-cell-name">{c.name}</span>
                </div>
                <button className="fin-badge fin-badge--danger cursor-pointer" onClick={() => handleDelete(c.id)}><Trash2 size={10} /></button>
              </div>
              <div className="flex justify-between">
                <span className="fin-cell-subtext">Spent: <span className={over ? 'fin-text-danger font-semibold' : 'fin-text-body'}>₹{c.spent.toLocaleString()}</span></span>
                <span className="fin-cell-subtext">Budget: ₹{c.budget.toLocaleString()}</span>
              </div>
              <div className="fin-progress-track">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: over ? 'var(--danger)' : c.color }} />
              </div>
              <div className="flex justify-between">
                <span className={`fin-badge ${over ? 'fin-badge--danger' : pct > 80 ? 'fin-badge--warning' : 'fin-badge--success'}`}>{pct}% used</span>
                {over && <span className="fin-badge fin-badge--danger">Over budget by ₹{(c.spent - c.budget).toLocaleString()}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <div className="fin-dialog-overlay">
          <div className="fin-dialog">
            <h2 className="fin-dialog__title">➕ Add Category</h2>
            <button className="fin-dialog__close" onClick={() => setShowAdd(false)}>✕</button>
            <div className="space-y-3">
              <div><label className="fin-label">Category Name <span className="fin-text-danger">*</span></label><input className="fin-input" placeholder="e.g. Rent" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} /></div>
              <div><label className="fin-label">Monthly Budget ₹ <span className="fin-text-danger">*</span></label><input type="number" className="fin-input" placeholder="0" value={form.budget} onChange={e => setForm(p=>({...p,budget:e.target.value}))} /></div>
              <div>
                <label className="fin-label">Color</label>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {COLORS.map((col: any) => (
                    <button key={col} onClick={() => setForm(p=>({...p,color:col}))} className={`w-7 h-7 rounded-full border-2 transition-all ${form.color === col ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: col }} />
                  ))}
                </div>
              </div>
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
