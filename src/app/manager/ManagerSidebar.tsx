'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, BarChart2, Phone, Users, UserPlus, Users2,
  UserCheck, FolderOpen, Award, LayoutGrid, Armchair, RefreshCw,
  ArrowLeftRight, ClipboardList, History, Lock, IndianRupee,
  FileText, RotateCcw, CreditCard, Handshake, Shield, Clock,
  Ban, Receipt, DollarSign, CalendarCheck, ClipboardCheck,
  QrCode, Calendar, TrendingUp, BarChart, Wallet, BookOpen,
  MessageSquare, Bell, BellRing, Smartphone, LifeBuoy,
  LogOut, Menu, X, type LucideIcon, AlertCircle, Building,
} from 'lucide-react';

type NavItem = { group: string } | { href: string; icon: LucideIcon; label: string };

const NAV: NavItem[] = [
  { href: '/manager/manager_dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/manager/manager_reports',   icon: BarChart2,       label: 'Reports'   },
  { group: 'CRM' },
  { href: '/manager/manager_crm/enquiries',       icon: Phone,      label: 'Enquiries'        },
  { group: 'Members' },
  { href: '/manager/manager_members',            icon: Users,      label: 'Member Directory'     },
  { href: '/manager/manager_students/new',        icon: UserPlus,   label: 'New Admission'    },
  { href: '/manager/manager_students/group',      icon: Users2,     label: 'Group Admission'  },
  { href: '/manager/manager_students/alumni',     icon: UserCheck,  label: 'Alumni'           },
  { href: '/manager/manager_documents',           icon: FolderOpen, label: 'Document Vault'   },
  { href: '/manager/manager_students/referrals',  icon: Award,      label: 'Referral Bonus'   },
  { href: '/manager/manager_students/id-card',    icon: CreditCard, label: 'ID Card Generator'},
  { group: 'Seats & Shifts' },
  { href: '/manager/manager_seats_shifts_lockers/seat-matrix',      icon: LayoutGrid,     label: 'Seat Matrix'     },
  { href: '/manager/manager_seats_shifts_lockers/seat-management',  icon: Armchair,       label: 'Seats'           },
  { href: '/manager/manager_seats_shifts_lockers/shift-management', icon: RefreshCw,      label: 'Shifts'          },
  { href: '/manager/manager_seats_shifts_lockers/shift-migration',  icon: ArrowLeftRight, label: 'Shift Migration' },
  { href: '/manager/manager_seats_shifts_lockers/allocations',      icon: ClipboardList,  label: 'Allocations'     },
  { href: '/manager/manager_seats_shifts_lockers/seat-history',     icon: History,        label: 'Seat History'    },
  { href: '/manager/manager_seats_shifts_lockers/lockers',          icon: Lock,           label: 'Lockers'         },
  { href: '/manager/manager_seats_shifts_lockers/locker-matrix',    icon: LayoutGrid,     label: 'Locker Matrix'   },
  { group: 'Finance' },
  { href: '/manager/manager_finance/collect-fee',       icon: IndianRupee, label: 'Collect Fee'       },
  { href: '/manager/manager_finance/subscriptions',     icon: FileText,    label: 'Subscriptions'     },
  { href: '/manager/manager_finance/renewals',          icon: RotateCcw,   label: 'Renewals'          },
  { href: '/manager/manager_finance/payments',          icon: CreditCard,  label: 'Payments'          },
  { href: '/manager/manager_finance/payment-promises',  icon: Handshake,   label: 'Payment Promises'  },
  { href: '/manager/manager_finance/trust-score',       icon: Shield,      label: 'Trust Scores'      },
  { href: '/manager/manager_finance/security-deposits', icon: Wallet,      label: 'Security Deposits' },
  { href: '/manager/manager_finance/late-fees',         icon: Clock,       label: 'Late Fees'         },
  { href: '/manager/manager_finance/fines-and-payments', icon: AlertCircle, label: 'Fines & Payments' },
  { href: '/manager/manager_finance/auto-suspend',      icon: Ban,         label: 'Auto-Suspend'      },
  { href: '/manager/manager_finance/invoice',           icon: Receipt,     label: 'Invoice'           },
  { href: '/manager/manager_finance/receipt',           icon: BookOpen,    label: 'Receipt'           },
  { href: '/manager/manager_finance/referrals',         icon: Award,       label: 'Referrals'         },
  { href: '/manager/manager_finance/refunds',           icon: DollarSign,  label: 'Refunds'           },
  { group: 'Operations' },
  { href: '/manager/manager_engagement/attendance',       icon: CalendarCheck,  label: 'Attendance'       },
  { href: '/manager/manager_engagement/absentee-report',  icon: ClipboardCheck, label: 'Absentee Report'  },
  { href: '/manager/manager_engagement/qr-scanner',       icon: QrCode,         label: 'QR Scanner'       },
  { href: '/manager/manager_engagement/holiday-calendar', icon: Calendar,       label: 'Holiday Calendar' },
  { group: 'Accounts & Assets' },
  { href: '/manager/manager_accounting/expenses',          icon: TrendingUp, label: 'Expenses'          },
  { href: '/manager/manager_accounting/daily-settlement',  icon: Receipt,    label: 'Daily Settlement'  },
  { href: '/manager/manager_accounting/seat-gap-report',   icon: LayoutGrid, label: 'Seat Gap Report'   },
  { href: '/manager/manager_accounting/assets',            icon: BarChart,   label: 'Assets'            },
  { href: '/manager/manager_accounting/asset-maintenance', icon: BarChart,   label: 'Asset Maintenance' },
  { group: 'Communication' },
  { href: '/manager/manager_communication/notices',             icon: Bell,          label: 'Notices'             },
  { href: '/manager/manager_communication/complaints',          icon: MessageSquare, label: 'Complaints'          },
  { href: '/manager/manager_communication/notification-center', icon: BellRing,      label: 'Notification Center' },
  { href: '/manager/manager_communication/whatsapp-logs',       icon: Smartphone,    label: 'WhatsApp Logs'       },
  { href: '/manager/manager_communication/whatsapp-templates',  icon: Smartphone,    label: 'WhatsApp Templates'  },
  { group: 'Help & Support' },
  { href: '/manager/manager_help_support',                      icon: LifeBuoy,      label: 'Help & Support'      },
  { group: 'Settings' },
  { href: '/manager/manager_branch_info',                       icon: Building,      label: 'Branch Info'         },
];

