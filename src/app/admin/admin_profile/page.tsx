'use client';
// RESPONSIBILITY: Renders the Admin Profile and Settings page
// DATA FLOW: Next.js Router -> Page

import { useState } from 'react';
import { User, Edit3, Key, Shield, Clock, MonitorSmartphone, Settings, Mail, Phone, Camera, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

type Tab = 'profile' | 'edit' | 'password' | '2fa' | 'history' | 'sessions' | 'security';

export default function AdminProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const navItems: { id: Tab; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'profile', label: 'Profile', icon: User, color: 'var(--primary)' },
    { id: 'edit', label: 'Edit Profile', icon: Edit3, color: 'var(--info)' },
    { id: 'password', label: 'Change Password', icon: Key, color: 'var(--warning)' },
    { id: '2fa', label: 'Two-Factor Auth', icon: Shield, color: 'var(--success)' },
    { id: 'history', label: 'Login History', icon: Clock, color: 'var(--purple)' },
    { id: 'sessions', label: 'Active Sessions', icon: MonitorSmartphone, color: 'var(--rose)' },
    { id: 'security', label: 'Security Settings', icon: Settings, color: 'var(--cyan)' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          My Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>
          Manage your personal details, security preferences, and active sessions.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* SUB-MENU (Sidebar) */}
        <div className="admin-card" style={{ flex: '1 1 250px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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
          
          {activeTab === 'profile' && (
            <div className="admin-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '42px', fontWeight: 700, boxShadow: '0 8px 24px var(--primary-glow)' }}>
                    LA
                  </div>
                  <button className="admin-btn-icon" style={{ position: 'absolute', bottom: 0, right: 0, borderRadius: '50%' }} title="Update Photo">
                    <Camera size={16} />
                  </button>
                </div>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>Library Admin</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="admin-btn-icon" style={{ background: 'var(--icon-bg-primary)', pointerEvents: 'none' }}><Mail size={16} /></div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Email Address</div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>admin@smartlibrary.com</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="admin-btn-icon" style={{ background: 'var(--icon-bg-success)', color: 'var(--success)', borderColor: 'rgba(16,185,129,0.2)', pointerEvents: 'none' }}><Phone size={16} /></div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Phone Number</div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>+91 98765 43210</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Active Sessions</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { id: 1, device: 'Windows Desktop', browser: 'Chrome 118.0', ip: '192.168.1.45', lastActive: 'Current Session', current: true },
                  { id: 2, device: 'MacBook Pro', browser: 'Safari 17.1', ip: '192.168.1.102', lastActive: '2 hours ago', current: false },
                  { id: 3, device: 'iPhone 14', browser: 'iOS Safari', ip: '10.0.0.55', lastActive: 'Yesterday', current: false },
                ].map(session => (
                  <div key={session.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: session.current ? 'var(--primary-subtle)' : 'var(--bg-glass)', borderRadius: '12px', border: session.current ? '1px solid var(--primary)' : '1px solid var(--border)', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div className="admin-btn-icon" style={{ background: session.current ? 'var(--primary)' : 'var(--bg-input)', color: session.current ? '#fff' : 'var(--primary)', borderColor: 'transparent', pointerEvents: 'none' }}>
                        <MonitorSmartphone size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {session.device} {session.current && <span className="admin-badge admin-badge-success" style={{ marginLeft: '8px' }}>Active Now</span>}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {session.browser} • IP: {session.ip} • Last active: {session.lastActive}
                        </div>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="admin-btn-ghost-danger" style={{ color: 'var(--danger)' }}>
                        <LogOut size={14} /> Logout
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'edit' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Edit Profile</h2>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Full Name</label>
                    <input type="text" className="admin-input" defaultValue="Library Admin" />
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Phone Number</label>
                    <input type="text" className="admin-input" defaultValue="+91 98765 43210" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Email Address</label>
                  <input type="email" className="admin-input" defaultValue="admin@smartlibrary.com" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Bio / Role Description</label>
                  <textarea className="admin-input" defaultValue="Main administrator managing operations for Library OS branches." style={{ minHeight: '80px', resize: 'vertical' }}></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="button" className="admin-btn-primary" onClick={() => toast.success('Profile Updated!')}>Save Changes</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Change Password</h2>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Current Password</label>
                  <input type="password" className="admin-input" placeholder="••••••••" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>New Password</label>
                  <input type="password" className="admin-input" placeholder="••••••••" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Confirm New Password</label>
                  <input type="password" className="admin-input" placeholder="••••••••" />
                </div>
                <div style={{ marginTop: '10px' }}>
                  <button type="button" className="admin-btn-primary" onClick={() => toast.success('Password Changed!')}>Update Password</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === '2fa' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Two-Factor Authentication</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Add an extra layer of security to your account. When logging in, you&apos;ll need to provide a code along with your password.</p>
              
              <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="admin-btn-icon" style={{ background: 'var(--icon-bg-danger)', color: 'var(--danger)', pointerEvents: 'none' }}><Shield size={24} /></div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Authenticator App</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Status: <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Disabled</span></div>
                  </div>
                </div>
                <button className="admin-btn-primary">Enable 2FA</button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Login History</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Date & Time</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>IP Address</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Device / Browser</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: 'Today, 10:45 AM', ip: '192.168.1.45', device: 'Windows / Chrome', status: 'Success' },
                      { date: 'Yesterday, 09:12 AM', ip: '192.168.1.102', device: 'Mac OS / Safari', status: 'Success' },
                      { date: '28 Sep 2026, 11:30 PM', ip: '10.0.0.55', device: 'Unknown Device', status: 'Failed' },
                      { date: '25 Sep 2026, 08:00 AM', ip: '192.168.1.45', device: 'Windows / Chrome', status: 'Success' },
                    ].map((log, i) => (
                      <tr key={i} style={{ borderBottom: i === 3 ? 'none' : '1px solid var(--border)' }}>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>{log.date}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{log.ip}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{log.device}</td>
                        <td style={{ padding: '12px' }}>
                          <span className={`admin-badge ${log.status === 'Success' ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Security Settings</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>New Login Alerts</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Receive an email when a login occurs from a new device.</div>
                  </div>
                  <div className="admin-badge admin-badge-success">Enabled</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Password Expiry</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Force password change every 90 days.</div>
                  </div>
                  <button className="admin-btn-ghost">Enable</button>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
