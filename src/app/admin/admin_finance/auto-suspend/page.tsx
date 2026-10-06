'use client';

// RESPONSIBILITY: Entry page for the admin_finance module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useEffect } from 'react';

import toast from 'react-hot-toast';
import { Settings, Ban, RotateCcw, Bell, Save, UserCheck, ShieldAlert } from 'lucide-react';

type Config = { daysBeforeSuspend: number; currentlySuspended: number; autoRestoredThisMonth: number; manualRestores: number };
type SuspendedStudent = { id: number; studentId: number; studentName: string; smartId: string; seat: string; shift: string; daysOverdue: number; suspendedSince: string };

const MOCK_CONFIG: Config = { daysBeforeSuspend: 7, currentlySuspended: 4, autoRestoredThisMonth: 2, manualRestores: 1 };
const MOCK_SUSPENDED: SuspendedStudent[] = [
  { id: 1, studentId: 101, studentName: 'Rahul Kumar',  smartId: 'STU101', seat: 'A-12', shift: 'Morning',  daysOverdue: 14, suspendedSince: '2026-03-28' },
  { id: 2, studentId: 102, studentName: 'Priya Singh',  smartId: 'STU102', seat: 'B-05', shift: 'Evening',  daysOverdue: 9,  suspendedSince: '2026-04-02' },
  { id: 3, studentId: 103, studentName: 'Aman Verma',   smartId: 'STU103', seat: 'C-18', shift: 'Full Day', daysOverdue: 21, suspendedSince: '2026-03-21' },
  { id: 4, studentId: 104, studentName: 'Sneha Patel',  smartId: 'STU104', seat: 'A-07', shift: 'Morning',  daysOverdue: 8,  suspendedSince: '2026-04-03' },
];

