'use client';
import { useState, useMemo } from 'react';
import { 
  Users, UserPlus, Search, UserCheck, UserX, UserMinus, 
  RefreshCw, FolderOpen, History, Upload, CheckCircle, 
  CreditCard, Calendar, Phone, Mail, MapPin
} from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/manager/manager_reusable/gridTheme';

ModuleRegistry.registerModules([AllCommunityModule]);

const DUMMY_MEMBERS = [
  { id: 'LIB-001', name: 'Rahul Sharma', phone: '9876543210', email: 'rahul@example.com', type: 'Pro', status: 'Active', joinDate: '2026-01-10', expiryDate: '2026-12-31' },
  { id: 'LIB-002', name: 'Priya Verma', phone: '9876543211', email: 'priya@example.com', type: 'Basic', status: 'Expired', joinDate: '2025-05-15', expiryDate: '2026-05-15' },
  { id: 'LIB-003', name: 'Amit Kumar', phone: '9876543212', email: 'amit@example.com', type: 'Enterprise', status: 'Suspended', joinDate: '2026-03-20', expiryDate: '2027-03-20' },
  { id: 'LIB-004', name: 'Sneha Patel', phone: '9876543213', email: 'sneha@example.com', type: 'Pro', status: 'Active', joinDate: '2026-08-01', expiryDate: '2026-11-01' },
];

