import KpiCard from '@/app/superadmin/superadmin_dashboard/KpiCard';
import SystemHealthPanel from '@/app/superadmin/superadmin_dashboard/SystemHealthPanel';
import ActionItemsPanel from '@/app/superadmin/superadmin_dashboard/ActionItemsPanel';
import RecentLibrariesTable from '@/app/superadmin/superadmin_dashboard/RecentLibrariesTable';
import Link from 'next/link';
import { Activity, Clock } from 'lucide-react';
import { fetchDashboardData } from '@/app/superadmin/superadmin_dashboard/dashboard_service';
import type { DashboardKpiCard } from '@/app/superadmin/superadmin_dashboard/superadmin_dashboard_types';

// Recent platform activity feed (hardcoded)
const RECENT_ACTIVITY = [
  {
    dotCls: 'sa-recent-activity-dot--success',
    title: 'New Library Registered',
    desc: 'StudyNest Patna — Pro Plan',
    time: '2 hours ago',
    href: '/superadmin/superadmin_libraries',
  },
  {
    dotCls: 'sa-recent-activity-dot--danger',
    title: 'Subscription Overdue',
    desc: 'Scholar Spaces — ₹999 due',
    time: '5 hours ago',
    href: '/superadmin/superadmin_subscriptions',
  },
  {
    dotCls: 'sa-recent-activity-dot--warning',
    title: 'Support Ticket Opened',
    desc: 'TKT-991 — Payment Gateway Failing',
    time: '1 day ago',
    href: '/superadmin/superadmin_support-tickets',
  },
  {
    dotCls: 'sa-recent-activity-dot--info',
    title: 'Automated Backup Completed',
    desc: 'DB Snapshot — AWS S3',
    time: '2 days ago',
    href: '/superadmin/superadmin_system-health',
  },
  {
    dotCls: 'sa-recent-activity-dot--success',
    title: 'Plan Renewed',
    desc: 'The Alexandria Modern — Enterprise Annual',
    time: '3 days ago',
    href: '/superadmin/superadmin_billing',
  },
];

export default async function SuperAdminDashboardPage() {
  const data = await fetchDashboardData();
  
  if (!data) return <div>Failed to load dashboard</div>;

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Library OS</span><span>/</span><span>Super Admin</span><span>/</span><span>Dashboard</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="sa-page-title">Platform Overview</h1>
          <Link href="/superadmin/superadmin_audit-logs" className="sa-btn-ghost sa-btn-ghost--sm">
            <Activity size={14} /> View Audit Logs
          </Link>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {data.kpiCards?.map((card: DashboardKpiCard, i: number) => (
          <KpiCard key={i} {...card} />
        ))}
      </div>

      {/* Row 2: System Health + Action Items */}
      <div className="grid grid-cols-12 gap-8 mb-8">
        <SystemHealthPanel data={data.systemHealth} />
        <ActionItemsPanel data={data.actionItems || []} />
      </div>

      {/* Row 3: Libraries Table */}
      <RecentLibrariesTable data={data.recentLibraries || []} />

      {/* Row 4: Recent Platform Activity */}
      <div className="sa-card overflow-hidden mt-8">
        <div className="p-6 flex items-center justify-between border-b border-border">
          <h2 className="text-base font-bold text-primary flex items-center gap-2">
            <Clock size={16} className="sa-metric--primary" /> Recent Platform Activity
          </h2>
          <Link href="/superadmin/superadmin_audit-logs" className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
            View All Logs
          </Link>
        </div>
        <div>
          {RECENT_ACTIVITY.map((item, i) => (
            <Link key={i} href={item.href} className="sa-recent-activity-row block">
              <div className="flex items-center gap-4">
                <div className={`sa-recent-activity-dot ${item.dotCls}`} />
                <div className="flex-1 min-w-0">
                  <p className="sa-recent-activity-title">{item.title}</p>
                  <p className="sa-recent-activity-desc">{item.desc}</p>
                </div>
                <span className="sa-recent-activity-time">{item.time}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
