'use client';
// RESPONSIBILITY: Renders the Admin Members management module
// DATA FLOW: Next.js Router -> Page

import React, { useState } from 'react';
import { 
  Users, UserPlus, Tags, Building, BookOpen, RotateCcw, 
  CheckCircle, AlertTriangle, PauseCircle, Ban, UploadCloud, 
  DownloadCloud, FileText, ArrowLeft, Edit, Calendar,
  MapPin, Phone, Mail, Activity, CreditCard, Banknote, HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

type MainTab = 'all' | 'add' | 'categories' | 'departments' | 'plans' | 'renewal' | 'active' | 'expired' | 'suspended' | 'blocked' | 'import' | 'export' | 'documents';
type DetailTab = 'profile' | 'membership' | 'renewalHistory' | 'paymentHistory' | 'lostHistory' | 'activityHistory' | 'documents' | 'attendance';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: 'Active' | 'Expired' | 'Suspended' | 'Blocked';
  expiryDate: string;
}

export default function AdminMembersPage() {
  const [activeTab, setActiveTab] = useState<MainTab>('all');
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('profile');

  const mainNav: { id: MainTab; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'all', label: 'All Members', icon: Users, color: 'var(--primary)' },
    { id: 'add', label: 'Add Member', icon: UserPlus, color: 'var(--success)' },
    { id: 'categories', label: 'Member Categories', icon: Tags, color: 'var(--purple)' },
    { id: 'departments', label: 'Departments', icon: Building, color: 'var(--info)' },
    { id: 'plans', label: 'Membership Plans', icon: BookOpen, color: 'var(--cyan)' },
    { id: 'renewal', label: 'Membership Renewal', icon: RotateCcw, color: 'var(--warning)' },
    { id: 'active', label: 'Active Members', icon: CheckCircle, color: 'var(--success)' },
    { id: 'expired', label: 'Expired Members', icon: AlertTriangle, color: 'var(--danger)' },
    { id: 'suspended', label: 'Suspended Members', icon: PauseCircle, color: 'var(--warning)' },
    { id: 'blocked', label: 'Blocked Members', icon: Ban, color: 'var(--danger)' },
    { id: 'import', label: 'Import Members', icon: UploadCloud, color: 'var(--primary)' },
    { id: 'export', label: 'Export Members', icon: DownloadCloud, color: 'var(--primary)' },
    { id: 'documents', label: 'Member Documents', icon: FileText, color: 'var(--purple)' },
  ];

  const detailNav: { id: DetailTab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'membership', label: 'Membership Info', icon: BookOpen },
    { id: 'renewalHistory', label: 'Renewal History', icon: RotateCcw },
    { id: 'paymentHistory', label: 'Payment History', icon: CreditCard },
    { id: 'lostHistory', label: 'Lost/Damaged History', icon: AlertTriangle },
    { id: 'activityHistory', label: 'Activity History', icon: Activity },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  const dummyMembers: Member[] = [
    { id: 'MEM-001', name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210', plan: 'Premium (Monthly)', status: 'Active', expiryDate: '2026-10-30' },
    { id: 'MEM-002', name: 'Jane Smith', email: 'jane@example.com', phone: '+91 9876543211', plan: 'Standard (Quarterly)', status: 'Expired', expiryDate: '2026-09-01' },
    { id: 'MEM-003', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 9876543212', plan: 'Premium (Yearly)', status: 'Suspended', expiryDate: '2027-01-15' },
    { id: 'MEM-004', name: 'Sneha Verma', email: 'sneha@example.com', phone: '+91 9876543213', plan: 'Standard (Monthly)', status: 'Blocked', expiryDate: '2026-12-01' },
  ];

  const handleAction = (action: string, memberName: string) => {
    toast.success(`${action} applied to ${memberName}`);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('New member registered successfully!');
    setActiveTab('all');
  };

  const openMemberDetails = (mem: Member) => {
    setViewingMember(mem);
    setDetailTab('profile');
  };

  const renderMemberTable = (filterStatus?: string) => {
    const data = filterStatus ? dummyMembers.filter(m => m.status === filterStatus) : dummyMembers;
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Member Name & ID</th>
              <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Contact Info</th>
              <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Membership Plan</th>
              <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Expiry Date</th>
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
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{m.email}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.phone}</div>
                </td>
                <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{m.plan}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{m.expiryDate}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`admin-badge ${m.status === 'Active' ? 'admin-badge-success' : m.status === 'Expired' ? 'admin-badge-danger' : m.status === 'Suspended' ? 'admin-badge-warning' : 'admin-badge-danger'}`}>
                    {m.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button className="admin-btn-primary" style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }} onClick={() => openMemberDetails(m)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>No members found.</td>
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
        {viewingMember && (
          <button className="admin-btn-icon" onClick={() => setViewingMember(null)}>
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {viewingMember ? `Member: ${viewingMember.name}` : 'Member Management'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>
            {viewingMember ? `ID: ${viewingMember.id} | Status: ${viewingMember.status}` : 'Manage all library members, subscriptions, renewals, and histories.'}
          </p>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      {!viewingMember && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {[
            { label: 'Total Members', value: '1,248', icon: Users, color: 'var(--primary)' },
            { label: 'Active Members', value: '984', icon: CheckCircle, color: 'var(--success)' },
            { label: 'New This Month', value: '+45', icon: UserPlus, color: 'var(--purple)' },
            { label: 'Pending Renewals', value: '12', icon: AlertTriangle, color: 'var(--danger)' }
          ].map((kpi, i) => (
            <div key={i} className="admin-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', transition: 'transform 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: `${kpi.color}15`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {React.createElement(kpi.icon as React.ElementType, { size: 28 })}
              </div>
              <div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TOP SCROLLABLE NAVIGATION TABS */}
      <div className="admin-card" style={{ padding: '8px', display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', whiteSpace: 'nowrap', WebkitOverflowScrolling: 'touch' }}>
        {!viewingMember ? (
          mainNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
                borderRadius: '8px', fontSize: '13px', fontWeight: activeTab === item.id ? 600 : 500,
                background: activeTab === item.id ? 'var(--primary-subtle)' : 'transparent',
                color: activeTab === item.id ? 'var(--primary)' : 'var(--text-secondary)',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0
              }}
            >
              <item.icon size={16} style={{ color: activeTab === item.id ? 'var(--primary)' : item.color }} />
              {item.label}
            </button>
          ))
        ) : (
          detailNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setDetailTab(item.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
                borderRadius: '8px', fontSize: '13px', fontWeight: detailTab === item.id ? 600 : 500,
                background: detailTab === item.id ? 'var(--primary-subtle)' : 'transparent',
                color: detailTab === item.id ? 'var(--primary)' : 'var(--text-secondary)',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0
              }}
            >
              <item.icon size={16} style={{ opacity: detailTab === item.id ? 1 : 0.7 }} />
              {item.label}
            </button>
          ))
        )}
      </div>

      {/* CONTENT AREA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* -------------------- MAIN DASHBOARD VIEWS -------------------- */}
          {!viewingMember && activeTab === 'all' && (
             <div className="admin-card" style={{ padding: '24px' }}>
               <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>All Members</h2>
               {renderMemberTable()}
             </div>
          )}
          {!viewingMember && activeTab === 'active' && (
             <div className="admin-card" style={{ padding: '24px' }}>
               <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Active Members</h2>
               {renderMemberTable('Active')}
             </div>
          )}
          {!viewingMember && activeTab === 'expired' && (
             <div className="admin-card" style={{ padding: '24px' }}>
               <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Expired Members</h2>
               {renderMemberTable('Expired')}
             </div>
          )}
          {!viewingMember && activeTab === 'suspended' && (
             <div className="admin-card" style={{ padding: '24px' }}>
               <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Suspended Members</h2>
               {renderMemberTable('Suspended')}
             </div>
          )}
          {!viewingMember && activeTab === 'blocked' && (
             <div className="admin-card" style={{ padding: '24px' }}>
               <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Blocked Members</h2>
               {renderMemberTable('Blocked')}
             </div>
          )}

          {/* ADD MEMBER FORM */}
          {!viewingMember && activeTab === 'add' && (
            <div className="admin-card" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 24px 0' }}>Register New Member</h2>
              <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Personal Info */}
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Personal Information</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px dashed var(--border)', flexShrink: 0 }}>
                    <UploadCloud size={24} color="var(--text-secondary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Profile Photo</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Max 2MB (JPG/PNG)</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div><label className="admin-label">Member ID</label><input type="text" className="admin-input" defaultValue="MEM-005" readOnly /></div>
                  <div><label className="admin-label">Full Name</label><input type="text" className="admin-input" required placeholder="e.g. John Doe" /></div>
                  <div><label className="admin-label">Date of Birth</label><input type="date" className="admin-input" required /></div>
                  <div>
                    <label className="admin-label">Gender</label>
                    <select className="admin-input" required>
                      <option value="">Select Gender</option><option value="M">Male</option><option value="F">Female</option><option value="O">Other</option>
                    </select>
                  </div>
                </div>

                {/* Contact Info */}
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Contact Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div><label className="admin-label">Phone Number</label><input type="text" className="admin-input" required placeholder="+91 00000 00000" /></div>
                  <div><label className="admin-label">Email Address</label><input type="email" className="admin-input" required placeholder="email@domain.com" /></div>
                  <div style={{ gridColumn: '1 / -1' }}><label className="admin-label">Full Address</label><textarea className="admin-input" required placeholder="Street, City, State, ZIP" style={{ minHeight: '60px' }}></textarea></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div><label className="admin-label">Guardian Name (Optional)</label><input type="text" className="admin-input" placeholder="Name" /></div>
                  <div><label className="admin-label">Emergency Contact</label><input type="text" className="admin-input" required placeholder="Phone number" /></div>
                </div>

                {/* Academic & Membership */}
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Academic & Membership</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div>
                    <label className="admin-label">Department / Stream</label>
                    <select className="admin-input">
                      <option>Science</option><option>Arts</option><option>Commerce</option>
                    </select>
                  </div>
                  <div><label className="admin-label">Course / Class</label><input type="text" className="admin-input" placeholder="e.g. B.Tech 2nd Year" /></div>
                  <div>
                    <label className="admin-label">Membership Type/Plan</label>
                    <select className="admin-input" required>
                      <option>Premium (Monthly)</option><option>Standard (Quarterly)</option>
                    </select>
                  </div>
                  <div>
                    <label className="admin-label">Status</label>
                    <select className="admin-input" required>
                      <option>Active</option><option>Suspended</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div><label className="admin-label">Join Date</label><input type="date" className="admin-input" required /></div>
                  <div><label className="admin-label">Expiry Date</label><input type="date" className="admin-input" required /></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button type="submit" className="admin-btn-primary"><UserPlus size={16} /> Register Member</button>
                </div>
              </form>
            </div>
          )}

          {/* GLOBAL CONFIG VIEWS */}
          {!viewingMember && activeTab === 'categories' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Member Categories</h2>
                <button className="admin-btn-primary"><Tags size={16} style={{ marginRight: '8px' }} /> Add Category</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {[
                  { name: 'Student', members: 124, color: 'var(--primary)' },
                  { name: 'Professional', members: 45, color: 'var(--purple)' },
                  { name: 'VIP Member', members: 12, color: 'var(--warning)' },
                ].map((cat, i) => (
                  <div key={i} style={{ padding: '20px', borderRadius: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${cat.color}20`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Tags size={24} /></div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{cat.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{cat.members} active members</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!viewingMember && activeTab === 'departments' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Departments & Streams</h2>
                <button className="admin-btn-primary" style={{ background: 'var(--info)', borderColor: 'var(--info)' }}><Building size={16} style={{ marginRight: '8px' }} /> Add Department</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '400px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Department Name</th>
                    <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Head / HOD</th>
                    <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Members Count</th>
                  </tr>
                </thead>
                <tbody>
                  {[ { n: 'Science (B.Sc / M.Sc)', h: 'Dr. Sharma', c: 85 }, { n: 'Engineering (B.Tech)', h: 'Prof. Verma', c: 156 } ].map((dep, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{dep.n}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{dep.h}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: 'var(--primary)', fontWeight: 700 }}>{dep.c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!viewingMember && activeTab === 'plans' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Membership Plans</h2>
                <button className="admin-btn-primary" style={{ background: 'var(--cyan)', borderColor: 'var(--cyan)' }}><BookOpen size={16} style={{ marginRight: '8px' }} /> Create Plan</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {[
                  { title: 'Standard Monthly', price: '₹500', dur: '1 Month', features: ['Basic Seat', 'Wifi (2GB)', 'Locker Not Included'] },
                  { title: 'Premium Quarterly', price: '₹1400', dur: '3 Months', features: ['AC Seat', 'Unlimited Wifi', 'Locker Included'] },
                ].map((plan, i) => (
                  <div key={i} style={{ padding: '24px', borderRadius: '16px', background: 'var(--bg-glass)', border: `2px solid ${i === 1 ? 'var(--primary)' : 'var(--border)'}`, position: 'relative' }}>
                    {i === 1 && <span style={{ position: 'absolute', top: '-12px', right: '20px', background: 'var(--primary)', color: '#fff', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontWeight: 700 }}>MOST POPULAR</span>}
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{plan.title}</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>{plan.price}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Duration: {plan.dur}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                      {plan.features.map((f, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}><CheckCircle size={14} color="var(--success)" /> {f}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!viewingMember && activeTab === 'renewal' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Upcoming Renewals</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Member</th>
                    <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Current Plan</th>
                    <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Expiry In</th>
                    <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[ { m: 'John Doe', p: 'Premium Monthly', e: '2 Days' }, { m: 'Anita Desai', p: 'Standard Yearly', e: '1 Week' } ].map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{r.m}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{r.p}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: 'var(--danger)', fontWeight: 600 }}>{r.e}</td>
                      <td style={{ padding: '12px' }}>
                        <button className="admin-btn-primary" style={{ padding: '6px 16px', fontSize: '12px', background: 'var(--warning)', borderColor: 'var(--warning)', color: '#000' }} onClick={() => handleAction('Sent Renewal Reminder to', r.m)}>Send Reminder</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!viewingMember && activeTab === 'import' && (
            <div className="admin-card" style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                <UploadCloud size={40} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0' }}>Bulk Import Members</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 32px auto' }}>Upload an Excel (.xlsx) or CSV file containing member records to add them instantly.</p>
              <div style={{ padding: '40px', border: '2px dashed var(--border)', borderRadius: '16px', background: 'var(--bg-glass)', cursor: 'pointer', maxWidth: '500px', margin: '0 auto' }}>
                <span style={{ fontSize: '16px', color: 'var(--primary)', fontWeight: 600 }}>Click to Browse File</span> or drag and drop here
              </div>
              <div style={{ marginTop: '24px' }}>
                <button className="admin-btn-ghost" style={{ fontSize: '13px' }}><DownloadCloud size={14} style={{ marginRight: '6px' }}/> Download Template File</button>
              </div>
            </div>
          )}

          {!viewingMember && activeTab === 'export' && (
            <div className="admin-card" style={{ padding: '40px', textAlign: 'center' }}>
               <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--success)', opacity: 0.1, position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '40px' }} />
               <DownloadCloud size={40} color="var(--success)" style={{ margin: '20px auto 24px auto', display: 'block', position: 'relative' }} />
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0' }}>Export Members Data</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Download your complete member database or filter by status.</p>
              
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'left', width: '250px' }}>
                  <label className="admin-label">Filter by Status</label>
                  <select className="admin-input">
                    <option>All Members</option><option>Active Only</option><option>Expired Only</option>
                  </select>
                </div>
                <div style={{ textAlign: 'left', width: '250px' }}>
                  <label className="admin-label">Filter by Plan</label>
                  <select className="admin-input">
                    <option>All Plans</option><option>Premium</option><option>Standard</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '32px' }}>
                <button className="admin-btn-primary" style={{ background: 'var(--success)', borderColor: 'var(--success)' }}><FileText size={16} style={{ marginRight: '8px' }}/> Export as CSV</button>
                <button className="admin-btn-primary" style={{ background: '#107c41', borderColor: '#107c41' }}><FileText size={16} style={{ marginRight: '8px' }}/> Export as Excel</button>
              </div>
            </div>
          )}

          {!viewingMember && activeTab === 'documents' && (
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Global Member Documents</h2>
                <input type="text" className="admin-input" placeholder="Search by Member ID..." style={{ width: '300px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {[
                  { mem: 'MEM-001 (John Doe)', type: 'Aadhar Card', date: '15 Jan 2026' },
                  { mem: 'MEM-002 (Jane Smith)', type: 'College ID', date: '20 Jan 2026' },
                  { mem: 'MEM-003 (Rahul)', type: 'Photo ID', date: '05 Feb 2026' },
                ].map((doc, i) => (
                  <div key={i} style={{ padding: '20px', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'center' }}>
                    <FileText size={32} color="var(--purple)" style={{ marginBottom: '12px' }} />
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{doc.type}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{doc.mem}</div>
                    <button className="admin-btn-ghost" style={{ padding: '4px 12px', fontSize: '11px' }}>View / Download</button>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* -------------------- DETAILED MEMBER VIEW -------------------- */}
          {viewingMember && (
            <>
              {/* Member Quick Action Header */}
              <div className="admin-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div className="admin-avatar" style={{ width: '80px', height: '80px', fontSize: '32px', background: 'var(--icon-bg-primary)', color: 'var(--primary)', flexShrink: 0 }}>
                      {viewingMember.name.charAt(0)}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        {viewingMember.name} 
                        <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>({viewingMember.id})</span>
                        <span className={`admin-badge ${viewingMember.status === 'Active' ? 'admin-badge-success' : viewingMember.status === 'Expired' ? 'admin-badge-danger' : viewingMember.status === 'Suspended' ? 'admin-badge-warning' : 'admin-badge-danger'}`}>
                          {viewingMember.status}
                        </span>
                      </h2>
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} color="var(--primary)"/> {viewingMember.phone}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} color="var(--info)"/> {viewingMember.email}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><BookOpen size={14} color="var(--purple)"/> Plan: {viewingMember.plan}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button className="admin-btn-ghost" onClick={() => handleAction('Edit Member', viewingMember.name)}><Edit size={16} /> Edit</button>
                    <button className="admin-btn-primary" onClick={() => handleAction('Renew Membership', viewingMember.name)}><RotateCcw size={16} /> Renew</button>
                    <button className="admin-btn-primary" style={{ background: 'var(--purple)', borderColor: 'var(--purple)' }} onClick={() => handleAction('Reserve Seat', viewingMember.name)}><MapPin size={16} /> Reserve</button>
                    <button className="admin-btn-ghost" style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }} onClick={() => handleAction('Collect Fine', viewingMember.name)}><Banknote size={16} /> Collect Fine</button>
                    {viewingMember.status === 'Active' && <button className="admin-btn-ghost" style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }} onClick={() => handleAction('Suspend', viewingMember.name)}><PauseCircle size={14} /> Suspend</button>}
                    {(viewingMember.status === 'Suspended' || viewingMember.status === 'Blocked') && <button className="admin-btn-ghost" style={{ color: 'var(--success)', borderColor: 'var(--success)' }} onClick={() => handleAction('Reactivate', viewingMember.name)}><CheckCircle size={14} /> Reactivate</button>}
                    {viewingMember.status !== 'Blocked' && <button className="admin-btn-ghost-danger" onClick={() => handleAction('Block', viewingMember.name)}><Ban size={14} /> Block</button>}
                  </div>
                </div>
              </div>

              {/* DETAILS TABS CONTENT */}
              <div className="admin-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {detailNav.find(n => n.id === detailTab)?.icon && React.createElement(detailNav.find(n => n.id === detailTab)?.icon as React.ElementType, { size: 20, color: 'var(--primary)' })}
                  {detailNav.find(n => n.id === detailTab)?.label}
                </h3>

                {detailTab === 'profile' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Full Address</div>
                      <div style={{ fontSize: '15px', color: 'var(--text-primary)' }}>123, Sample Street, Sector 4, New Delhi - 110001</div>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Date of Birth & Gender</div>
                      <div style={{ fontSize: '15px', color: 'var(--text-primary)' }}>14 Aug 2002 • Male</div>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Department / Course</div>
                      <div style={{ fontSize: '15px', color: 'var(--text-primary)' }}>Science / B.Tech CSE</div>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Emergency Contact</div>
                      <div style={{ fontSize: '15px', color: 'var(--text-primary)' }}>Father: +91 88888 88888</div>
                    </div>
                  </div>
                )}

                {detailTab === 'membership' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div style={{ padding: '20px', border: '1px solid var(--primary)', borderRadius: '12px', background: 'var(--primary-subtle)', textAlign: 'center' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Current Plan</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>{viewingMember.plan}</div>
                    </div>
                    <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-glass)', textAlign: 'center' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Join Date</div>
                      <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>15 Jan 2026</div>
                    </div>
                    <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-glass)', textAlign: 'center' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Expiry Date</div>
                      <div style={{ fontSize: '18px', fontWeight: 600, color: viewingMember.status === 'Expired' ? 'var(--danger)' : 'var(--success)' }}>{viewingMember.expiryDate}</div>
                    </div>
                  </div>
                )}

                {detailTab === 'renewalHistory' && (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Date</th>
                        <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Plan</th>
                        <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Amount</th>
                        <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>15 Jan 2026</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>Premium (Monthly)</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>₹999</td>
                        <td style={{ padding: '12px' }}><span className="admin-badge admin-badge-success">Success</span></td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {detailTab === 'paymentHistory' && (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Transaction ID</th>
                        <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Type</th>
                        <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Amount</th>
                        <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--primary)', fontWeight: 600 }}>TXN-98213</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>Membership Fee</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>₹999</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>15 Jan 2026</td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {detailTab === 'attendance' && (
                  <div>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                         <div style={{ width: '16px', height: '16px', background: 'var(--success)', borderRadius: '4px' }}/> Present
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                         <div style={{ width: '16px', height: '16px', background: 'var(--danger)', borderRadius: '4px' }}/> Absent
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                         <div style={{ width: '16px', height: '16px', background: 'var(--warning)', borderRadius: '4px' }}/> Late / Half-day
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                         <div style={{ width: '16px', height: '16px', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: '4px' }}/> Upcoming / Holiday
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' }}>
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', paddingBottom: '8px' }}>{d}</div>
                      ))}
                      {/* empty days for offset */}
                      {Array.from({length: 2}).map((_, i) => <div key={`empty-${i}`}/>)}
                      
                      {/* actual days */}
                      {Array.from({length: 31}).map((_, i) => {
                        const day = i + 1;
                        let statusColor = 'var(--bg-glass)'; // upcoming
                        if (day < 25) {
                           statusColor = day % 7 === 0 ? 'var(--danger)' : day % 5 === 0 ? 'var(--warning)' : 'var(--success)';
                        }
                        return (
                          <div key={day} style={{ 
                            aspectRatio: '1/1', background: statusColor, borderRadius: '8px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '15px', fontWeight: 600, color: statusColor === 'var(--bg-glass)' ? 'var(--text-secondary)' : '#fff',
                            border: statusColor === 'var(--bg-glass)' ? '1px solid var(--border)' : 'none',
                            boxShadow: statusColor !== 'var(--bg-glass)' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                          }}>
                            {day}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Absentee Report Section */}
                    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Absentee Report & Leaves</h3>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '400px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                              <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Date</th>
                              <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Status</th>
                              <th style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>Reason / Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { date: '14 Oct 2026', status: 'Absent', reason: 'Uninformed' },
                              { date: '07 Oct 2026', status: 'Absent', reason: 'Medical Leave' },
                              { date: '02 Oct 2026', status: 'Late', reason: 'Arrived 2 hours late' },
                            ].map((abs, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '12px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{abs.date}</td>
                                <td style={{ padding: '12px' }}>
                                  <span className={`admin-badge ${abs.status === 'Absent' ? 'admin-badge-danger' : 'admin-badge-warning'}`}>{abs.status}</span>
                                </td>
                                <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>{abs.reason}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {['lostHistory', 'activityHistory', 'documents'].includes(detailTab) && (
                   <div style={{ padding: '40px 20px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                     <HelpCircle size={32} style={{ color: 'var(--text-tertiary)', marginBottom: '12px', opacity: 0.5 }} />
                     <div style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>No records found for {detailNav.find(n => n.id === detailTab)?.label}.</div>
                   </div>
                )}
              </div>
            </>
          )}

      </div>
    </div>
  );
}
