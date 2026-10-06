// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_settings.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminSettingsState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminSettingsStore = create<AdminSettingsState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
