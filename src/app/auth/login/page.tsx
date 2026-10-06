'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Link from 'next/link';
import {
  Eye, EyeOff, BookOpen, CheckCircle, Lock,
  Shield, Zap, Users, BarChart3, Sparkles,
} from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/app/auth/reusable/schema';
import hardcoded from '@/app/auth/hardcoded.json';

const ROLES = hardcoded.roles;

const ROLE_DEST_LABEL: Record<string, string> = {
  superadmin: 'Setup Library Profile',
  admin: 'Branch Dashboard',
  manager: 'Daily Ops & Members',
};

function getRedirectUrl(role: typeof ROLES[0]): string {
  if (role.id === 'superadmin' && !role.setupComplete) return '/superadmin/superadmin_setup-wizard';
  return role.redirectTo;
}

const LOGIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; }

  .login-bg {
    background: #030712;
    font-family: 'Inter', sans-serif;
  }

  .dot-grid {
    background-image: radial-gradient(rgba(99,102,241,0.12) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  .aurora-orb-1 {
    position: absolute;
    width: 700px; height: 700px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
    animation: orb-float 14s ease-in-out infinite alternate;
  }
  .aurora-orb-2 {
    position: absolute;
    width: 500px; height: 500px;
    background: radial-gradient(ellipse, rgba(139,92,246,0.14) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
    animation: orb-float 18s ease-in-out infinite alternate-reverse;
  }
  .aurora-orb-3 {
    position: absolute;
    width: 400px; height: 400px;
    background: radial-gradient(ellipse, rgba(34,211,238,0.08) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
    animation: orb-float 10s ease-in-out infinite alternate;
  }

  @keyframes orb-float {
    0% { transform: translate(0,0) scale(1); }
    100% { transform: translate(50px, 30px) scale(1.08); }
  }

  .glass-login {
    background: rgba(8,8,22,0.75);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    border: 1px solid rgba(99,102,241,0.2);
    box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(99,102,241,0.08);
  }

  .glass-left {
    background: rgba(5,5,18,0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-right: 1px solid rgba(99,102,241,0.1);
  }

  .gradient-text {
    background: linear-gradient(135deg, #a78bfa 0%, #6366f1 40%, #22d3ee 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .shimmer-btn {
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #22d3ee, #6366f1);
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
  }

  .glow-indigo {
    box-shadow: 0 0 30px rgba(99,102,241,0.5), 0 0 60px rgba(99,102,241,0.15);
  }

  .input-field {
    background: rgba(10,10,28,0.8);
    border: 1px solid rgba(99,102,241,0.2);
    color: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }

  .input-field::placeholder {
    color: rgba(148,163,184,0.5);
  }

  .input-field:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
  }

  .input-error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important;
  }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 50px #0a0a1c inset !important;
    -webkit-text-fill-color: #fff !important;
  }

  .role-tab {
    color: rgba(148,163,184,0.7);
    border: 1px solid transparent;
    transition: all 0.25s ease;
  }

  .role-tab:hover {
    color: #fff;
    background: rgba(99,102,241,0.08);
  }

  .role-tab-active {
    background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2));
    border-color: rgba(99,102,241,0.4) !important;
    color: #fff;
    box-shadow: 0 4px 20px rgba(99,102,241,0.2);
  }

  .feature-pill {
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.2);
    transition: all 0.25s;
  }

  .feature-pill:hover {
    background: rgba(99,102,241,0.15);
    border-color: rgba(99,102,241,0.4);
    transform: translateY(-2px);
  }

  @keyframes float-card {
    0%,100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  .float-card-1 { animation: float-card 6s ease-in-out infinite; }
  .float-card-2 { animation: float-card 8s ease-in-out infinite 1s; }
  .float-card-3 { animation: float-card 7s ease-in-out infinite 2s; }

  .stat-card {
    background: rgba(15,15,35,0.8);
    border: 1px solid rgba(255,255,255,0.06);
    backdrop-filter: blur(12px);
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #030712; }
  ::-webkit-scrollbar-thumb { background: #2d2d5e; border-radius: 10px; }

  @keyframes spin-slow { to { transform: rotate(360deg); } }
  .spin-slow { animation: spin-slow 20s linear infinite; }

  .submit-btn {
    position: relative;
    overflow: hidden;
  }
  .submit-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.5s;
  }
  .submit-btn:hover::before { left: 100%; }
`;

const roleIcons: Record<string, React.ReactNode> = {
  superadmin: <Shield size={16} className="text-violet-400" />,
  admin: <Zap size={16} className="text-cyan-400" />,
  manager: <Users size={16} className="text-emerald-400" />,
};

const roleColors: Record<string, string> = {
  superadmin: 'from-violet-500/20 to-purple-500/10 border-violet-500/30',
  admin: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30',
  manager: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
};

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const { register, handleSubmit, setValue, setError, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    // Auto-fill SuperAdmin credentials by default
    defaultValues: { email: ROLES[0].email, password: ROLES[0].password, role: 'superadmin' },
  });

  const handleRoleSelect = (role: typeof ROLES[0]) => {
    setSelectedRole(role);
    // Auto-fill credentials for the selected role
    setValue('email', role.email, { shouldValidate: false });
    setValue('password', role.password, { shouldValidate: false });
    setValue('role', role.id as LoginFormData['role']);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      // ── Frontend-only mock authentication ──────────────────────────────
      // Find matching role credential from hardcoded list
      const matchedRole = ROLES.find(
        (r) => r.id === data.role && r.email === data.email && r.password === data.password
      );

      if (!matchedRole) {
        throw new Error('Invalid email or password. Please check your credentials.');
      }

      // Simulate a JWT token (mock)
      const mockToken = btoa(JSON.stringify({ role: matchedRole.id, email: data.email, exp: Date.now() + 900000 }));
      const mockUser = { id: `${matchedRole.id}-001`, name: matchedRole.label, email: data.email, role: matchedRole.id, phone: '' };

      // Store in localStorage + cookie (same as real auth flow)
      localStorage.setItem('access_token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      document.cookie = `access_token=${mockToken}; path=/; SameSite=Strict; max-age=900`;

      // Show success popup and delay redirect
      setLoginSuccess(true);
      setTimeout(() => {
        window.location.href = getRedirectUrl(matchedRole);
      }, 1500);
    } catch (err: any) {
      setError('root', { message: err.message || 'Invalid credentials. Please try again.' });
    }
  };

  return (
    <main className="login-bg flex min-h-screen text-white overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: LOGIN_CSS }} />

      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-50" />
      <div className="aurora-orb-1" style={{ top: '-15%', left: '-10%' }} />
      <div className="aurora-orb-2" style={{ bottom: '-10%', right: '-8%' }} />
      <div className="aurora-orb-3" style={{ top: '40%', left: '30%' }} />

      {/* SUCCESS POPUP */}
      {loginSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030712]/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-[#12121d] border border-emerald-500/30 p-8 rounded-3xl shadow-[0_20px_60px_-15px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center gap-2 transform scale-100 transition-transform duration-300">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 border border-emerald-500/20">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-white text-xl font-black tracking-tight">Login Successful</h3>
            <p className="text-slate-400 text-sm font-medium">Redirecting securely...</p>
          </div>
        </div>
      )}

      {/* ── LEFT BRAND PANEL ── */}
      <section className="hidden lg:flex lg:w-[55%] flex-col justify-between p-14 relative z-10 glass-left">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl blur-md opacity-80" />
            <div className="relative w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-2xl font-black tracking-tight">
            Library<span className="gradient-text">OS</span>
          </span>
        </div>

        {/* Center Content */}
        <div className="space-y-10 max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            2,400+ libraries trust LibraryOS
          </div>

          {/* Hero Text */}
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tight leading-[1.08]">
              Welcome back to<br />
              <span className="gradient-text">The Smartest</span><br />
              Library Platform
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Manage books, automate alerts, track attendance — all from one powerful dashboard built for modern Indian libraries.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: <CheckCircle size={13} />, label: 'Smart ID Cards', color: 'text-cyan-400' },
              { icon: <CheckCircle size={13} />, label: 'WhatsApp Automation', color: 'text-emerald-400' },
              { icon: <CheckCircle size={13} />, label: 'QR Checkouts', color: 'text-violet-400' },
              { icon: <CheckCircle size={13} />, label: 'Multi-Branch', color: 'text-amber-400' },
              { icon: <CheckCircle size={13} />, label: 'Real-time Analytics', color: 'text-rose-400' },
            ].map((f) => (
              <div key={f.label} className={`feature-pill flex items-center gap-2 px-4 py-2 rounded-xl cursor-default`}>
                <span className={f.color}>{f.icon}</span>
                <span className="text-xs font-semibold text-slate-300">{f.label}</span>
              </div>
            ))}
          </div>

          {/* Floating Stat Cards */}
          <div className="relative h-36">
            <div className="stat-card rounded-2xl p-4 absolute left-0 top-0 float-card-1 w-52">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <BookOpen size={16} className="text-cyan-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Books Managed</div>
                  <div className="text-xl font-black text-white">18L+</div>
                </div>
              </div>
            </div>
            <div className="stat-card rounded-2xl p-4 absolute left-56 top-4 float-card-2 w-52">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Users size={16} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Active Members</div>
                  <div className="text-xl font-black text-white">5L+</div>
                </div>
              </div>
            </div>
            <div className="stat-card rounded-2xl p-4 absolute left-24 top-16 float-card-3 w-52">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <BarChart3 size={16} className="text-violet-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Daily Transactions</div>
                  <div className="text-xl font-black text-white">12K+</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} LibraryOS. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </section>

      {/* ── RIGHT AUTH PANEL ── */}
      <section className="w-full lg:w-[45%] flex items-center justify-center p-6 md:p-10 relative z-10">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center items-center gap-3 mb-10">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl blur-md opacity-70" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight">Library<span className="gradient-text">OS</span></span>
          </div>

          <div className="glass-login rounded-3xl p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 mb-5">
                <Lock size={24} className="text-indigo-400" />
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Welcome Back</h2>
              <p className="text-slate-400 text-sm">Select your role and sign in to continue</p>
            </div>

            {/* Role Selector */}
            <div className="grid grid-cols-3 gap-2 mb-7 p-1.5 rounded-2xl" style={{ background: 'rgba(10,10,25,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
              {ROLES.map((role) => {
                const isActive = selectedRole.id === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    id={`role-btn-${role.id}`}
                    onClick={() => handleRoleSelect(role)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1.5 role-tab ${isActive ? 'role-tab-active' : ''}`}
                  >
                    <span>{roleIcons[role.id]}</span>
                    <span>{role.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Role Info Banner */}
            <div className={`bg-gradient-to-r ${roleColors[selectedRole.id]} border rounded-xl p-3 flex items-center gap-3 mb-6`}>
              <span className="text-lg">{selectedRole.icon}</span>
              <div>
                <div className="text-xs font-black text-white">{selectedRole.label} Portal</div>
                <div className="text-[11px] text-slate-400">Will redirect to: {ROLE_DEST_LABEL[selectedRole.id]}</div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <input type="hidden" {...register('role')} />

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Email Address</label>
                <input
                  id="login-email"
                  type="text"
                  placeholder="Enter your email"
                  {...register('email')}
                  className={`input-field w-full rounded-xl px-4 py-3.5 text-sm ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && <p className="text-rose-400 text-xs font-medium mt-1 flex items-center gap-1"><span>⚠</span>{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password')}
                    className={`input-field w-full rounded-xl px-4 py-3.5 text-sm pr-12 ${errors.password ? 'input-error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-400 text-xs font-medium mt-1 flex items-center gap-1"><span>⚠</span>{errors.password.message}</p>}
              </div>

              {/* Root Error */}
              {errors.root && (
                <div className="bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">⚠️</span>
                  <span>{errors.root.message}</span>
                </div>
              )}

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="submit-btn shimmer-btn glow-indigo w-full text-white font-black text-sm py-4 rounded-xl transition-all active:scale-[0.98] mt-2 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Secure Sign In
                    <Sparkles size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
              <p className="text-sm text-slate-400 text-center">
                New to LibraryOS?{' '}
                <Link href="/auth/signup" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                  Create an account
                </Link>
              </p>
              <p className="text-xs text-slate-500 text-center">
                Protected by enterprise-grade SSL encryption
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 mt-6">
            {[
              { icon: <Shield size={13} />, label: 'SSL Secured' },
              { icon: <Zap size={13} />, label: '99.9% Uptime' },
              { icon: <CheckCircle size={13} />, label: 'GDPR Compliant' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5 text-slate-500 text-xs">
                <span className="text-indigo-400/60">{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
