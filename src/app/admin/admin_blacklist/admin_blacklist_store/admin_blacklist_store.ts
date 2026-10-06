// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_blacklist.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminBlacklistState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminBlacklistStore = create<AdminBlacklistState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
