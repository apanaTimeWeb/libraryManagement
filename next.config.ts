import type { NextConfig } from "next";

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // NOTE: 'standalone' is for Docker only — Vercel handles its own output mode.
  // Remove or comment this line when deploying to Vercel.
  // output: 'standalone',

  // ── Vercel / Production: Proxy API calls to backend ─────────────────────────
  // This allows frontend to call /api/v1/* which gets forwarded to the backend.
  // Set NEXT_PUBLIC_API_URL in Vercel env vars to your backend URL.
  async rewrites() {
    const backendUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';
    // Strip trailing slash
    const base = backendUrl.replace(/\/$/, '');
    return [
      {
        source: '/api/v1/:path*',
        destination: `${base}/api/v1/:path*`,
      },
    ];
  },

  // ── Security Headers ────────────────────────────────────────────────────────
  async headers() {
    return [
      // Apply to all pages
      {
        source: '/:path*',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options',        value: 'DENY' },
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Control referrer information
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          // Restrict browser features
          { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          // XSS protection (legacy browsers)
          { key: 'X-XSS-Protection',       value: '1; mode=block' },
        ],
      },
      // Protected dashboard routes — NEVER cache
      {
        source: '/(superadmin|admin|manager|system|finance|accounting|crm|communication|engagement|seats_shifts_lockers)/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma',        value: 'no-cache' },
          { key: 'Expires',       value: '0' },
          { key: 'Surrogate-Control', value: 'no-store' },
        ],
      },
      // Auth pages — don't cache either
      {
        source: '/auth/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },
};

export default nextConfig;
