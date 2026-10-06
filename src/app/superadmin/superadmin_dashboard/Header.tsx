'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, Menu, Bell, CheckCircle, AlertTriangle, Plus, Server, Zap, ChevronDown, UserPlus, Building, Ticket } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(event.target as Node)) {
        setQuickAddOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sa-header">
      
      {/* ─── Left Section: Hamburger + Search + Badges ─── */}
      <div className="flex items-center gap-4">
        <button className="sa-mobile-menu-btn" onClick={onMenuClick} title="Toggle menu">
          <Menu size={18} />
        </button>
        
        <div className="sa-header-search group relative">
          <Search size={16} className="text-[var(--text-secondary)] group-focus-within:text-[var(--primary)] transition-colors shrink-0" />
          <input 
            placeholder="Global search (⌘K)..." 
            className="bg-transparent border-none outline-none text-sm text-[var(--text-primary)] w-full placeholder:text-[var(--text-secondary)]"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 bg-[var(--card-bg)] border border-[var(--border)] rounded px-1.5 py-0.5 pointer-events-none">
            <span className="text-[10px] font-medium text-[var(--text-secondary)]">⌘K</span>
          </div>
        </div>

        {/* Environment Badges - Hidden on smaller screens */}
        <div className="hidden lg:flex items-center gap-2 ml-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Server size={12} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Production</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <GlobeIcon size={12} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Global Scope</span>
          </div>
        </div>
      </div>

      {/* ─── Right Section: Quick Action + Health Ping + Theme + Notifs ─── */}
      <div className="sa-header-right">
        
        {/* Quick Add Dropdown */}
        <div className="relative hidden md:block" ref={quickAddRef}>
          <button 
            className="sa-btn-primary flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg"
            onClick={() => setQuickAddOpen(!quickAddOpen)}
          >
            <Plus size={14} /> Create <ChevronDown size={14} />
          </button>
          
          {quickAddOpen && (
            <div className="absolute top-full right-0 mt-3 w-48 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors">
                <Building size={16} className="text-[var(--success)]" /> Onboard Tenant
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors">
                <UserPlus size={16} className="text-[var(--info)]" /> Provision Admin
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors">
                <Ticket size={16} className="text-[var(--warning)]" /> Issue Promo Code
              </button>
            </div>
          )}
        </div>

        {/* System Health Mini-Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 border-r border-[var(--border)] mr-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]"></span>
          </span>
          <span className="text-[11px] font-bold text-[var(--text-secondary)] tracking-wider">API: 12ms</span>
        </div>

        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            className="sa-header-notif-btn" 
            title="Notifications"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Bell size={17} />
            <span className="sa-header-notif-badge" />
          </button>

          {notifOpen && (
            <div className="sa-notif-dropdown">
              <div className="sa-notif-dropdown-header">
                <div>
                  <h4 className="sa-notif-title">System Alerts</h4>
                  <p className="sa-notif-subtitle">2 unread notifications</p>
                </div>
                <button className="sa-btn-ghost sa-btn-ghost--sm">Mark read</button>
              </div>
              <div className="sa-notif-list">
                <div className="sa-notif-item sa-notif-item--unread">
                  <div className="sa-notif-item-icon sa-notif-item-icon--success">
                    <CheckCircle size={14} />
                  </div>
                  <div className="sa-notif-item-content">
                    <p className="sa-notif-item-title">V2.4 Deployment</p>
                    <p className="sa-notif-item-time">2 mins ago</p>
                  </div>
                  <div className="sa-notif-unread-dot" />
                </div>
                <div className="sa-notif-item sa-notif-item--unread">
                  <div className="sa-notif-item-icon sa-notif-item-icon--danger">
                    <AlertTriangle size={14} />
                  </div>
                  <div className="sa-notif-item-content">
                    <p className="sa-notif-item-title">DB Connection Spikes</p>
                    <p className="sa-notif-item-time">1 hour ago</p>
                  </div>
                  <div className="sa-notif-unread-dot" />
                </div>
                <div className="sa-notif-item">
                  <div className="sa-notif-item-icon sa-notif-item-icon--primary">
                    <Zap size={14} />
                  </div>
                  <div className="sa-notif-item-content">
                    <p className="sa-notif-item-title">Backup Completed</p>
                    <p className="sa-notif-item-time">1 day ago</p>
                  </div>
                </div>
              </div>
              <div className="sa-notif-dropdown-footer">
                <button className="sa-panel-view-all">View all logs</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Helper icon
function GlobeIcon({ size = 16, className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}
