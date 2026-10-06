'use client';
import type { ICellRendererParams } from 'ag-grid-community';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import toast from 'react-hot-toast';
import { formatCurrency } from '@/app/superadmin/superadmin_finance/lib/format';
import { RefreshCw, Send } from 'lucide-react';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

ModuleRegistry.registerModules([AllCommunityModule]);

type FilterType = 'expired' | 'expiring_7' | 'expiring_15';

type Renewal = {
  id: number;
  studentName: string;
  smartId: string;
  shift: string;
  plan: string;
  planId: number;
  expiryDate: string;
  daysLeft: number;
  lastPaymentDate: string;
  due: number;
  total: number;
};

const MOCK_RENEWALS: Renewal[] = [
  { id: 1, studentName: 'Aarav Sharma',  smartId: 'STU001', shift: 'Morning', plan: 'Premium', planId: 2, expiryDate: '2026-04-05', daysLeft: -6,  lastPaymentDate: '2026-03-01', due: 1499, total: 1499 },
  { id: 2, studentName: 'Priya Patel',   smartId: 'STU002', shift: 'Evening', plan: 'Basic',   planId: 1, expiryDate: '2026-04-15', daysLeft: 4,   lastPaymentDate: '2026-03-15', due: 999,  total: 999  },
  { id: 3, studentName: 'Rohan Kumar',   smartId: 'STU003', shift: 'Morning', plan: 'Elite',   planId: 3, expiryDate: '2026-04-20', daysLeft: 12,  lastPaymentDate: '2026-03-20', due: 2499, total: 2499 },
  { id: 4, studentName: 'Ananya Singh',  smartId: 'STU004', shift: 'Evening', plan: 'Premium', planId: 2, expiryDate: '2026-04-08', daysLeft: -2,  lastPaymentDate: '2026-03-08', due: 1499, total: 1499 },
  { id: 5, studentName: 'Vikram Rao',    smartId: 'STU005', shift: 'Morning', plan: 'Basic',   planId: 1, expiryDate: '2026-04-16', daysLeft: 6,   lastPaymentDate: '2026-03-16', due: 999,  total: 999  },
  { id: 6, studentName: 'Sneha Gupta',   smartId: 'STU006', shift: 'Evening', plan: 'Elite',   planId: 3, expiryDate: '2026-04-22', daysLeft: 14,  lastPaymentDate: '2026-03-22', due: 2499, total: 2499 },
];

const PLANS = [
  { id: 1, name: 'Basic',   price: 999  },
  { id: 2, name: 'Premium', price: 1499 },
  { id: 3, name: 'Elite',   price: 2499 },
];

const FILTERS: { label: string; value: FilterType; emoji: string }[] = [
  { label: 'Expired',            value: 'expired',     emoji: '🔴' },
  { label: 'Expiring in 7 days', value: 'expiring_7',  emoji: '🟠' },
  { label: 'Expiring in 15 days',value: 'expiring_15', emoji: '🟡' },
];

