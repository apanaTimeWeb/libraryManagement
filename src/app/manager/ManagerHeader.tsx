'use client';

import { Bell, Menu, Clock, User, ShieldCheck, Search, Building, HelpCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useState, useEffect } from 'react';

interface Props {
  sidebarWidth: number;
  onMobileOpen: () => void;
}

export default function ManagerHeader({ sidebarWidth, onMobileOpen }: Props) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    if (!time) return 'Welcome';
    const hour = time.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const managerName = "Manager";

  return (
    <header className="mgr-header" style={{ left: sidebarWidth }}>
      <div className="mgr-header-left" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button className="mgr-mobile-menu-btn" onClick={onMobileOpen} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="mgr-header-titles" style={{ display: 'flex', flexDirection: 'column', minWidth: '160px' }}>
          <span className="mgr-header-branch-name" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="var(--primary)" /> Library OS
          </span>
          {time && (
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <Clock size={14} />
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        
        {/* BRANCH INDICATOR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: 'var(--primary-subtle, rgba(99, 102, 241, 0.08))', borderRadius: '8px', border: '1px solid var(--border)' }} className="mgr-branch-pill">
           <Building size={16} color="var(--primary)" />
           <div style={{ display: 'flex', flexDirection: 'column' }}>
             <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>Current Branch</span>
             <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', lineHeight: '1' }}>Central Library</span>
           </div>
        </div>
      </div>

      {/* MIDDLE SECTION - SEARCH */}
      <div className="mgr-header-middle" style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 24px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
           <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
           <input 
             type="text" 
             placeholder="Search students, books, transactions..." 
             style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
             onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
             onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
           />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="mgr-header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="mgr-help-btn" title="Help & Support" style={{ background: 'transparent', border: 'none', padding: '8px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HelpCircle size={18} />
          </button>
          <ThemeToggle />
          <button className="mgr-bell-btn" aria-label="Notifications" style={{ position: 'relative', background: 'var(--bg-input)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={18} />
            <span className="mgr-bell-dot" style={{ position: 'absolute', top: '6px', right: '8px', width: '8px', height: '8px', backgroundColor: 'var(--danger)', borderRadius: '50%', border: '2px solid var(--bg-input)' }} />
          </button>
        </div>
        
        <div className="mgr-avatar-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '6px 12px', borderRadius: '12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)' }}>
           <div className="mgr-avatar" title="Manager" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff' }}>
             <User size={18} />
           </div>
           <div className="mgr-avatar-details" style={{ display: 'flex', flexDirection: 'column', paddingRight: '4px' }}>
             <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1' }}>{getGreeting()}</span>
             <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{managerName}</span>
           </div>
        </div>
      </div>
    </header>
  );
}
