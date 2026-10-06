'use client';
import { type LabelHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/superadmin/superadmin_system/reusable/utils';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn('sys-label', className)} {...props} />
  )
);

Label.displayName = 'Label';
export { Label };
