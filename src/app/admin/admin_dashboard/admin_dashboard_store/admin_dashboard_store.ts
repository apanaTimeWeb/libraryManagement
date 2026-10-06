// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_dashboard.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminDashboardState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminDashboardStore = create<AdminDashboardState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
