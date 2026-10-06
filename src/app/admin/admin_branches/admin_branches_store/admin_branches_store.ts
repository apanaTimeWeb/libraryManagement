// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_branches.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminBranchesState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminBranchesStore = create<AdminBranchesState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
