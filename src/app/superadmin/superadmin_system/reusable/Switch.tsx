'use client';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/app/superadmin/superadmin_system/reusable/utils';

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function Switch({ checked, onCheckedChange, disabled, id, className }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn('sys-switch', className)}
    >
      <SwitchPrimitive.Thumb className="sys-switch-thumb" />
    </SwitchPrimitive.Root>
  );
}