export default function AutoSuspend() {
  const [config, setConfig] = useState<Config | null>(null);
  const [suspended, setSuspended] = useState<SuspendedStudent[]>([]);
  const [configLoading, setConfigLoading] = useState(true);
  const [suspendedLoading, setSuspendedLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [days, setDays] = useState('');
  const [updatePending, setUpdatePending] = useState(false);
  const [restoreDialog, setRestoreDialog] = useState<{ id: number; name: string } | null>(null);
  const [restoreReason, setRestoreReason] = useState('');
  const [restorePending, setRestorePending] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => { setConfig(MOCK_CONFIG); setConfigLoading(false); }, 500);
    const t2 = setTimeout(() => { setSuspended(MOCK_SUSPENDED); setSuspendedLoading(false); }, 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleSave = () => {
    if (!days || isNaN(parseInt(days))) return;
    setUpdatePending(true);
    setTimeout(() => {
      setConfig((prev) => prev ? { ...prev, daysBeforeSuspend: parseInt(days) } : prev);
      toast.success('💾 Auto-suspend settings updated.');
      setEditing(false); setUpdatePending(false);
    }, 600);
  };

  const handleRestore = () => {
    if (!restoreDialog || !restoreReason.trim()) return;
    setRestorePending(true);
    setTimeout(() => {
      setSuspended((prev) => prev.filter((s) => s.studentId !== restoreDialog.id));
      setConfig((prev) => prev ? { ...prev, currentlySuspended: Math.max(0, prev.currentlySuspended - 1), manualRestores: prev.manualRestores + 1 } : prev);
      toast.success(`✅ ${restoreDialog.name} restored to active.`);
      setRestoreDialog(null); setRestoreReason(''); setRestorePending(false);
    }, 700);
  };

  const KPI_CARDS = [
    { label: 'Days Before Suspend', value: configLoading ? '—' : config?.daysBeforeSuspend, icon: Settings, variant: 'default' },
    { label: 'Currently Suspended', value: configLoading ? '—' : config?.currentlySuspended ?? 0, icon: Ban, variant: 'danger' },
    { label: 'Auto-Restored (Month)', value: configLoading ? '—' : config?.autoRestoredThisMonth ?? 0, icon: RotateCcw, variant: 'default' },
    { label: 'Manual Restores', value: configLoading ? '—' : config?.manualRestores ?? 0, icon: UserCheck, variant: 'default' },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fin-page-title">Auto-Suspend Policy</h1>
        <p className="fin-page-subtitle">Manage automatic suspension and student restoration.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {KPI_CARDS.map(({ label, value, icon: Icon, variant }) => (
          <div key={label} className={`fin-kpi-card ${variant === 'danger' ? 'fin-kpi-card--danger' : ''}`}>
            <div className="fin-kpi-card__header">
              <span className={`fin-kpi-label ${variant === 'danger' ? 'fin-kpi-label--danger' : ''}`}>{label}</span>
              <Icon size={16} className={variant === 'danger' ? 'fin-text-danger' : 'fin-icon-muted'} />
            </div>
            <p className={`fin-kpi-value ${variant === 'danger' ? 'fin-kpi-value--danger' : ''}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Policy Config */}
      <div className="fin-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 fin-text-body font-semibold">
            <ShieldAlert size={18} className="fin-icon-muted" />
            Policy Configuration
          </div>
          {!editing && (
            <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => { if (config) setDays(String(config.daysBeforeSuspend)); setEditing(true); }}>
              Edit
            </button>
          )}
        </div>
        {configLoading ? (
          <div className="fin-skeleton h-10 w-full" />
        ) : editing ? (
          <div className="space-y-4">
            <div>
              <label className="fin-label">Days before auto-suspend</label>
              <input type="number" className="fin-input" value={days} onChange={(e) => setDays(e.target.value)} />
              <p className="fin-input-hint">Students overdue beyond this period are automatically suspended.</p>
            </div>
            <div className="flex gap-2">
              <button className="fin-badge fin-badge--success cursor-pointer" onClick={handleSave} disabled={updatePending}>
                <Save size={11} /> {updatePending ? 'Saving...' : '💾 Save Config'}
              </button>
              <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <p className="fin-policy-text">
            Students are automatically suspended after <strong>{config?.daysBeforeSuspend}</strong> days of non-payment past due date.
          </p>
        )}
      </div>

      {/* Suspended Students Table */}
      <div className="fin-card overflow-x-auto">
        <div className="flex items-center gap-2 p-4 fin-border-bottom">
          <Ban size={18} className="fin-text-danger" />
          <span className="fin-text-body font-semibold">Suspended Students</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">Student</th>
              <th className="text-left py-3 px-4">Seat</th>
              <th className="text-left py-3 px-4">Shift</th>
              <th className="text-left py-3 px-4">Last Payment Date</th>
              <th className="text-left py-3 px-4">Days Overdue</th>
              <th className="text-left py-3 px-4">Suspended Since</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suspendedLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="fin-table-row">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="py-3 px-4">
                      <div className="fin-skeleton h-4 w-16" />
                    </td>
                  ))}
                </tr>
              ))
            ) : suspended.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="fin-empty-state">
                    <div className="fin-empty-state__icon">🔓</div>
                    <p className="fin-empty-state__title">No students currently suspended.</p>
                  </div>
                </td>
              </tr>
            ) : (
              suspended.map((s) => (
                <tr key={s.id} className="fin-table-hover-row fin-table-row">
                  <td className="py-3 px-4">
                    <div className="fin-cell-name">{s.studentName}</div>
                    <div className="fin-cell-subtext">{s.smartId}</div>
                  </td>
                  <td className="py-3 px-4 fin-text-body">{s.seat}</td>
                  <td className="py-3 px-4">
                    <span className="fin-badge fin-badge--neutral">{s.shift}</span>
                  </td>
                  <td className="py-3 px-4 fin-cell-subtext">—</td>
                  <td className="py-3 px-4">
                    <span className="fin-text-danger font-semibold">{s.daysOverdue}d</span>
                  </td>
                  <td className="py-3 px-4 fin-cell-subtext">{s.suspendedSince}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="fin-badge fin-badge--neutral cursor-pointer"
                        onClick={() => toast.success(`📱 WhatsApp reminder sent to ${s.studentName}.`)}
                      >
                        <Bell size={11} /> 📱 Send Reminder
                      </button>
                      <button
                        className="fin-badge fin-badge--success cursor-pointer"
                        onClick={() => setRestoreDialog({ id: s.studentId, name: s.studentName })}
                      >
                        <RotateCcw size={11} /> ✅ Manual Restore
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {restoreDialog && (
        <div className="fin-dialog-overlay">
          <div className="fin-dialog">
            <h2 className="fin-dialog__title">✅ Restore Student — {restoreDialog.name}</h2>
            <button className="fin-dialog__close" onClick={() => setRestoreDialog(null)}>✕</button>
            <p className="fin-dialog-helper">Manually restore access for {restoreDialog.name}?</p>
            <div className="mt-2">
              <label className="fin-label">Override reason <span className="fin-text-danger">*</span></label>
              <input className="fin-input mt-1" value={restoreReason} onChange={(e) => setRestoreReason(e.target.value)} placeholder="Enter reason..." />
            </div>
            <div className="fin-dialog__footer">
              <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => setRestoreDialog(null)}>Cancel</button>
              <button
                className="fin-badge fin-badge--success cursor-pointer"
                onClick={handleRestore}
                disabled={restorePending || !restoreReason.trim()}
              >
                {restorePending ? 'Restoring...' : 'Restore'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
