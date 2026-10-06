'use client';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/app/superadmin/superadmin_system/reusable/utils';

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cn('sys-tabs-list', className)} {...props} />;
}

export function TabsTrigger({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return <TabsPrimitive.Trigger className={cn('sys-tabs-trigger', className)} {...props} />;
}

export function TabsContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('sys-tabs-content', className)} {...props} />;
}
