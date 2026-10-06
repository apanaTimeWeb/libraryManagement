// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_expenses.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminExpensesState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminExpensesStore = create<AdminExpensesState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
