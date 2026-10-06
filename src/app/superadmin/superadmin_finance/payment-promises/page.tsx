'use client';

import { useState, useEffect } from 'react';

import toast from 'react-hot-toast';
import { formatCurrency } from '@/app/superadmin/superadmin_finance/lib/format';
import { CheckCircle, CalendarPlus, Eye } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  pending:   'fin-badge fin-badge--warning',
  fulfilled: 'fin-badge fin-badge--success',
  overdue:   'fin-badge fin-badge--danger',
};

type PromiseItem = {
  id: number;
  studentName: string;
  smartId: string;
  promisedAmount: number;
  expectedDate: string;
  daysUntilDue: number;
  timesChanged: number;
  status: 'pending' | 'fulfilled' | 'overdue';
  fulfilledDate?: string;
};

const INITIAL: PromiseItem[] = [
  { id: 1, studentName: 'Rahul Kumar',  smartId: 'STU101', promisedAmount: 1499, expectedDate: '2026-04-20', daysUntilDue: 9,   timesChanged: 0, status: 'pending'   },
  { id: 2, studentName: 'Priya Singh',  smartId: 'STU102', promisedAmount: 999,  expectedDate: '2026-04-05', daysUntilDue: -6,  timesChanged: 1, status: 'overdue'   },
  { id: 3, studentName: 'Aman Verma',   smartId: 'STU103', promisedAmount: 2499, expectedDate: '2026-03-15', daysUntilDue: -27, timesChanged: 0, status: 'fulfilled', fulfilledDate: '2026-04-10' },
  { id: 4, studentName: 'Sneha Patel',  smartId: 'STU104', promisedAmount: 1200, expectedDate: '2026-04-30', daysUntilDue: 19,  timesChanged: 2, status: 'pending'   },
  { id: 5, studentName: 'Vikas Sharma', smartId: 'STU105', promisedAmount: 800,  expectedDate: '2026-04-12', daysUntilDue: -3,  timesChanged: 3, status: 'overdue'   },
];

function calcDays(dateStr: string) {
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((new Date(dateStr).getTime() - today.getTime()) / 86400000);
}

export default function PaymentPromises() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [promises, setPromises] = useState<PromiseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [extendDialog, setExtendDialog] = useState<{ id: number; name: string } | null>(null);
  const [newDate, setNewDate] = useState('');
  const [extendReason, setExtendReason] = useState('');

  useEffect(() => {
    const t = setTimeout(() => { setPromises(INITIAL); setIsLoading(false); }, 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = promises.filter((p) => statusFilter === 'all' || p.status === statusFilter);

  const handleFulfill = (id: number, name: string) => {
    setPromises((prev) =>
      prev.map((p: any) => p.id === id ? { ...p, status: 'fulfilled', fulfilledDate: new Date().toISOString().split('T')[0] } : p)
    );
    toast.success(`✅ ${name}'s promise marked as paid.`);
  };

  const handleExtend = () => {
    if (!extendDialog || !newDate || !extendReason) return;
    setPromises((prev) =>
      prev.map((p: any) =>
        p.id === extendDialog.id
          ? { ...p, expectedDate: newDate, timesChanged: p.timesChanged + 1, daysUntilDue: calcDays(newDate) }
          : p
      )
    );
    toast.success(`📅 ${extendDialog.name}'s promise date extended.`);
    setExtendDialog(null); setNewDate(''); setExtendReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fin-page-title">Payment Promises</h1>
        <p className="fin-page-subtitle">Track and manage student payment commitments.</p>
      </div>

      <div className="fin-filter-bar">
        <select className="fin-select w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">Student</th>
              <th className="text-right py-3 px-4">Promised ₹</th>
              <th className="text-left py-3 px-4">Expected Date</th>
              <th className="text-left py-3 px-4">Days Until/Since Due</th>
              <th className="text-left py-3 px-4">Times Changed</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="fin-table-row">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="py-3 px-4">
                      <div className="fin-skeleton h-4 w-20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="fin-empty-state">
                    <div className="fin-empty-state__icon">🤝</div>
                    <p className="fin-empty-state__title">No payment promises recorded.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((p: any) => (
                <tr key={p.id} className="fin-table-hover-row fin-table-row">
                  <td className="py-3 px-4">
                    <div className="fin-cell-name">{p.studentName}</div>
                    <div className="fin-cell-subtext">{p.smartId}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(p.promisedAmount)}</td>
                  <td className="py-3 px-4 fin-cell-subtext">{p.expectedDate}</td>
                  <td className="py-3 px-4">
                    <span className={p.daysUntilDue < 0 ? 'fin-text-danger font-semibold' : p.daysUntilDue <= 3 ? 'fin-text-warning' : 'fin-text-body'}>
                      {p.daysUntilDue < 0 ? `${Math.abs(p.daysUntilDue)}d overdue` : `${p.daysUntilDue}d`}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {p.timesChanged >= 3 ? (
                      <span className="fin-badge fin-badge--danger">{p.timesChanged}x changed</span>
                    ) : p.timesChanged > 0 ? (
                      <span className="fin-badge fin-badge--warning">{p.timesChanged}x changed</span>
                    ) : (
                      <span className="fin-text-muted">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={STATUS_BADGE[p.status] || 'fin-badge fin-badge--neutral'}>{p.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    {p.status !== 'fulfilled' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="fin-badge fin-badge--success cursor-pointer"
                          onClick={() => handleFulfill(p.id, p.studentName)}
                        >
                          <CheckCircle size={11} /> Mark Paid
                        </button>
                        <button
                          className="fin-badge fin-badge--warning cursor-pointer"
                          onClick={() => setExtendDialog({ id: p.id, name: p.studentName })}
                        >
                          <CalendarPlus size={11} /> Extend Date
                        </button>
                        <button className="fin-badge fin-badge--neutral cursor-pointer">
                          <Eye size={11} /> View
                        </button>
                      </div>
                    ) : (
                      <span className="fin-cell-subtext">Paid on {p.fulfilledDate}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {extendDialog && (
        <div className="fin-dialog-overlay">
          <div className="fin-dialog">
            <h2 className="fin-dialog__title">📅 Extend Promise — {extendDialog.name}</h2>
            <button className="fin-dialog__close" onClick={() => setExtendDialog(null)}>✕</button>
            <div className="space-y-4">
              <div>
                <label className="fin-label">New Expected Date <span className="fin-text-danger">*</span></label>
                <input type="date" className="fin-input" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              </div>
              <div>
                <label className="fin-label">Reason <span className="fin-text-danger">*</span></label>
                <textarea className="fin-textarea" value={extendReason} onChange={(e) => setExtendReason(e.target.value)} placeholder="Reason for extension..." rows={2} />
              </div>
              <div className="fin-badge fin-badge--warning w-full justify-center py-2">
                ⚠️ This will decrease the student's Trust Score.
              </div>
            </div>
            <div className="fin-dialog__footer">
              <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => setExtendDialog(null)}>Cancel</button>
              <button
                className="fin-badge fin-badge--warning cursor-pointer"
                onClick={handleExtend}
                disabled={!newDate || !extendReason}
              >
                Extend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
