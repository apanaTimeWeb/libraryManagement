export type FetchState = 'idle' | 'loading' | 'success' | 'error';

export interface DashboardKpiData {
  title: string;
  value: string | number;
  trend: string;
  icon: string;
  iconClass: string;
}

export interface DashboardSeatData {
  id: string;
  status: string;
}

export interface DashboardActionItem {
  title: string;
  count: string;
  countClass: string;
  showRenew: boolean;
  href: string;
}

export interface RecentAdmission {
  name: string;
  smartId: string;
  shift: string;
}

export interface RecentEnquiry {
  name: string;
  phone: string;
  status: string;
}

export interface DashboardData {
  kpiData: DashboardKpiData[];
  seatData: DashboardSeatData[];
  actionItems: DashboardActionItem[];
  recentAdmissions: RecentAdmission[];
  recentEnquiries: RecentEnquiry[];
}
