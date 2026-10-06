// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_reports.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminReportsState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminReportsStore = create<AdminReportsState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
