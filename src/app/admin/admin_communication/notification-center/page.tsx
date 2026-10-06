'use client';
// RESPONSIBILITY: Entry page for the admin_communication module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';
import { ChevronRight, ArrowRight, CheckCheck } from 'lucide-react';

type Category = 'All' | 'Finance' | 'CRM' | 'Operations' | 'Attendance' | 'High Only';

interface Notification {
  id: string; category: 'Finance' | 'CRM' | 'Operations' | 'Attendance';
  icon: string; title: string; description: string;
  time: string; priority: 'High' | 'Medium'; link: string; read: boolean;
}

const NOTIFS: Notification[] = [
  { id: '1', category: 'Finance',    icon: '💰', title: '5 subscriptions expire today',           description: 'Rahul, Priya, Amit, Sneha, Rohan — subscriptions end today.',                 time: '2h ago', priority: 'High',   link: '/renewals',         read: false },
  { id: '2', category: 'CRM',        icon: '📞', title: 'Call Rahul — enquired 3 days ago',       description: 'Rahul Sharma enquired about Morning shift. Follow up now.',                   time: '3h ago', priority: 'Medium', link: '/crm/enquiries',        read: false },
  { id: '3', category: 'Finance',    icon: '🤝', title: '3 Payment Promise dates hit today',      description: 'Amit Kumar, Deepak Mishra, Anita Roy promised payment today.',                time: '4h ago', priority: 'High',   link: '/payment-promises', read: false },
  { id: '4', category: 'Operations', icon: '🪑', title: 'Seat A-05 maintenance overdue 45 days',  description: 'Last maintenance was on 2026-02-25. Immediate attention required.',           time: '1d ago', priority: 'Medium', link: '/system/maintenance',      read: false },
  { id: '5', category: 'Attendance', icon: '📅', title: 'Sneha Patel absent 7 consecutive days',  description: 'Sneha Patel has not attended for 7 days. Parent alert recommended.',          time: '1d ago', priority: 'High',   link: '/absentee-report',  read: false },
  { id: '6', category: 'Finance',    icon: '⏰', title: '2 late fee penalties auto-applied',      description: 'Late fees applied to Vikram Nair and Kavita Singh for overdue payments.',     time: '2d ago', priority: 'Medium', link: '/late-fees',        read: true  },
  { id: '7', category: 'Operations', icon: '🔒', title: 'Locker L-03 issue reported',             description: 'Lock jammed on Locker L-03. Reported by student on 2026-04-08.',             time: '3d ago', priority: 'Medium', link: '/system/maintenance',      read: true  },
];

const CATS: { id: Category; label: string; icon: string }[] = [
  { id: 'All',        label: 'All Notifications',  icon: '🔔' },
  { id: 'Finance',    label: 'Finance',             icon: '💰' },
  { id: 'CRM',        label: 'CRM',                 icon: '📞' },
  { id: 'Operations', label: 'Operations',          icon: '🪑' },
  { id: 'Attendance', label: 'Attendance',          icon: '📅' },
  { id: 'High Only',  label: 'Priority: High Only', icon: '🔴' },
];

const ICON_CLS: Record<string, string> = {
  Finance: 'eng-notif-icon--finance', CRM: 'eng-notif-icon--crm',
  Operations: 'eng-notif-icon--ops',  Attendance: 'eng-notif-icon--attend',
};

export default function NotificationCenterPage() {
  const [cat, setCat]       = useState<Category>('All');
  const [notifs, setNotifs] = useState<Notification[]>(NOTIFS);

  const filtered = notifs.filter(n => {
    if (cat === 'All')       return true;
    if (cat === 'High Only') return n.priority === 'High';
    return n.category === cat;
  });

  const unread = notifs.filter(n => !n.read).length;
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div className="eng-page">
      <div className="mb-8">
        <div className="eng-breadcrumb">
          <span>Communication</span><ChevronRight size={12} /><span>Notification Center</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="eng-page-title">🔔 Notification Center</h1>
            <p className="eng-page-subtitle">{unread} unread notifications requiring your attention.</p>
          </div>
          <button onClick={markAllRead} className="eng-btn-ghost" disabled={unread === 0}>
            <CheckCheck size={16} /> Mark All Read
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top Filter Bar */}
        <div className="eng-notif-topbar flex flex-wrap gap-3">
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={`eng-notif-cat${cat === c.id ? ' eng-notif-cat--active' : ''}`}
              style={{ width: 'auto', padding: '8px 16px', borderRadius: '30px' }}>
              <span>{c.icon}</span><span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="eng-card eng-card--flush">
          {filtered.length === 0 ? (
            <div className="eng-empty">
              <div className="eng-empty__icon">🔔</div>
              <p className="eng-empty__title">All caught up! No pending notifications.</p>
            </div>
          ) : (
            filtered.map(n => (
              <div key={n.id} className={`eng-notif-item${n.read ? ' eng-notif-read' : ''}`}>
                <div className={`eng-notif-icon ${ICON_CLS[n.category]}`}>{n.icon}</div>
                <div className="eng-flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="eng-notif-title">{n.title}</p>
                    <span className={`eng-badge ${n.priority === 'High' ? 'eng-badge--danger' : 'eng-badge--warning'}`}>
                      {n.priority === 'High' ? '🔴 High' : '🟡 Medium'}
                    </span>
                    {!n.read && <span className="eng-badge eng-badge--primary">New</span>}
                  </div>
                  <p className="eng-notif-desc">{n.description}</p>
                </div>
                <div className="eng-notif-meta">
                  <span className="eng-notif-time">{n.time}</span>
                  <a href={n.link} className="eng-notif-link">
                    Go to page <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
