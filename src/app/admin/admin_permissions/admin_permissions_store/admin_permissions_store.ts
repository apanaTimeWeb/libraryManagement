// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_permissions.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminPermissionsState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminPermissionsStore = create<AdminPermissionsState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
