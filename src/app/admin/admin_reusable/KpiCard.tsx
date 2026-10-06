import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: { value: string; up: boolean };
  sub?: string;
}

export default function KpiCard({ label, value, icon: Icon, iconColor, iconBg, trend, sub }: KpiCardProps) {
  return (
    <Card className="border-[var(--border)] bg-[var(--bg-card)] shadow-none flex flex-col justify-between p-5 h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: iconBg }}>
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${trend.up ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'}`}>
            {trend.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend.value}
          </span>
        )}
      </div>

      <div>
        <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{value}</p>
        {sub && <p className="text-[12px] text-muted-foreground mt-1">{sub}</p>}
      </div>
    </Card>
  );
}
