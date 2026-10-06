import {
  LayoutDashboard, BarChart2, History,
  FileText, User, Building2, Key, Tag,
  Ban, LucideIcon, IndianRupee, Users,
  RotateCcw, Phone, MessageSquare, Handshake, AlertCircle, Armchair, Shield
} from 'lucide-react';
import { AdminNavItem } from '../admin_types/admin_types';
import { ADMIN_ROUTES } from '../admin_url_config';

/**
 * Sidebar Navigation Configuration
 */
export const ADMIN_SIDEBAR_NAV: AdminNavItem[] = [
  { href: '/admin/admin_dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/admin_reports',   icon: BarChart2,       label: 'Reports'   },
  
  { group: 'CRM & Students' },
  { href: '/admin/admin_crm/enquiries', icon: Phone, label: 'Enquiries' },
  { href: '/admin/admin_members', icon: Users, label: 'Members' },

  { group: 'Seats & Shifts' },
  { href: '/admin/admin_seats_shifts_lockers/seat-matrix',      icon: Armchair,     label: 'Seat Matrix'      },
  { href: '/admin/admin_seats_shifts_lockers/seat-management',  icon: Key,          label: 'Seats'            },
  { href: '/admin/admin_seats_shifts_lockers/shift-management', icon: History,      label: 'Shifts'           },
  { href: '/admin/admin_seats_shifts_lockers/allocations',      icon: FileText,     label: 'Allocations'      },
  { href: '/admin/admin_seats_shifts_lockers/lockers',          icon: Ban,          label: 'Lockers'          },

  { group: 'Finance' },
  { href: '/admin/admin_finance/collect-fee',   icon: IndianRupee, label: 'Collect Fee'   },
  { href: '/admin/admin_finance/subscriptions', icon: FileText,    label: 'Subscriptions' },
  { href: '/admin/admin_finance/renewals',      icon: RotateCcw,   label: 'Renewals'      },
  
  { group: 'Operations' },
  { href: '/admin/admin_staff-users', icon: User, label: 'Staff & Managers' },
  
  { group: 'Configuration' },
  { href: '/admin/admin_branches', icon: Building2, label: 'Branches' },
  { href: '/admin/admin_settings', icon: Key, label: 'Settings' },
  { href: '/admin/admin_security', icon: Shield, label: 'Library Security' },
  { href: '/admin/admin_support', icon: MessageSquare, label: 'Help & Support' },
];

/**
 * Icon color & background tokens for KPI cards on Dashboard.
 * Values MUST be CSS token strings — no hex allowed in TSX files.
 */
export const ADMIN_KPI_META = [
  { icon: Users,       iconColor: 'var(--primary)', iconBg: 'var(--icon-bg-primary)' },
  { icon: IndianRupee, iconColor: 'var(--success)', iconBg: 'var(--icon-bg-success)' },
  { icon: Armchair,    iconColor: 'var(--warning)', iconBg: 'var(--icon-bg-warning)' },
  { icon: AlertCircle, iconColor: 'var(--danger)',  iconBg: 'var(--icon-bg-danger)'  },
] as const;



/**
 * Action Icons mapped to label
 */
export const ADMIN_ACTION_ICONS: Record<string, LucideIcon> = {
  'Fee Renewals Due': RotateCcw,
  'New Enquiries':    Phone,
  'Complaint Open':   MessageSquare,
  'PTP Dates Today':  Handshake,
};
