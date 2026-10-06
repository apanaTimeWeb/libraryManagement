'use client';
// RESPONSIBILITY: Renders the Card component for the admin_system module.
// DATA FLOW: Parent -> AdminSystemCard -> DOM

import { cn } from '../AdminSystemutils/AdminSystemutils';

interface CardProps { children: React.ReactNode; className?: string; }

export function Card({ children, className }: CardProps) {
  return <div className={cn('sys-card', className)}>{children}</div>;
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={cn('sys-card-header', className)}>{children}</div>;
}

export function CardTitle({ children, className }: CardProps) {
  return <h3 className={cn('sys-card-title', className)}>{children}</h3>;
}

export function CardDescription({ children, className }: CardProps) {
  return <p className={cn('sys-card-desc', className)}>{children}</p>;
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn('sys-card-content', className)}>{children}</div>;
}

export function CardFooter({ children, className }: CardProps) {
  return <div className={cn('sys-card-footer', className)}>{children}</div>;
}
