'use client';
import { useState, useMemo } from 'react';
import { 
  Bell, Send, Clock, CalendarClock, ShieldAlert, Megaphone, History, 
  CheckCircle, Mail, MessageSquare, Smartphone, AlertTriangle
} from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/manager/manager_reusable/gridTheme';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function NotificationCenterPage() {
  const [activeTab, setActiveTab] = useState('My Notifications');
  const [toast, setToast] = useState('');
  
  // Notification form state
  const [notifForm, setNotifForm] = useState({
    recipient: '',
    type: 'Manual member notification',
    channel: 'Email',
    message: ''
  });

  // History state
  const [history, setHistory] = useState([
    { id: '1', recipient: 'Rahul Sharma (LIB-001)', type: 'Overdue reminder', date: '2026-10-01 14:30', status: 'Delivered', channel: 'SMS' },
    { id: '2', recipient: 'Priya Verma (LIB-022)', type: 'Reservation ready', date: '2026-10-01 10:15', status: 'Delivered', channel: 'Email' },
    { id: '3', recipient: 'Amit Kumar (LIB-045)', type: 'Membership expiry reminder', date: '2026-09-30 09:00', status: 'Failed', channel: 'WhatsApp' },
    { id: '4', recipient: 'All Active Members', type: 'Announcement', date: '2026-09-28 11:00', status: 'Delivered', channel: 'Email' },
  ]);

  const TABS = [
    { name: 'My Notifications', icon: Bell },
    { name: 'Member Notifications', icon: Send },
    { name: 'Overdue Reminders', icon: Clock },
    { name: 'Reservation Alerts', icon: CalendarClock },
    { name: 'Membership Alerts', icon: ShieldAlert },
    { name: 'Announcements', icon: Megaphone },
    { name: 'Notification History', icon: History },
  ];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifForm.recipient || !notifForm.message) {
      showToast('Recipient and message are required.');
      return;
    }
    const newEntry = {
      id: Date.now().toString(),
      recipient: notifForm.recipient,
      type: notifForm.type,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Delivered',
      channel: notifForm.channel
    };
    setHistory([newEntry, ...history]);
    showToast(`${notifForm.type} sent successfully via ${notifForm.channel}!`);
    setNotifForm({ recipient: '', type: 'Manual member notification', channel: 'Email', message: '' });
  };

  const historyColDefs: any[] = useMemo(() => [
    { field: 'recipient', headerName: 'Recipient', flex: 2, cellClass: 'text-white font-medium' },
    { field: 'type', headerName: 'Message Type', flex: 2, cellClass: 'text-[var(--mgr-text-secondary)]' },
    { field: 'channel', headerName: 'Channel', flex: 1,
      cellRenderer: (p: any) => {
        if (p.value === 'Email') return <span className="flex items-center gap-1 text-blue-400"><Mail size={14}/> Email</span>;
        if (p.value === 'SMS') return <span className="flex items-center gap-1 text-emerald-400"><MessageSquare size={14}/> SMS</span>;
        return <span className="flex items-center gap-1 text-green-500"><Smartphone size={14}/> WhatsApp</span>;
      }
    },
    { field: 'date', headerName: 'Date', flex: 1.5, cellClass: 'text-[var(--mgr-text-secondary)]' },
    { field: 'status', headerName: 'Status', flex: 1,
      cellRenderer: (p: any) => (
        <span className={`mgr-badge ${p.value === 'Delivered' ? 'mgr-badge--success' : 'mgr-badge--danger'}`}>
          {p.value}
        </span>
      )
    },
  ], []);

  return (
    <div className="mgr-page-animate relative pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[var(--mgr-primary)] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-fade-in border border-white/20">
          <CheckCircle size={18} /> <span className="font-medium">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-1 mb-8">
        <div className="mgr-breadcrumb">
          <span>Communication</span><span>/</span><span>Notification Center</span>
        </div>
        <h1 className="mgr-page-title flex items-center gap-3 mt-2">
          <Bell className="text-[var(--mgr-primary)]" size={28} /> Notification Center
        </h1>
        <p className="text-sm text-[var(--mgr-text-secondary)]">Manage your alerts, send messages to members, and track notification history.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Sidebar Tabs */}
        <div className="xl:col-span-3 space-y-2">
          {TABS.map(tab => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                type="button"
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-[var(--mgr-primary)] text-white shadow-lg' 
                    : 'text-[var(--mgr-text-secondary)] hover:bg-[var(--mgr-surface)] hover:text-white'
                }`}
              >
                <tab.icon size={18} className={isActive ? 'text-white' : 'opacity-70'} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="xl:col-span-9 mgr-card p-6 min-h-[500px]">
          
          {/* MY NOTIFICATIONS */}
          {activeTab === 'My Notifications' && (
            <div className="animate-fade-in space-y-4">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-[var(--mgr-border)] pb-4">My System Notifications</h2>
              {[
                { title: 'New Student Enrollment', desc: 'Rohan Gupta has completed the admission process.', time: '10 mins ago', icon: Bell, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { title: 'Server Maintenance', desc: 'Scheduled maintenance tonight at 2 AM IST.', time: '2 hours ago', icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                { title: 'Payment Gateway Issue', desc: 'UPI payments are currently experiencing delays.', time: 'Yesterday', icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10' },
              ].map((n, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-[var(--mgr-surface)] border border-[var(--mgr-border)] hover:bg-[var(--mgr-surface-hover)] transition-colors cursor-pointer">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.bg} ${n.color}`}>
                    <n.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">{n.title}</h4>
                    <p className="text-sm text-[var(--mgr-text-secondary)] mb-2">{n.desc}</p>
                    <span className="text-xs font-semibold text-[var(--mgr-text-secondary)] opacity-70">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MEMBER NOTIFICATIONS (SEND) */}
          {activeTab === 'Member Notifications' && (
            <div className="animate-fade-in max-w-2xl">
              <h2 className="text-xl font-bold text-white mb-2">Send Member Notification</h2>
              <p className="text-sm text-[var(--mgr-text-secondary)] mb-6 border-b border-[var(--mgr-border)] pb-4">
                Manually trigger alerts or custom messages to specific library members.
              </p>
              
              <form onSubmit={handleSendNotification} className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/90">Recipient (Member ID or Name)</label>
                  <input required type="text" className="mgr-input" placeholder="e.g. Rahul Sharma or LIB-001" 
                    value={notifForm.recipient} onChange={e => setNotifForm({...notifForm, recipient: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/90">Message Type</label>
                    <select className="mgr-input" value={notifForm.type} onChange={e => setNotifForm({...notifForm, type: e.target.value})}>
                      <option>Due reminder</option>
                      <option>Overdue reminder</option>
                      <option>Reservation ready</option>
                      <option>Membership expiry reminder</option>
                      <option>Manual member notification</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/90">Message Channel</label>
                    <select className="mgr-input" value={notifForm.channel} onChange={e => setNotifForm({...notifForm, channel: e.target.value})}>
                      <option>Email</option>
                      <option>SMS</option>
                      <option>WhatsApp (Requires Integration)</option>
                    </select>
                  </div>
                </div>

                {notifForm.channel.includes('WhatsApp') && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex gap-3 text-yellow-500 text-sm">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <p>WhatsApp integration must be configured and active in the Settings module to deliver this message.</p>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/90">Message Content</label>
                  <textarea required rows={5} className="mgr-input resize-none py-3" placeholder="Type your message here..."
                    value={notifForm.message} onChange={e => setNotifForm({...notifForm, message: e.target.value})}
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="mgr-btn-primary px-8">
                    <Send size={16} className="mr-2 inline" /> Send Notification
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* OVERDUE REMINDERS */}
          {activeTab === 'Overdue Reminders' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6 border-b border-[var(--mgr-border)] pb-4">
                <h2 className="text-xl font-bold text-white">Overdue Reminders (Auto-generated)</h2>
                <button className="mgr-btn-secondary">Send All Pending</button>
              </div>
              <div className="p-10 text-center border-2 border-dashed border-[var(--mgr-border)] rounded-xl">
                <Clock size={48} className="mx-auto text-[var(--mgr-text-secondary)] opacity-50 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No pending overdue reminders</h3>
                <p className="text-[var(--mgr-text-secondary)]">All automated fee and book return reminders are up to date.</p>
              </div>
            </div>
          )}

          {/* RESERVATION ALERTS */}
          {activeTab === 'Reservation Alerts' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6 border-b border-[var(--mgr-border)] pb-4">
                <h2 className="text-xl font-bold text-white">Seat Reservation Alerts</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1,2,3].map(i => (
                  <div key={i} className="p-4 rounded-xl bg-[var(--mgr-surface)] border border-[var(--mgr-border)] flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-emerald-400 mb-1 flex items-center gap-2"><CheckCircle size={14}/> Seat A-{10+i} Ready</h4>
                      <p className="text-xs text-[var(--mgr-text-secondary)] mb-2">Reservation confirmed for Student ID: LIB-02{i}</p>
                      <button className="text-xs text-[var(--mgr-primary)] font-bold">Trigger Alert Now</button>
                    </div>
                    <CalendarClock size={20} className="text-[var(--mgr-text-secondary)] opacity-50" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MEMBERSHIP ALERTS */}
          {activeTab === 'Membership Alerts' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6 border-b border-[var(--mgr-border)] pb-4">
                <h2 className="text-xl font-bold text-white">Expiring Memberships</h2>
              </div>
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3">
                <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold mb-1">12 Memberships expiring in next 7 days</h4>
                  <p className="text-xs opacity-80 mb-3">Automated renewal alerts are scheduled to go out tomorrow at 9:00 AM.</p>
                  <button className="mgr-btn-primary !bg-red-500 !border-red-500 text-white text-xs px-3 py-1.5">Review List</button>
                </div>
              </div>
            </div>
          )}

          {/* ANNOUNCEMENTS */}
          {activeTab === 'Announcements' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6 border-b border-[var(--mgr-border)] pb-4">
                <h2 className="text-xl font-bold text-white">Global Announcements</h2>
                <button className="mgr-btn-primary"><Megaphone size={16} className="mr-2 inline" /> New Announcement</button>
              </div>
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-[var(--mgr-surface)] border-l-4 border-[var(--mgr-primary)]">
                  <h4 className="text-base font-bold text-white mb-2">Holiday Closure - Diwali</h4>
                  <p className="text-sm text-[var(--mgr-text-secondary)] mb-3">Library will remain closed on 12th November. Please adjust your study schedules accordingly.</p>
                  <div className="flex items-center gap-4 text-xs text-[var(--mgr-text-secondary)] font-semibold">
                    <span>Sent to: All Members</span>
                    <span>Views: 342</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATION HISTORY */}
          {activeTab === 'Notification History' && (
            <div className="animate-fade-in h-full flex flex-col">
              <div className="flex justify-between items-center mb-6 border-b border-[var(--mgr-border)] pb-4">
                <h2 className="text-xl font-bold text-white">Notification History</h2>
                <p className="text-sm text-[var(--mgr-text-secondary)]">Log of all manual and automated alerts sent.</p>
              </div>
              <div className="flex-1 w-full h-[400px]">
                <AgGridReact
                  theme={gridTheme}
                  rowData={history}
                  columnDefs={historyColDefs}
                  headerHeight={48}
                  rowHeight={56}
                  suppressCellFocus
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
