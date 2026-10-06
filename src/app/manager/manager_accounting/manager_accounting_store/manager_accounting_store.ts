// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across manager_accounting.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface ManagerAccountingState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useManagerAccountingStore = create<ManagerAccountingState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
