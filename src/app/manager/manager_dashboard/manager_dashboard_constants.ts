export const SEAT_CLASS: Record<string, string> = {
  available: 'mgr-seat-available',
  occupied:  'mgr-seat-occupied',
  expiring:  'mgr-seat-expiring',
};

export const STATUS_CLASS: Record<string, string> = {
  New:        'mgr-badge--info',
  Visited:    'mgr-badge--warning',
  Interested: 'mgr-badge--primary',
  Converted:  'mgr-badge--success',
  Lost:       'mgr-badge--danger',
};

export const QUICK_LINKS = [
  { title: 'All Students',    href: '/manager/manager_students'                 },
  { title: 'Enquiries',       href: '/manager/manager_crm/enquiries'            },
  { title: 'Collect Fee',     href: '/manager/manager_finance/collect-fee'      },
  { title: 'Add Complaint',   href: '/manager/manager_communication/complaints' },
  { title: 'Waitlist',        href: '#'                         },
  { title: 'Mark Attendance', href: '/manager/manager_engagement/attendance'    },
  { title: 'QR Scanner',      href: '/manager/manager_engagement/qr-scanner'    },
  { title: 'My Profile',      href: '#'                         },
];
