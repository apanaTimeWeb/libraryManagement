'use client';
import { useState } from 'react';
import { 
  ShieldAlert, Lock, Fingerprint, Activity, ListOrdered, 
  Ban, ShieldX, Network, FileWarning, AlertCircle, CheckCircle, Smartphone, Trash2, Globe, Key, Plus, ShieldCheck, Eye, Download
} from 'lucide-react';

export default function SecurityCenterPage() {
  const [activeTab, setActiveTab] = useState('Login Security');
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // States
  const [loginSec, setLoginSec] = useState({ maxFailed: 5, lockDuration: 30, sessionTimeout: 60, forceLogout: false });
  const [passPol, setPassPol] = useState({ upper: true, symbol: true, length: 12, expiry: 90 });
  const [twoFA, setTwoFA] = useState({ enabled: true, method: 'Authenticator App' });
  const [newIp, setNewIp] = useState('');
  
  const [ipRules, setIpRules] = useState([
    { id: 1, ip: '45.33.22.11', type: 'Blocked', reason: 'Brute Force Attack', date: '2026-09-28' },
    { id: 2, ip: '192.168.1.0/24', type: 'Allowed', reason: 'HQ Office Network', date: '2026-01-15' },
  ]);

  const [apiKeys, setApiKeys] = useState([
    { id: 'key_1', name: 'Biometric Sync Service', prefix: 'nx_live_8f92...', lastUsed: '2 mins ago', status: 'Active' },
    { id: 'key_2', name: 'SMS Gateway Webhook', prefix: 'nx_test_4a11...', lastUsed: '5 days ago', status: 'Active' }
  ]);

  const [sessions, setSessions] = useState([
    { id: 1, ip: '192.168.1.45', device: 'MacBook Pro - Chrome', time: 'Active Now', location: 'Mumbai, IN', user: 'SuperAdmin' },
    { id: 2, ip: '10.0.0.12', device: 'iPhone 13 - Safari', time: '2 hours ago', location: 'Pune, IN', user: 'Admin' },
  ]);

  const [failedLogins, setFailedLogins] = useState([
    { id: 1, ip: '45.33.22.11', user: 'admin@library.com', time: '10 mins ago', reason: 'Invalid Password' },
    { id: 2, ip: '194.22.11.9', user: 'unknown', time: '1 hour ago', reason: 'User not found' },
  ]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    showToast('Security policies updated successfully.');
  };

  const handleForceLogout = (id: number) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    showToast('Session forcefully terminated.');
  };

  const handleAddIp = () => {
    if(!newIp) return;
    setIpRules([{ id: Date.now(), ip: newIp, type: 'Blocked', reason: 'Manual Block', date: new Date().toISOString().split('T')[0] }, ...ipRules]);
    setNewIp('');
    showToast(`IP ${newIp} added to firewall rules.`);
  };

  const tabs = [
    { name: 'Login Security', icon: Lock },
    { name: 'Password Policy', icon: ListOrdered },
    { name: '2FA & MFA', icon: Fingerprint },
    { name: 'IP Firewall', icon: Globe },
    { name: 'API Keys', icon: Key },
    { name: 'Active Sessions', icon: Network },
    { name: 'Audit & Threats', icon: ShieldX },
  ];

  return (
    <div className="sa-page-animate relative pb-10">
      {saved && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-top-4 font-bold">
          <ShieldCheck size={20} /> Security settings applied system-wide!
        </div>
      )}
      {toast && !saved && (
        <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded shadow-lg animate-in slide-in-from-bottom-5 flex items-center gap-2 text-sm font-medium z-50 border border-white/10">
          <AlertCircle size={16} className="text-indigo-400" /> {toast}
        </div>
      )}

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Library OS</span><span>/</span><span>Super Admin</span><span>/</span><span>Security Center</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title flex items-center gap-3">
            <ShieldAlert className="text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" size={28} /> Security Center
          </h1>
          <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
            <AlertCircle size={14} /> Critical Zone: SuperAdmin Only
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.name 
                ? 'bg-rose-500/20 text-white border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon size={16} /> {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="sa-card p-0 h-[600px] flex flex-col overflow-hidden border-white/5">
        
        {activeTab === 'Login Security' && (
          <div className="flex-1 overflow-y-auto p-6 max-w-3xl space-y-8 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Brute Force Protection</h2>
              <p className="text-sm text-white/50 mb-4">Configure thresholds to prevent automated password guessing attacks.</p>
              
              <div className="grid grid-cols-2 gap-6 p-5 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Max Failed Attempts</label>
                  <input type="number" className="sa-input bg-black/20" value={loginSec.maxFailed} onChange={e => setLoginSec(p => ({...p, maxFailed: Number(e.target.value)}))} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Account Lockout Duration (Mins)</label>
                  <input type="number" className="sa-input bg-black/20" value={loginSec.lockDuration} onChange={e => setLoginSec(p => ({...p, lockDuration: Number(e.target.value)}))} />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-1">Session Management</h2>
              <p className="text-sm text-white/50 mb-4">Control how long users stay logged in.</p>

              <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-6">
                <div className="flex flex-col gap-2 max-w-xs">
                  <label className="text-sm font-semibold text-white/80">Idle Session Timeout (Mins)</label>
                  <input type="number" className="sa-input bg-black/20" value={loginSec.sessionTimeout} onChange={e => setLoginSec(p => ({...p, sessionTimeout: Number(e.target.value)}))} />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <h3 className="text-sm font-bold text-white">Force Logout on Password Reset</h3>
                    <p className="text-xs text-white/40 mt-1">Automatically invalidates all active tokens across devices.</p>
                  </div>
                  <label className="sa-toggle">
                    <input type="checkbox" checked={loginSec.forceLogout} onChange={e => setLoginSec(p => ({...p, forceLogout: e.target.checked}))} />
                    <span className="sa-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button onClick={handleSave} className="sa-btn-primary bg-rose-600 hover:bg-rose-500 border-none shadow-[0_0_15px_rgba(244,63,94,0.4)]">Save Security Rules</button>
            </div>
          </div>
        )}

        {activeTab === 'Password Policy' && (
          <div className="flex-1 overflow-y-auto p-6 max-w-3xl space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Enforced Password Policy</h2>
              <p className="text-sm text-white/50 mb-4">These rules apply to all SuperAdmins, Admins, and Managers.</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-white">Require Uppercase Letter</h3>
                  <p className="text-xs text-white/40 mt-1">Passwords must contain at least one uppercase letter (A-Z).</p>
                </div>
                <label className="sa-toggle">
                  <input type="checkbox" checked={passPol.upper} onChange={e => setPassPol(p => ({...p, upper: e.target.checked}))} />
                  <span className="sa-slider"></span>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-white">Require Special Character</h3>
                  <p className="text-xs text-white/40 mt-1">Passwords must contain at least one symbol (!@#$%^&*).</p>
                </div>
                <label className="sa-toggle">
                  <input type="checkbox" checked={passPol.symbol} onChange={e => setPassPol(p => ({...p, symbol: e.target.checked}))} />
                  <span className="sa-slider"></span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-6 p-4 bg-white/5 border border-white/10 rounded-xl mt-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Minimum Length</label>
                  <input type="number" className="sa-input bg-black/20" value={passPol.length} onChange={e => setPassPol(p => ({...p, length: Number(e.target.value)}))} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Force Password Expiry (Days)</label>
                  <input type="number" className="sa-input bg-black/20" value={passPol.expiry} onChange={e => setPassPol(p => ({...p, expiry: Number(e.target.value)}))} />
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button onClick={handleSave} className="sa-btn-primary bg-rose-600 hover:bg-rose-500 border-none shadow-[0_0_15px_rgba(244,63,94,0.4)]">Enforce Policy</button>
            </div>
          </div>
        )}

        {activeTab === '2FA & MFA' && (
          <div className="flex-1 overflow-y-auto p-6 max-w-3xl space-y-6 animate-fade-in">
            <div className="flex items-start gap-4 p-5 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
              <div className="p-3 bg-rose-500/20 rounded-full text-rose-400"><ShieldCheck size={24} /></div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-rose-400">System-Wide MFA Enforcement</h3>
                <p className="text-sm text-rose-200/70 mt-1 mb-4">Mandate Two-Factor Authentication for all staff accounts to prevent unauthorized access even if passwords are compromised.</p>
                <label className="sa-toggle">
                  <input type="checkbox" checked={twoFA.enabled} onChange={e => setTwoFA(p => ({...p, enabled: e.target.checked}))} />
                  <span className="sa-slider"></span>
                </label>
              </div>
            </div>

            {twoFA.enabled && (
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                <label className="text-sm font-semibold text-white/80 mb-3 block">Primary Authenticator Method</label>
                <div className="space-y-3">
                  {['Authenticator App (Google/Authy)', 'Email OTP', 'SMS OTP'].map(m => (
                    <label key={m} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 cursor-pointer hover:bg-white/5">
                      <input type="radio" name="2fa" value={m} checked={twoFA.method === m} onChange={e => setTwoFA(p => ({...p, method: e.target.value}))} className="accent-rose-500" />
                      <span className="text-sm font-medium text-white/80">{m}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-6 flex justify-end">
              <button onClick={handleSave} className="sa-btn-primary bg-rose-600 hover:bg-rose-500 border-none shadow-[0_0_15px_rgba(244,63,94,0.4)]">Update MFA Rules</button>
            </div>
          </div>
        )}

        {activeTab === 'IP Firewall' && (
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Network Access Rules</h2>
                <p className="text-sm text-white/50">Block malicious IPs or restrict admin access to specific office networks.</p>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="IP Address (e.g. 192.168.1.1)" className="sa-input w-64" value={newIp} onChange={e => setNewIp(e.target.value)} />
                <button className="sa-btn-primary bg-rose-600 border-none hover:bg-rose-500" onClick={handleAddIp}><Ban size={16} /> Block IP</button>
              </div>
            </div>

            <div className="flex-1 border border-white/5 rounded-xl overflow-hidden bg-black/20">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-white/70">
                  <tr>
                    <th className="py-3 px-4 font-semibold border-b border-white/5">IP / CIDR</th>
                    <th className="py-3 px-4 font-semibold border-b border-white/5">Rule Type</th>
                    <th className="py-3 px-4 font-semibold border-b border-white/5">Reason / Note</th>
                    <th className="py-3 px-4 font-semibold border-b border-white/5">Date Added</th>
                    <th className="py-3 px-4 font-semibold border-b border-white/5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ipRules.map(rule => (
                    <tr key={rule.id} className="hover:bg-white/5">
                      <td className="py-3 px-4 font-mono text-white">{rule.ip}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${rule.type === 'Blocked' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                          {rule.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white/70">{rule.reason}</td>
                      <td className="py-3 px-4 text-white/50">{rule.date}</td>
                      <td className="py-3 px-4">
                        <button className="text-rose-400 hover:text-rose-300" onClick={() => {
                          setIpRules(prev => prev.filter(r => r.id !== rule.id));
                          showToast(`Removed IP rule for ${rule.ip}`);
                        }}><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'API Keys' && (
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Developer API Keys</h2>
                <p className="text-sm text-white/50">Manage secret keys used for third-party integrations (Biometrics, SMS, Payment Webhooks).</p>
              </div>
              <button className="sa-btn-primary"><Plus size={16} /> Generate New Key</button>
            </div>

            <div className="grid gap-4">
              {apiKeys.map(key => (
                <div key={key.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                      <Key size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {key.name}
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded uppercase">{key.status}</span>
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <code className="text-xs text-indigo-300 font-mono bg-black/40 px-2 py-0.5 rounded">{key.prefix}</code>
                        <span className="text-xs text-white/40">Last used: {key.lastUsed}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="sa-btn-ghost sa-btn-ghost--sm text-indigo-400"><Eye size={14} /> Reveal</button>
                    <button className="sa-btn-ghost sa-btn-ghost--danger text-xs"><Ban size={14} /> Revoke</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Active Sessions' && (
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Global Active Sessions</h2>
                <p className="text-sm text-white/50">Monitor real-time logins across the entire Library OS platform.</p>
              </div>
              <button className="sa-btn-secondary text-rose-400 border-rose-500/20 hover:bg-rose-500/10">Terminate All Sessions</button>
            </div>
            
            <div className="grid gap-3">
              {sessions.map(s => (
                <div key={s.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Smartphone className="text-indigo-400" size={24} />
                    <div>
                      <h4 className="text-sm font-bold text-white">{s.user} <span className="text-white/30 font-normal">via</span> {s.ip}</h4>
                      <p className="text-xs text-secondary mt-1">{s.device} • {s.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">{s.time}</span>
                    <button onClick={() => handleForceLogout(s.id)} className="sa-btn-ghost sa-btn-ghost--danger text-xs px-3">Force Logout</button>
                  </div>
                </div>
              ))}
              {sessions.length === 0 && <p className="text-secondary text-sm">No active sessions found.</p>}
            </div>
          </div>
        )}

        {activeTab === 'Audit & Threats' && (
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-rose-400 mb-1 flex items-center gap-2"><ShieldAlert size={20}/> Suspicious Activity & Failed Logins</h2>
                <p className="text-sm text-rose-200/50">Automated threat detection logs.</p>
              </div>
              <button className="sa-btn-ghost text-indigo-400"><Download size={16} className="mr-1 inline"/> Export Logs</button>
            </div>
            
            <div className="grid gap-3">
              {failedLogins.map(f => (
                <div key={f.id} className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-center justify-between relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500/50"></div>
                  <div className="flex items-center gap-4 pl-2">
                    <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                      <ShieldX size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-rose-300 font-mono">{f.ip}</h4>
                      <p className="text-xs text-rose-200/50 mt-1">Attempted email: <span className="text-white/70">{f.user}</span></p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">{f.reason}</span>
                    <span className="text-xs text-secondary mt-1">{f.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
