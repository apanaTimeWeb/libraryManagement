'use client';
import { useEffect } from 'react';
import '@/app/superadmin/superadmin_system/system.css';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[App Error]', error);
  }, [error]);

  return (
    <div className="system-theme min-h-screen flex text-center items-center justify-center p-8">
      <div className="text-center max-w-[480px] w-full mx-auto relative">

        {/* Giant 500 */}
        <div className="text-[clamp(80px,20vw,140px)] font-extrabold leading-none tracking-tight mb-2 bg-gradient-to-br from-error to-[#FF6B6B] bg-clip-text text-transparent">
          500
        </div>

        {/* Icon illustration */}
        <div className="w-24 h-24 rounded-3xl mx-auto mb-6 bg-error-container/20 border border-error/20 flex items-center justify-center text-5xl">
          ⚡
        </div>

        <h1 className="text-[26px] font-bold text-on-surface m-0 mb-3 tracking-tight">
          Server Error
        </h1>

        <p className="text-[15px] text-on-surface-variant leading-relaxed m-0 mb-8">
          Something went wrong on our end. Our team has been notified and will fix this shortly.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            id="error-retry-btn"
            className="sys-btn-primary"
            onClick={reset}
          >
            🔄 Retry
          </button>
          <button
            id="error-contact-btn"
            className="sys-btn-ghost"
            onClick={() => window.location.href = 'mailto:support@smartlibrary360.com'}
          >
            📧 Contact Support
          </button>
        </div>

        {/* Error detail (collapsed, dev-friendly) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 p-3 px-4 rounded-xl bg-error/10 border border-error/20 text-left">
            <summary className="cursor-pointer text-xs text-error font-semibold">
              Dev: Error Details
            </summary>
            <pre className="text-[11px] text-on-surface-variant mt-2 overflow-auto whitespace-pre-wrap">
              {error?.message}
            </pre>
          </details>
        )}

        {/* Decorative glow */}
        <div className="sys-offline-glow !bg-error" />
      </div>
    </div>
  );
}
