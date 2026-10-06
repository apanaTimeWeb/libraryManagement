import { create } from 'zustand';
import type { Enquiry, FetchState } from '../manager_crm_types';

// RESPONSIBILITY: Module-scoped Zustand store for managing CRM Enquiries API data.

interface CrmState {
  enquiries: Enquiry[];
  status: FetchState;
  error: string | null;
  fetchData: () => Promise<void>;
  updateEnquiryStatus: (id: string, status: Enquiry['status']) => void;
}

export const useCrmStore = create<CrmState>((set, get) => ({
  enquiries: [],
  status: 'idle',
  error: null,
  fetchData: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading' });
    try {
      const { fetchEnquiries } = await import('../manager_crm_api/manager_crm_api');
      const data = await fetchEnquiries();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped = data.map((e: any) => ({
        id: e.id,
        name: e.name,
        phone: e.phone,
        shift: e.preferredShift,
        status: e.status.charAt(0).toUpperCase() + e.status.slice(1),
        handledBy: e.handledBy?.name || 'Unassigned',
        addedDate: new Date(e.createdAt).toLocaleDateString(),
        avatar: e.name.substring(0, 2).toUpperCase()
      }));
      set({ enquiries: mapped, status: 'success' });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', status: 'error' });
    }
  },
  updateEnquiryStatus: (id, status) => set((state) => ({
    enquiries: state.enquiries.map(enq => enq.id === id ? { ...enq, status } : enq)
  }))
}));
