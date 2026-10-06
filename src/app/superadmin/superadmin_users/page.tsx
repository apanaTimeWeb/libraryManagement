'use client';
import { useState, useMemo } from 'react';
import { Plus, Shield, ShieldCheck, Key, History, Activity, X, Trash2, Edit2, ShieldAlert, Download, Smartphone, Monitor, Globe, LogOut, CheckCircle, AlertTriangle } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { ICellRendererParams } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  branch: string;
  status: string;
  lastLogin: string;
  twoFactor: boolean;
}

interface SessionData {
  id: string;
  user: string;
  device: string;
  ip: string;
  location: string;
  lastActive: string;
  status: 'Active' | 'Revoked';
}

const INITIAL_USERS: UserData[] = [
  { id: '1', name: 'Rahul Sharma', username: 'rahul.s', email: 'rahul@nexus360.com', role: 'SuperAdmin', branch: 'Global', status: 'Active', lastLogin: '2026-09-30 09:30 AM', twoFactor: true },
  { id: '2', name: 'Amit Verma', username: 'amit.v', email: 'amit@studynest.com', role: 'Admin', branch: 'StudyNest Patna', status: 'Active', lastLogin: '2026-09-29 11:15 AM', twoFactor: false },
  { id: '3', name: 'Priya Das', username: 'priya.d', email: 'priya@studynest.com', role: 'Manager', branch: 'StudyNest Patna', status: 'Suspended', lastLogin: '2026-08-28 04:20 PM', twoFactor: false },
  { id: '4', name: 'Vikram Singh', username: 'vikram.admin', email: 'vikram@cityhub.com', role: 'Admin', branch: 'City Reading Hub', status: 'Active', lastLogin: '2026-09-30 08:00 AM', twoFactor: true },
];

const INITIAL_SESSIONS: SessionData[] = [
  { id: 's1', user: 'Rahul Sharma', device: 'MacBook Pro - Chrome', ip: '192.168.1.45', location: 'Delhi, India', lastActive: 'Just now', status: 'Active' },
  { id: 's2', user: 'Rahul Sharma', device: 'iPhone 14 Pro - Safari', ip: '117.20.34.12', location: 'Delhi, India', lastActive: '2 hours ago', status: 'Active' },
  { id: 's3', user: 'Amit Verma', device: 'Windows 11 - Edge', ip: '45.112.5.6', location: 'Patna, India', lastActive: '10 mins ago', status: 'Active' },
  { id: 's4', user: 'Priya Das', device: 'Unknown Device', ip: '103.24.55.1', location: 'Mumbai, India', lastActive: '1 month ago', status: 'Revoked' },
];

const ROLES_PERMISSIONS = [
  { module: 'Dashboard & Analytics', superadmin: true, admin: true, manager: true },
  { module: 'Library Management', superadmin: true, admin: false, manager: false },
  { module: 'Seat & Shift Allocations', superadmin: true, admin: true, manager: true },
  { module: 'Billing & Subscriptions', superadmin: true, admin: false, manager: false },
  { module: 'User Access Control', superadmin: true, admin: false, manager: false },
  { module: 'Student CRM', superadmin: true, admin: true, manager: true },
];

