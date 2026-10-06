import { useState, useEffect, useMemo } from 'react';
import { useCrmStore } from '../manager_crm_context/manager_crm_store';
import type { EnquiryStatus } from '../manager_crm_types';

// Use debounce to prevent excessive renders during search (Rule 15)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

/**
 * Custom hook to manage Enquiries data, searching, and filtering.
 * DATA FLOW: API → useEnquiries → EnquiriesClient
 */
export function useEnquiries() {
  const { enquiries, status, error, fetchData, updateEnquiryStatus } = useCrmStore();
  
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Fetch data on mount if idle, dependencies included to satisfy linter
  useEffect(() => {
    if (status === 'idle') {
      fetchData();
    }
  }, [status, fetchData]);

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const matchSearch =
        e.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        e.phone.includes(debouncedSearch.replace(/\D/g, ''));
      const matchStatus = statusFilter === 'All' || e.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [enquiries, debouncedSearch, statusFilter]);

  const getCardsByStatus = (status: EnquiryStatus) => {
    return filtered.filter((e) => e.status === status);
  };

  return {
    status,
    error,
    filtered,
    view, setView,
    search, setSearch,
    statusFilter, setStatusFilter,
    getCardsByStatus,
    updateEnquiryStatus
  };
}
