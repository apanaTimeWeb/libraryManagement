'use client';

// RESPONSIBILITY: Renders the Next.js native loading skeleton for the admin_branches module.
// DATA FLOW: Next.js Router -> loading.tsx

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="animate-pulse space-y-4 w-full max-w-3xl">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="h-64 bg-muted rounded w-full"></div>
      </div>
    </div>
  );
}
