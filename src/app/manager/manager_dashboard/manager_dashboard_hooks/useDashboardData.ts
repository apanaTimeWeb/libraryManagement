import { useEffect } from 'react';
import { useDashboardStore } from '../manager_dashboard_context/manager_dashboard_store';

/**
 * Custom hook to fetch and manage dashboard data.
 * DATA FLOW: API → useDashboardData → ManagerDashboardClient
 */
export function useDashboardData() {
  const { data, status, error, fetchData } = useDashboardStore();

  // Fetch data on mount if idle, dependencies included to satisfy linter
  useEffect(() => {
    if (status === 'idle') {
      fetchData();
    }
  }, [status, fetchData]);

  return { data, status, error };
}
