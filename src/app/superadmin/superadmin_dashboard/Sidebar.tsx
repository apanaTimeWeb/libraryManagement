'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Wand2, Building2, CreditCard, Receipt,
  HeadphonesIcon, ScrollText, Activity, Settings, BarChart2, LogOut, Users, ShieldAlert, DatabaseBackup, User
} from 'lucide-react';
import { createPortal } from 'react-dom';

const NAV_ITEMS = [
  { href: '/superadmin/superadmin_dashboard',       icon: LayoutDashboard, label: 'Dashboard'         },
  { href: '/superadmin/superadmin_setup-wizard',    icon: Wand2,           label: 'Setup Wizard'      },
  { href: '/superadmin/superadmin_libraries',       icon: Building2,       label: 'Libraries'         },
  { href: '/superadmin/superadmin_subscriptions',   icon: CreditCard,      label: 'Subscriptions'     },
  { href: '/superadmin/superadmin_users',           icon: Users,           label: 'Users & Access'    },
  { href: '/superadmin/superadmin_billing',         icon: Receipt,         label: 'Billing'           },
  { href: '/superadmin/superadmin_support-tickets', icon: HeadphonesIcon,  label: 'Support Tickets'   },
  { href: '/superadmin/superadmin_security',        icon: ShieldAlert,     label: 'Security Center'   },
  { href: '/superadmin/superadmin_system-health',   icon: Activity,        label: 'System Health'     },
  { href: '/superadmin/superadmin_backup',          icon: DatabaseBackup,  label: 'Backup & Restore'  },
  { href: '/superadmin/superadmin_reports',         icon: BarChart2,       label: 'Reports'           },
  { href: '/superadmin/superadmin_settings',        icon: Settings,        label: 'Platform Settings' },
  { href: '/superadmin/superadmin_profile',         icon: User,            label: 'My Profile'        },
];

interface SidebarProps {
  open?: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <aside className={`sa-sidebar ${open ? 'sa-sidebar--open' : ''}`}>
      <div className="sa-sidebar-logo-area">
        <div className="sa-sidebar-logo-box">
          <span className="text-white text-xs font-bold">L</span>
        </div>
        <div>
          <p className="sa-sidebar-logo-name">Library OS</p>
        </div>
      </div>

      <div className="sa-sidebar-divider" />

      <nav className="sa-sidebar-nav">
        {NAV_ITEMS.map(({ href, icon: Icon, label }, i) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          const iconColors = ['#4F46E5', '#059669', '#D97706', '#2563EB', '#7C3AED', '#E11D48', '#0D9488'];
          const color = iconColors[i % iconColors.length];

          return (
            <Link
              key={href}
              href={href}
              className={`sa-nav-link ${isActive ? 'sa-nav-link--active' : ''}`}
            >
              <Icon size={17} style={{ color: isActive ? 'inherit' : color }} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sa-sidebar-footer">
        <Link href="/superadmin/superadmin_profile" className="flex items-center gap-3 flex-1 overflow-hidden group">
          <div className="sa-header-avatar-icon shrink-0 group-hover:ring-2 ring-primary/50 transition-all">SA</div>
          <div className="sa-sidebar-footer-avatar">
            <p className="sa-sidebar-footer-name group-hover:text-primary transition-colors">Super Admin</p>
            <p className="sa-sidebar-footer-role">Platform Owner</p>
          </div>
        </Link>
        <button
          onClick={() => setShowLogout(true)}
          title="Log out"
          aria-label="Log out"
          style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '6px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
        >
          <LogOut size={15} />
        </button>
      </div>

      {showLogout && typeof document !== 'undefined' && createPortal(
        <div className="sa-wizard-modal-overlay" style={{ zIndex: 9999 }} onClick={() => setShowLogout(false)}>
          <div className="sa-wizard-modal" style={{ maxWidth: 360, background: '#12121d', border: '2px solid rgba(239, 68, 68, 0.4)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 40px -10px rgba(239, 68, 68, 0.2)' }} onClick={e => e.stopPropagation()}>
            <p className="sa-wizard-modal-title" style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 600 }}>Log out?</p>
            <p className="sa-wizard-modal-desc" style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '14px' }}>Are you sure you want to log out of the Super Admin panel?</p>
            <div className="flex justify-end gap-3 mt-4" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowLogout(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => router.push('/auth/login')} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#ffffff', fontWeight: 600, cursor: 'pointer' }}>Log out</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </aside>
  );
}
