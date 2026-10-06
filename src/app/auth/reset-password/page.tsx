'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, BookOpen } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/app/auth/reusable/schema';
import PasswordStrengthMeter from '@/app/auth/reusable/PasswordStrengthMeter';
import hardcoded from '@/app/auth/hardcoded.json';

const CORRECT_OTP  = hardcoded.resetPassword.otp.join('');
const RESEND_SECS  = 45;

export default function ResetPasswordPage() {
  const [otpDigits, setOtpDigits]   = useState<string[]>(hardcoded.resetPassword.otp);
  const [showPw, setShowPw]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone]             = useState(false);
  const [countdown, setCountdown]   = useState(RESEND_SECS);
  const [canResend, setCanResend]   = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp:             hardcoded.resetPassword.otp.join(''),
      newPassword:     '',
      confirmPassword: '',
    },
  });

  const newPassword     = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleDigitChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpDigits];
    next[idx] = val;
    setOtpDigits(next);
    setValue('otp', next.join(''), { shouldValidate: true });
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleDigitKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) inputRefs.current[idx - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      const digits = text.split('');
      setOtpDigits(digits);
      setValue('otp', text, { shouldValidate: true });
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtpDigits(Array(6).fill(''));
    setValue('otp', '', { shouldValidate: false });
    setCountdown(RESEND_SECS);
    setCanResend(false);
    inputRefs.current[0]?.focus();
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (data.otp !== CORRECT_OTP) {
      setError('otp', { message: 'Invalid OTP. Hint: use the hardcoded value.' });
      return;
    }
    await new Promise(res => setTimeout(res, 1200));
    setDone(true);
  };

  const fmt = (n: number) =>
    `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center p-4 sm:p-6 pt-10 sm:pt-6 bg-[var(--bg-page)] text-[var(--text-primary)] overflow-y-auto">
      <div className="auth-glow-bl" />

      <div className="w-full max-w-[480px] space-y-5 pb-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2.5">
            <div className="auth-logo-box auth-logo-box--sm"><BookOpen size={18} className="text-white" /></div>
            <span className="text-lg font-extrabold text-[var(--text-primary)]">Library OS</span>
          </div>
        </div>

        <div className="auth-card">
          {!done ? (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Reset Password 🔑</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Enter the OTP sent to your phone and choose a new password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {/* OTP Boxes */}
                <div>
                  <label className="auth-label">Enter OTP sent to your phone</label>
                  <Controller
                    name="otp"
                    control={control}
                    render={() => (
                      <div className="flex gap-1.5 sm:gap-2.5 justify-center" onPaste={handlePaste}>
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-${idx}`}
                            ref={el => { inputRefs.current[idx] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleDigitChange(idx, e.target.value)}
                            onKeyDown={e => handleDigitKeyDown(idx, e)}
                            className={`auth-otp-box ${digit ? 'auth-otp-box--filled' : ''} ${errors.otp ? 'auth-otp-box--error' : ''}`}
                          />
                        ))}
                      </div>
                    )}
                  />
                  {errors.otp && <p className="auth-error text-center mt-2">{errors.otp.message}</p>}

                  {/* Resend */}
                  <div className="text-center mt-3">
                    {canResend ? (
                      <button type="button" id="resend-otp-btn" onClick={handleResend} className="auth-btn-ghost text-sm">
                        Resend OTP
                      </button>
                    ) : (
                      <p className="text-sm text-[var(--text-secondary)]">
                        Resend in <span className="font-bold text-[var(--text-primary)] tabular-nums">{fmt(countdown)}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="rp-new" className="auth-label auth-label--required">New Password</label>
                  <div className="relative">
                    <input
                      id="rp-new"
                      type={showPw ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      {...register('newPassword')}
                      className={`auth-input pr-12 ${errors.newPassword ? 'auth-input--error' : ''}`}
                    />
                    <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(s => !s)}>
                      {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {errors.newPassword && <p className="auth-error">{errors.newPassword.message}</p>}
                  <PasswordStrengthMeter password={newPassword} />
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="rp-confirm" className="auth-label auth-label--required">Confirm Password</label>
                  <div className="relative">
                    <input
                      id="rp-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat new password"
                      {...register('confirmPassword')}
                      className={`auth-input pr-12 ${errors.confirmPassword ? 'auth-input--error' : ''} ${
                        confirmPassword && confirmPassword === newPassword && !errors.confirmPassword ? 'auth-input--success' : ''
                      }`}
                    />
                    <button type="button" className="auth-pw-toggle" onClick={() => setShowConfirm(s => !s)}>
                      {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="auth-error">{errors.confirmPassword.message}</p>}
                </div>

                {errors.root && <div className="auth-error-banner">❌ {errors.root.message}</div>}

                <button
                  id="update-password-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="auth-btn-primary"
                >
                  {isSubmitting
                    ? <><span className="auth-spinner" /> Updating...</>
                    : '🔐 Update Password'}
                </button>

                <div className="text-center">
                  <Link href="/auth/login" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    ← Back to Login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="auth-success-state">
              <div className="auth-success-state__icon">🎉</div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Password Updated!</h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-2">
                Your password has been successfully reset. You can now login with your new credentials.
              </p>
              <Link href="/auth/login" id="go-to-login-btn" className="auth-btn-primary mt-6 inline-flex">
                Go to Login →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
