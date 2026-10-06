export type SeatStatus = 'free' | 'occupied' | 'expiring' | 'maintenance';
export type FetchState = 'idle' | 'loading' | 'success' | 'error';

export interface SeatData {
  uuid?: string;
  id: string;
  status: SeatStatus;
  student?: string;
  smartId?: string;
  shift?: string;
  expiry?: string;
}
