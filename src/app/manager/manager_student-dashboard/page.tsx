'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentDashboardRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/manager/manager_dashboard'); }, [router]);
  return null;
}
