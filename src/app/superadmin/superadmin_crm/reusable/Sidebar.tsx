'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BarChart2, PhoneCall, Users, UserPlus, Users2,
  GraduationCap, FolderLock, Medal, LayoutGrid, Armchair, Timer,
  ArrowLeftRight, ClipboardList, ScrollText, Lock, Map, IndianRupee,
  RefreshCw, CreditCard, Wallet, Handshake, ShieldCheck, FileStack,
  Clock, Ban, Receipt, FileText, UserCheck, CalendarDays, ClipboardCheck,
  ScanQrCode, CalendarX, BadgeDollarSign, TrendingUp, Activity, Sofa,
  Wrench, Megaphone, MessageSquare, Bell, Smartphone, Building2, KeyRound,
  Tag, Hourglass, ShieldX, PackageSearch, Download, HardDrive, FileCheck2,
  Settings, UserCircle, Palette, type LucideProps,
} from 'lucide-react';
import type { FC } from 'react';

type NavItem  = { href: string; Icon: FC<LucideProps>; label: string };
type NavGroup = { group: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    group: '',
    items: [
      { href: '/superadmin/superadmin_dashboard', Icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/superadmin/superadmin_reports',   Icon: BarChart2,        label: 'Reports'   },
    ],
  },
  {
    group: 'CRM',
    items: [{ href: '/superadmin/superadmin_crm/enquiries', Icon: PhoneCall, label: 'Enquiries' }],
  },
  {
    group: 'Students',
    items: [
      { href: '/manager/manager_students',                 Icon: Users,         label: 'All Students'    },
      { href: '/manager/manager_students/new',   Icon: UserPlus,      label: 'New Admission'   },
      { href: '/manager/manager_students/group-admission', Icon: Users2,        label: 'Group Admission' },
      { href: '/superadmin/superadmin_alumni',                   Icon: GraduationCap, label: 'Alumni'          },
      { href: '/superadmin/superadmin_document-vault',           Icon: FolderLock,    label: 'Document Vault'  },
      { href: '/superadmin/superadmin_referral-bonus',           Icon: Medal,         label: 'Referral Bonus'  },
    ],
  },
  {
    group: 'Seats & Shifts',
    items: [
      { href: '/superadmin/superadmin_seats_shifts_lockers/seat-matrix',     Icon: LayoutGrid,     label: 'Seat Matrix'     },
      { href: '/superadmin/superadmin_seats',           Icon: Armchair,       label: 'Seats'           },
      { href: '/superadmin/superadmin_shifts',          Icon: Timer,          label: 'Shifts'          },
      { href: '/superadmin/superadmin_shift-migration', Icon: ArrowLeftRight, label: 'Shift Migration' },
      { href: '/superadmin/superadmin_allocations',     Icon: ClipboardList,  label: 'Allocations'     },
      { href: '/superadmin/superadmin_seat-history',    Icon: ScrollText,     label: 'Seat History'    },
      { href: '/superadmin/superadmin_lockers',         Icon: Lock,           label: 'Lockers'         },
      { href: '/superadmin/superadmin_locker-matrix',   Icon: Map,            label: 'Locker Matrix'   },
    ],
  },
  {
    group: 'Finance',
    items: [
      { href: '/superadmin/superadmin_collect-fee',       Icon: IndianRupee,     label: 'Collect Fee'       },
      { href: '/superadmin/superadmin_subscriptions',     Icon: FileStack,       label: 'Subscriptions'     },
      { href: '/superadmin/superadmin_renewals',          Icon: RefreshCw,       label: 'Renewals'          },
      { href: '/superadmin/superadmin_payments',          Icon: CreditCard,      label: 'Payments'          },
      { href: '/superadmin/superadmin_payment-promises',  Icon: Handshake,       label: 'Payment Promises'  },
      { href: '/superadmin/superadmin_trust-scores',      Icon: ShieldCheck,     label: 'Trust Scores'      },
      { href: '/superadmin/superadmin_security-deposits', Icon: Wallet,          label: 'Security Deposits' },
      { href: '/superadmin/superadmin_late-fees',         Icon: Clock,           label: 'Late Fees'         },
      { href: '/superadmin/superadmin_auto-suspend',      Icon: Ban,             label: 'Auto-Suspend'      },
      { href: '/superadmin/superadmin_invoices',          Icon: Receipt,         label: 'Invoices'          },
      { href: '/superadmin/superadmin_receipts',          Icon: FileText,        label: 'Receipts'          },
      { href: '/superadmin/superadmin_referrals',         Icon: UserCheck,       label: 'Referrals'         },
      { href: '/superadmin/superadmin_refunds',           Icon: BadgeDollarSign, label: 'Refunds'           },
    ],
  },
  {
    group: 'Operations',
    items: [
      { href: '/superadmin/superadmin_attendance',       Icon: CalendarDays,   label: 'Attendance'       },
      { href: '/superadmin/superadmin_absentee-report',  Icon: ClipboardCheck, label: 'Absentee Report'  },
      { href: '/superadmin/superadmin_qr-scanner',       Icon: ScanQrCode,     label: 'QR Scanner'       },
      { href: '/superadmin/superadmin_holiday-calendar', Icon: CalendarX,      label: 'Holiday Calendar' },
    ],
  },
  {
    group: 'Accounts & Assets',
    items: [
      { href: '/superadmin/superadmin_accounting/expenses',           Icon: BadgeDollarSign, label: 'Expenses'           },
      { href: '/superadmin/superadmin_accounting/financial-reports',  Icon: TrendingUp,      label: 'Financial Reports'  },
      { href: '/superadmin/superadmin_accounting/daily-settlement',   Icon: Activity,        label: 'Daily Settlement'   },
      { href: '/superadmin/superadmin_accounting/seat-gap-report',    Icon: Sofa,            label: 'Seat Gap Report'    },
      { href: '/superadmin/superadmin_accounting/shift-gap-analyzer', Icon: ArrowLeftRight,  label: 'Shift Gap Analyzer' },
      { href: '/superadmin/superadmin_accounting/assets',             Icon: PackageSearch,   label: 'Assets'             },
      { href: '/superadmin/superadmin_accounting/asset-maintenance',  Icon: Wrench,          label: 'Asset Maintenance'  },
    ],
  },
  {
    group: 'Communication',
    items: [
      { href: '/superadmin/superadmin_communication/notices',             Icon: Megaphone,     label: 'Notices'             },
      { href: '/superadmin/superadmin_communication/complaints',          Icon: MessageSquare, label: 'Complaints'          },
      { href: '/superadmin/superadmin_communication/notification-center', Icon: Bell,          label: 'Notification Center' },
      { href: '/superadmin/superadmin_communication/whatsapp-logs',       Icon: Smartphone,    label: 'WhatsApp Logs'      },
      { href: '/superadmin/superadmin_communication/whatsapp-templates',  Icon: FileCheck2,    label: 'WhatsApp Templates'  },
    ],
  },
  {
    group: 'Admin',
    items: [
      { href: '/superadmin/superadmin_branches',     Icon: Building2,      label: 'Branches'           },
      { href: '/superadmin/superadmin_staff',        Icon: Users2,         label: 'Staff & Users'      },
      { href: '/superadmin/superadmin_permissions',  Icon: KeyRound,       label: 'Permissions'        },
      { href: '/superadmin/superadmin_plans',        Icon: IndianRupee,    label: 'Plans'              },
      { href: '/superadmin/superadmin_coupons',      Icon: Tag,            label: 'Coupons'            },
      { href: '/superadmin/superadmin_waitlist',     Icon: Hourglass,      label: 'Waitlist'           },
      { href: '/superadmin/superadmin_blacklist',    Icon: ShieldX,        label: 'Blacklist'          },
      { href: '/superadmin/superadmin_audit-logs',   Icon: ScrollText,     label: 'Audit Logs'         },
      { href: '/superadmin/superadmin_system/bulk-import',  Icon: PackageSearch,  label: 'Bulk Import'        },
      { href: '/superadmin/superadmin_system/data-export',  Icon: Download,       label: 'Data Export'        },
      { href: '/superadmin/superadmin_system/backups',      Icon: HardDrive,      label: 'Backups'            },
      { href: '/superadmin/superadmin_gst-settings', Icon: FileCheck2,     label: 'GST & Tax Settings' },
    ],
  },
  {
    group: 'System',
    items: [
      { href: '/superadmin/superadmin_system/settings',             Icon: Settings,   label: 'Settings'             },
      { href: '/superadmin/superadmin_system/profile',              Icon: UserCircle, label: 'Profile'              },
      { href: '/superadmin/superadmin_system/branding',             Icon: Palette,    label: 'Branding'             },
      { href: '/superadmin/superadmin_system/whatsapp-integration', Icon: Smartphone, label: 'WhatsApp Integration' },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`crm-sidebar${isOpen ? ' crm-sidebar--open' : ''}`}>
      <div className="crm-sidebar-spacer" />

      {NAV.map((group, gi) => (
        <div key={gi}>
          {group.group && <p className="crm-nav-group-label">{group.group}</p>}

          {group.items.map((item: any) => {
            const active =
              item.href === '/crm/enquiries'
                ? pathname.startsWith('/crm/enquiries')
                : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`crm-nav-item${active ? ' crm-nav-item--active' : ''}`}
                onClick={onClose}
                title={item.label}
              >
                <item.Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}

      <div className="crm-sidebar-bottom" />
    </aside>
  );
}
