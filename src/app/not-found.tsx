'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Silently redirect to homepage instead of showing 404
    router.replace('/');
  }, [router]);

  // Show nothing while redirecting
  return (
    <div className="min-h-screen bg-[#030712]" />
  );
}
