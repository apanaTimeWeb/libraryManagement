// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_expense-categories.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminExpenseCategoriesState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminExpenseCategoriesStore = create<AdminExpenseCategoriesState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
