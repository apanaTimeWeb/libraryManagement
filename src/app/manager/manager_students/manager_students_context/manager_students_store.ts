import { create } from 'zustand';
import type { Student, FetchState } from '../manager_students_types';

// RESPONSIBILITY: Module-scoped Zustand store for managing Students API data.

interface StudentsState {
  students: Student[];
  status: FetchState;
  error: string | null;
  fetchData: () => Promise<void>;
}

export const useStudentsStore = create<StudentsState>((set, get) => ({
  students: [],
  status: 'idle',
  error: null,
  fetchData: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading' });
    try {
      const { fetchStudents } = await import('../manager_students_api/manager_students_api');
      const students = await fetchStudents();
      set({ students, status: 'success' });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', status: 'error' });
    }
  }
}));
