'use client';
// RESPONSIBILITY: Renders the Progress component for the admin_system module.
// DATA FLOW: Parent -> AdminSystemProgress -> DOM

import { cn } from '../AdminSystemutils/AdminSystemutils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
}

export function Progress({ value, max = 100, className, barClassName }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn('sys-progress-track', className)}>
      <div
        className={cn('sys-progress-fill', barClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
