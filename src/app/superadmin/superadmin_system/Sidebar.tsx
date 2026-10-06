'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, BarChart2, History,
  FileText, User, Building2, Key, Tag,
  Ban, LogOut, Menu, X, BookOpen, type LucideIcon, IndianRupee, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

type NavItem =
  | { group: string }
  | { href: string; icon: LucideIcon; label: string };

const NAV: NavItem[] = [
  { href: '/admin/admin_dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/admin_reports',   icon: BarChart2,       label: 'Reports'   },
  { group: 'Admin' },
  { href: '/admin/admin_branches',    icon: Building2, label: 'Branches'      },
  { href: '/admin/admin_staff-users', icon: User,      label: 'Staff & Users' },
  { href: '/admin/admin_permissions', icon: Key,       label: 'Permissions'   },
  { href: '/admin/admin_plans',       icon: FileText,  label: 'Plans'         },
  { href: '/admin/admin_coupons',     icon: Tag,       label: 'Coupons'       },
  { href: '/admin/admin_blacklist',   icon: Ban,       label: 'Blacklist'     },
  { href: '/admin/admin_audit-logs',  icon: History,   label: 'Audit Logs'    },
  { group: 'Operations (All Branches)' },
  { href: '/admin/admin_expenses',    icon: IndianRupee, label: 'Expenses'    },
  { href: '/admin/admin_students',    icon: Users,       label: 'Students'    },
  { group: 'Configuration' },
  { href: '/admin/admin_expense-categories', icon: Tag, label: 'Expense Types' },
  { href: '/admin/admin_settings',    icon: Key,       label: 'Settings'      },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`admin-sidebar${mobileOpen ? ' admin-sidebar-mobile-open' : ''}`}
        style={{ width: collapsed ? 60 : 240 }}
      >
        <div className="admin-sidebar-logo">
          <Button
            variant="ghost"
            size="icon"
            onClick={mobileOpen ? onMobileClose : onToggle}
            aria-label={mobileOpen ? 'Close sidebar' : 'Toggle sidebar'}
            className="h-8 w-8 ml-2 hover:bg-muted/50"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
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

        <nav className="admin-sidebar-nav">
          {NAV.map((item, i) => {
            if ('group' in item) {
              if (collapsed && !mobileOpen) return null;
              return <div key={'group-' + item.group} className="admin-nav-group-label">{item.group}</div>;
            }
            const Icon = item.icon;
            const isExactMatch = pathname === item.href;
            const isSubRouteMatch = pathname.startsWith(item.href + '/');
            const isActive = isExactMatch || (isSubRouteMatch && !NAV.some(
              nav => 'href' in nav && nav.href !== item.href && (pathname === nav.href || pathname.startsWith(nav.href + '/'))
            ));


            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item${isActive ? ' active' : ''}`}
                title={(collapsed && !mobileOpen) ? item.label : undefined}
                onClick={mobileOpen ? onMobileClose : undefined}
              >
                <Icon size={15} className="shrink-0 admin-nav-icon" />
                {(!collapsed || mobileOpen) && (
                  <span className="admin-nav-label">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {(!collapsed || mobileOpen) && (
          <div className="admin-sidebar-footer">
            <div className="admin-avatar">LA</div>
            <div className="admin-sidebar-user-info">
              <p className="admin-sidebar-user-name">Library Admin</p>
              <p className="admin-sidebar-user-email">admin@library.com</p>
            </div>
            <button aria-label="Log out" onClick={() => setShowLogout(true)}
              style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '6px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', transition: 'all 0.15s', marginLeft: 'auto' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </aside>

      <Dialog open={showLogout} onOpenChange={setShowLogout}>
        <DialogContent className="max-w-[360px]" style={{ background: '#12121d', border: '2px solid rgba(239, 68, 68, 0.4)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 40px -10px rgba(239, 68, 68, 0.2)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 600 }}>Log out?</DialogTitle>
            <DialogDescription style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '14px' }}>
              Are you sure you want to log out of your session?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button onClick={() => setShowLogout(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => router.push('/auth/login')} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#ffffff', fontWeight: 600, cursor: 'pointer' }}>Log out</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
