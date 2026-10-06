'use client';
import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/superadmin/superadmin_system/reusable/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn('sys-input', className)}
      {...props}
    />
  )
);

Input.displayName = 'Input';
export { Input };
