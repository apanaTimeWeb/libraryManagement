'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';
import { formatCurrency } from '@/app/superadmin/superadmin_finance/lib/format';
import { RefreshCw, Eye } from 'lucide-react';

const MOCK_SUBSCRIPTIONS = [
  { id: 1, studentName: 'Aarav Sharma',  smartId: 'STU001', plan: 'Premium Plan', shift: 'Morning', startDate: '2026-01-01', endDate: '2026-06-30', daysLeft: 12,  base: 15000, discount: 0,    total: 15000, paid: 15000, due: 0,    status: 'active'    },
  { id: 2, studentName: 'Priya Patel',   smartId: 'STU002', plan: 'Basic Plan',   shift: 'Evening', startDate: '2025-11-01', endDate: '2026-04-30', daysLeft: 3,   base: 8000,  discount: 200,  total: 7800,  paid: 6000, due: 1800, status: 'active'    },
  { id: 3, studentName: 'Rohan Kumar',   smartId: 'STU003', plan: 'Premium Plan', shift: 'Full Day',startDate: '2025-08-01', endDate: '2025-12-31', daysLeft: -15, base: 18000, discount: 0,    total: 18000, paid: 18000,due: 0,    status: 'expired'   },
  { id: 4, studentName: 'Sneha Singh',   smartId: 'STU004', plan: 'Basic Plan',   shift: 'Morning', startDate: '2026-02-01', endDate: '2026-07-31', daysLeft: 45,  base: 9000,  discount: 0,    total: 9000,  paid: 4500, due: 4500, status: 'suspended' },
  { id: 5, studentName: 'Vikram Rao',    smartId: 'STU005', plan: 'Premium Plan', shift: 'Evening', startDate: '2025-10-01', endDate: '2025-12-31', daysLeft: -45, base: 16000, discount: 500,  total: 15500, paid: 15500,due: 0,    status: 'cancelled' },
  { id: 6, studentName: 'Ananya Gupta',  smartId: 'STU006', plan: 'Basic Plan',   shift: 'Full Day',startDate: '2026-03-01', endDate: '2026-08-31', daysLeft: 8,   base: 7500,  discount: 0,    total: 7500,  paid: 7500, due: 0,    status: 'active'    },
  { id: 7, studentName: 'Karan Mehta',   smartId: 'STU007', plan: 'Premium Plan', shift: 'Morning', startDate: '2025-09-01', endDate: '2026-02-28', daysLeft: -5,  base: 14000, discount: 0,    total: 14000, paid: 10000,due: 4000, status: 'expired'   },
];

const STATUS_BADGE: Record<string, string> = {
  active:    'fin-badge fin-badge--success',
  expired:   'fin-badge fin-badge--danger',
  suspended: 'fin-badge fin-badge--warning',
  cancelled: 'fin-badge fin-badge--neutral',
};

function daysLeftBadgeClass(days: number) {
  if (days < 0) return 'fin-badge fin-badge--danger';
  if (days <= 7) return 'fin-badge fin-badge--danger';
  if (days <= 15) return 'fin-badge fin-badge--warning';
  return 'fin-badge fin-badge--success';
}

export default function Subscriptions() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [rows, setRows] = useState(MOCK_SUBSCRIPTIONS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setRows(
      MOCK_SUBSCRIPTIONS.filter((s) => {
        const st = statusFilter === 'all' || s.status === statusFilter;
        const pl = planFilter === 'all' || s.plan === planFilter;
        const sh = shiftFilter === 'all' || s.shift === shiftFilter;
        return st && pl && sh;
      })
    );
  }, [statusFilter, planFilter, shiftFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fin-page-title">Subscriptions</h1>
        <p className="fin-page-subtitle">Manage all student subscriptions.</p>
      </div>

      <div className="fin-filter-bar">
        <select className="fin-select w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="suspended">Suspended</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select className="fin-select w-40" value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
          <option value="all">All Plans</option>
          <option value="Basic Plan">Basic Plan</option>
          <option value="Premium Plan">Premium Plan</option>
        </select>
        <select className="fin-select w-40" value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)}>
          <option value="all">All Shifts</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
          <option value="Full Day">Full Day</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">Student</th>
              <th className="text-left py-3 px-4">Smart ID</th>
              <th className="text-left py-3 px-4">Plan</th>
              <th className="text-left py-3 px-4">Start Date</th>
              <th className="text-left py-3 px-4">End Date</th>
              <th className="text-left py-3 px-4">Days Left</th>
              <th className="text-right py-3 px-4">Base ₹</th>
              <th className="text-right py-3 px-4">Discount ₹</th>
              <th className="text-right py-3 px-4">Total ₹</th>
              <th className="text-right py-3 px-4">Paid ₹</th>
              <th className="text-right py-3 px-4">Due ₹</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="fin-table-row">
                  {Array.from({ length: 13 }).map((_, j) => (
                    <td key={j} className="py-3 px-4">
                      <div className="fin-skeleton h-4 w-20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={13}>
                  <div className="fin-empty-state">
                    <div className="fin-empty-state__icon">📋</div>
                    <p className="fin-empty-state__title">No subscriptions found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((s: any) => (
                <tr key={s.id} className="fin-table-hover-row fin-table-row">
                  <td className="py-3 px-4 fin-cell-name">{s.studentName}</td>
                  <td className="py-3 px-4 fin-mono">{s.smartId}</td>
                  <td className="py-3 px-4 fin-text-body">{s.plan}</td>
                  <td className="py-3 px-4 fin-cell-subtext">{s.startDate}</td>
                  <td className="py-3 px-4 fin-cell-subtext">{s.endDate}</td>
                  <td className="py-3 px-4">
                    <span className={daysLeftBadgeClass(s.daysLeft)}>
                      {s.daysLeft < 0 ? `${Math.abs(s.daysLeft)}d ago` : `${s.daysLeft}d`}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right fin-text-body">{formatCurrency(s.base)}</td>
                  <td className="py-3 px-4 text-right fin-text-success">{formatCurrency(s.discount)}</td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(s.total)}</td>
                  <td className="py-3 px-4 text-right fin-text-success">{formatCurrency(s.paid)}</td>
                  <td className={`py-3 px-4 text-right font-semibold ${s.due > 0 ? 'fin-text-danger' : 'fin-text-body'}`}>
                    {formatCurrency(s.due)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={STATUS_BADGE[s.status] || 'fin-badge fin-badge--neutral'}>{s.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="fin-badge fin-badge--info cursor-pointer"
                        onClick={() => router.push(`/superadmin/superadmin_finance/collect-fee?studentId=${s.id}&renew=true`)}
                      >
                        <RefreshCw size={11} /> Renew
                      </button>
                      <button
                        className="fin-badge fin-badge--neutral cursor-pointer"
                        onClick={() => toast.success(`Viewing subscription for ${s.studentName}`)}
                      >
                        <Eye size={11} /> View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
