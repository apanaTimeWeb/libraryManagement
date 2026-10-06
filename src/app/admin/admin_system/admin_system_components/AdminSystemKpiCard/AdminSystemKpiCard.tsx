// RESPONSIBILITY: Renders the KpiCard component for the admin_system module.
// DATA FLOW: Parent -> AdminSystemKpiCard -> DOM

import { cn } from '../AdminSystemutils/AdminSystemutils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  className?: string;
}

export function KpiCard({ title, value, subtitle, icon, trend, trendLabel, className }: KpiCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendCls  = trend === 'up' ? 'sys-kpi-card__trend--up' : trend === 'down' ? 'sys-kpi-card__trend--down' : '';

  return (
    <div className={cn('sys-kpi-card', className)}>
      <div className="flex items-center justify-between">
        <span className="sys-kpi-card__label">{title}</span>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="sys-kpi-card__value">{value}</div>
      {(subtitle || trend) && (
        <div className="flex items-center gap-2">
          {trend && <TrendIcon size={14} className={cn('sys-kpi-card__trend', trendCls)} />}
          {trendLabel && <span className={cn('sys-kpi-card__trend', trendCls)}>{trendLabel}</span>}
          {subtitle && <span className="sys-kpi-card__subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
