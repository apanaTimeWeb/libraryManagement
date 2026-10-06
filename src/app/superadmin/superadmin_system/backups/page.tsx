'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/superadmin/superadmin_system/reusable/Card';
import { Button } from '@/app/superadmin/superadmin_system/reusable/Button';
import { Badge } from '@/app/superadmin/superadmin_system/reusable/Badge';
import { KpiCard } from '@/app/superadmin/superadmin_system/reusable/KpiCard';
import { Switch } from '@/app/superadmin/superadmin_system/reusable/Switch';
import {
  Database, ChevronRight, Download, RefreshCw, CheckCircle, Clock,
  AlertTriangle, HardDrive, Shield, Cloud, Loader2
} from 'lucide-react';

interface BackupRecord {
  id: string;
  name: string;
  type: 'auto' | 'manual';
  size: string;
  createdAt: string;
  status: 'success' | 'failed' | 'in-progress';
  modules: string[];
}

const BACKUP_HISTORY: BackupRecord[] = [
  {
    id: 'bk-001', name: 'Nightly Auto Backup',    type: 'auto',   size: '4.2 MB', createdAt: '2026-04-12 02:00 AM', status: 'success',
    modules: ['Students', 'Payments', 'Attendance', 'Seats', 'Expenses'],
  },
  {
    id: 'bk-002', name: 'Nightly Auto Backup',    type: 'auto',   size: '4.1 MB', createdAt: '2026-04-11 02:00 AM', status: 'success',
    modules: ['Students', 'Payments', 'Attendance', 'Seats', 'Expenses'],
  },
  {
    id: 'bk-003', name: 'Manual Backup — Pre-Import',type: 'manual', size: '4.0 MB', createdAt: '2026-04-10 11:30 AM', status: 'success',
    modules: ['Students', 'Payments', 'Seats'],
  },
  {
    id: 'bk-004', name: 'Nightly Auto Backup',    type: 'auto',   size: '—',      createdAt: '2026-04-09 02:00 AM', status: 'failed',
    modules: [],
  },
  {
    id: 'bk-005', name: 'Nightly Auto Backup',    type: 'auto',   size: '3.9 MB', createdAt: '2026-04-08 02:00 AM', status: 'success',
    modules: ['Students', 'Payments', 'Attendance', 'Seats', 'Expenses'],
  },
  {
    id: 'bk-006', name: 'Manual Backup — Monthly',type: 'manual', size: '3.7 MB', createdAt: '2026-04-01 09:00 AM', status: 'success',
    modules: ['Students', 'Payments', 'Attendance', 'Seats', 'Expenses', 'CRM', 'WhatsApp Logs'],
  },
];

const STATUS_CFG = {
  success:     { label: 'Success',     variant: 'success' as const, icon: CheckCircle  },
  failed:      { label: 'Failed',      variant: 'danger'  as const, icon: AlertTriangle },
  'in-progress':{ label: 'In Progress', variant: 'warning' as const, icon: Loader2      },
};

