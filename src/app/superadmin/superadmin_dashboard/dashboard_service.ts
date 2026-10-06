import type { DashboardDataResponse } from '@/app/superadmin/superadmin_dashboard/superadmin_dashboard_types';

// ── Frontend-only Mock Data (no backend required) ────────────────────────────
const MOCK_DASHBOARD_DATA: DashboardDataResponse = {
  kpiCards: [
    {
      title: 'Total Libraries',
      value: '2,418',
      icon: '🏛️',
      subtitle: '+12 this month',
      trend: '+0.5%',
      progress: 72,
    },
    {
      title: 'Active Members',
      value: '5,12,340',
      icon: '👥',
      subtitle: '+1,240 this week',
      trend: '+2.4%',
      progress: 85,
    },
    {
      title: 'Monthly Revenue',
      value: '₹43.8L',
      icon: '💰',
      subtitle: '₹38.2L last month',
      trend: '+14.7%',
      progress: 91,
    },
    {
      title: 'Open Tickets',
      value: '7',
      icon: '🎫',
      subtitle: '3 critical',
      alert: 'Needs attention',
      progress: 30,
    },
  ],
  systemHealth: {
    uptime: '99.97%',
    activeUsers: 3241,
    apiLatency: '82ms',
    lastBackup: '2 hours ago',
  },
  actionItems: [
    {
      id: 'ai-1',
      title: 'Subscription Renewal Pending',
      description: 'Scholar Spaces — ₹999 overdue for 3 days',
      type: 'warning',
      icon: '⚠️',
      actionLabel: 'Review',
      actionUrl: '/superadmin/superadmin_subscriptions',
    },
    {
      id: 'ai-2',
      title: 'Critical Support Ticket',
      description: 'TKT-991 — Payment gateway failing for 2 libraries',
      type: 'error',
      icon: '🔴',
      actionLabel: 'Resolve',
      actionUrl: '/superadmin/superadmin_support-tickets',
    },
    {
      id: 'ai-3',
      title: 'New Library Onboarding',
      description: 'StudyNest Patna — Setup wizard pending',
      type: 'info',
      icon: '🔵',
      actionLabel: 'Guide',
      actionUrl: '/superadmin/superadmin_libraries',
    },
  ],
  recentLibraries: [
    {
      initials: 'SN',
      name: 'StudyNest Patna',
      owner: 'Rahul Verma',
      students: 0,
      status: 'setup',
      plan: 'Pro',
      joinedAt: '2 hours ago',
    },
    {
      initials: 'AL',
      name: 'The Alexandria Modern',
      owner: 'Anita Joshi',
      students: 1240,
      status: 'active',
      plan: 'Enterprise',
      joinedAt: '3 days ago',
    },
    {
      initials: 'SS',
      name: 'Scholar Spaces',
      owner: 'Ramesh Gupta',
      students: 890,
      status: 'inactive',
      plan: 'Starter',
      joinedAt: '1 week ago',
    },
    {
      initials: 'GK',
      name: 'Gyan Kendra Pune',
      owner: 'Priya Shah',
      students: 560,
      status: 'active',
      plan: 'Pro',
      joinedAt: '2 weeks ago',
    },
    {
      initials: 'CR',
      name: 'City Reading Hub',
      owner: 'Suresh Mehta',
      students: 2100,
      status: 'active',
      plan: 'Enterprise',
      joinedAt: '1 month ago',
    },
  ],
};

export async function fetchDashboardData(): Promise<DashboardDataResponse | null> {
  // Frontend-only mode: return mock data directly
  return MOCK_DASHBOARD_DATA;
}
