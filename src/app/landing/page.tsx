'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// /landing route → silently redirect to homepage
export default function LandingRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#030712]" />
  );
}
