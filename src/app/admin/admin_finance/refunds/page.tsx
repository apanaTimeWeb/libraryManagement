'use client';

// RESPONSIBILITY: Entry page for the admin_finance module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

import toast from 'react-hot-toast';
import { formatCurrency } from '../lib/format';
import { CheckCircle, XCircle, Undo2 } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  pending:   'fin-badge fin-badge--warning',
  approved:  'fin-badge fin-badge--success',
  rejected:  'fin-badge fin-badge--danger',
  processed: 'fin-badge fin-badge--info',
};

type Refund = {
  id: number;
  studentName: string;
  smartId: string;
  exitDate?: string;
  depositHeld: number;
  deductionAmount: number;
  netRefund: number;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requestedDate: string;
  processedDate?: string;
  paymentMethod?: string;
  rejectionReason?: string;
};

const MOCK_REFUNDS: Refund[] = [
  { id: 1, studentName: 'Sara Mishra',    smartId: 'STU-8821', exitDate: '2024-10-10', depositHeld: 10000, deductionAmount: 250,   netRefund: 9750, status: 'processed', requestedDate: '2024-10-10', processedDate: '2024-10-12', paymentMethod: 'UPI'  },
  { id: 2, studentName: 'Rohan Khanna',   smartId: 'STU-7654', exitDate: '2024-10-15', depositHeld: 12000, deductionAmount: 3200,  netRefund: 8800, status: 'pending',   requestedDate: '2024-10-15' },
  { id: 3, studentName: 'Ananya Sharma',  smartId: 'STU-5432', exitDate: '2024-10-18', depositHeld: 8000,  deductionAmount: 0,     netRefund: 8000, status: 'approved',  requestedDate: '2024-10-18' },
  { id: 4, studentName: 'Vikram Singh',   smartId: 'STU-3321', exitDate: '2024-10-05', depositHeld: 15000, deductionAmount: 15000, netRefund: 0,    status: 'rejected',  requestedDate: '2024-10-05', processedDate: '2024-10-08', rejectionReason: 'Deposit forfeited due to contract violation' },
  { id: 5, studentName: 'Priya Mehta',    smartId: 'STU-6670', exitDate: '2024-10-20', depositHeld: 10000, deductionAmount: 500,   netRefund: 9500, status: 'pending',   requestedDate: '2024-10-20' },
];

