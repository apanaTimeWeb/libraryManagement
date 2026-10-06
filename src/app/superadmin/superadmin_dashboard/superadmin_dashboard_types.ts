export interface DashboardKpiCard {
  title: string;
  value: string;
  icon: string;
  subtitle?: string;
  trend?: string;
  progress?: number;
  alert?: string;
}

export interface DashboardSystemHealth {
  uptime: string;
  activeUsers: number;
  apiLatency: string;
  lastBackup: string;
}

export interface DashboardActionItem {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'error' | 'info';
  icon: string;
  actionLabel: string;
  actionUrl: string;
}

export interface RecentLibrary {
  initials: string;
  name: string;
  owner: string;
  students: number;
  status: 'active' | 'setup' | 'inactive';
  plan: string;
  joinedAt: string;
}

export interface DashboardDataResponse {
  kpiCards: DashboardKpiCard[];
  systemHealth: DashboardSystemHealth;
  actionItems: DashboardActionItem[];
  recentLibraries: RecentLibrary[];
}
