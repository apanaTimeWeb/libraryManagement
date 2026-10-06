// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_reusable.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminReusableState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminReusableStore = create<AdminReusableState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