export default function Refunds() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [allRefunds, setAllRefunds] = useState<Refund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processDialog, setProcessDialog] = useState<{ id: number; name: string; amount: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [deductDialog, setDeductDialog] = useState<{ id: number; name: string } | null>(null);
  const [deductAmt, setDeductAmt] = useState('');
  const [deductReason, setDeductReason] = useState('');

  useEffect(() => {
    fetchApi('/finance/refunds').then(data => {
      const mapped = data.map((r: any) => ({
        id: parseInt(r.id),
        studentName: r.name,
        smartId: 'S-001',
        depositHeld: 1000,
        deductionAmount: 0,
        netRefund: r.amount,
        status: r.status,
        requestedDate: new Date(r.date).toISOString().split('T')[0],
      }));
      setAllRefunds(mapped);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  const filtered = allRefunds.filter((r) => statusFilter === 'all' || r.status === statusFilter);
  const totalRefunded = allRefunds.filter((r) => r.status === 'processed').reduce((s, r) => s + r.netRefund, 0);
  const pendingCount = allRefunds.filter((r) => r.status === 'pending').length;

  const handleProcess = () => {
    if (!processDialog) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setAllRefunds((prev) =>
        prev.map((r) =>
          r.id === processDialog.id
            ? { ...r, status: 'processed', processedDate: new Date().toISOString().split('T')[0], paymentMethod: paymentMethod.toUpperCase() }
            : r
        )
      );
      toast.success(`💸 Refund of ${formatCurrency(processDialog.amount)} for ${processDialog.name} processed.`);
      setProcessDialog(null); setPaymentMethod('upi'); setIsSubmitting(false);
    }, 700);
  };

  const handleDeduction = () => {
    if (!deductDialog || !deductAmt || !deductReason) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setAllRefunds((prev) =>
        prev.map((r) =>
          r.id === deductDialog.id
            ? { ...r, deductionAmount: parseFloat(deductAmt), netRefund: r.depositHeld - parseFloat(deductAmt) }
            : r
        )
      );
      toast.success(`➕ Deduction added for ${deductDialog.name}.`);
      setDeductDialog(null); setDeductAmt(''); setDeductReason(''); setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fin-page-title">Refunds</h1>
        <p className="fin-page-subtitle">Manage and process student deposit refund requests.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="fin-stat-mini">
          <p className="fin-stat-mini__label">Total Refunded</p>
          <p className="fin-stat-mini__value fin-stat-mini__value--success">{isLoading ? '—' : formatCurrency(totalRefunded)}</p>
        </div>
        <div className="fin-stat-mini">
          <p className="fin-stat-mini__label">Pending</p>
          <p className="fin-stat-mini__value fin-stat-mini__value--warning">{isLoading ? '—' : pendingCount}</p>
        </div>
        <div className="fin-stat-mini">
          <p className="fin-stat-mini__label">Approved</p>
          <p className="fin-stat-mini__value">{isLoading ? '—' : allRefunds.filter((r) => r.status === 'approved').length}</p>
        </div>
        <div className="fin-stat-mini">
          <p className="fin-stat-mini__label">Rejected</p>
          <p className="fin-stat-mini__value fin-stat-mini__value--danger">{isLoading ? '—' : allRefunds.filter((r) => r.status === 'rejected').length}</p>
        </div>
      </div>

      <div className="fin-filter-bar">
        <select className="fin-select w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="processed">Processed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">Student</th>
              <th className="text-left py-3 px-4">Exit Date</th>
              <th className="text-right py-3 px-4">Deposit Held ₹</th>
              <th className="text-right py-3 px-4">Deduction ₹</th>
              <th className="text-right py-3 px-4">Net Refund ₹</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="fin-table-row">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="py-3 px-4">
                      <div className="fin-skeleton h-4 w-16" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="fin-empty-state">
                    <div className="fin-empty-state__icon">💸</div>
                    <p className="fin-empty-state__title">No pending refunds.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="fin-table-hover-row fin-table-row">
                  <td className="py-3 px-4">
                    <div className="fin-cell-name">{r.studentName}</div>
                    <div className="fin-cell-subtext">{r.smartId}</div>
                  </td>
                  <td className="py-3 px-4 fin-cell-subtext">{r.exitDate || '—'}</td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(r.depositHeld)}</td>
                  <td className={`py-3 px-4 text-right ${r.deductionAmount > 0 ? 'fin-text-danger' : 'fin-text-muted'}`}>
                    {r.deductionAmount > 0 ? `-${formatCurrency(r.deductionAmount)}` : 'None'}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-success">{formatCurrency(r.netRefund)}</td>
                  <td className="py-3 px-4">
                    <span className={STATUS_BADGE[r.status] || 'fin-badge fin-badge--neutral'}>{r.status}</span>
                    {r.status === 'rejected' && r.rejectionReason && (
                      <div className="fin-cell-subtext mt-1 max-w-32 truncate">{r.rejectionReason}</div>
                    )}
                    {r.status === 'processed' && r.processedDate && (
                      <div className="fin-cell-subtext mt-1">{r.processedDate} · {r.paymentMethod}</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {r.status === 'pending' && (
                        <>
                          <button
                            className="fin-badge fin-badge--success cursor-pointer"
                            onClick={() => setProcessDialog({ id: r.id, name: r.studentName, amount: r.netRefund })}
                          >
                            <Undo2 size={11} /> 💸 Process Refund
                          </button>
                          <button
                            className="fin-badge fin-badge--warning cursor-pointer"
                            onClick={() => setDeductDialog({ id: r.id, name: r.studentName })}
                          >
                            ➕ Add Deduction
                          </button>
                        </>
                      )}
                      {r.status === 'approved' && (
                        <button
                          className="fin-badge fin-badge--info cursor-pointer"
                          onClick={() => setProcessDialog({ id: r.id, name: r.studentName, amount: r.netRefund })}
                        >
                          <Undo2 size={11} /> Process
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {processDialog && (
        <div className="fin-dialog-overlay">
          <div className="fin-dialog">
            <h2 className="fin-dialog__title">💸 Process Refund — {processDialog.name}</h2>
            <button className="fin-dialog__close" onClick={() => setProcessDialog(null)}>✕</button>
            <p className="fin-dialog-helper">Processing refund of <span className="font-semibold fin-text-success">{formatCurrency(processDialog.amount)}</span></p>
            <div>
              <label className="fin-label">Payment Method</label>
              <select className="fin-select mt-1" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="upi">UPI</option>
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
            <div className="fin-dialog__footer">
              <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => setProcessDialog(null)}>Cancel</button>
              <button className="fin-badge fin-badge--success cursor-pointer" onClick={handleProcess} disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Mark as Processed'}
              </button>
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
                <label className="fin-label">Deduction Amount <span className="fin-text-danger">*</span></label>
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
                disabled={!deductAmt || !deductReason || isSubmitting}
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
