'use client';
// RESPONSIBILITY: Renders the Admin Staff & Managers management module
// DATA FLOW: Next.js Router -> Page

import React, { useState } from 'react';
import { 
  Users, UserPlus, CheckCircle, PauseCircle, Ban, 
  MonitorSmartphone, Clock, Activity, Edit, Eye, 
  Key, LogOut, ArrowLeft, Building, User, Mail, Phone, Camera
} from 'lucide-react';
import toast from 'react-hot-toast';

type MainTab = 'all' | 'add' | 'active' | 'suspended' | 'deactivated' | 'sessions' | 'history' | 'activity';

interface Manager {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  branch: string;
  status: 'Active' | 'Suspended' | 'Deactivated';
  lastActive: string;
}

export default function AdminStaffUsersPage() {
  const [activeTab, setActiveTab] = useState<MainTab>('all');
  const [viewingManager, setViewingManager] = useState<Manager | null>(null);
  const [managerDetailTab, setManagerDetailTab] = useState<'overview' | 'history' | 'activity'>('overview');

  const navItems: { id: MainTab; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'all', label: 'All Managers', icon: Users, color: 'var(--primary)' },
    { id: 'add', label: 'Add Manager', icon: UserPlus, color: 'var(--success)' },
    { id: 'active', label: 'Active Managers', icon: CheckCircle, color: 'var(--success)' },
    { id: 'suspended', label: 'Suspended Managers', icon: PauseCircle, color: 'var(--warning)' },
    { id: 'deactivated', label: 'Deactivated Managers', icon: Ban, color: 'var(--danger)' },
    { id: 'sessions', label: 'Manager Sessions', icon: MonitorSmartphone, color: 'var(--purple)' },
    { id: 'history', label: 'Login History', icon: Clock, color: 'var(--info)' },
    { id: 'activity', label: 'Manager Activity', icon: Activity, color: 'var(--cyan)' },
  ];

  const dummyManagers: Manager[] = [
    { id: 'MGR-001', name: 'Vikram Singh', username: 'vikram.s', email: 'vikram@smartlibrary.com', phone: '+91 9876543210', branch: 'Downtown Central', status: 'Active', lastActive: '2 mins ago' },
    { id: 'MGR-002', name: 'Anita Desai', username: 'anita.d', email: 'anita@smartlibrary.com', phone: '+91 9876543211', branch: 'Westside Branch', status: 'Active', lastActive: '1 hr ago' },
    { id: 'MGR-003', name: 'Rahul Sharma', username: 'rahul.s', email: 'rahul@smartlibrary.com', phone: '+91 9876543212', branch: 'North Hub', status: 'Suspended', lastActive: '3 days ago' },
    { id: 'MGR-004', name: 'Sneha Verma', username: 'sneha.v', email: 'sneha@smartlibrary.com', phone: '+91 9876543213', branch: 'Unassigned', status: 'Deactivated', lastActive: '1 month ago' },
  ];

  const handleAction = (action: string, managerName: string) => {
    toast.success(`${action} applied to ${managerName}`);
  };

  const handleAddManager = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('New manager created successfully!');
    setActiveTab('all');
  };

  const openManagerDetails = (mgr: Manager) => {
    setViewingManager(mgr);
    setManagerDetailTab('overview');
  };

  const renderManagerTable = (filterStatus?: string) => {
    const data = filterStatus ? dummyManagers.filter(m => m.status === filterStatus) : dummyManagers;
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Manager</th>
              <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Contact</th>
              <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Branch</th>
              <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="admin-avatar" style={{ width: '36px', height: '36px', fontSize: '14px', background: 'var(--icon-bg-primary)', color: 'var(--primary)', flexShrink: 0 }}>
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>@{m.username}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{m.email}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.phone}</div>
                </td>
                <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{m.branch}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`admin-badge ${m.status === 'Active' ? 'admin-badge-success' : m.status === 'Suspended' ? 'admin-badge-warning' : 'admin-badge-danger'}`}>
                    {m.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button className="admin-btn-primary" style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }} onClick={() => openManagerDetails(m)}>
                    <Eye size={14} style={{ marginRight: '6px' }} /> View Details
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>No managers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="ad-page-animate" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {viewingManager && (
          <button className="admin-btn-icon" onClick={() => setViewingManager(null)}>
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {viewingManager ? `Manager: ${viewingManager.name}` : 'Staff & Managers'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>
            {viewingManager ? `ID: ${viewingManager.id} | Branch: ${viewingManager.branch}` : 'Manage branch managers, user accounts, and access permissions.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* SIDEBAR NAVIGATION */}
        {!viewingManager && (
          <div className="admin-card" style={{ flex: '1 1 250px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'sticky', top: '24px', minWidth: '250px' }}>
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
              >
                <item.icon size={18} style={{ color: activeTab === item.id ? 'var(--primary)' : item.color }} />
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* CONTENT AREA */}
        <div style={{ flex: '3 1 600px', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '300px' }}>
          
          {/* MAIN LIST VIEWS */}
          {!viewingManager && activeTab === 'all' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>All Managers</h2>
              {renderManagerTable()}
            </div>
          )}
          {!viewingManager && activeTab === 'active' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Active Managers</h2>
              {renderManagerTable('Active')}
            </div>
          )}
          {!viewingManager && activeTab === 'suspended' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Suspended Managers</h2>
              {renderManagerTable('Suspended')}
            </div>
          )}
          {!viewingManager && activeTab === 'deactivated' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Deactivated Managers</h2>
              {renderManagerTable('Deactivated')}
            </div>
          )}

          {/* ADD MANAGER */}
          {!viewingManager && activeTab === 'add' && (
            <div className="admin-card" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 24px 0' }}>Add New Manager</h2>
              <form onSubmit={handleAddManager} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px dashed var(--border)', flexShrink: 0 }}>
                    <Camera size={24} color="var(--text-secondary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Profile Photo</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Upload a square image (JPG/PNG)</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label className="admin-label">Full Name</label>
                    <input type="text" className="admin-input" required placeholder="e.g. John Doe" />
                  </div>
                  <div>
                    <label className="admin-label">Username</label>
                    <input type="text" className="admin-input" required placeholder="e.g. john.doe" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label className="admin-label">Email Address</label>
                    <input type="email" className="admin-input" required placeholder="john@domain.com" />
                  </div>
                  <div>
                    <label className="admin-label">Phone Number</label>
                    <input type="text" className="admin-input" required placeholder="+91 00000 00000" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label className="admin-label">Password Setup</label>
                    <select className="admin-input" required>
                      <option value="auto">Auto-generate and send via Email</option>
                      <option value="manual">Set manually now</option>
                    </select>
                  </div>
                  <div>
                    <label className="admin-label">Branch Assignment</label>
                    <select className="admin-input" required>
                      <option value="">Select Branch</option>
                      <option value="b1">Downtown Central</option>
                      <option value="b2">Westside Branch</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="admin-label">Initial Status</label>
                  <select className="admin-input" required>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button type="submit" className="admin-btn-primary"><UserPlus size={16} /> Create Manager</button>
                </div>
              </form>
            </div>
          )}

          {/* LOGS & ACTIVITY VIEWS */}
          {!viewingManager && activeTab === 'sessions' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Global Manager Sessions</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Manager</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Device & OS</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>IP Address</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Last Active</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { mgr: 'Vikram Singh', os: 'Windows 11 (Chrome)', ip: '192.168.1.45', time: 'Just now' },
                      { mgr: 'Anita Desai', os: 'macOS (Safari)', ip: '110.22.45.12', time: '2 hours ago' },
                    ].map((sess, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>{sess.mgr}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{sess.os}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{sess.ip}</td>
                        <td style={{ padding: '12px', fontSize: '13px', color: 'var(--success)' }}>{sess.time}</td>
                        <td style={{ padding: '12px' }}>
                          <button className="admin-btn-ghost-danger" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleAction('Revoke Session', sess.mgr)}>Revoke</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!viewingManager && activeTab === 'history' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Global Login History</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Manager</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Date & Time</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Status</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { mgr: 'Vikram Singh', time: 'Today, 09:00 AM', status: 'Success', loc: 'Delhi, IN' },
                      { mgr: 'Rahul Sharma', time: 'Yesterday, 08:30 PM', status: 'Failed (Wrong Password)', loc: 'Mumbai, IN' },
                      { mgr: 'Anita Desai', time: 'Yesterday, 10:15 AM', status: 'Success', loc: 'Delhi, IN' },
                    ].map((hist, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>{hist.mgr}</td>
                        <td style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>{hist.time}</td>
                        <td style={{ padding: '12px' }}>
                          <span className={`admin-badge ${hist.status === 'Success' ? 'admin-badge-success' : 'admin-badge-danger'}`}>{hist.status}</span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>{hist.loc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!viewingManager && activeTab === 'activity' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Global Manager Activity Logs</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { time: 'Today, 11:30 AM', action: 'Approved admission for John Doe', user: 'Vikram Singh' },
                  { time: 'Today, 10:15 AM', action: 'Updated pricing settings', user: 'Anita Desai' },
                  { time: 'Yesterday, 04:00 PM', action: 'Suspended member MEM-104', user: 'Vikram Singh' },
                ].map((log, i) => (
                  <div key={i} style={{ padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{log.action}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{log.time}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Performed by: {log.user}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* -------------------- DETAILED MANAGER VIEW -------------------- */}
          {viewingManager && managerDetailTab === 'overview' && (
            <>
              {/* Manager Overview Card */}
              <div className="admin-card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <div className="admin-avatar" style={{ width: '80px', height: '80px', fontSize: '32px', background: 'var(--icon-bg-primary)', color: 'var(--primary)', flexShrink: 0 }}>
                      {viewingManager.name.charAt(0)}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        {viewingManager.name}
                        <span className={`admin-badge ${viewingManager.status === 'Active' ? 'admin-badge-success' : viewingManager.status === 'Suspended' ? 'admin-badge-warning' : 'admin-badge-danger'}`}>
                          {viewingManager.status}
                        </span>
                      </h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} color="var(--info)" /> @{viewingManager.username}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16} color="var(--primary)" /> {viewingManager.email}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16} color="var(--success)" /> {viewingManager.phone}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Building size={16} color="var(--purple)" /> {viewingManager.branch}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '200px', flex: 1 }}>
                    <button className="admin-btn-primary" onClick={() => handleAction('Profile Edit', viewingManager.name)}><Edit size={16} /> Edit Profile</button>
                    <button className="admin-btn-ghost" onClick={() => handleAction('Change Branch', viewingManager.name)}><Building size={16} /> Change Branch</button>
                    <button className="admin-btn-ghost" onClick={() => handleAction('Password Reset', viewingManager.name)}><Key size={16} /> Reset Password</button>
                  </div>
                </div>
              </div>

              {/* Advanced Actions Grid */}
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px', marginBottom: '8px' }}>Security & Control Actions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div className="admin-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="admin-btn-icon" style={{ background: 'var(--icon-bg-danger)', color: 'var(--danger)', pointerEvents: 'none', border: 'none' }}><LogOut size={20} /></div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Force Logout</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>End all active sessions</div>
                    </div>
                  </div>
                  <button className="admin-btn-ghost-danger" onClick={() => handleAction('Force Logout', viewingManager.name)}>Logout User</button>
                </div>

                <div className="admin-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="admin-btn-icon" style={{ background: 'var(--icon-bg-warning)', color: 'var(--warning)', pointerEvents: 'none', border: 'none' }}><PauseCircle size={20} /></div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Suspend Account</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Temporary block access</div>
                    </div>
                  </div>
                  <button className="admin-btn-ghost" style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }} onClick={() => handleAction('Suspension', viewingManager.name)}>Suspend User</button>
                </div>

                <div className="admin-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="admin-btn-icon" style={{ background: 'var(--icon-bg-danger)', color: 'var(--danger)', pointerEvents: 'none', border: 'none' }}><Ban size={20} /></div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Deactivate Account</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Permanent disable</div>
                    </div>
                  </div>
                  <button className="admin-btn-ghost-danger" onClick={() => handleAction('Deactivation', viewingManager.name)}>Deactivate</button>
                </div>
                
                {viewingManager.status !== 'Active' && (
                   <div className="admin-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div className="admin-btn-icon" style={{ background: 'var(--icon-bg-success)', color: 'var(--success)', pointerEvents: 'none', border: 'none' }}><CheckCircle size={20} /></div>
                       <div>
                         <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Activate Account</div>
                         <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Restore access</div>
                       </div>
                     </div>
                     <button className="admin-btn-primary" onClick={() => handleAction('Activation', viewingManager.name)}>Activate</button>
                   </div>
                )}
              </div>

              {/* Logs Direct Access */}
              <div style={{ display: 'flex', gap: '20px', marginTop: '8px', flexWrap: 'wrap' }}>
                <button className="admin-btn-ghost" style={{ flex: '1 1 200px', padding: '16px', border: '1px solid var(--info)', color: 'var(--info)' }} onClick={() => setManagerDetailTab('history')}>
                  <Clock size={18} style={{ marginRight: '8px' }} /> View Login History
                </button>
                <button className="admin-btn-ghost" style={{ flex: '1 1 200px', padding: '16px', border: '1px solid var(--cyan)', color: 'var(--cyan)' }} onClick={() => setManagerDetailTab('activity')}>
                  <Activity size={18} style={{ marginRight: '8px' }} /> View Activity Logs
                </button>
              </div>
            </>
          )}

          {/* Individual Manager Detailed Logs */}
          {viewingManager && managerDetailTab === 'history' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Login History: {viewingManager.name}</h2>
                <button className="admin-btn-ghost" onClick={() => setManagerDetailTab('overview')}>Back to Overview</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Date & Time</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Device/IP</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { time: 'Today, 09:00 AM', device: 'Windows 11 (Chrome) - 192.168.1.45', status: 'Success' },
                      { time: 'Yesterday, 06:00 PM', device: 'Windows 11 (Chrome) - 192.168.1.45', status: 'Success' },
                    ].map((log, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{log.time}</td>
                        <td style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>{log.device}</td>
                        <td style={{ padding: '12px' }}>
                           <span className="admin-badge admin-badge-success">{log.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {viewingManager && managerDetailTab === 'activity' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Activity Logs: {viewingManager.name}</h2>
                <button className="admin-btn-ghost" onClick={() => setManagerDetailTab('overview')}>Back to Overview</button>
              </div>
              <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { time: 'Today, 11:30 AM', action: 'Approved admission for John Doe' },
                  { time: 'Today, 10:15 AM', action: 'Updated branch pricing settings' },
                  { time: 'Yesterday, 04:00 PM', action: 'Suspended member MEM-104' },
                ].map((log, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-31px', top: '0', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 0 4px var(--bg-card)' }} />
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{log.action}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{log.time}</div>
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
