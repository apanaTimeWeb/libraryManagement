// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_seats_shifts_lockers.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminSeatsShiftsLockersState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminSeatsShiftsLockersStore = create<AdminSeatsShiftsLockersState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
