'use client';
import { type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/superadmin/superadmin_system/reusable/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn('sys-textarea', className)} {...props} />
  )
);

Textarea.displayName = 'Textarea';
export { Textarea };