export default function BackupsPage() {
  const [autoBackup, setAutoBackup]   = useState(true);
  const [cloudSync, setCloudSync]     = useState(true);
  const [backupTime, setBackupTime]   = useState('02:00');
  const [retention, setRetention]     = useState(30);
  const [creating, setCreating]       = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [backups, setBackups]         = useState<BackupRecord[]>(BACKUP_HISTORY);

  const successCount = backups.filter(b => b.status === 'success').length;
  const failedCount  = backups.filter(b => b.status === 'failed').length;
  const lastSuccess  = backups.find(b => b.status === 'success');

  const handleCreateBackup = () => {
    setCreating(true);
    setTimeout(() => {
      const newBackup: BackupRecord = {
        id: `bk-${Date.now()}`,
        name: 'Manual Backup',
        type: 'manual',
        size: '4.3 MB',
        createdAt: new Date().toLocaleString('en-IN', { hour12: true }).replace(',', ''),
        status: 'success',
        modules: ['Students', 'Payments', 'Attendance', 'Seats', 'Expenses', 'CRM'],
      };
      setBackups(prev => [newBackup, ...prev]);
      setCreating(false);
    }, 2500);
  };

  const handleDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 1500);
  };

  const handleDeleteBackup = (id: string) => {
    setBackups(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium tracking-wide mb-1">
          <span>System</span><ChevronRight size={12} /><span>Backups</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
              <Database size={28} className="text-primary" />
              Backup Manager
            </h1>
            <p className="text-on-surface-variant mt-1 text-sm">
              Automated nightly backups with cloud sync. Your data is always safe.
            </p>
          </div>
          <Button
            id="create-backup-btn"
            variant="primary"
            onClick={handleCreateBackup}
            disabled={creating}
          >
            {creating
              ? <><Loader2 size={16} className="animate-spin" /> Creating Backup...</>
              : <><Database size={16} /> 📥 Create Manual Backup</>}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <KpiCard title="Total Backups" value={backups.length}       icon="🗄️"  subtitle="All time"              />
        <KpiCard title="Successful"    value={successCount}         icon="✅"   trend="up" trendLabel="Reliable" />
        <KpiCard title="Failed"        value={failedCount}          icon="❌"   trend={failedCount > 0 ? 'down' : 'neutral'} trendLabel={failedCount > 0 ? 'Needs attention' : 'All good'} />
        <KpiCard title="Last Backup"   value={lastSuccess ? 'Today' : 'Never'} icon="🕐" subtitle={lastSuccess?.createdAt ?? '—'} />
      </div>

      {/* Backup Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Auto Backup Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={18} className="text-primary" /> Automatic Backup Schedule
            </CardTitle>
            <CardDescription>Configure nightly backup schedule and retention period.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-high border border-outline-variant">
              <div>
                <p className="text-sm font-semibold text-on-surface">Enable Nightly Backups</p>
                <p className="text-xs text-on-surface-variant">Automatically backs up all data every night</p>
              </div>
              <Switch id="auto-backup-toggle" checked={autoBackup} onCheckedChange={setAutoBackup} />
            </div>

            <div className="space-y-2">
              <label htmlFor="backup-time" className="text-sm font-medium text-on-surface-variant">Backup Time (24hr)</label>
              <div className="flex items-center gap-3">
                <input
                  id="backup-time"
                  type="time"
                  value={backupTime}
                  onChange={e => setBackupTime(e.target.value)}
                  disabled={!autoBackup}
                  className="px-3 py-2 rounded-lg bg-surface-container-highest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary disabled:opacity-40"
                />
                <span className="text-sm text-on-surface-variant">Daily at {backupTime}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="retention-days" className="text-sm font-medium text-on-surface-variant">Retention Period (days)</label>
              <div className="flex items-center gap-3">
                <input
                  id="retention-days"
                  type="number"
                  value={retention}
                  onChange={e => setRetention(+e.target.value)}
                  min={7}
                  max={365}
                  className="w-24 px-3 py-2 rounded-lg bg-surface-container-highest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
                />
                <span className="text-sm text-on-surface-variant">Old backups deleted after {retention} days</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button id="save-backup-schedule-btn" variant="primary">💾 Save Schedule</Button>
          </CardFooter>
        </Card>

        {/* Cloud Sync */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud size={18} className="text-primary" /> Cloud Sync
            </CardTitle>
            <CardDescription>Sync backups to a secure cloud storage destination.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-high border border-outline-variant">
              <div>
                <p className="text-sm font-semibold text-on-surface">Enable Cloud Sync</p>
                <p className="text-xs text-on-surface-variant">Automatically upload backups to cloud after creation</p>
              </div>
              <Switch id="cloud-sync-toggle" checked={cloudSync} onCheckedChange={setCloudSync} />
            </div>

            {cloudSync && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant">Cloud Provider</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-surface-container-highest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary">
                    <option>Google Drive</option>
                    <option>AWS S3</option>
                    <option>Dropbox</option>
                    <option>Custom S3-Compatible</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Shield size={16} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-400">Connected — Google Drive</p>
                    <p className="text-xs text-on-surface-variant">Last synced: 2026-04-12 at 02:03 AM</p>
                  </div>
                </div>
              </>
            )}

            {/* Storage usage */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span className="flex items-center gap-1"><HardDrive size={12} /> Local Storage Used</span>
                <span className="text-on-surface font-semibold">28.4 MB / 500 MB</span>
              </div>
              <div className="h-2.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div className="sys-storage-fill" />
              </div>
              <p className="text-xs text-on-surface-variant">471.6 MB remaining</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button id="save-cloud-config-btn" variant="primary">💾 Save Cloud Config</Button>
            <Button id="test-cloud-connection-btn" variant="ghost">🔌 Test Connection</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>All backup records — download or restore from any checkpoint.</CardDescription>
            </div>
            <Button id="refresh-backups-btn" variant="ghost" size="sm">
              <RefreshCw size={14} /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant text-xs uppercase tracking-wide">
                  <th className="text-left py-3 pr-4">Backup Name</th>
                  <th className="text-left py-3 pr-4">Type</th>
                  <th className="text-left py-3 pr-4">Size</th>
                  <th className="text-left py-3 pr-4">Created At</th>
                  <th className="text-left py-3 pr-4">Status</th>
                  <th className="text-left py-3 pr-4">Includes</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {backups.map((backup) => {
                  const cfg  = STATUS_CFG[backup.status as keyof typeof STATUS_CFG];
                  const Icon = cfg.icon;
                  return (
                    <tr key={backup.id} className="hover:bg-surface-container-high transition-colors group">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <Database size={14} className="text-on-surface-variant" />
                          <span className="font-medium text-on-surface">{backup.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={backup.type === 'auto' ? 'primary' : 'outline'}>
                          {backup.type === 'auto' ? '🔄 Auto' : '👤 Manual'}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs text-on-surface-variant">{backup.size}</td>
                      <td className="py-3 pr-4 text-on-surface-variant text-xs">{backup.createdAt}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={cfg.variant}>
                          <Icon size={10} className={backup.status === 'in-progress' ? 'animate-spin' : ''} />
                          {cfg.label}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-1">
                          {backup.modules.slice(0, 3).map((m: any) => (
                            <span key={m} className="text-xs px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">{m}</span>
                          ))}
                          {backup.modules.length > 3 && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">+{backup.modules.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {backup.status === 'success' && (
                            <Button
                              id={`download-backup-${backup.id}`}
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(backup.id)}
                              disabled={downloading === backup.id}
                            >
                              {downloading === backup.id
                                ? <Loader2 size={12} className="animate-spin" />
                                : <Download size={12} />}
                            </Button>
                          )}
                          <Button
                            id={`delete-backup-${backup.id}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBackup(backup.id)}
                            className="text-error hover:bg-error-container/20"
                          >
                            🗑️
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
