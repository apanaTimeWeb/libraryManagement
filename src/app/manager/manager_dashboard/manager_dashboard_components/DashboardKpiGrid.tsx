import { Users, CalendarCheck, Phone, Armchair } from 'lucide-react';
import type { DashboardKpiData } from '../manager_dashboard_types';

// RESPONSIBILITY: Renders the read-only grid of KPI cards. Receives data via props. No API calls.

interface DashboardKpiGridProps {
  kpiData: DashboardKpiData[];
}

const iconMap: Record<string, React.ElementType> = {
  Users, CalendarCheck, Phone, Armchair,
};

export function DashboardKpiGrid({ kpiData }: DashboardKpiGridProps) {
  if (!kpiData || kpiData.length === 0) return null;

  return (
    <div className="mgr-kpi-grid mgr-section-gap">
      {kpiData.map((kpi) => {
        const Icon = iconMap[kpi.icon];
        return (
          <div key={kpi.title} className="mgr-kpi-card">
            <div className="mgr-kpi-top-row">
              <div className={`mgr-kpi-icon ${kpi.iconClass}`}>
                {Icon && <Icon size={18} />}
              </div>
              <span className="mgr-trend-up">{kpi.trend}</span>
            </div>
            <div>
              <p className="mgr-kpi-label">{kpi.title}</p>
              <p className="mgr-kpi-value">{kpi.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
