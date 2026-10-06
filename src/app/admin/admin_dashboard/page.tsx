// RESPONSIBILITY: Renders the Admin Dashboard, fetching data server-side and displaying KPI metrics, seating, and actions.
// DATA FLOW: Server Fetch -> AdminDashboardPage -> (KpiCard, SeatMatrixGrid, ActionItemsList, RecentPaymentsFeed)

import { ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import KpiCard from '@/app/admin/admin_reusable/KpiCard';
import SeatMatrixGrid from '@/app/admin/admin_reusable/SeatMatrixGrid';
import ActionItemsList, { type ActionItem } from '@/app/admin/admin_reusable/ActionItemsList';
import RecentPaymentsFeed from '@/app/admin/admin_reusable/RecentPaymentsFeed';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ADMIN_KPI_META, ADMIN_ACTION_ICONS } from '@/app/admin/admin_constants/admin_constants';



async function getDashboardData() {
  // ── Frontend-only Mock Data (no backend required) ──────────────────────────
  return {
    kpiCards: [
      { label: 'Active Members', value: '1,293', trend: { value: '+18', up: true }, sub: '18 joined today' },
      { label: 'Revenue (Month)', value: '₹1,24,800', trend: { value: '+12%', up: true }, sub: 'vs last month' },
      { label: 'Seats Available', value: '14 / 60', trend: { value: '-3', up: false }, sub: 'Morning shift' },
      { label: 'Overdue Returns', value: '7', trend: { value: '+2', up: false }, sub: '3 critical' },
    ],
    seats: Array.from({ length: 60 }, (_, i) => {
      const shift = i < 20 ? 'Morning' : i < 40 ? 'Afternoon' : 'Evening';
      const status = i % 5 === 0 ? 'free' : i % 7 === 0 ? 'expiring' : i === 13 ? 'maintenance' : 'occupied';
      return {
        id: `S${i + 1}`,
        shift,
        status,
        fee: i % 3 === 0 ? 'Due' : 'Paid',
        occupant: status === 'occupied' || status === 'expiring' ? `Student ${i + 1}` : undefined,
      };
    }),
    shifts: ['Morning', 'Afternoon', 'Evening'],
    actionItems: [
      { label: 'Fee Renewals Due', count: 14, type: 'warning', description: '14 members expiring this week', href: '/admin/admin_finance/renewals' },
      { label: 'New Enquiries', count: 6, type: 'danger', description: '6 unattended enquiries', href: '/admin/admin_crm/enquiries' },
      { label: 'Complaint Open', count: 2, type: 'warning', description: '2 open complaints', href: '/admin/admin_support-tickets' },
      { label: 'PTP Dates Today', count: 3, type: 'danger', description: '3 payment promises today', href: '/admin/admin_finance/payment-promises' },
    ],
    recentPayments: [
      { id: 'TXN-001', studentName: 'Ravi Kumar', amount: 1200, type: 'Membership', date: '2026-09-30', status: 'paid' },
      { id: 'TXN-002', studentName: 'Sneha Mehta', amount: 600, type: 'Fine', date: '2026-09-29', status: 'paid' },
      { id: 'TXN-003', studentName: 'Arjun Singh', amount: 1500, type: 'Membership', date: '2026-09-29', status: 'pending' },
      { id: 'TXN-004', studentName: 'Priya Sharma', amount: 300, type: 'Fine', date: '2026-09-28', status: 'paid' },
      { id: 'TXN-005', studentName: 'Mohan Lal', amount: 1200, type: 'Membership', date: '2026-09-28', status: 'overdue' },
    ],
  };
}



export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  if (!data) return <div>Failed to load dashboard</div>;

  const actionItems: ActionItem[] = data.actionItems.map((a: any) => ({
    ...a,
    icon: ADMIN_ACTION_ICONS[a.label] ?? AlertCircle,
    type: a.type as 'danger' | 'warning',
  }));

  return (
    <div className="space-y-6 pb-10">

      {/* Breadcrumb + Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Library OS › Admin › Dashboard</p>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back — here's what's happening today.</p>
        </div>
        <Link href="/admin/admin_reports">
          <Button variant="outline" size="sm">
            View Full Reports <ChevronRight size={14} className="ml-1" />
          </Button>
        </Link>
      </div>

      {/* Row 1: 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpiCards.map((card: any, i: number) => (
          <KpiCard
            key={i}
            label={card.label}
            value={card.value}
            icon={ADMIN_KPI_META[i].icon}
            iconColor={ADMIN_KPI_META[i].iconColor}
            iconBg={ADMIN_KPI_META[i].iconBg}
            trend={card.trend as { value: string; up: boolean }}
            sub={card.sub}
          />
        ))}
      </div>

      {/* Row 2: Seat Matrix (60%) + Action Items (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full">
          <SeatMatrixGrid seats={data.seats as any} shifts={data.shifts as any} />
        </div>

        <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full">
          <Card className="flex flex-col h-full border-[var(--border)] bg-[var(--bg-card)] shadow-none">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base">Action Items</CardTitle>
              <CardDescription className="text-xs">
                {data.actionItems.reduce((s: number, a: any) => s + a.count, 0)} items need your attention
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 flex-1">
              <ActionItemsList items={actionItems} />
            </CardContent>

            <div className="px-4 pb-3">
              <div className="flex items-start gap-2 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-3 rounded-md">
                <span className="text-sm">💡</span>
                <p className="text-xs text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                  5 students expire within 7 days. Consider sending renewal reminders via WhatsApp.
                </p>
              </div>
            </div>

            <CardFooter className="pt-2 pb-4 border-t px-4">
              <Button asChild variant="ghost" className="w-full text-xs text-muted-foreground hover:text-[var(--text-primary)]">
                <Link href="/admin/admin_audit-logs">
                  View All Activities <ChevronRight size={13} className="ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Row 3: Recent Payments AG Grid */}
      <RecentPaymentsFeed payments={data.recentPayments as any} />
    </div>
  );
}
