// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_audit-logs.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminAuditLogsState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminAuditLogsStore = create<AdminAuditLogsState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
