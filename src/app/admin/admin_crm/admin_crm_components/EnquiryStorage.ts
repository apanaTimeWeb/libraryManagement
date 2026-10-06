import { type Enquiry } from './AdminCrmtypes/AdminCrmtypes';

const STORAGE_KEY = 'admin_crm_enquiries_data';

const MOCK_DATA: Enquiry[] = [
  { id: '1', name: 'Rahul Sharma', phone: '9876543210', shift: 'Morning', status: 'New', handledBy: 'Admin', addedDate: new Date().toLocaleDateString(), isToday: true, avatar: 'RS' },
  { id: '2', name: 'Sneha Patil', phone: '9123456789', shift: 'Evening', status: 'Visited', handledBy: 'John', addedDate: new Date(Date.now() - 86400000).toLocaleDateString(), isUpcoming: true, avatar: 'SP' },
  { id: '3', name: 'Amit Kumar', phone: '9988776655', shift: 'Night', status: 'Interested', handledBy: 'Admin', addedDate: new Date(Date.now() - 172800000).toLocaleDateString(), isOverdue: true, avatar: 'AK' },
  { id: '4', name: 'Priya Singh', phone: '9001122334', shift: 'Morning', status: 'Converted', handledBy: 'Jane', addedDate: new Date(Date.now() - 259200000).toLocaleDateString(), convertedDate: new Date(Date.now() - 86400000).toLocaleDateString(), avatar: 'PS' }
];

export const getEnquiries = (): Enquiry[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  // Initialize if empty
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
  return MOCK_DATA;
};

export const saveEnquiries = (data: Enquiry[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const addEnquiry = (enq: Omit<Enquiry, 'id' | 'addedDate' | 'avatar'>) => {
  const data = getEnquiries();
  const newEnq: Enquiry = {
    ...enq,
    id: Date.now().toString(),
    addedDate: new Date().toLocaleDateString(),
    avatar: (enq.name.substring(0, 2) || 'EN').toUpperCase()
  };
  saveEnquiries([newEnq, ...data]);
  return newEnq;
};

export const updateEnquiry = (id: string, updates: Partial<Enquiry>) => {
  const data = getEnquiries();
  const updated = data.map(e => e.id === id ? { ...e, ...updates } : e);
  saveEnquiries(updated);
};

export const deleteEnquiry = (id: string) => {
  const data = getEnquiries();
  const filtered = data.filter(e => e.id !== id);
  saveEnquiries(filtered);
};
