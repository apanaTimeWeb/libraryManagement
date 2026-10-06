'use client';
import { useState, useMemo } from 'react';
import { 
  User, UserCog, KeyRound, Fingerprint, History, 
  MonitorSmartphone, LogOut, Camera, CheckCircle, Shield,
  Smartphone, Monitor, Globe, Clock, AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function SuperAdminProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Profile');
  const [saved, setSaved] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  
  const [sessions, setSessions] = useState([
    { id: '1', device: 'MacBook Pro 16"', browser: 'Chrome 120.0', ip: '192.168.1.1', lastActive: 'Current Session', isCurrent: true, location: 'Mumbai, India' },
    { id: '2', device: 'iPhone 14 Pro', browser: 'Safari 16.5', ip: '103.45.67.89', lastActive: '2 hours ago', isCurrent: false, location: 'Delhi, India' },
    { id: '3', device: 'Windows PC', browser: 'Edge 119.0', ip: '112.134.56.78', lastActive: 'Yesterday', isCurrent: false, location: 'Pune, India' }
  ]);

  const loginHistory = [
    { id: 1, date: '2026-10-01 10:23 AM', ip: '192.168.1.1', location: 'Mumbai, India', status: 'Success', browser: 'Chrome' },
    { id: 2, date: '2026-09-30 08:15 PM', ip: '103.45.67.89', location: 'Delhi, India', status: 'Success', browser: 'Safari' },
    { id: 3, date: '2026-09-28 11:40 AM', ip: '112.134.56.78', location: 'Pune, India', status: 'Failed', browser: 'Edge' },
    { id: 4, date: '2026-09-25 09:00 AM', ip: '192.168.1.1', location: 'Mumbai, India', status: 'Success', browser: 'Chrome' },
  ];

  const tabs = [
    { name: 'Profile', icon: User },
    { name: 'Edit Profile', icon: UserCog },
    { name: 'Change Password', icon: KeyRound },
    { name: '2FA', icon: Fingerprint },
    { name: 'Login History', icon: History },
    { name: 'Active Sessions', icon: MonitorSmartphone },
    { name: 'Security Settings', icon: Shield },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleRevokeSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    handleSave();
  };

  const colDefs: any[] = useMemo(() => [
    { headerName: 'Date & Time', field: 'date', flex: 1.5, cellClass: 'text-white/90 font-medium' },
    { headerName: 'IP Address', field: 'ip', flex: 1, cellClass: 'text-secondary' },
    { headerName: 'Location', field: 'location', flex: 1.5, cellClass: 'text-white/80' },
    { headerName: 'Browser', field: 'browser', flex: 1, cellClass: 'text-secondary' },
    { headerName: 'Status', field: 'status', flex: 1,
      cellRenderer: (p: any) => (
        <span className={`sa-badge ${p.value === 'Success' ? 'sa-badge--success' : 'sa-badge--danger'}`}>
          {p.value}
        </span>
      )
    },
  ], []);

  return (
    <div className="sa-page-animate relative">
      {showLogout && (
        <div className="sa-wizard-modal-overlay" onClick={() => setShowLogout(false)}>
          <div className="sa-wizard-modal" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
            <div className="sa-wizard-modal-icon">
              <LogOut size={20} className="sa-metric--warning" />
            </div>
            <p className="sa-wizard-modal-title">Are you sure you want to logout?</p>
            <div className="flex gap-3 mt-6">
              <button className="sa-btn-ghost sa-btn-ghost--sm flex-1" onClick={() => setShowLogout(false)}>Cancel</button>
              <button className="sa-btn-ghost sa-btn-ghost--danger flex-1" onClick={() => router.push('/auth/login')}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {saved && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <CheckCircle size={16} /> Saved successfully!
        </div>
      )}

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Library OS</span><span>/</span><span>Super Admin</span><span>/</span><span>My Profile</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title flex items-center gap-3">
            <User className="text-primary" size={28} /> My Profile
          </h1>
          <button onClick={() => setShowLogout(true)} className="sa-btn-ghost sa-btn-ghost--danger text-sm font-bold">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            type="button"
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.name 
                ? 'bg-primary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon size={16} /> {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Sidebar Profile Card (Always visible) */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="sa-card p-6 flex flex-col items-center text-center sticky top-6">
            <div className="relative group cursor-pointer mb-4">
              <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold border-2 border-primary/30">
                SA
              </div>
              <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="text-white" size={28} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white">Super Admin</h2>
            <p className="text-xs text-primary font-bold tracking-widest uppercase mt-1">Platform Owner</p>
            
            <div className="w-full h-px bg-white/10 my-5" />
            
            <div className="w-full space-y-4 text-left">
              <div>
                <p className="text-xs text-secondary mb-1">Email Address</p>
                <p className="text-sm text-white font-medium">admin@nexus360.com</p>
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">Phone Number</p>
                <p className="text-sm text-white font-medium">+91 9876543210</p>
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">Account Status</p>
                <p className="text-sm text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle size={14} /> Active
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">Last Password Reset</p>
                <p className="text-sm text-white font-medium">45 Days Ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-8 lg:col-span-9 sa-card p-6 min-h-[550px]">
          
          {activeTab === 'Profile' && (
            <div className="animate-fade-in space-y-8">
              <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Personal Information</h2>
                  <p className="text-sm text-secondary">View your account profile details</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-xs text-secondary block mb-1">Full Name</label>
                  <p className="text-base text-white font-medium">Super Admin</p>
                </div>
                <div>
                  <label className="text-xs text-secondary block mb-1">Email</label>
                  <p className="text-base text-white font-medium">admin@nexus360.com</p>
                </div>
                <div>
                  <label className="text-xs text-secondary block mb-1">Phone</label>
                  <p className="text-base text-white font-medium">+91 9876543210</p>
                </div>
                <div>
                  <label className="text-xs text-secondary block mb-1">Role</label>
                  <p className="text-base text-white font-medium">Platform Owner</p>
                </div>
                <div>
                  <label className="text-xs text-secondary block mb-1">Joined Date</label>
                  <p className="text-base text-white font-medium">January 15, 2024</p>
                </div>
                <div>
                  <label className="text-xs text-secondary block mb-1">Timezone</label>
                  <p className="text-base text-white font-medium">Asia/Kolkata (IST)</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Edit Profile' && (
            <div className="max-w-2xl space-y-6 animate-fade-in">
              <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-6">
                <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <UserCog size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Edit Personal Details</h2>
                  <p className="text-sm text-secondary">Update your name, email, photo and contact information.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold border border-primary/30">
                  SA
                </div>
                <div>
                  <button className="sa-btn-secondary text-sm mb-2"><Camera size={14} className="inline mr-1"/> Change Photo</button>
                  <p className="text-xs text-secondary">Allowed JPG, GIF or PNG. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">First Name</label>
                  <input type="text" defaultValue="Super" className="sa-input" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Last Name</label>
                  <input type="text" defaultValue="Admin" className="sa-input" />
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <label className="text-sm font-semibold text-white/80">Email Address</label>
                  <input type="email" defaultValue="admin@nexus360.com" className="sa-input" />
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <label className="text-sm font-semibold text-white/80">Phone Number</label>
                  <input type="tel" defaultValue="+91 9876543210" className="sa-input" />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-3">
                <button onClick={handleSave} className="sa-btn-primary px-8">Save Changes</button>
                <button className="sa-btn-ghost">Cancel</button>
              </div>
            </div>
          )}

          {activeTab === 'Change Password' && (
            <div className="max-w-xl space-y-6 animate-fade-in">
              <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-6">
                <div className="p-3 rounded-lg bg-orange-500/20 text-orange-400">
                  <KeyRound size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Change Password</h2>
                  <p className="text-sm text-secondary">Ensure your account uses a long, random password to stay secure.</p>
                </div>
              </div>
              
              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Current Password</label>
                  <input type="password" placeholder="••••••••" className="sa-input" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">New Password</label>
                  <input type="password" placeholder="••••••••" className="sa-input" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="sa-input" />
                </div>

                <div className="pt-6 border-t border-white/5">
                  <button onClick={handleSave} className="sa-btn-primary">Update Password</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === '2FA' && (
            <div className="max-w-3xl space-y-6 animate-fade-in">
              <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-6">
                <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                  <Fingerprint size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Two-Factor Authentication</h2>
                  <p className="text-sm text-secondary">Add an extra layer of security to your account.</p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">Authenticator App</h3>
                  <p className="text-sm text-secondary">Use an app like Google Authenticator to generate codes.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold ${twoFactorEnabled ? 'text-emerald-400' : 'text-secondary'}`}>
                    {twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={twoFactorEnabled} onChange={() => { setTwoFactorEnabled(!twoFactorEnabled); handleSave(); }} />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              {twoFactorEnabled && (
                <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
                  <h4 className="text-sm font-bold text-white mb-4">Recovery Codes</h4>
                  <p className="text-sm text-secondary mb-4">If you lose your device, use these codes to regain access to your account. Keep them in a safe place.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {['X89A-B7F2', 'P4Q2-M9L1', 'Z5R8-T3K6', 'W2V1-N4C8'].map(code => (
                      <div key={code} className="bg-black/40 p-2 text-center text-white/80 font-mono text-sm rounded border border-white/5 tracking-wider">
                        {code}
                      </div>
                    ))}
                  </div>
                  <button className="sa-btn-ghost sa-btn-ghost--sm text-xs"><History size={14}/> Regenerate Codes</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Login History' && (
            <div className="h-full flex flex-col animate-fade-in">
              <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-6">
                <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                  <History size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Login History</h2>
                  <p className="text-sm text-secondary">Review your recent account login activity.</p>
                </div>
              </div>
              <div className="flex-1 w-full mt-2">
                <AgGridReact 
                  theme={gridTheme} 
                  rowData={loginHistory} 
                  columnDefs={colDefs} 
                  headerHeight={48} 
                  rowHeight={56} 
                  suppressCellFocus 
                  domLayout="normal" 
                />
              </div>
            </div>
          )}

          {activeTab === 'Active Sessions' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-pink-500/20 text-pink-400">
                    <MonitorSmartphone size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Active Sessions</h2>
                    <p className="text-sm text-secondary">Devices currently logged into your account.</p>
                  </div>
                </div>
                <button className="sa-btn-ghost sa-btn-ghost--danger text-sm" onClick={handleSave}>Log Out All Other Devices</button>
              </div>

              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="p-5 rounded-xl border border-white/10 bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${session.isCurrent ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60'}`}>
                        {session.device.includes('iPhone') ? <Smartphone size={20} /> : <Monitor size={20} />}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          {session.device} 
                          {session.isCurrent && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase tracking-wider">Current</span>}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-secondary mt-1">
                          <span className="flex items-center gap-1"><Globe size={12}/> {session.browser}</span>
                          <span className="w-1 h-1 rounded-full bg-white/20"></span>
                          <span>IP: {session.ip}</span>
                          <span className="w-1 h-1 rounded-full bg-white/20"></span>
                          <span>{session.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-secondary mt-2">
                          <Clock size={12}/> Last active: {session.lastActive}
                        </div>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <button onClick={() => handleRevokeSession(session.id)} className="sa-btn-secondary text-sm border-red-500/30 text-red-400 hover:bg-red-500/10">
                        Log Out Device
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Security Settings' && (
            <div className="max-w-3xl space-y-6 animate-fade-in">
              <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-6">
                <div className="p-3 rounded-lg bg-teal-500/20 text-teal-400">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Security Settings</h2>
                  <p className="text-sm text-secondary">Manage security alerts and account protection.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={20} className="text-yellow-500" />
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">Unrecognized Login Alerts</h3>
                      <p className="text-sm text-secondary">Receive an email when your account is logged into from a new device.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input type="checkbox" className="sr-only peer" checked={loginAlerts} onChange={() => { setLoginAlerts(!loginAlerts); handleSave(); }} />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="p-5 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Password Expiry</h3>
                    <p className="text-sm text-secondary">Force password change every 90 days for better security.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input type="checkbox" className="sr-only peer" checked={true} readOnly />
                    <div className="w-11 h-6 bg-primary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
