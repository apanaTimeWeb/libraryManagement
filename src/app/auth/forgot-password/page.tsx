'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Send } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/app/auth/reusable/schema';
import hardcoded from '@/app/auth/hardcoded.json';

export default function ForgotPasswordPage() {
  const [sent, setSent]   = useState(false);
  const [sentTo, setSentTo] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { identity: hardcoded.forgotPassword.identity },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await new Promise(res => setTimeout(res, 1100));
    setSentTo(data.identity);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center p-4 sm:p-6 pt-10 sm:pt-6 bg-[var(--bg-page)] text-[var(--text-primary)] overflow-y-auto">
      <div className="auth-glow-tr" />

      <div className="w-full max-w-[440px] space-y-5 pb-8">
        <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:opacity-80 transition-opacity">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        {/* Logo */}
        <div className="flex justify-center pt-2">
          <div className="flex items-center gap-2.5">
            <div className="auth-logo-box auth-logo-box--sm"><BookOpen size={18} className="text-white" /></div>
            <span className="text-lg font-extrabold text-[var(--text-primary)]">Library OS</span>
          </div>
        </div>

        <div className="auth-card">
          {!sent ? (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Forgot Password? 🔐</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                  Enter your registered phone or email. We&apos;ll send an OTP to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                  <label htmlFor="fp-identity" className="auth-label auth-label--required">Phone or Email</label>
                  <input
                    id="fp-identity"
                    type="text"
                    placeholder="Your registered phone or email"
                    {...register('identity')}
                    className={`auth-input ${errors.identity ? 'auth-input--error' : ''}`}
                  />
                  {errors.identity
                    ? <p className="auth-error">{errors.identity.message}</p>
                    : <p className="auth-helper">An OTP will be sent to your registered mobile number.</p>
                  }
                </div>

                <button
                  id="send-otp-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="auth-btn-primary"
                >
                  {isSubmitting
                    ? <><span className="auth-spinner" /> Sending OTP...</>
                    : <><Send size={15} /> Send OTP</>}
                </button>
              </form>
            </>
          ) : (
            <div className="auth-success-state">
              <div className="auth-success-state__icon">✅</div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">OTP Sent!</h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-2">
                We&apos;ve sent a 6-digit OTP to <strong className="text-[var(--text-primary)]">{sentTo}</strong>. Check your messages.
              </p>
              <Link
                href="/auth/reset-password"
                id="enter-otp-btn"
                className="auth-btn-primary mt-6 inline-flex"
              >
                Enter OTP →
              </Link>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 mt-7 opacity-40">
            <div className="h-px w-6 bg-[var(--border)]" />
            <span className="text-[10px] tracking-[0.12em] uppercase font-bold text-[var(--text-secondary)]">Library OS</span>
            <div className="h-px w-6 bg-[var(--border)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
