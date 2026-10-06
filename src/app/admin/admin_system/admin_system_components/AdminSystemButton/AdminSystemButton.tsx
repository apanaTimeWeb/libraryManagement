'use client';
// RESPONSIBILITY: Renders the Button component for the admin_system module.
// DATA FLOW: Parent -> AdminSystemButton -> DOM

import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../AdminSystemutils/AdminSystemutils';

const VARIANT: Record<string, string> = {
  primary:     'sys-btn-primary',
  ghost:       'sys-btn-ghost',
  destructive: 'sys-btn-danger',
  secondary:   'sys-btn-ghost',
  link:        'sys-btn-link',
};

const SIZE: Record<string, string> = {
  sm:   'sys-btn--sm',
  md:   '',
  lg:   'sys-btn--lg',
  icon: 'sys-btn--icon',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(VARIANT[variant], SIZE[size], className)}
      {...props}
    />
  )
);

Button.displayName = 'Button';
export { Button };
