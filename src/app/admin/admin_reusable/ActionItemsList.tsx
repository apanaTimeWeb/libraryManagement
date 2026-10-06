import Link from 'next/link';
import { ChevronRight, type LucideIcon } from 'lucide-react';

export interface ActionItem {
  icon: LucideIcon;
  label: string;
  count: number;
  type: 'danger' | 'warning';
  href: string;
}

export default function ActionItemsList({ items }: { items: ActionItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const Icon = item.icon;
        const isDanger = item.type === 'danger';
        return (
          <Link
            key={i}
            href={item.href}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              isDanger 
                ? 'bg-red-50/50 border-red-100 hover:bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 dark:hover:bg-red-950/40' 
                : 'bg-orange-50/50 border-orange-100 hover:bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900/30 dark:hover:bg-orange-950/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon
                size={16}
                className={isDanger ? 'text-red-500 dark:text-red-400' : 'text-orange-500 dark:text-orange-400'}
              />
              <span className="text-sm font-medium text-[var(--text-primary)]">
                <span className={`font-bold mr-1 ${isDanger ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {item.count}
                </span>{' '}
                {item.label}
              </span>
            </div>
            <ChevronRight size={14} className="text-muted-foreground" />
          </Link>
        );
      })}
    </div>
  );
}
