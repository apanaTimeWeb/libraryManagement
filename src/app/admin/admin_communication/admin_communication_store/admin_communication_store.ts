// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across admin_communication.
// DATA FLOW: API / Components -> Store -> Components

import { create } from 'zustand';

interface AdminCommunicationState {
  data: any[];
  setData: (data: any[]) => void;
}

export const useAdminCommunicationStore = create<AdminCommunicationState>((set: any) => ({
  data: [],
  setData: (data: any[]) => set({ data }),
}));
