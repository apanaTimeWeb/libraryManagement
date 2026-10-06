import { fetchApi } from '@/lib/api';

export async function fetchDashboardData() {
  return await fetchApi('/manager/manager_dashboard');
}
