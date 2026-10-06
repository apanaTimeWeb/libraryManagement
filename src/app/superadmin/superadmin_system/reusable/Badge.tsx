'use client';
import { cn } from '@/app/superadmin/superadmin_system/reusable/utils';

const VARIANT_CLASS: Record<string, string> = {
  default:  'sys-badge--outline',
  primary:  'sys-badge--primary',
  success:  'sys-badge--success',
  warning:  'sys-badge--warning',
  danger:   'sys-badge--danger',
  info:     'sys-badge--info',
  outline:  'sys-badge--outline',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof VARIANT_CLASS;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn('sys-badge', VARIANT_CLASS[variant] ?? 'sys-badge--outline', className)}
      {...props}
    />
  );
}
