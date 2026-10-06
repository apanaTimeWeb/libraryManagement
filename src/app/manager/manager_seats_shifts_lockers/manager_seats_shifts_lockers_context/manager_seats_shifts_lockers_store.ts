import { create } from 'zustand';
import type { SeatData, FetchState } from '../manager_seats_shifts_lockers_types';

// RESPONSIBILITY: Module-scoped Zustand store for managing Seat Matrix API data.

interface SeatsState {
  seatsData: SeatData[];
  lockerData: { uuid?: string; id: string; status: 'free' | 'occupied' | 'maintenance' }[];
  allocationsData: any[];
  seatHistoryData: any[];
  status: FetchState;
  error: string | null;
  fetchData: () => Promise<void>;
  fetchLockers: () => Promise<void>;
  fetchAllocationsData: () => Promise<void>;
  fetchSeatHistoryData: () => Promise<void>;
}

export const useSeatsStore = create<SeatsState>((set, get) => ({
  seatsData: [],
  lockerData: [],
  allocationsData: [],
  seatHistoryData: [],
  status: 'idle',
  error: null,
  fetchData: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading' });
    try {
      const { fetchSeatMatrix } = await import('../manager_seats_shifts_lockers_api/manager_seats_shifts_lockers_api');
      const data = await fetchSeatMatrix();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped = data.map((s: any) => ({
        uuid: s.id,
        id: s.seatNumber.replace('S-', ''),
        status: (s.isActive ? 'free' : 'maintenance') as 'free' | 'maintenance',
      }));
      set({ seatsData: mapped, status: 'success' });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', status: 'error' });
    }
  },
  fetchLockers: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading' });
    try {
      const { fetchLockerMatrix } = await import('../manager_seats_shifts_lockers_api/manager_seats_shifts_lockers_api');
      const data = await fetchLockerMatrix();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped = data.map((l: any) => ({
        uuid: l.id,
        id: l.lockerNumber.replace('L-', ''),
        status: (l.isActive ? 'free' : 'maintenance') as 'free' | 'maintenance',
      }));
      set({ lockerData: mapped, status: 'success' });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', status: 'error' });
    }
  },
  fetchAllocationsData: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading' });
    try {
      const { fetchAllocations } = await import('../manager_seats_shifts_lockers_api/manager_seats_shifts_lockers_api');
      const data = await fetchAllocations();
      set({ allocationsData: data, status: 'success' });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', status: 'error' });
    }
  },
  fetchSeatHistoryData: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading' });
    try {
      const { fetchSeatHistory } = await import('../manager_seats_shifts_lockers_api/manager_seats_shifts_lockers_api');
      const data = await fetchSeatHistory();
      set({ seatHistoryData: data, status: 'success' });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', status: 'error' });
    }
  }
}));
