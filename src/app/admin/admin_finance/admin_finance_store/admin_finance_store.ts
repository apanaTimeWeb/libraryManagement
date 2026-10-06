// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_finance.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminFinanceState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminFinanceStore = create<AdminFinanceState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
