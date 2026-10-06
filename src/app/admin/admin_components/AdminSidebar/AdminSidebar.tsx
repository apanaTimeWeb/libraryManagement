'use client';

// RESPONSIBILITY: Renders the sidebar navigation for the admin module.
// DATA FLOW: AdminRoute -> AdminSidebar

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Menu, X, BookOpen, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ADMIN_SIDEBAR_NAV } from '@/app/admin/admin_constants/admin_constants';

const ALL_HREFS = ADMIN_SIDEBAR_NAV.filter((n): n is { href: string; icon: LucideIcon; label: string } => 'href' in n).map(n => n.href);
const ICON_COLORS = ['#4F46E5', '#059669', '#D97706', '#2563EB', '#7C3AED', '#E11D48', '#0D9488'];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  function isActive(href: string): boolean {
    if (pathname === href) return true;
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
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 30,
            backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)'
          }}
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        style={{
          width: collapsed ? 60 : 240,
          position: 'fixed',
          left: mobileOpen ? 0 : 0,
          transform: mobileOpen ? 'translateX(0)' : 'none',
          top: 0, height: '100%',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border)',
          transition: 'width 0.3s, transform 0.3s',
          overflow: 'hidden',
          boxShadow: mobileOpen ? '4px 0 32px rgba(0, 0, 0, 0.5)' : 'none'
        }}
      >
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px',
          height: 64, flexShrink: 0, borderBottom: '1px solid var(--border)',
        }}>
          <button
            onClick={mobileOpen ? onMobileClose : onToggle}
            style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              cursor: 'pointer', display: 'flex', padding: 4, borderRadius: 4
            }}
            aria-label={mobileOpen ? 'Close sidebar' : 'Toggle sidebar'}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center gap-2 group">
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

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {ADMIN_SIDEBAR_NAV.map((item, i) => {
            if ('group' in item) {
              if (collapsed && !mobileOpen) return null;
              return (
                <div key={i} style={{
                  fontSize: 10, fontWeight: 700, color: 'var(--primary)',
                  textTransform: 'uppercase', letterSpacing: '0.1em', padding: '16px 14px 4px',
                }}>{item.group}</div>
              );
            }
            const Icon = item.icon;
            const active = isActive(item.href);
            const color = ICON_COLORS[i % ICON_COLORS.length];
            return (
              <Link
                key={item.href}
                href={item.href}
                title={(collapsed && !mobileOpen) ? item.label : undefined}
                onClick={mobileOpen ? onMobileClose : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: active ? '10px 14px 10px 11px' : '10px 14px',
                  borderRadius: 8,
                  fontSize: 14, fontWeight: 500,
                  color: active ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: active ? 'var(--primary-subtle)' : 'transparent',
                  borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
                  transition: 'background-color 0.15s, color 0.15s',
                  cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap',
                }}
              >
                <Icon size={15} style={{ color: active ? 'var(--primary)' : color, flexShrink: 0 }} />
                {(!collapsed || mobileOpen) && (
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14 }}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: (!collapsed || mobileOpen) ? 12 : '12px 0', 
          flexShrink: 0,
          borderTop: '1px solid var(--border)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: (!collapsed || mobileOpen) ? 'flex-start' : 'center',
          gap: 8,
        }}>
          {(!collapsed || mobileOpen) && (
            <>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                backgroundColor: 'var(--primary)', color: '#ffffff',
                flexShrink: 0, cursor: 'pointer',
              }}>AD</div>
              <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>Library Admin</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>admin@library.com</p>
              </div>
            </>
          )}
          <button
            style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '6px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', transition: 'all 0.15s' }}
            aria-label="Log out"
            onClick={() => setShowLogout(true)}
            onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
          >
            <LogOut size={(!collapsed || mobileOpen) ? 14 : 20} />
          </button>
        </div>
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
