'use client';
// RESPONSIBILITY: Renders the Textarea component for the admin_system module.
// DATA FLOW: Parent -> AdminSystemTextarea -> DOM

import { type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../AdminSystemutils/AdminSystemutils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn('sys-textarea', className)} {...props} />
  )
);

Textarea.displayName = 'Textarea';
export { Textarea };
