'use client';

import { useState, useEffect } from 'react';

import toast from 'react-hot-toast';
import { formatCurrency } from '@/app/superadmin/superadmin_finance/lib/format';
import { Undo2, Minus } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  held:      'fin-badge fin-badge--info',
  refunded:  'fin-badge fin-badge--success',
  forfeited: 'fin-badge fin-badge--danger',
};

type Deposit = {
  id: number;
  studentName: string;
  smartId: string;
  depositAmount: number;
  collectedBy: string;
  collectedDate: string;
  deductionAmount: number;
  deductionReason?: string;
  status: 'held' | 'refunded' | 'forfeited';
  refundedDate?: string;
};

const INITIAL: Deposit[] = [
  { id: 1, studentName: 'Rahul Kumar',  smartId: 'STU101', depositAmount: 10000, collectedBy: 'Admin',   collectedDate: '2026-03-15', deductionAmount: 0,    status: 'held'     },
  { id: 2, studentName: 'Priya Singh',  smartId: 'STU102', depositAmount: 8000,  collectedBy: 'Manager', collectedDate: '2026-03-20', deductionAmount: 1500, deductionReason: 'Damaged property', status: 'held' },
  { id: 3, studentName: 'Aman Verma',   smartId: 'STU103', depositAmount: 12000, collectedBy: 'Admin',   collectedDate: '2026-02-10', deductionAmount: 0,    status: 'refunded', refundedDate: '2026-04-08' },
  { id: 4, studentName: 'Sneha Patel',  smartId: 'STU104', depositAmount: 9000,  collectedBy: 'Admin',   collectedDate: '2026-03-05', deductionAmount: 9000, deductionReason: 'Multiple violations', status: 'forfeited' },
  { id: 5, studentName: 'Vikas Sharma', smartId: 'STU105', depositAmount: 11000, collectedBy: 'Manager', collectedDate: '2026-04-01', deductionAmount: 0,    status: 'held'     },
];

