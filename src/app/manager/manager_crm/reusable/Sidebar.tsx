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
      { href: '/manager/manager_dashboard', Icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/manager/manager_reports',   Icon: BarChart2,        label: 'Reports'   },
    ],
  },
  {
    group: 'CRM',
    items: [{ href: '/manager/manager_crm/enquiries', Icon: PhoneCall, label: 'Enquiries' }],
  },
  {
    group: 'Students',
    items: [
      { href: '/manager/manager_students',                 Icon: Users,         label: 'All Students'    },
      { href: '/manager/manager_students/new',   Icon: UserPlus,      label: 'New Admission'   },
      { href: '/manager/manager_students/group-admission', Icon: Users2,        label: 'Group Admission' },
      { href: '/manager/manager_alumni',                   Icon: GraduationCap, label: 'Alumni'          },
      { href: '/manager/manager_document-vault',           Icon: FolderLock,    label: 'Document Vault'  },
      { href: '/manager/manager_referral-bonus',           Icon: Medal,         label: 'Referral Bonus'  },
    ],
  },
  {
    group: 'Seats & Shifts',
    items: [
      { href: '/manager/manager_seats_shifts_lockers/seat-matrix',     Icon: LayoutGrid,     label: 'Seat Matrix'     },
      { href: '/manager/manager_seats',           Icon: Armchair,       label: 'Seats'           },
      { href: '/manager/manager_shifts',          Icon: Timer,          label: 'Shifts'          },
      { href: '/manager/manager_shift-migration', Icon: ArrowLeftRight, label: 'Shift Migration' },
      { href: '/manager/manager_allocations',     Icon: ClipboardList,  label: 'Allocations'     },
      { href: '/manager/manager_seat-history',    Icon: ScrollText,     label: 'Seat History'    },
      { href: '/manager/manager_lockers',         Icon: Lock,           label: 'Lockers'         },
      { href: '/manager/manager_locker-matrix',   Icon: Map,            label: 'Locker Matrix'   },
    ],
  },
  {
    group: 'Finance',
    items: [
      { href: '/manager/manager_collect-fee',       Icon: IndianRupee,     label: 'Collect Fee'       },
      { href: '/manager/manager_subscriptions',     Icon: FileStack,       label: 'Subscriptions'     },
      { href: '/manager/manager_renewals',          Icon: RefreshCw,       label: 'Renewals'          },
      { href: '/manager/manager_payments',          Icon: CreditCard,      label: 'Payments'          },
      { href: '/manager/manager_payment-promises',  Icon: Handshake,       label: 'Payment Promises'  },
      { href: '/manager/manager_trust-scores',      Icon: ShieldCheck,     label: 'Trust Scores'      },
      { href: '/manager/manager_security-deposits', Icon: Wallet,          label: 'Security Deposits' },
      { href: '/manager/manager_late-fees',         Icon: Clock,           label: 'Late Fees'         },
      { href: '/manager/manager_auto-suspend',      Icon: Ban,             label: 'Auto-Suspend'      },
      { href: '/manager/manager_invoices',          Icon: Receipt,         label: 'Invoices'          },
      { href: '/manager/manager_receipts',          Icon: FileText,        label: 'Receipts'          },
      { href: '/manager/manager_referrals',         Icon: UserCheck,       label: 'Referrals'         },
      { href: '/manager/manager_refunds',           Icon: BadgeDollarSign, label: 'Refunds'           },
    ],
  },
  {
    group: 'Operations',
    items: [
      { href: '/manager/manager_attendance',       Icon: CalendarDays,   label: 'Attendance'       },
      { href: '/manager/manager_absentee-report',  Icon: ClipboardCheck, label: 'Absentee Report'  },
      { href: '/manager/manager_qr-scanner',       Icon: ScanQrCode,     label: 'QR Scanner'       },
      { href: '/manager/manager_holiday-calendar', Icon: CalendarX,      label: 'Holiday Calendar' },
    ],
  },
  {
    group: 'Accounts & Assets',
    items: [
      { href: '/manager/manager_accounting/expenses',           Icon: BadgeDollarSign, label: 'Expenses'           },
      { href: '/manager/manager_accounting/financial-reports',  Icon: TrendingUp,      label: 'Financial Reports'  },
      { href: '/manager/manager_accounting/daily-settlement',   Icon: Activity,        label: 'Daily Settlement'   },
      { href: '/manager/manager_accounting/seat-gap-report',    Icon: Sofa,            label: 'Seat Gap Report'    },
      { href: '/manager/manager_accounting/shift-gap-analyzer', Icon: ArrowLeftRight,  label: 'Shift Gap Analyzer' },
      { href: '/manager/manager_accounting/assets',             Icon: PackageSearch,   label: 'Assets'             },
      { href: '/manager/manager_accounting/asset-maintenance',  Icon: Wrench,          label: 'Asset Maintenance'  },
    ],
  },
  {
    group: 'Communication',
    items: [
      { href: '/manager/manager_communication/notices',             Icon: Megaphone,     label: 'Notices'             },
      { href: '/manager/manager_communication/complaints',          Icon: MessageSquare, label: 'Complaints'          },
      { href: '/manager/manager_communication/notification-center', Icon: Bell,          label: 'Notification Center' },
      { href: '/manager/manager_communication/whatsapp-logs',       Icon: Smartphone,    label: 'WhatsApp Logs'      },
      { href: '/manager/manager_communication/whatsapp-templates',  Icon: FileCheck2,    label: 'WhatsApp Templates'  },
    ],
  },
  {
    group: 'Admin',
    items: [
      { href: '/manager/manager_branches',     Icon: Building2,      label: 'Branches'           },
      { href: '/manager/manager_staff',        Icon: Users2,         label: 'Staff & Users'      },
      { href: '/manager/manager_permissions',  Icon: KeyRound,       label: 'Permissions'        },
      { href: '/manager/manager_plans',        Icon: IndianRupee,    label: 'Plans'              },
      { href: '/manager/manager_coupons',      Icon: Tag,            label: 'Coupons'            },
      { href: '/manager/manager_waitlist',     Icon: Hourglass,      label: 'Waitlist'           },
      { href: '/manager/manager_blacklist',    Icon: ShieldX,        label: 'Blacklist'          },
      { href: '/manager/manager_audit-logs',   Icon: ScrollText,     label: 'Audit Logs'         },
      { href: '/manager/manager_system/bulk-import',  Icon: PackageSearch,  label: 'Bulk Import'        },
      { href: '/manager/manager_system/data-export',  Icon: Download,       label: 'Data Export'        },
      { href: '/manager/manager_system/backups',      Icon: HardDrive,      label: 'Backups'            },
      { href: '/manager/manager_gst-settings', Icon: FileCheck2,     label: 'GST & Tax Settings' },
    ],
  },
  {
    group: 'System',
    items: [
      { href: '/manager/manager_system/settings',             Icon: Settings,   label: 'Settings'             },
      { href: '/manager/manager_system/profile',              Icon: UserCircle, label: 'Profile'              },
      { href: '/manager/manager_system/branding',             Icon: Palette,    label: 'Branding'             },
      { href: '/manager/manager_system/whatsapp-integration', Icon: Smartphone, label: 'WhatsApp Integration' },
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
