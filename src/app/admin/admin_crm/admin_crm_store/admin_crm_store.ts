// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_crm.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminCrmState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminCrmStore = create<AdminCrmState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
