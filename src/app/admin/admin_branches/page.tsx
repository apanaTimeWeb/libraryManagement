'use client';
// RESPONSIBILITY: Renders the Admin Branch Management module
// DATA FLOW: Next.js Router -> Page

import React, { useState } from 'react';
import { 
  Building2, Plus, CheckCircle, PauseCircle, Archive, 
  Users, Settings, Activity, BarChart, MapPin, Phone, 
  Mail, Clock, User, Shield, BookOpen, MoreVertical, 
  Eye, Edit, Power, Ban, FileText, ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

type MainTab = 'all' | 'create' | 'active' | 'suspended' | 'archived' | 'managers' | 'settings' | 'usage' | 'reports';
type DetailTab = 'overview' | 'users' | 'members' | 'reservations' | 'reports' | 'audit' | 'settings';

export default function AdminBranchesPage() {
  const [activeTab, setActiveTab] = useState<MainTab>('all');
  const [viewingBranch, setViewingBranch] = useState<{id: string, name: string, code: string, address: string, phone: string, email: string, manager: string, status: string} | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');

  const mainNav: { id: MainTab; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'all', label: 'All Branches', icon: Building2, color: 'var(--primary)' },
    { id: 'create', label: 'Create Branch', icon: Plus, color: 'var(--success)' },
    { id: 'active', label: 'Active Branches', icon: CheckCircle, color: 'var(--success)' },
    { id: 'suspended', label: 'Suspended Branches', icon: PauseCircle, color: 'var(--warning)' },
    { id: 'archived', label: 'Archived Branches', icon: Archive, color: 'var(--danger)' },
    { id: 'managers', label: 'Branch Managers', icon: Users, color: 'var(--info)' },
    { id: 'settings', label: 'Global Settings', icon: Settings, color: 'var(--purple)' },
    { id: 'usage', label: 'Branch Usage', icon: Activity, color: 'var(--cyan)' },
    { id: 'reports', label: 'Branch Reports', icon: BarChart, color: 'var(--rose)' },
  ];

  const detailNav: { id: DetailTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'users', label: 'Staff Users', icon: Shield },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'reservations', label: 'Reservations', icon: BookOpen },
    { id: 'reports', label: 'Reports', icon: BarChart },
    { id: 'audit', label: 'Audit Log', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Dummy branches
  const branches = [
    { id: 'BR-001', name: 'Downtown Central', code: 'DT-CEN', address: '123 Main St, City', phone: '+91 9876543210', email: 'downtown@lib.com', manager: 'Vikram Singh', status: 'Active' },
    { id: 'BR-002', name: 'Westside Branch', code: 'WS-BR', address: '45 West Ave, City', phone: '+91 9876543211', email: 'westside@lib.com', manager: 'Anita Desai', status: 'Suspended' },
    { id: 'BR-003', name: 'North Hub', code: 'NH-01', address: '88 North Blvd, City', phone: '+91 9876543212', email: 'north@lib.com', manager: 'Rahul Sharma', status: 'Active' },
  ];

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('New branch created successfully!');
    setActiveTab('all');
  };

  const handleAction = (action: string, branchName: string) => {
    toast.success(`${action} applied to ${branchName}`);
  };

  const renderBranchTable = (filterStatus?: string) => {
    const data = filterStatus ? branches.filter(b => b.status === filterStatus) : branches;
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Branch Name & Code</th>
              <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Contact Info</th>
              <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Manager</th>
              <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((b, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{b.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{b.code}</div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{b.email}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{b.phone}</div>
                </td>
                <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>{b.manager}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`admin-badge ${b.status === 'Active' ? 'admin-badge-success' : b.status === 'Suspended' ? 'admin-badge-warning' : 'admin-badge-danger'}`}>
                    {b.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="admin-btn-icon" title="View Details" onClick={() => setViewingBranch(b)}><Eye size={16} /></button>
                    <button className="admin-btn-icon" title="Edit" onClick={() => handleAction('Edit', b.name)}><Edit size={16} /></button>
                    {b.status !== 'Active' && <button className="admin-btn-icon" title="Activate" style={{ color: 'var(--success)' }} onClick={() => handleAction('Activation', b.name)}><Power size={16} /></button>}
                    {b.status === 'Active' && <button className="admin-btn-icon" title="Suspend" style={{ color: 'var(--warning)' }} onClick={() => handleAction('Suspension', b.name)}><PauseCircle size={16} /></button>}
                    <button className="admin-btn-icon" title="Archive" style={{ color: 'var(--danger)' }} onClick={() => handleAction('Archive', b.name)}><Archive size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>No branches found.</td>
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
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        {viewingBranch && (
          <button className="admin-btn-icon" onClick={() => setViewingBranch(null)}>
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {viewingBranch ? `Branch: ${viewingBranch.name}` : 'Branch Management'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>
            {viewingBranch ? `Code: ${viewingBranch.code} | Manager: ${viewingBranch.manager}` : 'Manage all library branches, managers, and configurations globally.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* SIDEBAR NAVIGATION */}
        <div className="admin-card" style={{ flex: '1 1 250px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'sticky', top: '24px' }}>
          {!viewingBranch ? (
            // MAIN NAVIGATION
            mainNav.map((item) => (
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
            ))
          ) : (
            // DETAIL NAVIGATION (When a branch is selected)
            <>
              <div style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Branch Details</div>
              {detailNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setDetailTab(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                    borderRadius: '10px', fontSize: '14px', fontWeight: detailTab === item.id ? 600 : 500,
                    background: detailTab === item.id ? 'var(--primary-subtle)' : 'transparent',
                    color: detailTab === item.id ? 'var(--primary)' : 'var(--text-secondary)',
                    border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'left'
                  }}
                >
                  <item.icon size={18} style={{ opacity: detailTab === item.id ? 1 : 0.7 }} />
                  {item.label}
                </button>
              ))}
            </>
          )}
        </div>

        {/* CONTENT AREA */}
        <div style={{ flex: '3 1 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* -------------------- MAIN DASHBOARD VIEWS -------------------- */}
          {!viewingBranch && activeTab === 'all' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>All Branches</h2>
                <button className="admin-btn-primary" onClick={() => setActiveTab('create')}><Plus size={16} /> New Branch</button>
              </div>
              {renderBranchTable()}
            </div>
          )}

          {!viewingBranch && activeTab === 'active' && (
             <div className="admin-card" style={{ padding: '24px' }}>
               <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Active Branches</h2>
               {renderBranchTable('Active')}
             </div>
          )}

          {!viewingBranch && activeTab === 'suspended' && (
             <div className="admin-card" style={{ padding: '24px' }}>
               <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Suspended Branches</h2>
               {renderBranchTable('Suspended')}
             </div>
          )}

          {!viewingBranch && activeTab === 'archived' && (
             <div className="admin-card" style={{ padding: '24px' }}>
               <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Archived Branches</h2>
               {renderBranchTable('Archived')}
             </div>
          )}

          {!viewingBranch && activeTab === 'create' && (
            <div className="admin-card" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 24px 0' }}>Create New Branch</h2>
              <form onSubmit={handleCreateBranch} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Branch Name</label>
                    <input type="text" className="admin-input" required placeholder="e.g. Downtown Central" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Branch Code</label>
                    <input type="text" className="admin-input" required placeholder="e.g. DT-CEN" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Address</label>
                  <textarea className="admin-input" required placeholder="Full physical address" style={{ minHeight: '60px' }}></textarea>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Phone Number</label>
                    <input type="text" className="admin-input" required placeholder="+91 00000 00000" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Email Address</label>
                    <input type="email" className="admin-input" required placeholder="branch@domain.com" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Working Hours</label>
                    <input type="text" className="admin-input" required placeholder="e.g. 08:00 AM - 08:00 PM" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Assign Manager</label>
                    <select className="admin-input" required>
                      <option value="">Select Manager</option>
                      <option value="user1">Vikram Singh</option>
                      <option value="user2">Anita Desai</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Initial Status</label>
                  <select className="admin-input" required>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended (Setup Phase)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button type="submit" className="admin-btn-primary">Create Branch</button>
                </div>
              </form>
            </div>
          )}

          {!viewingBranch && activeTab === 'managers' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Branch Managers</h2>
                <button className="admin-btn-primary"><Plus size={16} /> Assign Manager</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Manager Name</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Assigned Branch</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Contact Info</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Vikram Singh', branch: 'Downtown Central', email: 'vikram@lib.com', phone: '+91 9999911111', status: 'Active' },
                      { name: 'Anita Desai', branch: 'Westside Branch', email: 'anita@lib.com', phone: '+91 9999922222', status: 'Active' },
                      { name: 'Rahul Sharma', branch: 'North Hub', email: 'rahul@lib.com', phone: '+91 9999933333', status: 'Active' }
                    ].map((mgr, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{mgr.name}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{mgr.branch}</td>
                        <td style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>{mgr.email}<br/>{mgr.phone}</td>
                        <td style={{ padding: '12px' }}><span className="admin-badge admin-badge-success">{mgr.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!viewingBranch && activeTab === 'settings' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 24px 0' }}>Global Branch Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Cross-Branch Member Access</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Allow members to reserve seats across all branches.</div>
                  </div>
                  <button className="admin-btn-ghost">Enable</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Standardized Pricing</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Force all branches to use the same subscription pricing plans.</div>
                  </div>
                  <div className="admin-badge admin-badge-success">Enforced</div>
                </div>
              </div>
            </div>
          )}

          {!viewingBranch && activeTab === 'usage' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 24px 0' }}>Global Branch Usage</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={{ padding: '20px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Total Capacity (All Branches)</div>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--primary)' }}>450 Seats</div>
                </div>
                <div style={{ padding: '20px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Current Occupancy</div>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--warning)' }}>78%</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>More advanced visual charts will be placed here.</p>
            </div>
          )}

          {!viewingBranch && activeTab === 'reports' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 24px 0' }}>Branch Comparison Reports</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {[
                  { title: 'Monthly Revenue Comparison', type: 'PDF / Excel' },
                  { title: 'Occupancy Rate by Branch', type: 'PDF / Excel' },
                  { title: 'New Admissions Report', type: 'PDF / Excel' }
                ].map((rep, i) => (
                  <div key={i} style={{ padding: '20px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer' }} className="hover:border-primary">
                    <div className="admin-btn-icon" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)', marginBottom: '12px', pointerEvents: 'none' }}><BarChart size={20} /></div>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{rep.title}</h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{rep.type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* -------------------- BRANCH DETAILS VIEWS -------------------- */}
          {viewingBranch && detailTab === 'overview' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 24px 0' }}>Overview: {viewingBranch.name}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={{ padding: '20px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Total Seats</div>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--primary)' }}>120</div>
                </div>
                <div style={{ padding: '20px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Active Members</div>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--success)' }}>85</div>
                </div>
                <div style={{ padding: '20px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Revenue (MTD)</div>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--info)' }}>₹45,200</div>
                </div>
              </div>
              
              <div style={{ padding: '20px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>Contact Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><MapPin size={16} color="var(--primary)"/> <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{viewingBranch.address}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Phone size={16} color="var(--primary)"/> <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{viewingBranch.phone}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Mail size={16} color="var(--primary)"/> <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{viewingBranch.email}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><User size={16} color="var(--primary)"/> <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Manager: {viewingBranch.manager}</span></div>
                </div>
              </div>
            </div>
          )}

          {viewingBranch && detailTab === 'users' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Staff Users - {viewingBranch.name}</h2>
                <button className="admin-btn-primary">Add Staff</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Staff Name</th>
                    <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Role</th>
                    <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Amit Sharma', role: 'Librarian', status: 'Active' },
                    { name: 'Riya Das', role: 'Support Staff', status: 'Active' },
                  ].map((staff, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>{staff.name}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{staff.role}</td>
                      <td style={{ padding: '12px' }}><span className="admin-badge admin-badge-success">{staff.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {viewingBranch && detailTab === 'members' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Members - {viewingBranch.name}</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="admin-btn-ghost">Export</button>
                  <button className="admin-btn-primary">Add Member</button>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Name & ID</th>
                    <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Plan</th>
                    <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'MEM-101', name: 'John Doe', plan: 'Premium (Monthly)', status: 'Active' },
                    { id: 'MEM-102', name: 'Jane Smith', plan: 'Standard (Quarterly)', status: 'Inactive' },
                  ].map((mem, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{mem.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{mem.id}</div>
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{mem.plan}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`admin-badge ${mem.status === 'Active' ? 'admin-badge-success' : 'admin-badge-warning'}`}>{mem.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {viewingBranch && detailTab === 'reservations' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Reservations - {viewingBranch.name}</h2>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                <div style={{ flex: 1, padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Today&apos;s Reservations</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>42</div>
                </div>
                <div style={{ flex: 1, padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Available Seats Now</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)', marginTop: '4px' }}>15</div>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Seat No.</th>
                    <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Member</th>
                    <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Time Slot</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { seat: 'A-12', member: 'John Doe', time: '09:00 AM - 01:00 PM' },
                    { seat: 'B-04', member: 'Rahul Roy', time: '02:00 PM - 06:00 PM' },
                  ].map((res, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px', fontSize: '14px', color: 'var(--primary)', fontWeight: 600 }}>{res.seat}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>{res.member}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{res.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {viewingBranch && detailTab === 'reports' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Branch Reports - {viewingBranch.name}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div style={{ padding: '20px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer' }} className="hover:border-primary">
                  <BarChart size={24} color="var(--primary)" style={{ marginBottom: '12px' }} />
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Daily Attendance</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Download CSV/PDF</div>
                </div>
                <div style={{ padding: '20px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer' }} className="hover:border-primary">
                  <BarChart size={24} color="var(--info)" style={{ marginBottom: '12px' }} />
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Revenue Collection</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Download CSV/PDF</div>
                </div>
              </div>
            </div>
          )}

          {viewingBranch && detailTab === 'audit' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Audit Log - {viewingBranch.name}</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { time: 'Today, 09:30 AM', action: 'New admission approved', user: 'Vikram Singh (Manager)' },
                  { time: 'Yesterday, 06:15 PM', action: 'Branch settings updated', user: 'Admin' },
                  { time: 'Yesterday, 10:00 AM', action: 'Fee collected for MEM-101', user: 'Riya Das (Staff)' },
                ].map((log, i) => (
                  <div key={i} style={{ padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{log.action}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{log.time}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>By: {log.user}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewingBranch && detailTab === 'settings' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Branch Settings - {viewingBranch.name}</h2>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Update Manager</label>
                  <select className="admin-input">
                    <option>{viewingBranch.manager}</option>
                    <option>Anita Desai</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Operating Hours</label>
                  <input type="text" className="admin-input" defaultValue="08:00 AM - 08:00 PM" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Allow Online Bookings</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Members can book seats via app.</div>
                  </div>
                  <div className="admin-badge admin-badge-success">Enabled</div>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <button type="button" className="admin-btn-primary" onClick={() => toast.success('Settings saved!')}>Save Branch Settings</button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