export default function Renewals() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('expiring_7');
  const [allRenewals, setAllRenewals] = useState(MOCK_RENEWALS);
  const [renewDialog, setRenewDialog] = useState<{ id: number; name: string } | null>(null);
  const [renewPlanId, setRenewPlanId] = useState('');
  const [renewAmount, setRenewAmount] = useState('');
  const [renewMode, setRenewMode] = useState('cash');
  const [renewTxnId, setRenewTxnId] = useState('');
  const [isRenewing, setIsRenewing] = useState(false);

  const visible = allRenewals.filter((r) => {
    if (filter === 'expired')     return r.daysLeft < 0;
    if (filter === 'expiring_7')  return r.daysLeft >= 0 && r.daysLeft <= 7;
    if (filter === 'expiring_15') return r.daysLeft >= 0 && r.daysLeft <= 15;
    return true;
  });

  const handleRemindAll = () => {
    toast.success(`📱 WhatsApp reminder sent to ${visible.length} students.`);
  };

  const handleRemind = (name: string) => {
    toast.success(`✅ Reminder sent to ${name}`);
  };

  const openRenew = (r: Renewal) => {
    setRenewDialog({ id: r.id, name: r.studentName });
    setRenewPlanId(String(r.planId));
    setRenewAmount(String(r.total));
  };

  const handleRenew = () => {
    if (!renewDialog || !renewAmount) return;
    setIsRenewing(true);
    setTimeout(() => {
      setAllRenewals((prev) => prev.filter((r) => r.id !== renewDialog.id));
      toast.success(`🔄 ${renewDialog.name}'s subscription renewed.`);
      setRenewDialog(null);
      setRenewAmount('');
      setRenewTxnId('');
      setIsRenewing(false);
    }, 800);
  };

  const colDefs = [
    { field: 'studentName', headerName: 'Student', flex: 1, minWidth: 150, cellRenderer: (p: ICellRendererParams) => <span className="fin-cell-name font-medium">{p.value}</span> },
    { field: 'smartId', headerName: 'Smart ID', width: 120, cellRenderer: (p: ICellRendererParams) => <span className="fin-mono text-sm">{p.value}</span> },
    { field: 'shift', headerName: 'Shift', width: 110, cellRenderer: (p: ICellRendererParams) => <div className="h-full flex items-center"><span className="fin-badge fin-badge--neutral">{p.value}</span></div> },
    { field: 'plan', headerName: 'Plan', width: 110, cellRenderer: (p: ICellRendererParams) => <span className="fin-text-body">{p.value}</span> },
    { field: 'expiryDate', headerName: 'Expiry Date', width: 120, cellRenderer: (p: ICellRendererParams) => <span className="fin-cell-subtext">{p.value}</span> },
    { 
      field: 'daysLeft', 
      headerName: 'Days Left', 
      width: 120,
      cellRenderer: (p: ICellRendererParams) => (
        <span className={p.value < 0 ? 'fin-text-danger font-semibold' : p.value <= 7 ? 'fin-text-warning font-semibold' : 'fin-text-body'}>
          {p.value < 0 ? `${Math.abs(p.value)} days ago` : `${p.value} days`}
        </span>
      )
    },
    { field: 'lastPaymentDate', headerName: 'Last Payment', width: 130, cellRenderer: (p: ICellRendererParams) => <span className="fin-cell-subtext">{p.value}</span> },
    { 
      field: 'due', 
      headerName: 'Due ₹', 
      width: 110,
      cellStyle: { textAlign: 'right', fontWeight: 600 },
      cellRenderer: (p: ICellRendererParams) => (
        <span className={p.value > 0 ? 'fin-text-danger' : 'fin-text-body'}>
          {formatCurrency(p.value)}
        </span>
      )
    },
    {
      headerName: 'Actions',
      width: 180,
      sortable: false,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex items-center gap-2 h-full">
          <button
            className="fin-badge fin-badge--info cursor-pointer hover:border-[var(--mgr-primary)]"
            onClick={() => openRenew(params.data)}
            title="Renew Now"
          >
            <RefreshCw size={12} className="mr-1" /> Renew
          </button>
          <button
            className="fin-badge fin-badge--neutral cursor-pointer hover:border-[var(--mgr-primary)]"
            onClick={() => handleRemind(params.data.studentName)}
            title="Send WhatsApp Reminder"
          >
            <Send size={12} className="mr-1" /> Remind
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="fin-page-title">Renewals</h1>
          <p className="fin-page-subtitle">Subscriptions needing renewal attention.</p>
        </div>
        <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={handleRemindAll}>
          <Send size={14} className="mr-1" /> 📱 Remind All
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {FILTERS.map((f: any) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={filter === f.value ? 'fin-badge fin-badge--info cursor-pointer' : 'fin-badge fin-badge--neutral cursor-pointer'}
          >
            {f.emoji} {f.label}
          </button>
        ))}
      </div>

      <div className="fin-card p-4">
        <div className="mgr-table-wrapper h-[450px]">
          <AgGridReact
            theme={gridTheme}
            rowData={visible}
            columnDefs={colDefs as any}
            rowHeight={60}
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
      </div>

      {renewDialog && (
        <div className="fin-dialog-overlay">
          <div className="fin-dialog">
            <h2 className="fin-dialog__title">Renew Subscription — {renewDialog.name}</h2>
            <button className="fin-dialog__close" onClick={() => setRenewDialog(null)}>✕</button>
            <div className="space-y-4">
              <div>
                <label className="fin-label">Plan</label>
                <select
                  className="fin-select"
                  value={renewPlanId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setRenewPlanId(id);
                    const selectedPlan = PLANS.find((p) => String(p.id) === id);
                    if (selectedPlan) {
                      setRenewAmount(String(selectedPlan.price));
                    }
                  }}
                >
                  {PLANS.map((p: any) => (
                    <option key={p.id} value={String(p.id)}>{p.name} — {formatCurrency(p.price)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="fin-label">Amount</label>
                <input type="number" className="fin-input" value={renewAmount} onChange={(e) => setRenewAmount(e.target.value)} />
              </div>
              <div>
                <label className="fin-label">Payment Mode</label>
                <select className="fin-select" value={renewMode} onChange={(e) => setRenewMode(e.target.value)}>
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
              {renewMode !== 'cash' && (
                <div>
                  <label className="fin-label">Transaction ID</label>
                  <input className="fin-input" value={renewTxnId} onChange={(e) => setRenewTxnId(e.target.value)} placeholder="Enter transaction reference" />
                </div>
              )}
            </div>
            <div className="fin-dialog__footer">
              <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => setRenewDialog(null)}>Cancel</button>
              <button
                className="fin-badge fin-badge--success cursor-pointer"
                onClick={handleRenew}
                disabled={isRenewing || !renewAmount}
              >
                {isRenewing ? 'Renewing...' : '✅ Confirm Renewal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
