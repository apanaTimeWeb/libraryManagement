'use client';

// RESPONSIBILITY: Renders the Next.js native error boundary for the admin_system module.
// DATA FLOW: Next.js Router -> error.tsx

import { useEffect } from 'react';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
      <h2 className="text-xl font-semibold text-destructive">Something went wrong in admin_system!</h2>
      <button onClick={() => reset()} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
        Try again
      </button>
    </div>
  );
}
