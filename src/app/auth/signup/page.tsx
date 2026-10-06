'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, BookOpen, CheckCircle } from 'lucide-react';
import { signupSchema, type SignupFormData } from '@/app/auth/reusable/schema';
import PasswordStrengthMeter from '@/app/auth/reusable/PasswordStrengthMeter';
import hardcoded from '@/app/auth/hardcoded.json';

const d = hardcoded.signup;

export default function SignupPage() {
  const [shows, setShows] = useState({ pw: false, confirm: false });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      ownerName:       d.ownerName,
      libraryName:     d.libraryName,
      email:           d.email,
      phone:           d.phone,
      password:        '',
      confirmPassword: '',
    },
  });

  const password        = watch('password');
  const confirmPassword = watch('confirmPassword');

  const onSubmit = async (_: SignupFormData) => {
    await new Promise(res => setTimeout(res, 1200));
    window.location.href = '/superadmin/superadmin_setup-wizard';
  };

  return (
    <main className="flex min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <div className="auth-glow-tr" />
      <div className="auth-glow-bl" />

      {/* ── LEFT BRAND PANEL ── */}
      <section className="hidden lg:flex lg:w-1/2 flex-col justify-between p-8 xl:p-12 auth-brand-panel">
        <div className="relative z-10 flex items-center gap-3">
          <div className="auth-logo-box">
            <BookOpen size={22} className="text-white" />
          </div>
          <span className="text-xl font-extrabold text-[var(--text-primary)]">Library OS</span>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-[var(--text-primary)]">
              Start your<br />
              <span className="auth-gradient-text">free trial today</span>
            </h1>
            <p className="mt-4 text-[var(--text-secondary)] text-base leading-relaxed max-w-sm">
              Join 12,000+ libraries already running smarter with Library OS.
            </p>
          </div>
          <div className="space-y-3">
            {[
              '30-day free trial, no credit card required',
              'Setup takes less than 5 minutes',
              'Import existing data via Excel',
              'WhatsApp & SMS alerts built-in',
            ].map(f => (
              <div key={f} className="flex items-center gap-2.5">
                <CheckCircle size={15} className="text-[var(--success)] shrink-0" />
                <span className="text-sm text-[var(--text-secondary)]">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-[var(--text-secondary)]">© 2026 Library OS</p>
      </section>

      {/* ── RIGHT PANEL ── */}
      <section className="w-full lg:w-1/2 flex items-start lg:items-center justify-center p-4 sm:p-8 md:p-10 overflow-y-auto min-h-screen lg:min-h-0 bg-[var(--bg-page)]">
        <div className="w-full max-w-[520px] py-8 lg:py-0">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2.5">
              <div className="auth-logo-box auth-logo-box--sm"><BookOpen size={18} className="text-white" /></div>
              <span className="text-lg font-extrabold text-[var(--text-primary)]">Library OS</span>
            </div>
          </div>

          <div className="auth-card">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Create Library Account</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Enter your details to start your 30-day free trial.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {/* Owner Name */}
              <div>
                <label htmlFor="su-name" className="auth-label auth-label--required">Owner Name</label>
                <input id="su-name" type="text" placeholder="Your full name" {...register('ownerName')}
                  className={`auth-input ${errors.ownerName ? 'auth-input--error' : ''}`} />
                {errors.ownerName && <p className="auth-error">{errors.ownerName.message}</p>}
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="su-email" className="auth-label auth-label--required">Email</label>
                  <input id="su-email" type="email" placeholder="you@example.com" {...register('email')}
                    className={`auth-input ${errors.email ? 'auth-input--error' : ''}`} />
                  {errors.email && <p className="auth-error">{errors.email.message}</p>}
                </div>
                <div>
                  <label htmlFor="su-phone" className="auth-label auth-label--required">Phone</label>
                  <input id="su-phone" type="tel" placeholder="+91 9800000000" {...register('phone')}
                    className={`auth-input ${errors.phone ? 'auth-input--error' : ''}`} />
                  {errors.phone && <p className="auth-error">{errors.phone.message}</p>}
                </div>
              </div>

              {/* Library Name */}
              <div>
                <label htmlFor="su-lib" className="auth-label auth-label--required">Library Name</label>
                <input id="su-lib" type="text" placeholder="e.g. City Reading Hub" {...register('libraryName')}
                  className={`auth-input ${errors.libraryName ? 'auth-input--error' : ''}`} />
                {errors.libraryName && <p className="auth-error">{errors.libraryName.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="su-pw" className="auth-label auth-label--required">Password</label>
                <div className="relative">
                  <input id="su-pw" type={shows.pw ? 'text' : 'password'} placeholder="Min. 8 characters"
                    {...register('password')}
                    className={`auth-input pr-12 ${errors.password ? 'auth-input--error' : ''}`} />
                  <button type="button" className="auth-pw-toggle" onClick={() => setShows(s => ({ ...s, pw: !s.pw }))}>
                    {shows.pw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <p className="auth-error">{errors.password.message}</p>}
                <PasswordStrengthMeter password={password} />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="su-confirm" className="auth-label auth-label--required">Confirm Password</label>
                <div className="relative">
                  <input
                    id="su-confirm"
                    type={shows.confirm ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    {...register('confirmPassword')}
                    className={`auth-input pr-12 ${errors.confirmPassword ? 'auth-input--error' : ''} ${
                      confirmPassword && confirmPassword === password && !errors.confirmPassword ? 'auth-input--success' : ''
                    }`}
                  />
                  <button type="button" className="auth-pw-toggle" onClick={() => setShows(s => ({ ...s, confirm: !s.confirm }))}>
                    {shows.confirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="auth-error">{errors.confirmPassword.message}</p>}
              </div>

              {errors.root && <div className="auth-error-banner">❌ {errors.root.message}</div>}

              <button id="signup-submit-btn" type="submit" disabled={isSubmitting} className="auth-btn-primary mt-2">
                {isSubmitting ? <><span className="auth-spinner" /> Creating account...</> : 'Create Account →'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-[var(--text-secondary)]">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[var(--primary)] font-semibold hover:underline">Login</Link>
            </p>
          </div>

          <div className="mt-5 flex justify-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Help Center'].map(l => (
              <a key={l} href="#" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
