'use client';
// RESPONSIBILITY: Renders the Input component for the admin_system module.
// DATA FLOW: Parent -> AdminSystemInput -> DOM

import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../AdminSystemutils/AdminSystemutils';

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
