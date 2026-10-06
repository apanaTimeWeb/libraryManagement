// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across manager_finance.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface ManagerFinanceState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useManagerFinanceStore = create<ManagerFinanceState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
