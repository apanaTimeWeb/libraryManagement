'use client';
// RESPONSIBILITY: Renders the Switch component for the admin_system module.
// DATA FLOW: Parent -> AdminSystemSwitch -> DOM

import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '../AdminSystemutils/AdminSystemutils';

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
