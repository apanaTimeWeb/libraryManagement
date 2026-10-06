import { useState, useEffect, useCallback } from 'react';
import type { Library } from '@/app/superadmin/superadmin_libraries/superadmin_libraries_types';

export function useLibraries() {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLibraries = useCallback(async () => {
    setLoading(true);
    try {
      const mockData: Library[] = [
        { id: '1', name: 'StudyNest Patna', location: 'Patna, Bihar', branches: 3, students: 450, plan: 'Pro', status: 'Active', revenue: 150000, joinedAt: '2023-01-15', owner: 'Rahul Sharma', email: 'rahul@studynest.com', phone: '+91 9876543210', gstNumber: '10AAACR3456F1Z2', nextRenewal: '2027-01-15' },
        { id: '2', name: 'The Alexandria Modern', location: 'Delhi', branches: 5, students: 1240, plan: 'Enterprise', status: 'Active', revenue: 520000, joinedAt: '2022-11-10', owner: 'Priya Verma', email: 'priya@alexandria.com', phone: '+91 9988776655', gstNumber: '07BBBCR1234H1Z5', nextRenewal: '2027-11-10' },
        { id: '3', name: 'Scholar Spaces', location: 'Mumbai', branches: 1, students: 890, plan: 'Starter', status: 'Maintenance', revenue: 0, joinedAt: '2024-02-20', owner: 'Amit Das', email: 'amit@scholarspaces.in', phone: '+91 9123456789', gstNumber: '27DDDXR4567J1Z8', nextRenewal: '2025-02-20' },
      ];
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLibraries(mockData);
    } catch (err) {
      setError('Failed to load libraries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadLibraries(); }, [loadLibraries]);

  const updateLibrary = async (id: string, updates: Partial<Library>) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    setLibraries((libs) => libs.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const toggleStatus = async (id: string) => {
    const lib = libraries.find((l) => l.id === id);
    if (!lib) throw new Error('Library not found');
    const newStatus = lib.status === 'Active' ? 'Maintenance' : 'Active';
    await new Promise((resolve) => setTimeout(resolve, 300));
    setLibraries((libs) => libs.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
  };

  return { libraries, loading, error, updateLibrary, toggleStatus, refetch: loadLibraries };
}
