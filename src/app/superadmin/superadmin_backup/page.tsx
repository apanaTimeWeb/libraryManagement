'use client';
import { useState } from 'react';
import { 
  Database, CloudUpload, CloudDownload, HardDrive, 
  Settings, AlertTriangle, RotateCcw, Clock, CheckCircle, UploadCloud, RefreshCw, CloudRain, Save
} from 'lucide-react';

export default function BackupRestorePage() {
  const [activeTab, setActiveTab] = useState('Create Backup');
  const [showRestoreWarning, setShowRestoreWarning] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState('');

  const [history, setHistory] = useState([
    { id: '1', name: 'saas_full_db_2026_09_29.sql.gz', size: '1.2 GB', type: 'Automated (Cron)', destination: 'AWS S3', status: 'Success', date: 'Yesterday, 02:00 AM' },
    { id: '2', name: 'saas_full_db_2026_09_28.sql.gz', size: '1.2 GB', type: 'Automated (Cron)', destination: 'AWS S3', status: 'Success', date: '28 Sep 2026, 02:00 AM' },
    { id: '3', name: 'manual_snapshot_before_update.sql', size: '1.1 GB', type: 'Manual', destination: 'Local Storage', status: 'Success', date: '25 Sep 2026, 14:30 PM' }
  ]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleStartBackup = (type: string) => {
    setIsBackingUp(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsBackingUp(false);
            setHistory(prev => [{
              id: Math.random().toString(),
              name: `manual_${type}_${new Date().toISOString().split('T')[0]}.sql`,
              size: type === 'full' ? '1.2 GB' : '450 MB',
              type: 'Manual',
              destination: 'Local + S3',
              status: 'Success',
              date: 'Just now'
            }, ...prev]);
            showToast('Backup completed successfully!');
            setActiveTab('Backup History');
          }, 500);
          return 100;
        }
        return p + 10;
      });
    }, 300);
  };

  const tabs = [
    { name: 'Create Backup', icon: CloudUpload },
    { name: 'Backup History', icon: Clock },
    { name: 'Restore Point', icon: RotateCcw },
    { name: 'Automated Schedules', icon: Settings },
  ];

  return (
    <div className="sa-page-animate pb-12 relative">
      {toast && (
        <div className="fixed bottom-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded shadow-lg animate-in slide-in-from-bottom-5 flex items-center gap-2 text-sm font-medium z-50">
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Library OS</span><span>/</span><span>Super Admin</span><span>/</span><span>Backup & Restore</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title flex items-center gap-3">
            <Database className="text-emerald-500" size={28} /> Disaster Recovery & Backups
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.name 
                ? 'bg-emerald-500/20 text-white border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon size={16} /> {tab.name}
          </button>
        ))}
      </div>

      <div className="sa-card p-0 h-[600px] flex flex-col border border-white/5 overflow-hidden">
        
        {activeTab === 'Create Backup' && (
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in flex flex-col items-center justify-center">
            
            {!isBackingUp ? (
              <div className="w-full max-w-3xl space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Manual Data Snapshot</h2>
                  <p className="text-sm text-white/50">Take a secure snapshot of the entire SaaS platform before making major updates.</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 border border-emerald-500/30 bg-emerald-500/5 rounded-2xl cursor-pointer hover:bg-emerald-500/10 transition-colors relative overflow-hidden group" onClick={() => handleStartBackup('full')}>
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity"><Database size={100} className="text-emerald-500"/></div>
                    <Database className="text-emerald-400 mb-4" size={40} />
                    <h3 className="font-bold text-white text-lg mb-1">Full SaaS Backup</h3>
                    <p className="text-xs text-white/60 leading-relaxed">Includes Users, Tenants, CRM, Billing Data, Roles, and configuration files.</p>
                    <button className="mt-6 text-emerald-400 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all"><CloudUpload size={16}/> Start Full Backup</button>
                  </div>
                  
                  <div className="p-6 border border-sky-500/30 bg-sky-500/5 rounded-2xl cursor-pointer hover:bg-sky-500/10 transition-colors relative overflow-hidden group" onClick={() => handleStartBackup('partial')}>
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity"><HardDrive size={100} className="text-sky-500"/></div>
                    <HardDrive className="text-sky-400 mb-4" size={40} />
                    <h3 className="font-bold text-white text-lg mb-1">Configuration & Settings Only</h3>
                    <p className="text-xs text-white/60 leading-relaxed">Lightweight backup of tenant configs and permissions. Excludes heavy CRM data.</p>
                    <button className="mt-6 text-sky-400 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all"><CloudUpload size={16}/> Start Partial Backup</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md flex flex-col items-center justify-center text-center animate-in zoom-in-95">
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                  <CloudUpload className="text-emerald-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Compressing & Encrypting...</h2>
                <p className="text-sm text-white/50 mb-8">Please do not close this window. Syncing to AWS S3 bucket.</p>
                
                <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-emerald-400 font-bold mt-3 text-lg">{progress}% Completed</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Backup History' && (
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in flex flex-col">
            <h2 className="text-lg font-bold text-white mb-6">Backup Archive Logs</h2>
            <div className="flex-1 border border-white/5 rounded-xl overflow-hidden bg-black/20">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-white/70">
                  <tr>
                    <th className="py-3 px-4 font-semibold border-b border-white/5">Filename</th>
                    <th className="py-3 px-4 font-semibold border-b border-white/5">Size</th>
                    <th className="py-3 px-4 font-semibold border-b border-white/5">Type & Trigger</th>
                    <th className="py-3 px-4 font-semibold border-b border-white/5">Destination</th>
                    <th className="py-3 px-4 font-semibold border-b border-white/5">Timestamp</th>
                    <th className="py-3 px-4 font-semibold border-b border-white/5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.map(row => (
                    <tr key={row.id} className="hover:bg-white/5">
                      <td className="py-4 px-4 font-mono text-emerald-400 text-xs">{row.name}</td>
                      <td className="py-4 px-4 text-white/80">{row.size}</td>
                      <td className="py-4 px-4 text-white/80">{row.type}</td>
                      <td className="py-4 px-4 text-white/50 flex items-center gap-1.5"><UploadCloud size={14}/> {row.destination}</td>
                      <td className="py-4 px-4 text-white/50">{row.date}</td>
                      <td className="py-4 px-4">
                        <button className="text-indigo-400 hover:text-white flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded text-xs"><CloudDownload size={12}/> Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Restore Point' && (
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in flex flex-col items-center justify-center">
            {!showRestoreWarning ? (
              <div className="w-full max-w-2xl bg-white/5 border border-white/10 p-8 rounded-2xl text-center">
                <RotateCcw size={48} className="text-rose-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Restore Platform from Backup</h2>
                <p className="text-sm text-white/60 mb-8 leading-relaxed">
                  Restoring from a backup will **completely overwrite** the current live database. All data created after the selected backup date will be permanently lost. This action requires SuperAdmin master credentials.
                </p>
                <button 
                  className="sa-btn-primary bg-rose-600 hover:bg-rose-500 border-none shadow-[0_0_15px_rgba(225,29,72,0.4)] px-8 py-3 text-lg"
                  onClick={() => setShowRestoreWarning(true)}
                >
                  Initiate Restore Process
                </button>
              </div>
            ) : (
              <div className="w-full max-w-2xl bg-rose-500/10 border border-rose-500/30 p-8 rounded-2xl">
                <div className="flex items-center gap-3 mb-6 border-b border-rose-500/20 pb-4">
                  <AlertTriangle className="text-rose-500" size={32} />
                  <div>
                    <h2 className="text-xl font-bold text-rose-400">CRITICAL ACTION: Point-in-Time Recovery</h2>
                    <p className="text-xs text-rose-200/70 mt-1">Select a backup file to rollback the system.</p>
                  </div>
                </div>

                <label className="text-sm font-semibold text-rose-200 mb-2 block">Select Archive</label>
                <select className="sa-input bg-black/40 border-rose-500/30 text-white mb-6">
                  {history.map(h => (
                    <option key={h.id}>{h.name} ({h.date})</option>
                  ))}
                </select>

                <label className="text-sm font-semibold text-rose-200 mb-2 block">Type "I AGREE TO OVERWRITE" to confirm</label>
                <input type="text" className="sa-input bg-black/40 border-rose-500/30 text-white mb-8" placeholder="I AGREE..." />

                <div className="flex gap-4">
                  <button className="flex-1 sa-btn-ghost text-rose-300 hover:text-white" onClick={() => setShowRestoreWarning(false)}>Cancel Recovery</button>
                  <button className="flex-1 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-500 transition-colors">Confirm & Restore</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Automated Schedules' && (
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in max-w-3xl">
            <h2 className="text-lg font-bold text-white mb-2">Automated Backup Rules</h2>
            <p className="text-sm text-white/50 mb-8">Configure cron schedules for AWS S3 syncing.</p>

            <div className="space-y-6">
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2"><Database size={16} className="text-emerald-400"/> Daily Full Database Dump</h3>
                  <p className="text-xs text-white/50 mt-1">Runs every day at 02:00 AM server time.</p>
                </div>
                <label className="sa-toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="sa-slider"></span>
                </label>
              </div>

              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2"><CloudRain size={16} className="text-sky-400"/> AWS S3 Offsite Sync</h3>
                  <p className="text-xs text-white/50 mt-1">Pushes generated backups to encrypted S3 Bucket.</p>
                </div>
                <label className="sa-toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="sa-slider"></span>
                </label>
              </div>

              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                <label className="text-sm font-semibold text-white/80 block mb-2">Retention Policy (Rolling Deletion)</label>
                <select className="sa-input bg-black/40">
                  <option>Keep last 7 days</option>
                  <option>Keep last 30 days</option>
                  <option>Keep last 90 days</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="sa-btn-primary" onClick={() => showToast('Settings Saved!')}><Save size={16}/> Save Schedule Rules</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
