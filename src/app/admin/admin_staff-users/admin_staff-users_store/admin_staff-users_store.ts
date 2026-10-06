// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_staff-users.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminStaffUsersState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminStaffUsersStore = create<AdminStaffUsersState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
