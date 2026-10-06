// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_system.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminSystemState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminSystemStore = create<AdminSystemState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
