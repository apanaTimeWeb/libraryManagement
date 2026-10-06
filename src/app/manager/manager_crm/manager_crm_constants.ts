import type { EnquiryStatus, KanbanColumn } from './manager_crm_types';

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'New', label: 'New Leads', cardClass: 'crm-col-new' },
  { id: 'Visited', label: 'Visited', cardClass: 'crm-col-visited' },
  { id: 'Interested', label: 'Interested', cardClass: 'crm-col-interested' },
  { id: 'Converted', label: 'Converted', cardClass: 'crm-col-converted' },
  { id: 'Lost', label: 'Lost', cardClass: 'crm-col-lost' },
];

export const STATUS_BADGE: Record<EnquiryStatus, string> = {
  New: 'crm-badge--info',
  Visited: 'crm-badge--warning',
  Interested: 'crm-badge--primary',
  Converted: 'crm-badge--success',
  Lost: 'crm-badge--danger',
};

export const DOT_CLASS: Record<EnquiryStatus, string> = {
  New: 'crm-col-dot--new',
  Visited: 'crm-col-dot--visited',
  Interested: 'crm-col-dot--interested',
  Converted: 'crm-col-dot--converted',
  Lost: 'crm-col-dot--lost',
};
