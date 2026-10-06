import { fetchApi } from '@/lib/api';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchEnquiries(): Promise<any[]> {
  return await fetchApi('/crm/enquiries');
}