export default function SecurityDeposits() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refundDialog, setRefundDialog] = useState<{ id: number; name: string; amount: number } | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [deductionAmount, setDeductionAmount] = useState('');
  const [deductionReason, setDeductionReason] = useState('');
  const [deductDialog, setDeductDialog] = useState<{ id: number; name: string } | null>(null);
  const [deductAmt, setDeductAmt] = useState('');
  const [deductReason, setDeductReason] = useState('');

  useEffect(() => {
    const t = setTimeout(() => { setDeposits(INITIAL); setIsLoading(false); }, 700);
    return () => clearTimeout(t);
  }, []);

  const filtered = deposits.filter((d) => statusFilter === 'all' || d.status === statusFilter);

  const handleRefund = () => {
    if (!refundDialog) return;
    setDeposits((prev) =>
      prev.map((d: any) =>
        d.id === refundDialog.id
          ? { ...d, status: 'refunded', refundedDate: new Date().toISOString().split('T')[0], deductionAmount: parseFloat(deductionAmount) || d.deductionAmount, deductionReason: deductionReason || d.deductionReason }
          : d
      )
    );
    toast.success(`💸 Deposit refund for ${refundDialog.name} processed.`);
    setRefundDialog(null); setRefundAmount(''); setDeductionAmount(''); setDeductionReason('');
  };

  const handleDeduction = () => {
    if (!deductDialog || !deductAmt || !deductReason) return;
    setDeposits((prev) =>
      prev.map((d: any) =>
        d.id === deductDialog.id ? { ...d, deductionAmount: parseFloat(deductAmt), deductionReason: deductReason } : d
      )
    );
    toast.success(`➕ Deduction added to ${deductDialog.name}'s deposit.`);
    setDeductDialog(null); setDeductAmt(''); setDeductReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fin-page-title">Security Deposits</h1>
        <p className="fin-page-subtitle">Manage student security deposit records.</p>
      </div>

      <div className="fin-filter-bar">
        <select className="fin-select w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="held">Held</option>
          <option value="refunded">Refunded</option>
          <option value="forfeited">Forfeited</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">Student</th>
              <th className="text-right py-3 px-4">Deposit ₹</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Collected By</th>
              <th className="text-left py-3 px-4">Collected Date</th>
              <th className="text-right py-3 px-4">Deduction ₹</th>
              <th className="text-left py-3 px-4">Deduction Reason</th>
              <th className="text-left py-3 px-4">Refunded Date</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="fin-table-row">
                  {Array.from({ length: 9 }).map((_, j) => (
                    <td key={j} className="py-3 px-4">
                      <div className="fin-skeleton h-4 w-16" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="fin-empty-state">
                    <div className="fin-empty-state__icon">💼</div>
                    <p className="fin-empty-state__title">No security deposits recorded.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((d: any) => (
                <tr key={d.id} className="fin-table-hover-row fin-table-row">
                  <td className="py-3 px-4">
                    <div className="fin-cell-name">{d.studentName}</div>
                    <div className="fin-cell-subtext">{d.smartId}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(d.depositAmount)}</td>
                  <td className="py-3 px-4">
                    <span className={STATUS_BADGE[d.status] || 'fin-badge fin-badge--neutral'}>{d.status}</span>
                  </td>
                  <td className="py-3 px-4 fin-text-body">{d.collectedBy}</td>
                  <td className="py-3 px-4 fin-cell-subtext">{d.collectedDate}</td>
                  <td className={`py-3 px-4 text-right ${d.deductionAmount > 0 ? 'fin-text-danger' : 'fin-text-muted'}`}>
                    {d.deductionAmount > 0 ? formatCurrency(d.deductionAmount) : '—'}
                  </td>
                  <td className="py-3 px-4 fin-cell-subtext">{d.deductionReason || '—'}</td>
                  <td className="py-3 px-4 fin-cell-subtext">{d.refundedDate || '—'}</td>
                  <td className="py-3 px-4">
                    {d.status === 'held' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="fin-badge fin-badge--success cursor-pointer"
                          onClick={() => { setRefundDialog({ id: d.id, name: d.studentName, amount: d.depositAmount }); setRefundAmount(String(d.depositAmount - d.deductionAmount)); }}
                        >
                          <Undo2 size={11} /> 💸 Process Refund
                        </button>
                        <button
                          className="fin-badge fin-badge--warning cursor-pointer"
                          onClick={() => setDeductDialog({ id: d.id, name: d.studentName })}
                        >
                          <Minus size={11} /> ➕ Add Deduction
                        </button>
                      </div>
                    )}
                    {d.status === 'refunded' && d.refundedDate && (
                      <span className="fin-cell-subtext">Refunded {d.refundedDate}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {refundDialog && (
        <div className="fin-dialog-overlay">
          <div className="fin-dialog">
            <h2 className="fin-dialog__title">💸 Process Refund — {refundDialog.name}</h2>
            <button className="fin-dialog__close" onClick={() => setRefundDialog(null)}>✕</button>
            <div className="space-y-4">
              <div>
                <label className="fin-label">Refund Amount</label>
                <input type="number" className="fin-input" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} />
              </div>
              <div>
                <label className="fin-label">Deduction Amount</label>
                <input type="number" className="fin-input" value={deductionAmount} onChange={(e) => setDeductionAmount(e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className="fin-label">Deduction Reason {parseFloat(deductionAmount) > 0 && <span className="fin-text-danger">*</span>}</label>
                <input className="fin-input" value={deductionReason} onChange={(e) => setDeductionReason(e.target.value)} placeholder="Reason..." />
              </div>
            </div>
            <div className="fin-dialog__footer">
              <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => setRefundDialog(null)}>Cancel</button>
              <button className="fin-badge fin-badge--success cursor-pointer" onClick={handleRefund}>Process Refund</button>
            </div>
          </div>
        </div>
      )}

      {deductDialog && (
        <div className="fin-dialog-overlay">
          <div className="fin-dialog">
            <h2 className="fin-dialog__title">➕ Add Deduction — {deductDialog.name}</h2>
            <button className="fin-dialog__close" onClick={() => setDeductDialog(null)}>✕</button>
            <div className="space-y-4">
              <div>
                <label className="fin-label">Amount <span className="fin-text-danger">*</span></label>
                <input type="number" className="fin-input" value={deductAmt} onChange={(e) => setDeductAmt(e.target.value)} />
              </div>
              <div>
                <label className="fin-label">Reason <span className="fin-text-danger">*</span></label>
                <input className="fin-input" value={deductReason} onChange={(e) => setDeductReason(e.target.value)} placeholder="Reason for deduction" />
              </div>
            </div>
            <div className="fin-dialog__footer">
              <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => setDeductDialog(null)}>Cancel</button>
              <button
                className="fin-badge fin-badge--warning cursor-pointer"
                onClick={handleDeduction}
                disabled={!deductAmt || !deductReason}
              >
                Add Deduction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