// All nav hrefs for specificity check
const ALL_HREFS = NAV.filter((n): n is { href: string; icon: LucideIcon; label: string } => 'href' in n).map(n => n.href);

const ICON_COLORS = ['#4F46E5', '#059669', '#D97706', '#2563EB', '#7C3AED', '#E11D48', '#0D9488'];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function ManagerSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  function isActive(href: string): boolean {
    // Exact match always wins
    if (pathname === href) return true;
    // For sub-route match: only active if NO more-specific nav item also matches
    if (href !== '/' && pathname.startsWith(href + '/')) {
      const moreSpecific = ALL_HREFS.some(
        other => other !== href && other.startsWith(href) && pathname.startsWith(other)
      );
      return !moreSpecific;
    }
    return false;
  }

  return (
    <>
      {mobileOpen && (
        <div className="mgr-sidebar-overlay" onClick={onMobileClose} aria-hidden="true" />
      )}

      <aside
        className={`mgr-sidebar${mobileOpen ? ' mgr-sidebar-mobile-open' : ''}`}
        style={{ width: collapsed ? 60 : 240 }}
      >
        <div className="mgr-sidebar-logo">
          <button
            onClick={mobileOpen ? onMobileClose : onToggle}
            className="mgr-menu-btn"
            aria-label={mobileOpen ? 'Close sidebar' : 'Toggle sidebar'}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center gap-2 group ml-2">
              <div className="relative w-6 h-6 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-md blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-6 h-6 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-md flex items-center justify-center shadow-md">
                  <BookOpen className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <span style={{
                fontSize: 16, fontWeight: 900, color: 'var(--text-primary)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.02em'
              }}>
                Library<span style={{ 
                  background: 'linear-gradient(135deg, #a5b4fc, #818cf8)', 
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' 
                }}>OS</span>
              </span>
            </div>
          )}
        </div>

        <nav className="mgr-sidebar-nav">
          {NAV.map((item, i) => {
            if ('group' in item) {
              if (collapsed && !mobileOpen) return null;
              return <div key={i} className="mgr-nav-group-label">{item.group}</div>;
            }
            const Icon = item.icon;
            const active = isActive(item.href);
            const color = ICON_COLORS[i % ICON_COLORS.length];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mgr-nav-item${active ? ' active' : ''}`}
                title={(collapsed && !mobileOpen) ? item.label : undefined}
                onClick={mobileOpen ? onMobileClose : undefined}
              >
                <Icon size={15} className="shrink-0" style={{ color: active ? 'inherit' : color }} />
                {(!collapsed || mobileOpen) && (
                  <span className="mgr-nav-label">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {(!collapsed || mobileOpen) && (
          <div className="mgr-sidebar-footer">
            <div className="mgr-avatar">MG</div>
            <div className="mgr-sidebar-user-info">
              <p className="mgr-sidebar-user-name">Manager</p>
              <p className="mgr-sidebar-user-email">manager@library.com</p>
            </div>
            <button className="mgr-logout-btn" aria-label="Log out" onClick={() => setShowLogout(true)}
              style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '6px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </aside>

      {showLogout && (
        <div className="mgr-modal-overlay" onClick={() => setShowLogout(false)}>
          <div className="mgr-modal" onClick={e => e.stopPropagation()} style={{ background: '#12121d', border: '2px solid rgba(239, 68, 68, 0.4)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 40px -10px rgba(239, 68, 68, 0.2)' }}>
            <p className="mgr-modal-title" style={{ color: 'var(--mgr-text-primary)', fontSize: '18px', fontWeight: 600 }}>Log out?</p>
            <p className="mgr-modal-desc" style={{ color: 'var(--mgr-text-secondary)', marginTop: '8px', fontSize: '14px' }}>Are you sure you want to log out?</p>
            <div className="mgr-modal-footer" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowLogout(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--mgr-border)', background: 'transparent', color: 'var(--mgr-text-primary)', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => router.push('/auth/login')} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#ffffff', fontWeight: 600, cursor: 'pointer' }}>Log out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
