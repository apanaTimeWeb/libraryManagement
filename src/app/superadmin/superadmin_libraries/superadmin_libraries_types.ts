export interface Library {
  id: string;
  name: string;
  location: string;
  branches: number;
  students: number;
  status: string;
  plan: string;
  owner: string;
  email: string;
  phone: string;
  gstNumber: string;
  revenue: number;
  joinedAt: string;
  nextRenewal: string;
}

export type LibraryPanelMode = 'view' | 'edit';
