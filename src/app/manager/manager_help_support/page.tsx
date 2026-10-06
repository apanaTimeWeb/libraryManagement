'use client';
import { useState } from 'react';
import {
  HelpCircle, Book, Ticket, Megaphone, Activity, Plus, Search,
  Upload, FileText, ChevronRight, CheckCircle, Clock, AlertCircle,
  Video, Users, ArrowRight, Server, Database, Globe
} from 'lucide-react';

export default function ManagerHelpSupportPage() {
  const [activeTab, setActiveTab] = useState('Help Center');
  const [ticketTab, setTicketTab] = useState('My Tickets'); // 'Create Ticket' | 'My Tickets'
  
  // State for Create Ticket Form
  const [ticketForm, setTicketForm] = useState({ category: 'Billing', subject: '', description: '', priority: 'Medium' });
  const [toast, setToast] = useState('');
  
  // Mock Data
  const [myTickets, setMyTickets] = useState([
    { id: 'TCK-001', subject: 'Payment Gateway Issue', category: 'Finance', priority: 'High', status: 'Open', date: '2026-10-01' },
    { id: 'TCK-002', subject: 'How to add bulk students?', category: 'General', priority: 'Low', status: 'Closed', date: '2026-09-28' },
  ]);

  const tabs = [
    { name: 'Help Center', icon: HelpCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Documentation', icon: Book, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Support Tickets', icon: Ticket, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Announcements', icon: Megaphone, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { name: 'System Status', icon: Activity, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  ];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject.trim()) {
      showToast('Subject is required');
      return;
    }
    const newTicket = {
      id: `TCK-00${myTickets.length + 1}`,
      subject: ticketForm.subject,
      category: ticketForm.category,
      priority: ticketForm.priority,
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };
    setMyTickets([newTicket, ...myTickets]);
    setTicketForm({ category: 'Billing', subject: '', description: '', priority: 'Medium' });
    setTicketTab('My Tickets');
    showToast('Support ticket created successfully!');
  };

  return (
    <div className="mgr-page-animate relative">
      {/* Toast Notification */}
      {toast && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[var(--mgr-primary)] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-fade-in border border-white/20">
          <CheckCircle size={18} /> <span className="font-medium">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="mgr-page-title">Help & Support</h1>
          <p className="text-sm text-[var(--mgr-text-secondary)] mt-1">Get assistance, view docs, and track support tickets.</p>
        </div>
        {activeTab !== 'Support Tickets' && (
          <button onClick={() => { setActiveTab('Support Tickets'); setTicketTab('Create Ticket'); }} className="mgr-btn-primary self-start md:self-auto">
            <Plus size={16} /> Raise a Ticket
          </button>
        )}
      </div>

      {/* Main Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-[var(--mgr-border)] pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              type="button"
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isActive 
                  ? `bg-[var(--mgr-surface)] text-white border border-[var(--mgr-border)] shadow-md` 
                  : 'text-[var(--mgr-text-secondary)] hover:bg-[var(--mgr-surface)] hover:text-white border border-transparent'
              }`}
            >
              <div className={`p-1 rounded-md ${isActive ? tab.bg : 'bg-transparent'}`}>
                <tab.icon size={16} className={isActive ? tab.color : 'opacity-70'} />
              </div>
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* ----------------- HELP CENTER ----------------- */}
      {activeTab === 'Help Center' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="mgr-card p-6 flex flex-col items-start border-t-4 border-t-blue-500 hover:-translate-y-1 transition-transform cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
              <Book size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Knowledge Base</h3>
            <p className="text-sm text-[var(--mgr-text-secondary)] mb-4 flex-1">Read detailed guides and articles on how to use all manager features.</p>
            <button className="text-blue-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">Browse Articles <ArrowRight size={14} /></button>
          </div>
          <div className="mgr-card p-6 flex flex-col items-start border-t-4 border-t-purple-500 hover:-translate-y-1 transition-transform cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform">
              <Video size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Video Tutorials</h3>
            <p className="text-sm text-[var(--mgr-text-secondary)] mb-4 flex-1">Watch step-by-step videos to master the Library OS CRM and operations.</p>
            <button className="text-purple-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">Watch Now <ArrowRight size={14} /></button>
          </div>
          <div className="mgr-card p-6 flex flex-col items-start border-t-4 border-t-emerald-500 hover:-translate-y-1 transition-transform cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Community Forum</h3>
            <p className="text-sm text-[var(--mgr-text-secondary)] mb-4 flex-1">Join other library managers to share tips, tricks, and feature requests.</p>
            <button className="text-emerald-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">Join Discussion <ArrowRight size={14} /></button>
          </div>
        </div>
      )}

      {/* ----------------- DOCUMENTATION ----------------- */}
      {activeTab === 'Documentation' && (
        <div className="animate-fade-in flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <div className="mgr-card p-5">
              <div className="relative mb-6">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--mgr-text-secondary)]" />
                <input type="text" placeholder="Search docs..." className="mgr-input pl-10" />
              </div>
              <h4 className="text-xs font-bold text-[var(--mgr-text-secondary)] uppercase tracking-wider mb-3">Categories</h4>
              <ul className="space-y-2">
                {['Getting Started', 'Student Management', 'Fee Collection', 'Seat Allocation', 'Reports & Analytics'].map((cat, i) => (
                  <li key={cat} className={`text-sm px-3 py-2 rounded-md cursor-pointer ${i===0 ? 'bg-[var(--mgr-primary-muted)] text-[var(--mgr-primary)] font-bold' : 'text-white hover:bg-[var(--mgr-surface)]'}`}>
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:w-2/3 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="mgr-card p-5 cursor-pointer hover:border-[var(--mgr-primary)] transition-colors flex items-start gap-4">
                <div className="p-3 bg-[var(--mgr-surface-hover)] rounded-lg text-purple-400 mt-1">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white mb-1">How to handle Group Admissions?</h3>
                  <p className="text-sm text-[var(--mgr-text-secondary)] mb-2">Learn the best practices for onboarding multiple students from the same institute at once.</p>
                  <span className="text-xs text-purple-400 font-semibold bg-purple-500/10 px-2 py-1 rounded">Student Management</span>
                </div>
                <ChevronRight className="text-[var(--mgr-text-secondary)]" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- SUPPORT TICKETS ----------------- */}
      {activeTab === 'Support Tickets' && (
        <div className="animate-fade-in">
          {/* Sub Tabs */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              type="button" 
              onClick={() => setTicketTab('My Tickets')}
              className={`pb-2 text-sm font-bold border-b-2 transition-colors ${ticketTab === 'My Tickets' ? 'border-[var(--mgr-primary)] text-[var(--mgr-primary)]' : 'border-transparent text-[var(--mgr-text-secondary)] hover:text-white'}`}
            >
              My Tickets
            </button>
            <button 
              type="button" 
              onClick={() => setTicketTab('Create Ticket')}
              className={`pb-2 text-sm font-bold border-b-2 transition-colors ${ticketTab === 'Create Ticket' ? 'border-[var(--mgr-primary)] text-[var(--mgr-primary)]' : 'border-transparent text-[var(--mgr-text-secondary)] hover:text-white'}`}
            >
              Create New Ticket
            </button>
          </div>

          {ticketTab === 'My Tickets' && (
            <div className="mgr-card p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--mgr-surface)] border-b border-[var(--mgr-border)] text-[var(--mgr-text-secondary)] text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Ticket ID</th>
                      <th className="p-4 font-semibold">Subject</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold">Priority</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myTickets.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-[var(--mgr-text-secondary)]">No tickets found.</td>
                      </tr>
                    ) : (
                      myTickets.map(t => (
                        <tr key={t.id} className="border-b border-[var(--mgr-border)] hover:bg-[var(--mgr-surface-hover)] transition-colors">
                          <td className="p-4 text-sm font-medium text-white">{t.id}</td>
                          <td className="p-4 text-sm text-white">{t.subject}</td>
                          <td className="p-4 text-sm text-[var(--mgr-text-secondary)]">{t.category}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              t.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                              t.priority === 'Medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>{t.priority}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 text-sm">
                              {t.status === 'Open' ? <Clock size={14} className="text-yellow-500"/> : <CheckCircle size={14} className="text-emerald-500"/>}
                              <span className={t.status === 'Open' ? 'text-yellow-500' : 'text-emerald-500'}>{t.status}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-[var(--mgr-text-secondary)]">{t.date}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {ticketTab === 'Create Ticket' && (
            <div className="mgr-card p-6 md:p-8 max-w-3xl">
              <h2 className="text-xl font-bold text-white mb-2">Raise a Support Ticket</h2>
              <p className="text-sm text-[var(--mgr-text-secondary)] mb-8">Please describe the issue in detail. Our support team will respond within 24 hours.</p>
              
              <form onSubmit={handleCreateTicket} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/90">Category</label>
                    <select 
                      className="mgr-input" 
                      value={ticketForm.category}
                      onChange={e => setTicketForm({...ticketForm, category: e.target.value})}
                    >
                      <option>Billing & Payments</option>
                      <option>Technical Issue</option>
                      <option>Feature Request</option>
                      <option>Account Settings</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/90">Priority</label>
                    <select 
                      className="mgr-input"
                      value={ticketForm.priority}
                      onChange={e => setTicketForm({...ticketForm, priority: e.target.value})}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/90">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Briefly describe the issue..." 
                    className="mgr-input" 
                    value={ticketForm.subject}
                    onChange={e => setTicketForm({...ticketForm, subject: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/90">Description</label>
                  <textarea 
                    rows={5} 
                    placeholder="Provide as much detail as possible..." 
                    className="mgr-input resize-none py-3"
                    value={ticketForm.description}
                    onChange={e => setTicketForm({...ticketForm, description: e.target.value})}
                  ></textarea>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/90">Attachment (Optional)</label>
                  <div className="border-2 border-dashed border-[var(--mgr-border)] rounded-xl p-8 flex flex-col items-center justify-center text-[var(--mgr-text-secondary)] hover:bg-[var(--mgr-surface-hover)] transition-colors cursor-pointer">
                    <Upload size={28} className="mb-3 text-[var(--mgr-primary)]" />
                    <p className="text-sm font-medium text-white mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs">SVG, PNG, JPG or PDF (max. 5MB)</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--mgr-border)] flex justify-end gap-3">
                  <button type="button" onClick={() => setTicketTab('My Tickets')} className="mgr-btn-secondary">Cancel</button>
                  <button type="submit" className="mgr-btn-primary">Submit Ticket</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ----------------- ANNOUNCEMENTS ----------------- */}
      {activeTab === 'Announcements' && (
        <div className="max-w-4xl space-y-6 animate-fade-in">
          {[
            { tag: 'New Feature', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', date: 'Oct 01, 2026', title: 'Automated Late Fee Calculations Released', desc: 'You can now set up automated late fee rules in the Finance section. This will automatically apply penalties to overdue accounts.' },
            { tag: 'Maintenance', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', date: 'Sep 25, 2026', title: 'Scheduled Maintenance Notice', desc: 'The system will undergo scheduled maintenance on Sunday at 2:00 AM IST for approximately 2 hours. Access may be intermittent.' },
            { tag: 'Update', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', date: 'Sep 10, 2026', title: 'Improved Reports Dashboard', desc: 'We have completely revamped the Reports Dashboard to include more visualizations and faster export capabilities.' }
          ].map((ann, i) => (
            <div key={i} className="mgr-card p-6 border-l-4 border-l-[var(--mgr-primary)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Megaphone size={100} />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded border ${ann.color}`}>{ann.tag}</span>
                <span className="text-sm text-[var(--mgr-text-secondary)]">{ann.date}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{ann.title}</h2>
              <p className="text-[var(--mgr-text-secondary)] leading-relaxed">{ann.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* ----------------- SYSTEM STATUS ----------------- */}
      {activeTab === 'System Status' && (
        <div className="animate-fade-in max-w-5xl">
          <div className="mgr-card p-8 mb-6 bg-emerald-500/10 border-emerald-500/20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">All Systems Operational</h2>
            <p className="text-[var(--mgr-text-secondary)]">Last updated: Just now</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'API Services', icon: Server, uptime: '99.99%' },
              { name: 'Database Clusters', icon: Database, uptime: '100%' },
              { name: 'CDN & Assets', icon: Globe, uptime: '99.98%' }
            ].map(sys => (
              <div key={sys.name} className="mgr-card p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3 text-white font-bold text-lg">
                    <sys.icon className="text-[var(--mgr-primary)]" /> {sys.name}
                  </div>
                  <span className="text-emerald-400 text-sm font-bold">Operational</span>
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--mgr-text-secondary)]">Uptime (30 days)</span>
                    <span className="text-white font-bold">{sys.uptime}</span>
                  </div>
                  <div className="w-full bg-[var(--mgr-surface)] h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[99%]"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
