import { fetchApi } from '@/lib/api';

export async function fetchSeatMatrix(): Promise<any[]> {
  return await fetchApi('/seats_shifts_lockers/seat-matrix');
}

export async function fetchLockerMatrix(): Promise<any[]> {
  return await fetchApi('/seats_shifts_lockers/lockers');
}

export async function fetchAllocations(): Promise<any[]> {
  return await fetchApi('/seats_shifts_lockers/allocations');
}

export async function fetchSeatHistory(): Promise<any[]> {
  return await fetchApi('/seats_shifts_lockers/history');
}
