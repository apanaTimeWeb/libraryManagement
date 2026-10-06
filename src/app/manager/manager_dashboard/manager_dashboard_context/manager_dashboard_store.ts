import { create } from 'zustand';
import type { DashboardData, FetchState } from '../manager_dashboard_types';

// RESPONSIBILITY: Module-scoped Zustand store for managing Dashboard API data.

interface DashboardState {
  data: DashboardData | null;
  status: FetchState;
  error: string | null;
  fetchData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  data: null,
  status: 'idle',
  error: null,
  fetchData: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading' });
    try {
      const { fetchDashboardData } = await import('../manager_dashboard_api/manager_dashboard_api');
      const data = await fetchDashboardData();
      set({ data, status: 'success' });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', status: 'error' });
    }
  }
}));
