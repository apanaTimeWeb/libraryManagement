'use client';
// RESPONSIBILITY: Entry page for the admin_system module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const FEATURES = [
  { available: true,  text: 'Mark attendance (syncs when online)' },
  { available: true,  text: 'View student basic info (cached)' },
  { available: true,  text: 'View seat matrix (read-only)' },
  { available: false, text: 'Financial transactions require internet' },
  { available: false, text: 'WhatsApp messages require internet' },
  { available: false, text: 'Fee collection requires internet' },
];

export default function OfflinePage() {
  const [dots, setDots]         = useState('');
  const [online, setOnline]     = useState(false);
  const [checking, setChecking] = useState(false);

  /* Animated dots */
  useEffect(() => {
    const t = setInterval(() => setDots(d => (d.length >= 3 ? '' : d + '.')), 500);
    return () => clearInterval(t);
  }, []);

  /* Watch real connectivity */
  useEffect(() => {
    const onOnline  = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online',  onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  /* Auto-redirect when connection is restored */
  useEffect(() => {
    if (!online) return;
    const t = setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
    return () => clearTimeout(t);
  }, [online]);

  const handleRetry = () => {
    setChecking(true);
    setTimeout(() => {
      if (navigator.onLine) setOnline(true);
      else setChecking(false);
    }, 1200);
  };

  return (
    /* This page intentionally skips the app shell (no sidebar/header) — PWA offline fallback */
    <div className="sys-offline-page">
      {/* Ambient glow */}
      <div className="sys-offline-glow" />

      <div className="w-full max-w-[420px] flex flex-col items-center gap-0">

        {/* Icon */}
        <div className="sys-offline-icon-box">
          {online
            ? <CheckCircle size={52} className="text-success" />
            : <WifiOff     size={52} className="text-primary" />}
        </div>

        {/* Heading */}
        <h1 className={`sys-offline-title ${online ? 'sys-offline-title--online' : ''}`}>
          {online ? 'Back Online! 🎉' : "You're Offline"}
        </h1>

        {/* Subtitle */}
        <p className="sys-offline-subtitle">
          {online
            ? "Great news! You're reconnected. Redirecting to Dashboard..."
            : "No internet connection detected. Don't worry — your basic features still work:"}
        </p>

        {/* Feature list */}
        {!online && (
          <div className="sys-offline-feature-list">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`sys-offline-feature-item ${
                  f.available ? 'sys-offline-feature-item--available' : 'sys-offline-feature-item--unavailable'
                }`}
              >
                {f.available
                  ? <CheckCircle size={16} className="text-success shrink-0" />
                  : <XCircle    size={16} className="text-error shrink-0" />}
                {f.text}
              </div>
            ))}
          </div>
        )}

        {/* Waiting / Retry section */}
        {!online && (
          <div className="flex flex-col items-center gap-4 mt-6 w-full">
            {/* Pulsing status badge */}
            <div className="sys-offline-status-badge">
              <span className={`sys-offline-dot ${checking ? 'sys-offline-dot--checking' : ''}`} />
              {checking ? 'Checking connection...' : `Waiting for connection${dots}`}
            </div>

            {/* Retry button */}
            <button
              id="retry-connection-btn"
              onClick={handleRetry}
              disabled={checking}
              className="sys-offline-retry-btn"
            >
              <RefreshCw
                size={16}
                className={checking ? 'animate-spin' : ''}
              />
              {checking ? 'Checking...' : 'Retry Connection'}
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="sys-offline-footer">
          Library OS · Works offline with limited functionality
        </p>
      </div>
    </div>
  );
}
