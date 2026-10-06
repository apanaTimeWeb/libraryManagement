// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_engagement.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminEngagementState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminEngagementStore = create<AdminEngagementState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
