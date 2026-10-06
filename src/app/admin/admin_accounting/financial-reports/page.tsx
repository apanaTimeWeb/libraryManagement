'use client';

// RESPONSIBILITY: Entry page for the admin_accounting module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';
import { BarChart2, TrendingUp, TrendingDown } from 'lucide-react';

const MONTHLY = [
  { month: 'Oct', income: 42000, expense: 18000 },
  { month: 'Nov', income: 38000, expense: 15000 },
  { month: 'Dec', income: 51000, expense: 22000 },
  { month: 'Jan', income: 47000, expense: 19000 },
  { month: 'Feb', income: 44000, expense: 17000 },
  { month: 'Mar', income: 56000, expense: 21000 },
  { month: 'Apr', income: 61000, expense: 24000 },
];

const CATEGORY_BREAKDOWN = [
  { category: 'Electricity',   amount: 4200,  pct: 17 },
  { category: 'Maintenance',   amount: 3600,  pct: 15 },
  { category: 'Internet',      amount: 2200,  pct: 9  },
  { category: 'Salary',        amount: 12000, pct: 50 },
  { category: 'Miscellaneous', amount: 2200,  pct: 9  },
];

const maxIncome = Math.max(...MONTHLY.map(m => m.income));

export default function FinancialReportsPage() {
  const [period, setPeriod] = useState('monthly');

  const totalIncome  = MONTHLY.reduce((s, m) => s + m.income, 0);
  const totalExpense = MONTHLY.reduce((s, m) => s + m.expense, 0);
  const netProfit    = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="fin-page-title">Financial Reports</h1>
          <p className="fin-page-subtitle">Income vs expense overview and category breakdown.</p>
        </div>
        <div className="flex gap-2">
          {['monthly', 'quarterly', 'yearly'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`fin-badge cursor-pointer ${period === p ? 'fin-badge--info' : 'fin-badge--neutral'}`}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="fin-kpi-card">
          <div className="fin-kpi-card__header"><p className="fin-kpi-label fin-text-success">Total Income</p><TrendingUp size={16} className="fin-text-success" /></div>
          <p className="fin-kpi-value fin-text-success">₹{totalIncome.toLocaleString()}</p>
        </div>
        <div className="fin-kpi-card fin-kpi-card--danger">
          <div className="fin-kpi-card__header"><p className="fin-kpi-label fin-kpi-label--danger">Total Expenses</p><TrendingDown size={16} className="fin-text-danger" /></div>
          <p className="fin-kpi-value fin-kpi-value--danger">₹{totalExpense.toLocaleString()}</p>
        </div>
        <div className="fin-kpi-card">
          <div className="fin-kpi-card__header"><p className="fin-kpi-label">Net Profit</p><BarChart2 size={16} className="fin-icon-muted" /></div>
          <p className={`fin-kpi-value ${netProfit >= 0 ? 'fin-text-success' : 'fin-text-danger'}`}>₹{netProfit.toLocaleString()}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="fin-card p-6">
        <p className="fin-section-label mb-4">Monthly Income vs Expense</p>
        <div className="flex items-end gap-3 h-48 overflow-x-auto pb-2">
          {MONTHLY.map(m => (
            <div key={m.month} className="flex flex-col items-center gap-1 flex-1 min-w-[48px]">
              <div className="flex items-end gap-1 w-full justify-center" style={{ height: 160 }}>
                <div
                  className="rounded-t w-5 transition-all"
                  style={{ height: `${(m.income / maxIncome) * 100}%`, backgroundColor: 'var(--success)' }}
                  title={`Income: ₹${m.income.toLocaleString()}`}
                />
                <div
                  className="rounded-t w-5 transition-all"
                  style={{ height: `${(m.expense / maxIncome) * 100}%`, backgroundColor: 'var(--danger)' }}
                  title={`Expense: ₹${m.expense.toLocaleString()}`}
                />
              </div>
              <span className="fin-cell-subtext text-center">{m.month}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--success)' }} /><span className="fin-cell-subtext">Income</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--danger)' }} /><span className="fin-cell-subtext">Expense</span></div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="fin-card p-6">
        <p className="fin-section-label mb-4">Expense Category Breakdown</p>
        <div className="space-y-3">
          {CATEGORY_BREAKDOWN.map(c => (
            <div key={c.category}>
              <div className="flex justify-between mb-1">
                <span className="fin-text-body">{c.category}</span>
                <span className="fin-cell-subtext">₹{c.amount.toLocaleString()} ({c.pct}%)</span>
              </div>
              <div className="fin-progress-track">
                <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: 'var(--primary)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
