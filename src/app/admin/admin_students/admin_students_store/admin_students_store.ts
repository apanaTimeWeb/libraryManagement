// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_students.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminStudentsState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminStudentsStore = create<AdminStudentsState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
