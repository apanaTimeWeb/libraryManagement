import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge Tailwind CSS class names safely.
 * Uses clsx for conditional classes + tailwind-merge to prevent conflicts.
 * Referenced via the `@/lib/utils` path alias (tsconfig: @/* → ./src/*).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
