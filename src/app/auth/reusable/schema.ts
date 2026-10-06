import { z } from 'zod';

// ─── Login ────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email or phone is required'),
  password: z
    .string()
    .min(1, 'Password is required'),
  role: z.enum(['superadmin', 'admin', 'manager']),
});
export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Signup ───────────────────────────────────────────────────────────────────
export const signupSchema = z
  .object({
    ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
    libraryName: z.string().min(2, 'Library name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    phone: z
      .string()
      .min(1, 'Phone is required')
      .regex(/^\+91\s?\d{10}$/, 'Must be +91 followed by 10 digits'),
    password: z
      .string()
      .min(8, 'Minimum 8 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[0-9]/, 'Must include a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type SignupFormData = z.infer<typeof signupSchema>;

// ─── Forgot Password ──────────────────────────────────────────────────────────
export const forgotPasswordSchema = z.object({
  identity: z.string().min(1, 'Phone or email is required'),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ─── Reset Password ───────────────────────────────────────────────────────────
export const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .length(6, 'OTP must be exactly 6 digits')
      .regex(/^\d{6}$/, 'OTP must contain only digits'),
    newPassword: z
      .string()
      .min(8, 'Minimum 8 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[0-9]/, 'Must include a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ─── Public Enquiry ──────────────────────────────────────────────────────────
export const enquirySchema = z.object({
  name:    z.string().min(2, 'Full name is required (min 2 characters)'),
  phone:   z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+91\s?\d{10}$/, 'Enter a valid +91 number (e.g. +91 9800000000)'),
  shift:   z.string().min(1, 'Please select a preferred shift'),
  message: z.string().optional(),
});
export type EnquiryFormData = z.infer<typeof enquirySchema>;