export default function MembersDashboardPage() {
  const [activeTab, setActiveTab] = useState('All Members');
  const [toast, setToast] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Member State
  const [addForm, setAddForm] = useState({
    memberId: 'LIB-' + Math.floor(1000 + Math.random() * 9000),
    name: '', phone: '', email: '', address: '', dob: '', gender: 'Male',
    department: '', membershipType: 'Pro', joinDate: '', expiryDate: '',
    guardian: '', emergencyContact: ''
  });

  const TABS = [
    { name: 'All Members', icon: Users },
    { name: 'Active Members', icon: UserCheck },
    { name: 'Expired Members', icon: UserX },
    { name: 'Suspended Members', icon: UserMinus },
    { name: 'Add Member', icon: UserPlus },
    { name: 'Member Profile', icon: Search },
    { name: 'Membership Renewal', icon: RefreshCw },
    { name: 'Member Documents', icon: FolderOpen },
    { name: 'Member History', icon: History },
  ];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Member ${addForm.name} added successfully!`);
    setAddForm({
      memberId: 'LIB-' + Math.floor(1000 + Math.random() * 9000),
      name: '', phone: '', email: '', address: '', dob: '', gender: 'Male',
      department: '', membershipType: 'Pro', joinDate: '', expiryDate: '',
      guardian: '', emergencyContact: ''
    });
  };

  const getFilteredMembers = () => {
    let filtered = DUMMY_MEMBERS;
    if (activeTab === 'Active Members') filtered = filtered.filter(m => m.status === 'Active');
    if (activeTab === 'Expired Members') filtered = filtered.filter(m => m.status === 'Expired');
    if (activeTab === 'Suspended Members') filtered = filtered.filter(m => m.status === 'Suspended');
    if (searchQuery) {
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const colDefs: any[] = useMemo(() => [
    { field: 'id', headerName: 'Member ID', width: 130, cellClass: 'font-mono text-primary' },
    { field: 'name', headerName: 'Name', flex: 1, cellClass: 'text-white font-bold' },
    { field: 'phone', headerName: 'Phone', width: 140 },
    { field: 'type', headerName: 'Plan', width: 120, cellRenderer: (p:any) => <span className="mgr-badge mgr-badge--info">{p.value}</span> },
    { field: 'status', headerName: 'Status', width: 130, 
      cellRenderer: (p: any) => {
        const colors:any = { Active: 'mgr-badge--success', Expired: 'mgr-badge--danger', Suspended: 'mgr-badge--warning' };
        return <span className={`mgr-badge ${colors[p.value]}`}>{p.value}</span>;
      }
    },
    { field: 'expiryDate', headerName: 'Expiry Date', width: 140 },
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
          <span>Members</span><span>/</span><span>Directory</span>
        </div>
        <h1 className="mgr-page-title flex items-center gap-3 mt-2">
          <Users className="text-[var(--mgr-primary)]" size={28} /> Members Management
        </h1>
        <p className="text-sm text-[var(--mgr-text-secondary)]">Complete member counter handling, profiles, and administration.</p>
      </div>

      {/* KPI Counters (Global) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Members', value: DUMMY_MEMBERS.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Active', value: DUMMY_MEMBERS.filter(m=>m.status==='Active').length, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Expired', value: DUMMY_MEMBERS.filter(m=>m.status==='Expired').length, icon: UserX, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Suspended', value: DUMMY_MEMBERS.filter(m=>m.status==='Suspended').length, icon: UserMinus, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map((kpi, i) => (
          <div key={i} className="mgr-card p-4 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer">
            <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--mgr-text-secondary)] uppercase">{kpi.label}</p>
              <h3 className="text-2xl font-black text-white">{kpi.value}</h3>
            </div>
          </div>
        ))}
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
                    ? 'bg-[var(--mgr-primary)] text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
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
          
          {/* GRIDS (All, Active, Expired, Suspended) */}
          {['All Members', 'Active Members', 'Expired Members', 'Suspended Members'].includes(activeTab) && (
            <div className="animate-fade-in h-full flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[var(--mgr-border)] pb-4">
                <h2 className="text-xl font-bold text-white">{activeTab}</h2>
                <div className="relative w-full sm:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--mgr-text-secondary)]" />
                  <input type="text" className="mgr-input pl-9" placeholder="Search by name or ID..." 
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 w-full h-[450px]">
                <AgGridReact
                  theme={gridTheme}
                  rowData={getFilteredMembers()}
                  columnDefs={colDefs}
                  headerHeight={48}
                  rowHeight={56}
                />
              </div>
            </div>
          )}

          {/* ADD MEMBER */}
          {activeTab === 'Add Member' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-2">Register New Member</h2>
              <p className="text-sm text-[var(--mgr-text-secondary)] mb-6 border-b border-[var(--mgr-border)] pb-4">Complete all mandatory fields to create a new profile.</p>
              
              <form onSubmit={handleAddSubmit} className="space-y-6">
                {/* Photo Upload Area */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-black/30 border-2 border-dashed border-[var(--mgr-primary)] flex flex-col items-center justify-center text-[var(--mgr-primary)] hover:bg-[var(--mgr-primary)]/10 cursor-pointer transition-colors">
                    <Upload size={24} className="mb-1" />
                    <span className="text-[10px] font-bold">Upload Photo</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Profile Picture</h4>
                    <p className="text-xs text-[var(--mgr-text-secondary)]">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/90">Member ID</label>
                    <input disabled type="text" className="mgr-input opacity-70" value={addForm.memberId} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/90">Full Name *</label>
                    <input required type="text" className="mgr-input" value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/90">Phone *</label>
                    <input required type="tel" className="mgr-input" value={addForm.phone} onChange={e => setAddForm({...addForm, phone: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/90">Email</label>
                    <input type="email" className="mgr-input" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/90">Date of Birth</label>
                    <input type="date" className="mgr-input" value={addForm.dob} onChange={e => setAddForm({...addForm, dob: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/90">Gender</label>
                    <select className="mgr-input" value={addForm.gender} onChange={e => setAddForm({...addForm, gender: e.target.value})}>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-3">
                    <label className="text-sm font-semibold text-white/90">Address</label>
                    <input type="text" className="mgr-input" value={addForm.address} onChange={e => setAddForm({...addForm, address: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/90">Department/Course</label>
                    <input type="text" className="mgr-input" value={addForm.department} onChange={e => setAddForm({...addForm, department: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/90">Membership Type *</label>
                    <select className="mgr-input" value={addForm.membershipType} onChange={e => setAddForm({...addForm, membershipType: e.target.value})}>
                      <option>Basic</option><option>Pro</option><option>Enterprise</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/90">Join Date *</label>
                    <input required type="date" className="mgr-input" value={addForm.joinDate} onChange={e => setAddForm({...addForm, joinDate: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/90">Expiry Date *</label>
                    <input required type="date" className="mgr-input" value={addForm.expiryDate} onChange={e => setAddForm({...addForm, expiryDate: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/90">Guardian Name</label>
                    <input type="text" className="mgr-input" value={addForm.guardian} onChange={e => setAddForm({...addForm, guardian: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/90">Emergency Contact</label>
                    <input type="tel" className="mgr-input" value={addForm.emergencyContact} onChange={e => setAddForm({...addForm, emergencyContact: e.target.value})} />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-[var(--mgr-border)]">
                  <button type="submit" className="mgr-btn-primary px-8">Save Member Profile</button>
                </div>
              </form>
            </div>
          )}

          {/* MEMBER PROFILE */}
          {activeTab === 'Member Profile' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-[var(--mgr-border)] pb-4">Search & View Profile</h2>
              <div className="flex gap-4 mb-8">
                <input type="text" className="mgr-input flex-1" placeholder="Enter Member ID or Name (e.g. LIB-001)" />
                <button className="mgr-btn-primary"><Search size={16}/> Search</button>
              </div>
              
              <div className="p-6 rounded-2xl bg-black/20 border border-[var(--mgr-border)] flex flex-col md:flex-row gap-8">
                <div className="w-32 h-32 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/50">
                  <Users size={48} className="text-blue-400" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1">Rahul Sharma</h3>
                    <p className="text-sm text-blue-400 font-bold mb-4">LIB-001 • Pro Plan</p>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2 text-[var(--mgr-text-secondary)]"><Phone size={14}/> +91 9876543210</p>
                      <p className="flex items-center gap-2 text-[var(--mgr-text-secondary)]"><Mail size={14}/> rahul@example.com</p>
                      <p className="flex items-center gap-2 text-[var(--mgr-text-secondary)]"><MapPin size={14}/> 123 Main St, New Delhi</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <p className="text-xs font-bold uppercase mb-1">Status</p>
                      <p className="text-lg font-black flex items-center gap-2"><CheckCircle size={18}/> ACTIVE</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-[var(--mgr-surface)] p-2 rounded-lg">
                        <span className="text-xs text-[var(--mgr-text-secondary)] block">Joined</span>
                        <span className="text-white font-semibold">10 Jan 2026</span>
                      </div>
                      <div className="bg-[var(--mgr-surface)] p-2 rounded-lg">
                        <span className="text-xs text-[var(--mgr-text-secondary)] block">Expires</span>
                        <span className="text-white font-semibold">31 Dec 2026</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RENEWAL */}
          {activeTab === 'Membership Renewal' && (
            <div className="animate-fade-in text-center p-12">
              <RefreshCw size={64} className="mx-auto text-[var(--mgr-primary)] opacity-50 mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Membership Renewals</h2>
              <p className="text-[var(--mgr-text-secondary)] mb-6 max-w-md mx-auto">Manage expired and upcoming expirations. Search a member to process their membership renewal.</p>
              <div className="flex justify-center gap-4 max-w-md mx-auto">
                <input type="text" className="mgr-input flex-1" placeholder="Member ID..." />
                <button className="mgr-btn-primary">Initiate Renewal</button>
              </div>
            </div>
          )}

          {/* DOCUMENTS */}
          {activeTab === 'Member Documents' && (
            <div className="animate-fade-in text-center p-12">
              <FolderOpen size={64} className="mx-auto text-yellow-500 opacity-50 mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Member Documents Vault</h2>
              <p className="text-[var(--mgr-text-secondary)] mb-6 max-w-md mx-auto">Upload and manage identity proofs, address proofs, and signed agreements for members.</p>
              <button className="mgr-btn-secondary"><Upload size={16} className="mr-2 inline"/> Upload Document</button>
            </div>
          )}

          {/* HISTORY */}
          {activeTab === 'Member History' && (
            <div className="animate-fade-in text-center p-12">
              <History size={64} className="mx-auto text-sky-500 opacity-50 mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Audit & Activity History</h2>
              <p className="text-[var(--mgr-text-secondary)] mb-6 max-w-md mx-auto">Track member check-ins, plan upgrades, and profile modifications securely.</p>
              <button className="mgr-btn-secondary"><Search size={16} className="mr-2 inline"/> Search Logs</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
