import { TrendingUp, AlertTriangle } from 'lucide-react';
import type { DashboardKpiCard as KpiCardProps } from '@/app/superadmin/superadmin_dashboard/superadmin_dashboard_types';

const ICON_MAP: Record<string, string> = {
  store:           '🏛️',
  groups:          '👥',
  currency_rupee:  '₹',
  pending_actions: '⏳',
};

// Generates a mock SVG path based on title length for variety
const generateSparkline = (title: string) => {
  const seed = title.length;
  return `M0,30 Q${10 + seed},${40 - seed} ${30 + seed},20 T${60 + seed},25 T${100 + seed},10 T140,5`;
};

export default function KpiCard({ title, value, icon, subtitle, trend, progress, alert }: KpiCardProps) {
  const sparklinePath = generateSparkline(title);

  return (
    <div className="sa-kpi-card group relative overflow-hidden">
      {/* Background Sparkline Effect */}
      <svg className="absolute bottom-0 right-0 w-32 h-16 opacity-[0.15] group-hover:opacity-30 transition-opacity duration-500 pointer-events-none" viewBox="0 0 140 40">
        <path d={sparklinePath} fill="none" stroke="url(#sparkGradient)" strokeWidth="3" strokeLinecap="round" />
        <defs>
          <linearGradient id="sparkGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex items-start justify-between relative z-10">
        <p className="sa-label text-gray-300">{title}</p>
        <span className="text-2xl leading-none drop-shadow-lg">{ICON_MAP[icon] ?? '📊'}</span>
      </div>

      <div className="relative z-10 mt-2">
        <p className="sa-kpi-value text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
          {value}
        </p>
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          {trend && (
            <span className="sa-trend-up px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md shadow-sm">
              <TrendingUp size={12} className="text-indigo-400" /> 
              <span className="text-indigo-300 font-bold">{trend}</span>
            </span>
          )}
          {subtitle && <span className="sa-kpi-subtitle font-medium text-gray-400">{subtitle}</span>}
          {alert && (
            <span className="sa-trend-alert bg-amber-500/10 border border-amber-500/20 rounded-md px-2 py-1 shadow-sm">
              <AlertTriangle size={12} className="text-amber-400" /> 
              <span className="text-amber-300 font-bold">{alert}</span>
            </span>
          )}
          {progress !== undefined && (
            <div className="sa-progress-track w-full max-w-[100px] h-1.5 bg-gray-800 rounded-full overflow-hidden mt-1 shadow-inner">
              <div className="sa-progress-fill--primary h-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