export default function UsersAndAccessPage() {
  const [activeTab, setActiveTab] = useState('All Users');
  const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
  const [sessions, setSessions] = useState<SessionData[]>(INITIAL_SESSIONS);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [toast, setToast] = useState('');

  // Form State
  const [formData, setFormData] = useState({ name: '', username: '', email: '', role: 'Manager', branch: 'Global', twoFactor: false });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleOpenAdd = () => {
    setEditUser(null);
    setFormData({ name: '', username: '', email: '', role: 'Manager', branch: 'Global', twoFactor: false });
    setShowModal(true);
  };

  const handleOpenEdit = (user: UserData) => {
    setEditUser(user);
    setFormData({ name: user.name, username: user.username, email: user.email, role: user.role, branch: user.branch, twoFactor: user.twoFactor });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) return;

    if (editUser) {
      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...formData } : u));
      showToast(`User ${formData.name} updated successfully.`);
    } else {
      const newUser: UserData = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        status: 'Active',
        lastLogin: 'Never',
      };
      setUsers(prev => [newUser, ...prev]);
      showToast(`User ${formData.name} created successfully.`);
    }
    setShowModal(false);
  };

  const toggleStatus = (id: string, current: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: current === 'Active' ? 'Suspended' : 'Active' } : u));
    showToast(`User status updated.`);
  };

  const handleResetPassword = (name: string) => {
    showToast(`Password reset link sent to ${name}`);
  };

  const handleRevokeSession = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'Revoked' } : s));
    showToast('Session revoked successfully.');
  };

  const tabs = [
    { name: 'All Users', icon: Shield },
    { name: 'Roles & Permissions', icon: ShieldCheck },
    { name: 'User Sessions', icon: Activity },
  ];

  const userCols: any[] = useMemo(() => [
    { 
      field: 'name', headerName: 'Name', flex: 1.2, cellClass: 'sa-cell-primary-bold',
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-2 h-full">
          <div className="sa-avatar-cell">{p.value.charAt(0)}</div>
          <div className="flex flex-col leading-tight">
            <span>{p.value}</span>
            <span className="text-[10px] text-white/40 font-normal">{p.data.username}</span>
          </div>
        </div>
      )
    },
    { field: 'email', headerName: 'Email', flex: 1.2, cellClass: 'sa-cell-muted' },
    { 
      field: 'role', headerName: 'Role', flex: 0.8,
      cellRenderer: (p: ICellRendererParams) => (
        <span className={`px-2 py-1 rounded text-[11px] font-bold ${
          p.value === 'SuperAdmin' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
          p.value === 'Admin' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
          'bg-orange-500/10 text-orange-400 border border-orange-500/20'
        }`}>
          {p.value}
        </span>
      )
    },
    { field: 'branch', headerName: 'Branch/Tenant', flex: 1, cellClass: 'sa-cell-muted' },
    { 
      field: 'twoFactor', headerName: '2FA', flex: 0.6,
      cellRenderer: (p: ICellRendererParams) => (
        p.value ? <ShieldCheck size={16} className="text-emerald-400 mt-2" /> : <ShieldAlert size={16} className="text-rose-400 mt-2" />
      )
    },
    { 
      field: 'status', headerName: 'Status', flex: 0.8,
      cellRenderer: (p: ICellRendererParams) => (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
          p.value === 'Active' ? 'text-emerald-400' : 'text-rose-400'
        }`}>
          {p.value === 'Active' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
          {p.value}
        </span>
      )
    },
    { field: 'lastLogin', headerName: 'Last Login', flex: 1, cellClass: 'sa-cell-muted-sm' },
    {
      headerName: 'Actions', flex: 1.2,
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-3 h-full">
          <button onClick={() => handleOpenEdit(p.data)} className="text-indigo-400 hover:text-indigo-300 font-medium text-xs">Edit</button>
          <button onClick={() => toggleStatus(p.data.id, p.data.status)} className="text-amber-400 hover:text-amber-300 font-medium text-xs">
            {p.data.status === 'Active' ? 'Suspend' : 'Activate'}
          </button>
          <button onClick={() => handleResetPassword(p.data.name)} className="text-sky-400 hover:text-sky-300 font-medium text-xs">Reset Pwd</button>
        </div>
      )
    }
  ], []);

  const sessionCols: any[] = useMemo(() => [
    { field: 'user', headerName: 'User', flex: 1, cellClass: 'sa-cell-primary-bold' },
    { 
      field: 'device', headerName: 'Device & Browser', flex: 1.5, cellClass: 'sa-cell-muted',
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-2 h-full">
          {p.value.includes('Mac') || p.value.includes('Windows') ? <Monitor size={14} className="text-white/40" /> : <Smartphone size={14} className="text-white/40" />}
          <span>{p.value}</span>
        </div>
      )
    },
    { field: 'ip', headerName: 'IP Address', flex: 1, cellClass: 'sa-cell-muted-sm font-mono' },
    { 
      field: 'location', headerName: 'Location', flex: 1, cellClass: 'sa-cell-muted',
      cellRenderer: (p: ICellRendererParams) => (
        <div className="flex items-center gap-2 h-full">
          <Globe size={14} className="text-white/40" /> <span>{p.value}</span>
        </div>
      )
    },
    { field: 'lastActive', headerName: 'Last Active', flex: 1, cellClass: 'sa-cell-muted' },
    {
      field: 'status', headerName: 'Status', flex: 0.8,
      cellRenderer: (p: ICellRendererParams) => (
        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
          p.value === 'Active' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
        }`}>
          {p.value}
        </span>
      )
    },
    {
      headerName: 'Action', flex: 1,
      cellRenderer: (p: ICellRendererParams) => (
        p.data.status === 'Active' ? (
          <button onClick={() => handleRevokeSession(p.data.id)} className="sa-btn-ghost sa-btn-ghost--sm text-rose-400 border-rose-500/20 px-2 py-1 h-auto text-xs flex items-center gap-1 mt-1.5">
            <LogOut size={12} /> Kill Session
          </button>
        ) : <span className="text-white/20 text-xs mt-2 block">Revoked</span>
      )
    }
  ], []);

  return (
    <div className="sa-page-animate">
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Library OS</span><span>/</span><span>Super Admin</span><span>/</span><span>Users & Access</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title">Users & Access Control</h1>
          <div className="flex items-center gap-3">
            <button className="sa-btn-secondary" onClick={() => showToast('Downloading Users Report...')}>
              <Download size={16} className="text-secondary" /> Export Users
            </button>
            <button onClick={handleOpenAdd} className="sa-btn-primary">
              <Plus size={16} /> Add User
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.name 
                ? 'bg-indigo-500/20 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon size={16} /> {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="sa-card p-0 overflow-hidden h-[600px] flex flex-col">
        {activeTab === 'All Users' && (
          <div className="flex-1 w-full">
            <AgGridReact
              theme={gridTheme}
              rowData={users}
              columnDefs={userCols}
              headerHeight={48}
              rowHeight={56}
              suppressCellFocus
              domLayout="normal"
            />
          </div>
        )}

        {activeTab === 'User Sessions' && (
          <div className="flex-1 w-full flex flex-col">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Active Sessions & Audit</h3>
                <p className="text-xs text-white/50">Monitor active user sessions and forcefully revoke access if necessary.</p>
              </div>
              <button className="sa-btn-secondary sa-btn-secondary--sm text-rose-400 border-rose-500/20 hover:bg-rose-500/10">
                <LogOut size={14} className="mr-1 inline" /> Revoke All Idle
              </button>
            </div>
            <div className="flex-1">
              <AgGridReact
                theme={gridTheme}
                rowData={sessions}
                columnDefs={sessionCols}
                headerHeight={48}
                rowHeight={56}
                suppressCellFocus
                domLayout="normal"
              />
            </div>
          </div>
        )}

        {activeTab === 'Roles & Permissions' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h3 className="text-base font-bold text-white">Role-Based Access Control (RBAC) Matrix</h3>
              <p className="text-sm text-white/50">Define which roles have access to specific SaaS modules.</p>
            </div>
            
            <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card-bg)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-white/70">
                  <tr>
                    <th className="py-3 px-4 font-semibold border-b border-white/5">Module / Feature</th>
                    <th className="py-3 px-4 font-semibold border-b border-white/5 text-center text-indigo-400">SuperAdmin</th>
                    <th className="py-3 px-4 font-semibold border-b border-white/5 text-center text-emerald-400">Admin (Tenant)</th>
                    <th className="py-3 px-4 font-semibold border-b border-white/5 text-center text-orange-400">Manager</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ROLES_PERMISSIONS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-white font-medium">{row.module}</td>
                      <td className="py-3 px-4 text-center">
                        {row.superadmin ? <CheckCircle size={16} className="text-emerald-500 mx-auto" /> : <X size={16} className="text-white/20 mx-auto" />}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.admin ? <CheckCircle size={16} className="text-emerald-500 mx-auto" /> : <X size={16} className="text-white/20 mx-auto" />}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.manager ? <CheckCircle size={16} className="text-emerald-500 mx-auto" /> : <X size={16} className="text-white/20 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="sa-btn-primary">Save RBAC Changes</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="sa-wizard-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sa-wizard-modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield size={20} className="text-primary" /> {editUser ? 'Edit User Configuration' : 'Provision New User'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white"><X size={20}/></button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Full Name</label>
                  <input type="text" className="sa-input" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Username</label>
                  <input type="text" className="sa-input" value={formData.username} onChange={e => setFormData(p => ({...p, username: e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1">Email Address</label>
                <input type="email" className="sa-input" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Role Type</label>
                  <select className="sa-input" value={formData.role} onChange={e => setFormData(p => ({...p, role: e.target.value}))}>
                    <option value="SuperAdmin">SuperAdmin (System)</option>
                    <option value="Admin">Admin (Tenant Owner)</option>
                    <option value="Manager">Manager (Staff)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Assigned Tenant/Branch</label>
                  <input type="text" className="sa-input" value={formData.branch} onChange={e => setFormData(p => ({...p, branch: e.target.value}))} />
                </div>
              </div>

              <div className="mt-4 p-3 border border-white/10 rounded-lg bg-black/20 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-400" /> Enforce 2FA</h4>
                  <p className="text-[11px] text-white/50">Require two-factor auth on next login</p>
                </div>
                <label className="sa-toggle">
                  <input type="checkbox" checked={formData.twoFactor} onChange={e => setFormData(p => ({...p, twoFactor: e.target.checked}))} />
                  <span className="sa-slider"></span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button className="sa-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="sa-btn-primary" onClick={handleSave}>{editUser ? 'Update Configuration' : 'Provision User'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-indigo-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in flex items-center gap-2 text-sm font-medium z-50">
          <CheckCircle size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}
