export type EnquiryStatus = 'New' | 'Visited' | 'Interested' | 'Converted' | 'Lost';
export type FetchState = 'idle' | 'loading' | 'success' | 'error';

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  shift: string;
  status: EnquiryStatus;
  handledBy: string;
  addedDate: string;
  convertedDate?: string;
  avatar: string;
  isOverdue?: boolean;
  isToday?: boolean;
  isUpcoming?: boolean;
}

export interface KanbanColumn {
  id: EnquiryStatus;
  label: string;
  cardClass: string;
}
