'use client';
// RESPONSIBILITY: Renders the Label component for the admin_system module.
// DATA FLOW: Parent -> AdminSystemLabel -> DOM

import { type LabelHTMLAttributes, forwardRef } from 'react';
import { cn } from '../AdminSystemutils/AdminSystemutils';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn('sys-label', className)} {...props} />
  )
);

Label.displayName = 'Label';
export { Label };
