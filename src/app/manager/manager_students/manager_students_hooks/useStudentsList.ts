import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { useStudentsStore } from '../manager_students_context/manager_students_store';

/**
 * Custom hook to fetch and filter students.
 * DATA FLOW: API → useStudentsList → ManagerStudentsClient
 */
export function useStudentsList() {
  const { students, status, error, fetchData } = useStudentsStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');

  // Fetch data on mount if idle, dependencies included to satisfy linter
  useEffect(() => {
    if (status === 'idle') {
      fetchData();
    }
  }, [status, fetchData]);

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() =>
    students.filter(s => {
      const q = debouncedSearch.toLowerCase();
      const matchSearch = !debouncedSearch ||
        s.name.toLowerCase().includes(q) ||
        s.phone.includes(debouncedSearch) ||
        s.smartId.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchShift  = shiftFilter  === 'all' || s.shift  === shiftFilter;
      return matchSearch && matchStatus && matchShift;
    }),
    [students, debouncedSearch, statusFilter, shiftFilter]
  );

  return {
    students,
    filtered,
    status,
    error,
    search, setSearch,
    statusFilter, setStatusFilter,
    shiftFilter, setShiftFilter
  };
}
