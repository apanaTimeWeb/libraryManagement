import { z } from 'zod';

// ─── Step 1: Branch Details ────────────────────────────────────────────────────
export const branchDetailsSchema = z.object({
  name:    z.string().min(2, 'Library name is required'),
  address: z.string().min(5, 'Full address is required'),
  city:    z.string().min(2, 'City is required'),
  gst:     z.string().optional(),
});
export type BranchDetailsData = z.infer<typeof branchDetailsSchema>;

// ─── Step 2: Define Shifts ─────────────────────────────────────────────────────
export const shiftSchema = z.object({
  name:  z.string().min(1, 'Shift name is required'),
  start: z.string().min(1, 'Start time required'),
  end:   z.string().min(1, 'End time required'),
});
export const shiftsSchema = z.object({
  shifts: z.array(shiftSchema).min(1, 'At least one shift is required'),
});
export type ShiftsData = z.infer<typeof shiftsSchema>;

// ─── Step 3: Add Seats ────────────────────────────────────────────────────────
export const seatsSchema = z.object({
  count:  z.number().min(1, 'At least 1 seat required').max(9999),
  prefix: z.string().max(3, 'Max 3 characters').min(1, 'Prefix required'),
});
export type SeatsData = z.infer<typeof seatsSchema>;

// ─── Step 4: Fee Plans ────────────────────────────────────────────────────────
export const planSchema = z.object({
  name:  z.string().min(1, 'Plan name required'),
  days:  z.number().min(1, 'Minimum 1 day'),
  price: z.number().min(0, 'Price cannot be negative'),
});
export const plansSchema = z.object({
  plans: z.array(planSchema).min(1, 'At least one plan required'),
});
export type PlansData = z.infer<typeof plansSchema>;
