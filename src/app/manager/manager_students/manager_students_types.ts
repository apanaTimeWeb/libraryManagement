export interface Student {
  id: string;
  smartId: string; 
  name: string; 
  phone: string;
  shift: string; 
  seat: string; 
  status: string;
  plan: string; 
  due: number; 
  joined: string;
  branch?: string;
}

export type FetchState = 'idle' | 'loading' | 'success' | 'error';
