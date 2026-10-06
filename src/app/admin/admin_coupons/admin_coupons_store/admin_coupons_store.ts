// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_coupons.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminCouponsState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminCouponsStore = create<AdminCouponsState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
