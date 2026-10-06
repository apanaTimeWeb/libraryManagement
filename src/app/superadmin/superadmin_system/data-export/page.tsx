'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/superadmin/superadmin_system/reusable/Card';
import { Button } from '@/app/superadmin/superadmin_system/reusable/Button';
import { Badge } from '@/app/superadmin/superadmin_system/reusable/Badge';
import { Download, FileSpreadsheet, Database, Users, CreditCard, CalendarDays, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';

interface ExportModule {
  id: string;
  label: string;
  description: string;
  icon: string;
  estimatedRows: number;
  formats: string[];
}

const EXPORT_MODULES: ExportModule[] = [
  { id: 'students',     label: 'Students',            description: 'All student records including personal info, seat, shift, and status', icon: '🎓', estimatedRows: 248,  formats: ['CSV', 'XLSX'] },
  { id: 'payments',     label: 'Payments & Fees',     description: 'Complete payment history — fee collected, due amounts, receipts',     icon: '💳', estimatedRows: 1240, formats: ['CSV', 'XLSX'] },
  { id: 'attendance',   label: 'Attendance',          description: 'Full attendance log — daily check-ins by student and shift',          icon: '📅', estimatedRows: 5800, formats: ['CSV', 'XLSX'] },
  { id: 'expenses',     label: 'Expenses',            description: 'Library expense records — rent, electricity, salaries, etc.',         icon: '💸', estimatedRows: 320,  formats: ['CSV', 'XLSX'] },
  { id: 'enquiries',    label: 'CRM Enquiries',       description: 'Lead pipeline — all enquires with status and follow-up history',      icon: '📞', estimatedRows: 186,  formats: ['CSV', 'XLSX'] },
  { id: 'seats',        label: 'Seats & Lockers',     description: 'Seat matrix, locker assignments, and maintenance logs',               icon: '🪑', estimatedRows: 140,  formats: ['CSV', 'XLSX'] },
  { id: 'whatsapp',     label: 'WhatsApp Logs',       description: 'All outbound WhatsApp messages — receipts, renewals, alerts',        icon: '📱', estimatedRows: 890,  formats: ['CSV'] },
  { id: 'audit',        label: 'Audit Logs',          description: 'Staff actions log — sensitive operations, deletes, and edits',        icon: '🔍', estimatedRows: 2400, formats: ['CSV', 'XLSX'] },
];

interface QuickExport {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  format: string;
}

const QUICK_EXPORTS: QuickExport[] = [
  { id: 'due-fees',     label: 'Fee Due Report',        description: 'Students with pending fee payments',  icon: <CreditCard size={18} />,  format: 'CSV' },
  { id: 'expiring',     label: 'Expiring Subscriptions',description: 'Students expiring in the next 7 days', icon: <CalendarDays size={18} />, format: 'CSV' },
  { id: 'active',       label: 'Active Students',       description: 'All currently active students',        icon: <Users size={18} />,       format: 'XLSX' },
  { id: 'full-backup',  label: 'Full Data Backup',      description: 'Everything — all modules in one ZIP',  icon: <Database size={18} />,    format: 'ZIP' },
];

export default function DataExportPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [format, setFormat] = useState<'CSV' | 'XLSX'>('XLSX');
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo]     = useState('2026-04-12');
  const [exporting, setExporting] = useState<string | null>(null);
  const [exported, setExported]   = useState<Set<string>>(new Set());

  const toggleModule = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(EXPORT_MODULES.map((m: any) => m.id)));
  const clearAll  = () => setSelected(new Set());

  const estimatedTotal = EXPORT_MODULES.filter(m => selected.has(m.id)).reduce((sum, m) => sum + m.estimatedRows, 0);

  const handleExport = (id?: string) => {
    const key = id ?? 'bulk';
    setExporting(key);
    setTimeout(() => {
      setExporting(null);
      setExported(prev => new Set([...prev, key]));
    }, 1800);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium tracking-wide mb-1">
          <span>System</span><ChevronRight size={12} /><span>Data Export</span>
        </div>
        <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
          <Download size={28} className="text-primary" />
          Data Export
        </h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Export your library data as CSV or Excel. All exports are filtered by date range.
        </p>
      </div>

      {/* Quick Exports */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-on-surface mb-3">⚡ Quick Exports</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_EXPORTS.map((qe: any) => (
            <Card key={qe.id} className="hover:border-primary/40 transition-colors cursor-pointer group">
              <CardContent className="flex items-start gap-3 py-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  {qe.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">{qe.label}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5 leading-snug">{qe.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{qe.format}</Badge>
                    <button
                      id={`quick-export-${qe.id}`}
                      onClick={() => handleExport(qe.id)}
                      disabled={exporting === qe.id}
                      className="text-xs text-primary font-medium hover:underline disabled:opacity-50 flex items-center gap-1"
                    >
                      {exporting === qe.id
                        ? <><Loader2 size={11} className="animate-spin" /> Exporting...</>
                        : exported.has(qe.id)
                        ? <><CheckCircle size={11} /> Downloaded!</>
                        : '↓ Export'}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Export Builder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-primary" /> Custom Export Builder
              </CardTitle>
              <CardDescription>Select modules and configure filters for a custom data export.</CardDescription>
            </div>
            <div className="flex gap-2">
              <button onClick={selectAll} className="text-xs text-primary font-medium hover:underline">Select All</button>
              <span className="text-on-surface-variant text-xs">·</span>
              <button onClick={clearAll} className="text-xs text-on-surface-variant hover:text-on-surface">Clear</button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Module selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EXPORT_MODULES.map((mod: any) => {
              const isSelected = selected.has(mod.id);
              return (
                <div
                  key={mod.id}
                  id={`export-module-${mod.id}`}
                  onClick={() => toggleModule(mod.id)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary/40 bg-primary/8'
                      : 'border-outline-variant hover:border-primary/25 hover:bg-surface-container-high'
                  }`}
                >
                  <div className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isSelected ? 'bg-primary border-primary' : 'border-outline-variant'
                  }`}>
                    {isSelected && <CheckCircle size={12} className="text-on-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{mod.icon}</span>
                      <span className="text-sm font-semibold text-on-surface">{mod.label}</span>
                      <span className="text-xs text-on-surface-variant ml-auto">~{mod.estimatedRows.toLocaleString()} rows</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-snug">{mod.description}</p>
                    <div className="flex gap-1 mt-1.5">
                      {mod.formats.map((f: any) => <Badge key={f} variant="outline">{f}</Badge>)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filters row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-surface-container-high border border-outline-variant">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Output Format</label>
              <div className="flex gap-2">
                {(['CSV', 'XLSX'] as const).map((f: any) => (
                  <button
                    key={f}
                    id={`format-${f.toLowerCase()}`}
                    onClick={() => setFormat(f)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      format === f
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container text-on-surface-variant border-outline-variant hover:border-primary/40'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="export-date-from" className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">From Date</label>
              <input
                id="export-date-from"
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="export-date-to" className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">To Date</label>
              <input
                id="export-date-to"
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1">
              {selected.size > 0 && (
                <p className="text-sm text-on-surface-variant">
                  <span className="text-primary font-semibold">{selected.size} module{selected.size > 1 ? 's' : ''}</span> selected ·
                  ~<span className="text-on-surface font-medium">{estimatedTotal.toLocaleString()} rows</span> · Format: <span className="text-primary font-medium">{format}</span>
                </p>
              )}
            </div>
            <Button
              id="export-data-btn"
              variant="primary"
              disabled={selected.size === 0 || exporting === 'bulk'}
              onClick={() => handleExport()}
            >
              {exporting === 'bulk'
                ? <><Loader2 size={16} className="animate-spin" /> Exporting...</>
                : exported.has('bulk')
                ? <><CheckCircle size={16} /> Downloaded!</>
                : <><Download size={16} /> Export {selected.size > 0 ? `${selected.size} Module${selected.size > 1 ? 's' : ''}` : 'Data'}</>}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
