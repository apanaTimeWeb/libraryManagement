// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_plans.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminPlansState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminPlansStore = create<AdminPlansState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
