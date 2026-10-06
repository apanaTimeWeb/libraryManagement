'use client';

import { useState, useEffect } from 'react';
import {
  PiggyBank, Users, Clock, Ban, UsersRound, ShieldAlert,
  TrendingUp, TrendingDown, IndianRupee, Receipt, AlertTriangle, RefreshCw,
} from 'lucide-react';
import { formatCurrency } from '@/app/superadmin/superadmin_finance/lib/format';

interface DashboardStats {
  totalCollections: number; collectionsGrowth: number; activeStudents: number;
  expiringSoon: number; suspended: number; totalReferrals: number;
  depositsHeld: number; pendingPromises: number; overdueStudents: number;
  pendingRefunds: number; renewalsDue: number; lateFeeAccrued: number;
}
interface RecentPayment {
  id: number; studentName: string; studentSmartId: string;
  amount: number; mode: string; date: string;
}

const MOCK_STATS: DashboardStats = {
  totalCollections: 44880, collectionsGrowth: 12.5, activeStudents: 12,
  expiringSoon: 3, suspended: 2, totalReferrals: 6, depositsHeld: 16000,
  pendingPromises: 2, overdueStudents: 3, pendingRefunds: 18, renewalsDue: 4, lateFeeAccrued: 1500,
};
const MOCK_RECENT_PAYMENTS: RecentPayment[] = [
  { id: 1, studentName: 'Aarav Sharma',  studentSmartId: 'STU001', amount: 1499, mode: 'cash', date: '2026-04-01' },
  { id: 2, studentName: 'Priya Patel',   studentSmartId: 'STU002', amount: 1049, mode: 'upi',  date: '2026-04-02' },
  { id: 3, studentName: 'Ananya Singh',  studentSmartId: 'STU004', amount: 1499, mode: 'bank', date: '2026-04-05' },
  { id: 4, studentName: 'Vikram Rao',    studentSmartId: 'STU005', amount: 1149, mode: 'cash', date: '2026-04-06' },
  { id: 5, studentName: 'Sneha Gupta',   studentSmartId: 'STU006', amount: 2199, mode: 'upi',  date: '2026-04-08' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setStats(MOCK_STATS); setRecentPayments(MOCK_RECENT_PAYMENTS); setIsLoading(false); }, 600);
    return () => clearTimeout(t);
  }, []);

  const statCards = stats ? [
    { label: 'Total Collections',   value: formatCurrency(stats.totalCollections), icon: PiggyBank,     sub: <span className="fin-trend-up"><TrendingUp size={12} />+{stats.collectionsGrowth}% vs last month</span>, variant: 'default' as const },
    { label: 'Active Students',      value: stats.activeStudents,                   icon: Users,         sub: null,                                                                                                    variant: 'default' as const },
    { label: 'Expiring Soon',        value: stats.expiringSoon,                     icon: Clock,         sub: <span className="fin-text-warning fin-text-xs">within 7 days</span>,                                    variant: 'warning' as const },
    { label: 'Currently Suspended',  value: stats.suspended,                        icon: Ban,           sub: null,                                                                                                    variant: 'danger'  as const },
    { label: 'Total Referrals',      value: stats.totalReferrals,                   icon: UsersRound,    sub: null,                                                                                                    variant: 'default' as const },
    { label: 'Deposits Held',        value: formatCurrency(stats.depositsHeld),     icon: ShieldAlert,   sub: null,                                                                                                    variant: 'default' as const },
    { label: 'Pending Promises',     value: stats.pendingPromises,                  icon: Receipt,       sub: <span className="fin-text-muted fin-text-xs">payment promises pending</span>,                           variant: 'default' as const },
    { label: 'Overdue Students',     value: stats.overdueStudents,                  icon: AlertTriangle, sub: <span className="fin-text-warning fin-text-xs">late fee accruing</span>,                                variant: 'warning' as const },
    { label: 'Renewals Due',         value: stats.renewalsDue,                      icon: RefreshCw,     sub: <span className="fin-text-muted fin-text-xs">need renewal</span>,                                       variant: 'default' as const },
    { label: 'Pending Refunds',      value: stats.pendingRefunds,                   icon: IndianRupee,   sub: <span className="fin-text-muted fin-text-xs">deposit refund requests</span>,                            variant: 'default' as const },
    { label: 'Late Fee Accrued',     value: formatCurrency(stats.lateFeeAccrued),   icon: TrendingDown,  sub: <span className="fin-text-danger fin-text-xs">this month</span>,                                        variant: 'danger'  as const },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fin-page-title">Dashboard</h1>
        <p className="fin-page-subtitle">Overview of financial intelligence.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="fin-kpi-card space-y-3">
                <div className="fin-skeleton h-4 w-28" />
                <div className="fin-skeleton h-8 w-20" />
                <div className="fin-skeleton h-3 w-24" />
              </div>
            ))
          : statCards.map(({ label, value, icon: Icon, sub, variant }) => (
              <div
                key={label}
                className={`fin-kpi-card${variant === 'warning' ? ' fin-kpi-card--warning' : variant === 'danger' ? ' fin-kpi-card--danger' : ''}`}
              >
                <div className="fin-kpi-card__header">
                  <span className={`fin-kpi-label${variant === 'warning' ? ' fin-kpi-label--warning' : variant === 'danger' ? ' fin-kpi-label--danger' : ''}`}>
                    {label}
                  </span>
                  <Icon size={16} className={variant === 'warning' ? 'fin-text-warning' : variant === 'danger' ? 'fin-text-danger' : 'fin-icon-muted'} />
                </div>
                <p className={`fin-kpi-value${variant === 'warning' ? ' fin-kpi-value--warning' : variant === 'danger' ? ' fin-kpi-value--danger' : ''}`}>
                  {value}
                </p>
                {sub && <div className="mt-1">{sub}</div>}
              </div>
            ))}
      </div>

      {/* Recent Payments */}
      <div className="fin-card">
        <div className="flex items-center gap-2 p-6 fin-border-bottom">
          <Receipt size={20} className="fin-icon-muted" />
          <span className="fin-text-body font-semibold">Recent Payments</span>
        </div>
        <div>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="fin-payment-row">
                  <div className="space-y-1">
                    <div className="fin-skeleton h-4 w-32" />
                    <div className="fin-skeleton h-3 w-20" />
                  </div>
                  <div className="text-right space-y-1">
                    <div className="fin-skeleton h-4 w-16 ml-auto" />
                    <div className="fin-skeleton h-3 w-12 ml-auto" />
                  </div>
                </div>
              ))
            : recentPayments.map((p: any) => (
                <div key={p.id} className="fin-payment-row">
                  <div>
                    <div className="fin-cell-name">{p.studentName}</div>
                    <div className="fin-cell-subtext">{p.studentSmartId} · {p.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`fin-badge fin-badge--${p.mode}`}>{p.mode}</span>
                    <span className="font-semibold fin-text-sm fin-text-primary">{formatCurrency(p.amount)}</span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
