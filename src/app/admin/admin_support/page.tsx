'use client';
// RESPONSIBILITY: Renders the Admin Help & Support module
// DATA FLOW: Next.js Router -> Page

import { useState } from 'react';
import { LifeBuoy, Ticket, Activity, BellRing, BookOpen, Plus, MessageSquare, Paperclip, Send } from 'lucide-react';
import toast from 'react-hot-toast';

type Tab = 'help' | 'tickets' | 'status' | 'announcements' | 'docs';

export default function AdminSupportPage() {
  const [activeTab, setActiveTab] = useState<Tab>('tickets');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const navItems: { id: Tab; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'help', label: 'Help Center', icon: LifeBuoy, color: 'var(--primary)' },
    { id: 'tickets', label: 'Support Tickets', icon: Ticket, color: 'var(--warning)' },
    { id: 'status', label: 'System Status', icon: Activity, color: 'var(--success)' },
    { id: 'announcements', label: 'Announcements', icon: BellRing, color: 'var(--purple)' },
    { id: 'docs', label: 'Documentation', icon: BookOpen, color: 'var(--info)' },
  ];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Ticket submitted successfully to SuperAdmin support!');
    setShowCreateForm(false);
  };

  return (
    <div className="ad-page-animate" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Help & Support
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>
          Communicate with the SuperAdmin/Support Team and manage your queries.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* SUB-MENU (Sidebar) */}
        <div className="admin-card" style={{ flex: '1 1 250px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setShowCreateForm(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                borderRadius: '10px', fontSize: '14px', fontWeight: activeTab === item.id ? 600 : 500,
                background: activeTab === item.id ? 'var(--primary-subtle)' : 'transparent',
                color: activeTab === item.id ? 'var(--primary)' : 'var(--text-secondary)',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.background = 'var(--bg-glass-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <item.icon size={18} style={{ color: activeTab === item.id ? 'var(--primary)' : item.color, opacity: activeTab === item.id ? 1 : 0.8 }} />
              {item.label}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT AREA */}
        <div style={{ flex: '3 1 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {activeTab === 'tickets' && !showCreateForm && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>My Tickets</h2>
                <button className="admin-btn-primary" onClick={() => setShowCreateForm(true)}>
                  <Plus size={16} /> Create Ticket
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Dummy Tickets List */}
                {[
                  { id: 'TKT-1042', subject: 'Billing module not updating correctly', category: 'Bug Report', priority: 'High', status: 'Open', replies: 2, date: '2 hrs ago' },
                  { id: 'TKT-1041', subject: 'Need help exporting reports', category: 'Feature Request', priority: 'Low', status: 'Resolved', replies: 4, date: '1 day ago' },
                ].map(ticket => (
                  <div key={ticket.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)', flexWrap: 'wrap', gap: '16px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div className="admin-btn-icon" style={{ background: 'var(--bg-input)', color: 'var(--primary)', borderColor: 'transparent', pointerEvents: 'none' }}>
                        <Ticket size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {ticket.subject} 
                          {ticket.status === 'Open' ? (
                            <span className="admin-badge admin-badge-warning">Open</span>
                          ) : (
                            <span className="admin-badge admin-badge-success">Resolved</span>
                          )}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', gap: '12px' }}>
                          <span>#{ticket.id}</span>
                          <span>Category: {ticket.category}</span>
                          <span style={{ color: ticket.priority === 'High' ? 'var(--danger)' : 'inherit' }}>Priority: {ticket.priority}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <MessageSquare size={14} /> {ticket.replies} Replies
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{ticket.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tickets' && showCreateForm && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Create Support Ticket</h2>
                <button className="admin-btn-ghost" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Category</label>
                    <select className="admin-input" required>
                      <option value="">Select Category</option>
                      <option value="bug">Bug / Error</option>
                      <option value="feature">Feature Request</option>
                      <option value="billing">Billing Issue</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Priority</label>
                    <select className="admin-input" required>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Subject</label>
                  <input type="text" className="admin-input" placeholder="Brief summary of the issue" required />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Description</label>
                  <textarea className="admin-input" placeholder="Provide detailed information about your issue..." style={{ minHeight: '120px', resize: 'vertical' }} required />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Attachment (Optional)</label>
                  <div style={{ border: '1px dashed var(--border)', borderRadius: '12px', padding: '24px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-glass-hover)' }}>
                    <Paperclip size={20} style={{ color: 'var(--text-secondary)', margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Click to upload files or drag & drop</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>PNG, JPG, PDF up to 10MB</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button type="submit" className="admin-btn-primary">
                    <Send size={16} /> Submit Ticket
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Help Center & FAQs</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { q: 'How do I add a new student?', a: 'Go to CRM & Students -> Students -> Click "Add Student" on the top right.' },
                  { q: 'Can I change my assigned Library Branch?', a: 'Only SuperAdmin can change branch assignments. Please create a Support Ticket.' },
                  { q: 'How do I collect fees?', a: 'Navigate to Finance -> Collect Fee. Select the student and choose the payment method.' },
                  { q: 'What does "Suspend" do?', a: 'Suspending a student temporarily blocks their access without deleting their records.' }
                ].map((faq, i) => (
                  <div key={i} style={{ padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>{faq.q}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'status' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 24px 0' }}>System Status</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {[
                  { name: 'Core Application', uptime: '99.99%', status: 'Operational', color: 'var(--success)', icon: Activity },
                  { name: 'Database API', uptime: '99.98%', status: 'Operational', color: 'var(--success)', icon: Activity },
                  { name: 'SMS Gateway', uptime: '98.50%', status: 'Degraded', color: 'var(--warning)', icon: Activity },
                  { name: 'Email Server', uptime: '99.99%', status: 'Operational', color: 'var(--success)', icon: Activity }
                ].map((sys, i) => (
                  <div key={i} style={{ padding: '20px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="admin-btn-icon" style={{ background: 'var(--bg-input)', color: sys.color, pointerEvents: 'none', border: 'none' }}>
                      <sys.icon size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{sys.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {sys.status} • {sys.uptime} uptime
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 24px 0' }}>Announcements</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { title: 'New CRM Feature Released! 🚀', date: 'Today, 10:00 AM', content: 'You can now directly send WhatsApp templates to leads directly from the Enquiries tab. Try it out now!' },
                  { title: 'Scheduled Maintenance', date: '25 Sep 2026', content: 'The system will undergo scheduled maintenance on 30 Sep from 2 AM to 4 AM IST. Expect brief downtimes.' },
                  { title: 'Welcome to Library OS v2.0', date: '01 Sep 2026', content: 'We have completely revamped the admin portal with a fresh new look, dark mode support, and improved performance.' }
                ].map((ann, i) => (
                  <div key={i} style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid var(--primary)' }}>
                    <div style={{ position: 'absolute', left: '-6px', top: '0', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 0 4px var(--bg-card)' }} />
                    <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, marginBottom: '4px' }}>{ann.date}</div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>{ann.title}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Documentation & Guides</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Download or read our official guides to master the Library OS Admin portal.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {[
                  { title: 'Admin User Manual', type: 'PDF • 2.4 MB', icon: BookOpen },
                  { title: 'Finance Setup Guide', type: 'PDF • 1.1 MB', icon: BookOpen },
                  { title: 'Troubleshooting Common Issues', type: 'Article', icon: LifeBuoy }
                ].map((doc, i) => (
                  <div key={i} style={{ padding: '20px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.2s ease', cursor: 'pointer' }} className="hover:border-primary">
                    <div className="admin-btn-icon" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)', pointerEvents: 'none', border: 'none' }}>
                      <doc.icon size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{doc.title}</h3>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{doc.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
