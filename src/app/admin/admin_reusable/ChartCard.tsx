import { Card } from '@/components/ui/card';

interface ChartCardProps {
  title: string;
  badge?: string;
  /** Dynamic color value — must be a CSS token string like 'var(--success)' */
  badgeColor?: string;
  legend?: { label: string; color: string }[];
  children: React.ReactNode;
}

export default function ChartCard({ title, badge, badgeColor, legend, children }: ChartCardProps) {
  return (
    <Card className="border-[var(--border)] bg-[var(--bg-card)] shadow-none p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-base text-[var(--text-primary)]">{title}</h3>
        <div className="flex items-center gap-4">
          {legend?.map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              {/* l.color is dynamic (from data array, should be CSS var string) → style={{}} allowed */}
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
              <span className="text-xs font-medium text-muted-foreground">{l.label}</span>
            </div>
          ))}
          {badge && (
            /* badgeColor is dynamic prop → style={{}} allowed */
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-muted" style={{ color: badgeColor }}>
              {badge}
            </span>
          )}
        </div>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </Card>
  );
}
