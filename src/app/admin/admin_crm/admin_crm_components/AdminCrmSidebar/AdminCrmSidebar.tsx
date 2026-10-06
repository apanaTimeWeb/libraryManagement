'use client';

// RESPONSIBILITY: Renders the Sidebar component for the admin_crm module.
// DATA FLOW: Parent -> AdminCrmSidebar -> DOM

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
      { href: '/admin/admin_dashboard', Icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/admin/admin_reports',   Icon: BarChart2,        label: 'Reports'   },
    ],
  },
  {
    group: 'CRM',
    items: [{ href: '/admin/admin_crm/enquiries', Icon: PhoneCall, label: 'Enquiries' }],
  },
  {
    group: 'Students',
    items: [
      { href: '/manager/manager_students',                 Icon: Users,         label: 'All Students'    },
      { href: '/manager/manager_students/new',   Icon: UserPlus,      label: 'New Admission'   },
      { href: '/manager/manager_students/group-admission', Icon: Users2,        label: 'Group Admission' },
      { href: '/admin/admin_alumni',                   Icon: GraduationCap, label: 'Alumni'          },
      { href: '/admin/admin_document-vault',           Icon: FolderLock,    label: 'Document Vault'  },
      { href: '/admin/admin_referral-bonus',           Icon: Medal,         label: 'Referral Bonus'  },
    ],
  },
  {
    group: 'Seats & Shifts',
    items: [
      { href: '/admin/admin_seats_shifts_lockers/seat-matrix',     Icon: LayoutGrid,     label: 'Seat Matrix'     },
      { href: '/admin/admin_seats',           Icon: Armchair,       label: 'Seats'           },
      { href: '/admin/admin_shifts',          Icon: Timer,          label: 'Shifts'          },
      { href: '/admin/admin_shift-migration', Icon: ArrowLeftRight, label: 'Shift Migration' },
      { href: '/admin/admin_allocations',     Icon: ClipboardList,  label: 'Allocations'     },
      { href: '/admin/admin_seat-history',    Icon: ScrollText,     label: 'Seat History'    },
      { href: '/admin/admin_lockers',         Icon: Lock,           label: 'Lockers'         },
      { href: '/admin/admin_locker-matrix',   Icon: Map,            label: 'Locker Matrix'   },
    ],
  },
  {
    group: 'Finance',
    items: [
      { href: '/admin/admin_collect-fee',       Icon: IndianRupee,     label: 'Collect Fee'       },
      { href: '/admin/admin_subscriptions',     Icon: FileStack,       label: 'Subscriptions'     },
      { href: '/admin/admin_renewals',          Icon: RefreshCw,       label: 'Renewals'          },
      { href: '/admin/admin_payments',          Icon: CreditCard,      label: 'Payments'          },
      { href: '/admin/admin_payment-promises',  Icon: Handshake,       label: 'Payment Promises'  },
      { href: '/admin/admin_trust-scores',      Icon: ShieldCheck,     label: 'Trust Scores'      },
      { href: '/admin/admin_security-deposits', Icon: Wallet,          label: 'Security Deposits' },
      { href: '/admin/admin_late-fees',         Icon: Clock,           label: 'Late Fees'         },
      { href: '/admin/admin_auto-suspend',      Icon: Ban,             label: 'Auto-Suspend'      },
      { href: '/admin/admin_invoices',          Icon: Receipt,         label: 'Invoices'          },
      { href: '/admin/admin_receipts',          Icon: FileText,        label: 'Receipts'          },
      { href: '/admin/admin_referrals',         Icon: UserCheck,       label: 'Referrals'         },
      { href: '/admin/admin_refunds',           Icon: BadgeDollarSign, label: 'Refunds'           },
    ],
  },
  {
    group: 'Operations',
    items: [
      { href: '/admin/admin_attendance',       Icon: CalendarDays,   label: 'Attendance'       },
      { href: '/admin/admin_absentee-report',  Icon: ClipboardCheck, label: 'Absentee Report'  },
      { href: '/admin/admin_qr-scanner',       Icon: ScanQrCode,     label: 'QR Scanner'       },
      { href: '/admin/admin_holiday-calendar', Icon: CalendarX,      label: 'Holiday Calendar' },
    ],
  },
  {
    group: 'Accounts & Assets',
    items: [
      { href: '/admin/admin_accounting/expenses',           Icon: BadgeDollarSign, label: 'Expenses'           },
      { href: '/admin/admin_accounting/financial-reports',  Icon: TrendingUp,      label: 'Financial Reports'  },
      { href: '/admin/admin_accounting/daily-settlement',   Icon: Activity,        label: 'Daily Settlement'   },
      { href: '/admin/admin_accounting/seat-gap-report',    Icon: Sofa,            label: 'Seat Gap Report'    },
      { href: '/admin/admin_accounting/shift-gap-analyzer', Icon: ArrowLeftRight,  label: 'Shift Gap Analyzer' },
      { href: '/admin/admin_accounting/assets',             Icon: PackageSearch,   label: 'Assets'             },
      { href: '/admin/admin_accounting/asset-maintenance',  Icon: Wrench,          label: 'Asset Maintenance'  },
    ],
  },
  {
    group: 'Communication',
    items: [
      { href: '/admin/admin_communication/notices',             Icon: Megaphone,     label: 'Notices'             },
      { href: '/admin/admin_communication/complaints',          Icon: MessageSquare, label: 'Complaints'          },
      { href: '/admin/admin_communication/notification-center', Icon: Bell,          label: 'Notification Center' },
      { href: '/admin/admin_communication/whatsapp-logs',       Icon: Smartphone,    label: 'WhatsApp Logs'      },
      { href: '/admin/admin_communication/whatsapp-templates',  Icon: FileCheck2,    label: 'WhatsApp Templates'  },
    ],
  },
  {
    group: 'Admin',
    items: [
      { href: '/admin/admin_branches',     Icon: Building2,      label: 'Branches'           },
      { href: '/admin/admin_staff',        Icon: Users2,         label: 'Staff & Users'      },
      { href: '/admin/admin_permissions',  Icon: KeyRound,       label: 'Permissions'        },
      { href: '/admin/admin_plans',        Icon: IndianRupee,    label: 'Plans'              },
      { href: '/admin/admin_coupons',      Icon: Tag,            label: 'Coupons'            },
      { href: '/admin/admin_waitlist',     Icon: Hourglass,      label: 'Waitlist'           },
      { href: '/admin/admin_blacklist',    Icon: ShieldX,        label: 'Blacklist'          },
      { href: '/admin/admin_audit-logs',   Icon: ScrollText,     label: 'Audit Logs'         },
      { href: '/admin/admin_system/bulk-import',  Icon: PackageSearch,  label: 'Bulk Import'        },
      { href: '/admin/admin_system/data-export',  Icon: Download,       label: 'Data Export'        },
      { href: '/admin/admin_system/backups',      Icon: HardDrive,      label: 'Backups'            },
      { href: '/admin/admin_gst-settings', Icon: FileCheck2,     label: 'GST & Tax Settings' },
    ],
  },
  {
    group: 'System',
    items: [
      { href: '/admin/admin_system/settings',             Icon: Settings,   label: 'Settings'             },
      { href: '/admin/admin_system/profile',              Icon: UserCircle, label: 'Profile'              },
      { href: '/admin/admin_system/branding',             Icon: Palette,    label: 'Branding'             },
      { href: '/admin/admin_system/whatsapp-integration', Icon: Smartphone, label: 'WhatsApp Integration' },
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

          {group.items.map((item) => {
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
