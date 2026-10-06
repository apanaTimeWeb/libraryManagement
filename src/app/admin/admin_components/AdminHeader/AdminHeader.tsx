'use client';

// RESPONSIBILITY: Renders the top header for the admin module.
// DATA FLOW: AdminRoute -> AdminHeader

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, Bell, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAdmin } from '@/app/admin/admin_context/AdminContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  sidebarWidth: number;
  onMobileOpen: () => void;
}

export default function AdminHeader({ sidebarWidth, onMobileOpen }: HeaderProps) {
  const { selectedBranch, setSelectedBranch } = useAdmin();
  const [greeting, setGreeting] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    setDateStr(new Date().toLocaleDateString('en-US', options));
  }, []);

  return (
    <header className="admin-header" style={{ left: sidebarWidth, justifyContent: 'space-between' }}>

      {/* Left Section */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMobileOpen}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </Button>

        <div className="flex items-center gap-2">
          <Building2 size={15} className="text-muted-foreground hidden sm:block" />
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger 
              className="w-[130px] sm:w-[180px] h-9 text-sm font-medium border-none shadow-none focus:ring-0"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
            >
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', zIndex: 9999 }}>
              <SelectItem value="Main Branch" style={{ cursor: 'pointer' }}>Main Branch</SelectItem>
              <SelectItem value="Branch 2" style={{ cursor: 'pointer' }}>Branch 2</SelectItem>
              <SelectItem value="Kothrud Center" style={{ cursor: 'pointer' }}>Kothrud Center</SelectItem>
              <SelectItem value="Nashik Branch" style={{ cursor: 'pointer' }}>Nashik Branch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Center Section: Greeting & Date */}
      <div className="hidden lg:flex flex-col items-center justify-center">
        <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
          {greeting}, Admin! 👋
        </span>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          {dateStr}
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="admin-bell-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="admin-bell-dot" />
        </button>
        <Link href="/admin/admin_profile" className="admin-avatar" title="My Profile" style={{ textDecoration: 'none' }}>
          LA
        </Link>
      </div>
    </header>
  );
}
