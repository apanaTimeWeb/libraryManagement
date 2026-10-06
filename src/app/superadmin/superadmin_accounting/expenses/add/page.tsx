'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electricity', 'Maintenance', 'Stationery', 'Internet', 'Cleaning', 'Salary', 'Rent', 'Miscellaneous'];

export default function AddExpensePage() {
  const router = useRouter();
  const [form, setForm] = useState({ date: '', category: CATEGORIES[0], description: '', amount: '', paidBy: '', mode: 'cash', notes: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!form.date || !form.description || !form.amount || !form.paidBy) {
      toast.error('Please fill all required fields.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      toast.success('Expense recorded successfully.');
      router.push('/superadmin/superadmin_accounting/expenses');
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="fin-page-title">Add Expense</h1>
        <p className="fin-page-subtitle">Record a new operational expense.</p>
      </div>

      <div className="fin-card p-6 space-y-4">
        <div><label className="fin-label">Date <span className="fin-text-danger">*</span></label><input type="date" className="fin-input" value={form.date} onChange={e => setForm(p=>({...p,date:e.target.value}))} /></div>
        <div><label className="fin-label">Category</label><select className="fin-select" value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))}>{CATEGORIES.map((c: any) =><option key={c}>{c}</option>)}</select></div>
        <div><label className="fin-label">Description <span className="fin-text-danger">*</span></label><input className="fin-input" placeholder="Enter description" value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} /></div>
        <div><label className="fin-label">Amount ₹ <span className="fin-text-danger">*</span></label><input type="number" className="fin-input" placeholder="0" value={form.amount} onChange={e => setForm(p=>({...p,amount:e.target.value}))} /></div>
        <div><label className="fin-label">Paid By <span className="fin-text-danger">*</span></label><input className="fin-input" placeholder="Name" value={form.paidBy} onChange={e => setForm(p=>({...p,paidBy:e.target.value}))} /></div>
        <div><label className="fin-label">Payment Mode</label>
          <select className="fin-select" value={form.mode} onChange={e => setForm(p=>({...p,mode:e.target.value}))}>
            <option value="cash">Cash</option><option value="upi">UPI</option><option value="card">Card</option><option value="bank">Bank Transfer</option>
          </select>
        </div>
        <div><label className="fin-label">Notes</label><textarea className="fin-textarea" rows={2} placeholder="Optional notes..." value={form.notes} onChange={e => setForm(p=>({...p,notes:e.target.value}))} /></div>
      </div>

      <div className="flex gap-3">
        <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => router.push('/superadmin/superadmin_accounting/expenses')}>Cancel</button>
        <button className="fin-badge fin-badge--success cursor-pointer" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Expense'}</button>
      </div>
    </div>
  );
}
