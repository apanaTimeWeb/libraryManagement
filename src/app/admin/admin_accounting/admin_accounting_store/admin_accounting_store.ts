// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_accounting.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminAccountingState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminAccountingStore = create<AdminAccountingState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
