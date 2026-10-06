'use client';
// RESPONSIBILITY: Renders the Library Security module for Admin to monitor managers and library-level security policies.
// DATA FLOW: Next.js Router -> Page

import { useState } from 'react';
import { Shield, KeyRound, MonitorSmartphone, XOctagon, Ban, Laptop, BellRing, LogOut, Search, Activity, UserX, Lock, Unlock } from 'lucide-react';
import toast from 'react-hot-toast';

type Tab = 'dashboard' | 'login-security' | 'active-sessions' | 'failed-logins' | 'blocked-users' | 'device-sessions' | 'events';

export default function AdminSecurityPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const navItems: { id: Tab; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'dashboard', label: 'Security Dashboard', icon: Shield, color: 'var(--primary)' },
    { id: 'login-security', label: 'Login Security', icon: KeyRound, color: 'var(--info)' },
    { id: 'active-sessions', label: 'Active Sessions', icon: MonitorSmartphone, color: 'var(--success)' },
    { id: 'failed-logins', label: 'Failed Logins', icon: XOctagon, color: 'var(--warning)' },
    { id: 'blocked-users', label: 'Blocked Users', icon: Ban, color: 'var(--danger)' },
    { id: 'device-sessions', label: 'Device Sessions', icon: Laptop, color: 'var(--purple)' },
    { id: 'events', label: 'Security Events', icon: BellRing, color: 'var(--cyan)' },
  ];

  const handleForceLogout = (managerName: string) => {
    toast.success(`Forced logout applied to ${managerName}'s session.`);
  };

  const handleAccountLockUnlock = (managerName: string, lock: boolean) => {
    if (lock) toast.success(`Manager account ${managerName} has been locked.`);
    else toast.success(`Manager account ${managerName} has been unlocked.`);
  };

  return (
    <div className="ad-page-animate" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Library Security
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>
          Monitor and manage security policies, sessions, and access controls for your Library Managers.
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
          
          {activeTab === 'dashboard' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 24px 0' }}>Security Dashboard</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div style={{ padding: '20px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Active Manager Sessions</div>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--success)' }}>12</div>
                </div>
                <div style={{ padding: '20px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Failed Logins (24h)</div>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--danger)' }}>3</div>
                </div>
                <div style={{ padding: '20px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Blocked Accounts</div>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--warning)' }}>1</div>
                </div>
              </div>
              <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Shield size={20} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Library Security Status is Normal. SuperAdmin 2FA Policy is strictly enforced.</span>
              </div>
            </div>
          )}

          {activeTab === 'login-security' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 24px 0' }}>Login Security & Policies</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Manage library-level password and session policies where permitted by SuperAdmin.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Password Policy</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Require alphanumeric + special characters for Managers.</div>
                  </div>
                  <button className="admin-btn-ghost">Edit Policy</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>SuperAdmin 2FA Requirement</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>All Managers must use Two-Factor Authentication.</div>
                  </div>
                  <div className="admin-badge admin-badge-success">Enforced Globally</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Session Timeout</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Automatically logout idle manager sessions after 30 mins.</div>
                  </div>
                  <button className="admin-btn-ghost">Edit</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'active-sessions' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Manager Active Sessions</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { id: 1, name: 'Vikram Singh', role: 'Branch Manager', device: 'Windows Desktop / Chrome', ip: '192.168.1.10' },
                  { id: 2, name: 'Anita Desai', role: 'Shift Manager', device: 'MacBook Pro / Safari', ip: '192.168.1.55' },
                ].map(session => (
                  <div key={session.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div className="admin-avatar" style={{ width: '40px', height: '40px', background: 'var(--icon-bg-primary)', color: 'var(--primary)', fontSize: '16px' }}>
                        {session.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {session.name} <span className="admin-badge" style={{ marginLeft: '8px' }}>{session.role}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {session.device} • IP: {session.ip}
                        </div>
                      </div>
                    </div>
                    <button className="admin-btn-ghost-danger" style={{ color: 'var(--danger)' }} onClick={() => handleForceLogout(session.name)}>
                      <LogOut size={14} /> Force Logout
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'failed-logins' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Failed Login Monitoring</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Time</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Attempted Account</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>IP Address</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { time: '10 mins ago', account: 'amit.manager@lib.com', ip: '45.112.33.1', reason: 'Invalid Password' },
                      { time: '1 hour ago', account: 'unknown_user', ip: '192.168.1.100', reason: 'User not found' },
                      { time: 'Yesterday', account: 'neha.staff@lib.com', ip: '103.11.22.44', reason: '2FA Failed' },
                    ].map((log, i) => (
                      <tr key={i} style={{ borderBottom: i === 2 ? 'none' : '1px solid var(--border)' }}>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>{log.time}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>{log.account}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{log.ip}</td>
                        <td style={{ padding: '12px' }}><span className="admin-badge admin-badge-danger">{log.reason}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'blocked-users' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Manager Account Lock/Unlock</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { id: 1, name: 'Sanjay Kumar', email: 'sanjay@smartlibrary.com', status: 'Locked', reason: 'Multiple failed login attempts' },
                  { id: 2, name: 'Neha Gupta', email: 'neha@smartlibrary.com', status: 'Active', reason: '-' },
                ].map(user => (
                  <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div className="admin-btn-icon" style={{ background: user.status === 'Locked' ? 'var(--icon-bg-danger)' : 'var(--icon-bg-success)', color: user.status === 'Locked' ? 'var(--danger)' : 'var(--success)', pointerEvents: 'none', border: 'none' }}>
                        {user.status === 'Locked' ? <UserX size={20} /> : <Activity size={20} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {user.name} <span className={`admin-badge ${user.status === 'Locked' ? 'admin-badge-danger' : 'admin-badge-success'}`} style={{ marginLeft: '8px' }}>{user.status}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {user.email} {user.status === 'Locked' && `• Reason: ${user.reason}`}
                        </div>
                      </div>
                    </div>
                    {user.status === 'Locked' ? (
                      <button className="admin-btn-primary" onClick={() => handleAccountLockUnlock(user.name, false)}>
                        <Unlock size={14} /> Unlock Account
                      </button>
                    ) : (
                      <button className="admin-btn-ghost-danger" style={{ color: 'var(--danger)' }} onClick={() => handleAccountLockUnlock(user.name, true)}>
                        <Lock size={14} /> Lock Account
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'device-sessions' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Device Sessions</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Monitor all distinct devices where Library Managers have authenticated.</p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Manager</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Device Info</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Location (IP)</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>First Seen</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { manager: 'Vikram Singh', device: 'Windows 11 / Chrome', location: 'Pune (192.168.1.10)', date: '10 Sep 2026' },
                      { manager: 'Vikram Singh', device: 'Android / Chrome Mobile', location: 'Pune (10.0.0.8)', date: '12 Sep 2026' },
                      { manager: 'Anita Desai', device: 'MacBook Pro / Safari', location: 'Mumbai (192.168.1.55)', date: '28 Sep 2026' },
                      { manager: 'Rahul Sharma', device: 'iPad OS / Safari', location: 'Unknown (45.112.33.1)', date: '29 Sep 2026' },
                    ].map((dev, i) => (
                      <tr key={i} style={{ borderBottom: i === 3 ? 'none' : '1px solid var(--border)' }}>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{dev.manager}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{dev.device}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{dev.location}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{dev.date}</td>
                        <td style={{ padding: '12px' }}>
                          <button className="admin-btn-ghost-danger" style={{ color: 'var(--danger)', padding: '6px 12px', fontSize: '12px' }} onClick={() => toast.success(`Revoked device access for ${dev.manager}.`)}>
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Security Events Audit Log</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="admin-btn-ghost"><Search size={16} /> Filter</button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { time: 'Today, 10:45 AM', action: 'Password Changed', user: 'Vikram Singh', color: 'var(--info)' },
                  { time: 'Yesterday, 04:30 PM', action: 'Account Locked (Failed Logins)', user: 'Sanjay Kumar', color: 'var(--danger)' },
                  { time: '28 Sep 2026, 09:15 AM', action: '2FA Enabled', user: 'Anita Desai', color: 'var(--success)' },
                  { time: '25 Sep 2026, 02:00 PM', action: 'Forced Logout applied', user: 'System (Admin)', color: 'var(--warning)' },
                ].map((event, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div className="admin-badge" style={{ background: `color-mix(in srgb, ${event.color} 10%, transparent)`, color: event.color, border: `1px solid color-mix(in srgb, ${event.color} 20%, transparent)`, minWidth: '150px', textAlign: 'center' }}>
                        {event.action}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {event.user}
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {event.time}
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
