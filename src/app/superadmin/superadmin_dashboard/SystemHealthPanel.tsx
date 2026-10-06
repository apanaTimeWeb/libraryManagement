import Link from 'next/link';
import { CheckCircle, Users, Zap, HardDrive, ExternalLink } from 'lucide-react';

import type { DashboardSystemHealth as SystemHealth } from '@/app/superadmin/superadmin_dashboard/superadmin_dashboard_types';

interface Props { data: SystemHealth; }

// Map each metric key to its CSS colour class — no inline style needed
const METRICS = [
  { key: 'uptime',      label: 'System Uptime',   icon: CheckCircle, colorCls: 'sa-metric--success' },
  { key: 'activeUsers', label: 'Active Users Now', icon: Users,       colorCls: 'sa-metric--primary' },
  { key: 'apiLatency',  label: 'API Latency',      icon: Zap,         colorCls: 'sa-metric--info' },
  { key: 'lastBackup',  label: 'Last Backup',      icon: HardDrive,   colorCls: 'sa-metric--muted' },
] as const;

export default function SystemHealthPanel({ data }: Props) {
  return (
    <div className="col-span-12 lg:col-span-7 sa-card flex flex-col overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-base font-bold text-primary">System Health</h2>
      </div>

      <div className="p-6 grid grid-cols-2 gap-4">
        {METRICS.map(({ key, label, icon: Icon, colorCls }) => (
          <div key={key} className="sa-health-metric-card">
            <div className="sa-health-metric-header">
              <Icon size={16} className={colorCls} />
              <span className="sa-health-metric-label">{label}</span>
            </div>
            <span className={`sa-health-metric-value ${colorCls}`}>
              {data[key as keyof SystemHealth]}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto p-6 border-t border-border">
        <Link href="/superadmin/superadmin_system-health" className="sa-panel-view-all">
          <ExternalLink size={13} /> View Full System Report
        </Link>
      </div>
    </div>
  );
}
