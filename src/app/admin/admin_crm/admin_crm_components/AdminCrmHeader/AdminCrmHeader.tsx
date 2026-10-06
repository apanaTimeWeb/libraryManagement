'use client';
// RESPONSIBILITY: Renders the Header component for the admin_crm module.
// DATA FLOW: Parent -> AdminCrmHeader -> DOM

import { BellRing, Building2, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="crm-header">
      {/* ── Brand ── */}
      <div className="crm-header-brand">
        {/* Hamburger (mobile only) */}
        <button
          className="crm-hamburger"
          onClick={onMenuClick}
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="crm-header-logo">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>

        <span className="crm-header-title">Library OS</span>
      </div>

      {/* ── Right section ── */}
      <div className="crm-header-right">
        {/* Branch chip */}
        <div className="crm-header-branch">
          <Building2 size={14} />
          <span>Downtown Hub</span>
        </div>

        {/* Bell */}
        <button className="crm-header-bell" title="Notifications" aria-label="Notifications">
          <BellRing size={18} />
          <span className="crm-header-bell-dot" />
        </button>

        {/* Avatar + name */}
        <div className="crm-header-user">
          <div className="crm-header-avatar">LA</div>
          <span className="crm-header-username">Library Admin</span>
        </div>
      </div>
    </header>
  );
}
