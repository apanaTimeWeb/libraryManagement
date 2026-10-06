'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';
import { formatCurrency } from '@/app/superadmin/superadmin_finance/lib/format';
import { Settings, AlertTriangle, Save, MessageSquare } from 'lucide-react';
import { openWhatsApp } from '@/lib/whatsappUtils';

type Config = { gracePeriodDays: number; penaltyPerDay: number };
type OverdueStudent = {
  studentId: string;
  studentName: string;
  smartId: string;
  phone: string;
  dueDate: string;
  daysOverdue: number;
  accruedFee: number;
  totalDue: number;
};

const INIT_CONFIG: Config = { gracePeriodDays: 5, penaltyPerDay: 50 };
const INIT_OVERDUE: OverdueStudent[] = [
  { studentId: 'STU101', studentName: 'Rahul Kumar', smartId: 'STU101', phone: '8084350824', dueDate: '2026-04-05', daysOverdue: 6,  accruedFee: 300, totalDue: 45300 },
  { studentId: 'STU102', studentName: 'Priya Singh', smartId: 'STU102', phone: '8084350824', dueDate: '2026-04-01', daysOverdue: 10, accruedFee: 500, totalDue: 30500 },
  { studentId: 'STU103', studentName: 'Aman Verma',  smartId: 'STU103', phone: '8084350824', dueDate: '2026-03-28', daysOverdue: 14, accruedFee: 700, totalDue: 60700 },
];

export default function LateFees() {
  const router = useRouter();
  const [config, setConfig] = useState<Config | null>(null);
  const [overdue, setOverdue] = useState<OverdueStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [graceDays, setGraceDays] = useState('');
  const [penaltyRate, setPenaltyRate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => { setConfig(INIT_CONFIG); setOverdue(INIT_OVERDUE); setIsLoading(false); }, 700);
    return () => clearTimeout(t);
  }, []);

  const startEdit = () => {
    if (config) { setGraceDays(String(config.gracePeriodDays)); setPenaltyRate(String(config.penaltyPerDay)); }
    setEditing(true);
  };

  const handleSave = () => {
    if (!graceDays || !penaltyRate) return;
    setIsSaving(true);
    setTimeout(() => {
      setConfig({ gracePeriodDays: parseInt(graceDays), penaltyPerDay: parseFloat(penaltyRate) });
      toast.success('💾 Late fee settings updated.');
      setEditing(false); setIsSaving(false);
    }, 600);
  };

  const sendWhatsAppReminder = (s: OverdueStudent) => {
    const lines = [
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `📚 *Library OS*`,
      `📍 Main Branch`,
      `━━━━ FEE OVERDUE ━━━━`,
      ``,
      `👤 *Name:* ${s.studentName}`,
      `🆔 *Smart ID:* ${s.smartId}`,
      ``,
      `⚠️ *Your fee is overdue by ${s.daysOverdue} days.*`,
      `📅 *Due Date:* ${s.dueDate}`,
      ``,
      `💰 *Late Fee Accrued:* ${formatCurrency(s.accruedFee)}`,
      `🔴 *Total Due Amount:* ${formatCurrency(s.totalDue)}`,
      ``,
      `Please clear your dues as soon as possible to avoid further late fees and suspension of seat access.`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `🎓 Keep studying hard!`,
      `📚 Library OS`
    ];
    const message = lines.join('\\n');
    openWhatsApp(s.phone, message);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fin-page-title">Late Fees</h1>
        <p className="fin-page-subtitle">Configure late fee policies and view overdue students.</p>
      </div>

      {/* Config Card */}
      <div className="fin-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 fin-text-body font-semibold">
            <Settings size={18} className="fin-icon-muted" />
            Late Fee Settings
          </div>
          {!editing && (
            <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={startEdit}>Edit</button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="fin-skeleton h-10 w-full" />
            <div className="fin-skeleton h-10 w-full" />
          </div>
        ) : editing ? (
          <div className="space-y-4">
            <div>
              <label className="fin-label">Grace Period (days)</label>
              <input type="number" className="fin-input" value={graceDays} onChange={(e) => setGraceDays(e.target.value)} />
              <p className="fin-input-hint">Days after due date before penalties apply</p>
            </div>
            <div>
              <label className="fin-label">Penalty Per Day (₹)</label>
              <input type="number" className="fin-input" value={penaltyRate} onChange={(e) => setPenaltyRate(e.target.value)} />
              <p className="fin-input-hint">Daily late fee amount after grace period</p>
            </div>
            <div className="flex gap-2">
              <button className="fin-badge fin-badge--success cursor-pointer" onClick={handleSave} disabled={isSaving}>
                <Save size={11} /> {isSaving ? 'Saving...' : '💾 Save Rules'}
              </button>
              <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="fin-text-muted text-sm">Grace Period</p>
              <p className="fin-kpi-value">{config?.gracePeriodDays} days</p>
            </div>
            <div>
              <p className="fin-text-muted text-sm">Penalty Per Day</p>
              <p className="fin-kpi-value">{formatCurrency(config?.penaltyPerDay || 0)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Overdue Table */}
      <div className="fin-card overflow-x-auto">
        <div className="flex items-center gap-2 p-4 fin-border-bottom">
          <AlertTriangle size={18} className="fin-text-warning" />
          <span className="fin-text-body font-semibold">Overdue Students</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">Student</th>
              <th className="text-left py-3 px-4">Subscription Due Date</th>
              <th className="text-left py-3 px-4">Days Overdue</th>
              <th className="text-right py-3 px-4">Late Fee Accrued ₹</th>
              <th className="text-right py-3 px-4">Total Due ₹</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="fin-table-row">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="py-3 px-4">
                      <div className="fin-skeleton h-4 w-16" />
                    </td>
                  ))}
                </tr>
              ))
            ) : overdue.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="fin-empty-state">
                    <div className="fin-empty-state__icon">✅</div>
                    <p className="fin-empty-state__title">No active late fee charges.</p>
                  </div>
                </td>
              </tr>
            ) : (
              overdue.map((s: any) => (
                <tr key={s.studentId} className="fin-table-hover-row fin-table-row">
                  <td className="py-3 px-4">
                    <div className="fin-cell-name">{s.studentName}</div>
                    <div className="fin-cell-subtext">{s.smartId}</div>
                  </td>
                  <td className="py-3 px-4 fin-cell-subtext">{s.dueDate}</td>
                  <td className="py-3 px-4">
                    <span className="fin-text-danger font-semibold">{s.daysOverdue}d</span>
                  </td>
                  <td className="py-3 px-4 text-right fin-text-warning">{formatCurrency(s.accruedFee)}</td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-danger">{formatCurrency(s.totalDue)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="fin-badge fin-badge--info cursor-pointer"
                        onClick={() => router.push(`/superadmin/superadmin_finance/collect-fee?studentId=${s.studentId}`)}
                      >
                        💰 Collect Now
                      </button>
                      <button
                        className="fin-badge fin-badge--success cursor-pointer"
                        onClick={() => sendWhatsAppReminder(s)}
                        title="Send WhatsApp Reminder"
                      >
                        <MessageSquare size={13} /> WA
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
