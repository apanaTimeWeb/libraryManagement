import { z } from 'zod';

// ─── Add Enquiry ──────────────────────────────────────────────────────────────
export const addEnquirySchema = z.object({
  name: z
    .string()
    .min(2, 'Full name must be at least 2 characters'),
  phone: z
    .string()
    .min(10, 'Phone number is required')
    .regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  preferredShift: z.string().optional(),
  source: z.string().optional(),
  handledBy: z.string().optional(),
  notes: z.string().optional(),
});
export type AddEnquiryFormData = z.infer<typeof addEnquirySchema>;

// ─── Follow-Up ────────────────────────────────────────────────────────────────
export const followUpSchema = z.object({
  date: z
    .string()
    .min(1, 'Follow-up date is required'),
  remark: z
    .string()
    .min(3, 'Remark must be at least 3 characters'),
});
export type FollowUpFormData = z.infer<typeof followUpSchema>;

// ─── Update Status ────────────────────────────────────────────────────────────
export const updateStatusSchema = z.object({
  status: z.enum(['New', 'Visited', 'Interested', 'Converted', 'Lost'], {
    error: 'Please select a valid status',
  }),
});
export type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;

// ─── Mark as Lost ─────────────────────────────────────────────────────────────
export const markLostSchema = z.object({
  reason: z.string().optional(),
});
export type MarkLostFormData = z.infer<typeof markLostSchema>;
