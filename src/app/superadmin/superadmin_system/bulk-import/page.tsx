'use client';
import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/superadmin/superadmin_system/reusable/Card';
import { Button } from '@/app/superadmin/superadmin_system/reusable/Button';
import { Badge } from '@/app/superadmin/superadmin_system/reusable/Badge';
import { Upload, FileSpreadsheet, ChevronRight, CheckCircle, XCircle, AlertTriangle, Download, RefreshCw } from 'lucide-react';

type RowStatus = 'ok' | 'error' | 'warning';

interface PreviewRow {
  row: number;
  name: string;
  phone: string;
  email: string;
  shift: string;
  seat: string;
  status: RowStatus;
  issue?: string;
}

const MOCK_PREVIEW: PreviewRow[] = [
  { row: 1, name: 'Rahul Sharma',    phone: '9876543210', email: 'rahul@gmail.com',   shift: 'Morning',   seat: 'S-01', status: 'ok' },
  { row: 2, name: 'Priya Verma',     phone: '9812345678', email: 'priya@yahoo.com',   shift: 'Afternoon', seat: 'S-02', status: 'ok' },
  { row: 3, name: 'Amit Kumar',      phone: '',           email: 'amit@gmail.com',    shift: 'Evening',   seat: 'S-03', status: 'error',   issue: 'Mobile Number missing' },
  { row: 4, name: 'Sneha Patel',     phone: '9999988888', email: '',                  shift: 'Morning',   seat: 'S-04', status: 'warning', issue: 'Email missing (optional)' },
  { row: 5, name: 'Rohan Das',       phone: '9870001234', email: 'rohan@gmail.com',   shift: 'Afternoon', seat: 'S-05', status: 'ok' },
  { row: 6, name: '',                phone: '9810001234', email: 'unknown@gmail.com', shift: 'Morning',   seat: 'S-06', status: 'error',   issue: 'Student Name is required' },
  { row: 7, name: 'Kavita Singh',    phone: '9820001234', email: 'kavita@gmail.com',  shift: 'Evening',   seat: 'S-07', status: 'ok' },
  { row: 8, name: 'Deepak Mishra',   phone: '9830001234', email: 'deepak@gmail.com',  shift: 'Morning',   seat: '',     status: 'error',   issue: 'Seat Number missing' },
];

const TEMPLATE_HEADERS = ['Name*', 'Phone*', 'Email', 'Shift*', 'Seat', 'Plan', 'Fee Paid', 'Join Date'];

const STATUS_CONFIG = {
  ok:      { label: 'OK',      variant: 'success'  as const, icon: CheckCircle  },
  warning: { label: 'Warning', variant: 'warning'  as const, icon: AlertTriangle },
  error:   { label: 'Error',   variant: 'danger'   as const, icon: XCircle      },
};

type ImportStep = 'upload' | 'preview' | 'importing' | 'done';

export default function BulkImportPage() {
  const [step, setStep] = useState<ImportStep>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [filter, setFilter] = useState<'all' | RowStatus>('all');
  const [importProgress, setImportProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const errorCount   = MOCK_PREVIEW.filter(r => r.status === 'error').length;
  const warningCount = MOCK_PREVIEW.filter(r => r.status === 'warning').length;
  const okCount      = MOCK_PREVIEW.filter(r => r.status === 'ok').length;

  const filteredRows = filter === 'all' ? MOCK_PREVIEW : MOCK_PREVIEW.filter(r => r.status === filter);

  const handleFileSelect = (name: string) => {
    setFileName(name);
    setTimeout(() => setStep('preview'), 800);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file.name);
  };

  const handleImport = () => {
    setStep('importing');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 12;
      setImportProgress(Math.min(progress, 100));
      if (progress >= 100) { clearInterval(interval); setStep('done'); }
    }, 200);
  };

  const handleReset = () => {
    setStep('upload');
    setFileName('');
    setImportProgress(0);
    setFilter('all');
  };

  const downloadTemplate = () => {
    const csv = [TEMPLATE_HEADERS.join(','), 'Rahul Sharma,9876543210,rahul@gmail.com,Morning,S-01,Monthly,1000,2026-04-12'].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'bulk_import_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium tracking-wide mb-1">
          <span>System</span><ChevronRight size={12} /><span>Bulk Import</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
              <FileSpreadsheet size={28} className="text-primary" />
              Bulk Student Import
            </h1>
            <p className="text-on-surface-variant mt-1 text-sm">
              Upload an Excel or CSV file to import up to 500 students at once. System validates every row before import.
            </p>
          </div>
          <Button id="download-template-btn" variant="ghost" onClick={downloadTemplate}>
            <Download size={16} /> Download Template
          </Button>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8">
        {[
          { id: 'upload',    label: 'Upload File',     num: 1 },
          { id: 'preview',   label: 'Review & Validate', num: 2 },
          { id: 'importing', label: 'Importing',        num: 3 },
          { id: 'done',      label: 'Complete',         num: 4 },
        ].map((s, i, arr) => {
          const stepOrder = ['upload', 'preview', 'importing', 'done'];
          const currentIdx = stepOrder.indexOf(step);
          const thisIdx    = stepOrder.indexOf(s.id);
          const isActive   = s.id === step;
          const isDone     = currentIdx > thisIdx;

          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  isDone    ? 'bg-primary border-primary text-on-primary' :
                  isActive  ? 'border-primary text-primary bg-primary/10' :
                              'border-outline-variant text-on-surface-variant'
                }`}>
                  {isDone ? '✓' : s.num}
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>{s.label}</span>
              </div>
              {i < arr.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${isDone ? 'bg-primary' : 'bg-outline-variant'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── STEP 1: UPLOAD ── */}
      {step === 'upload' && (
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Upload Your File</CardTitle>
              <CardDescription>Accepted formats: .xlsx, .xls, .csv — Maximum 500 rows, 5MB</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                id="bulk-drop-zone"
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-4 p-16 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                  isDragging
                    ? 'border-primary bg-primary/8 scale-[1.01]'
                    : 'border-outline-variant hover:border-primary/50 hover:bg-surface-container-high'
                }`}
              >
                <div className={`h-20 w-20 rounded-2xl flex items-center justify-center text-4xl transition-all ${
                  isDragging ? 'bg-primary/20' : 'bg-surface-container-highest'
                }`}>
                  {isDragging ? '📂' : '📁'}
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-on-surface">
                    {isDragging ? 'Drop your file here' : 'Drag & drop your file here'}
                  </p>
                  <p className="text-sm text-on-surface-variant mt-1">or <span className="text-primary font-medium">browse to upload</span></p>
                </div>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                  <span className="px-2 py-1 rounded-lg bg-surface-container-highest">.xlsx</span>
                  <span className="px-2 py-1 rounded-lg bg-surface-container-highest">.xls</span>
                  <span className="px-2 py-1 rounded-lg bg-surface-container-highest">.csv</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={e => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0].name); }}
              />
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>File Format Instructions</CardTitle>
              <CardDescription>Make sure your file follows this column structure.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant text-on-surface-variant text-xs uppercase tracking-wide">
                      <th className="text-left py-2 pr-4">Column</th>
                      <th className="text-left py-2 pr-4">Required</th>
                      <th className="text-left py-2">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {[
                      ['Name',      true,  'Rahul Sharma'],
                      ['Phone',     true,  '9876543210'],
                      ['Email',     false, 'rahul@gmail.com'],
                      ['Shift',     true,  'Morning / Afternoon / Evening'],
                      ['Seat',      false, 'S-01 (auto-assigned if blank)'],
                      ['Plan',      false, 'Monthly / Quarterly'],
                      ['Fee Paid',  false, '1000'],
                      ['Join Date', false, '2026-04-12'],
                    ].map(([col, req, ex]) => (
                      <tr key={col as string} className="hover:bg-surface-container-high">
                        <td className="py-2.5 pr-4 font-medium text-on-surface">{col as string}</td>
                        <td className="py-2.5 pr-4">
                          {req
                            ? <Badge variant="danger">Required</Badge>
                            : <Badge variant="outline">Optional</Badge>}
                        </td>
                        <td className="py-2.5 text-on-surface-variant text-xs">{ex as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── STEP 2: PREVIEW ── */}
      {step === 'preview' && (
        <div className="space-y-5">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant text-center">
              <p className="text-2xl font-bold text-on-surface">{MOCK_PREVIEW.length}</p>
              <p className="text-xs text-on-surface-variant mt-1">Total Rows</p>
            </div>
            <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-center">
              <p className="text-2xl font-bold text-green-400">{okCount}</p>
              <p className="text-xs text-on-surface-variant mt-1">✅ Ready to Import</p>
            </div>
            <div className="p-4 rounded-2xl bg-tertiary/10 border border-tertiary/20 text-center">
              <p className="text-2xl font-bold text-tertiary">{warningCount}</p>
              <p className="text-xs text-on-surface-variant mt-1">⚠️ Warnings</p>
            </div>
            <div className="p-4 rounded-2xl bg-error-container/10 border border-error/20 text-center">
              <p className="text-2xl font-bold text-error">{errorCount}</p>
              <p className="text-xs text-on-surface-variant mt-1">❌ Errors (must fix)</p>
            </div>
          </div>

          {errorCount > 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-error-container/10 border border-error/20">
              <XCircle size={18} className="text-error shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-error">{errorCount} rows have errors and will be skipped</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Fix the issues in your file and re-upload, or proceed to import only the valid rows.</p>
              </div>
            </div>
          )}

          {/* Preview Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Data Preview — {fileName}</CardTitle>
                  <CardDescription>Review each row before importing.</CardDescription>
                </div>
                {/* Filter buttons */}
                <div className="flex gap-2">
                  {(['all', 'ok', 'warning', 'error'] as const).map((f: any) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filter === f
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {f === 'all' ? `All (${MOCK_PREVIEW.length})` :
                       f === 'ok'  ? `✅ OK (${okCount})` :
                       f === 'warning' ? `⚠️ Warn (${warningCount})` :
                       `❌ Error (${errorCount})`}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant text-on-surface-variant text-xs uppercase tracking-wide">
                      <th className="text-left py-3 pr-3">Row</th>
                      <th className="text-left py-3 pr-3">Name</th>
                      <th className="text-left py-3 pr-3">Phone</th>
                      <th className="text-left py-3 pr-3">Email</th>
                      <th className="text-left py-3 pr-3">Shift</th>
                      <th className="text-left py-3 pr-3">Seat</th>
                      <th className="text-left py-3 pr-3">Status</th>
                      <th className="text-left py-3">Issue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {filteredRows.map((row: any) => {
                      const cfg = STATUS_CONFIG[row.status as keyof typeof STATUS_CONFIG];
                      const Icon = cfg.icon;
                      return (
                        <tr key={row.row} className={`hover:bg-surface-container-high transition-colors ${
                          row.status === 'error' ? 'bg-error-container/5' :
                          row.status === 'warning' ? 'bg-tertiary/5' : ''
                        }`}>
                          <td className="py-3 pr-3 font-mono text-xs text-on-surface-variant">#{row.row}</td>
                          <td className="py-3 pr-3 font-medium text-on-surface">{row.name || <span className="text-error text-xs italic">missing</span>}</td>
                          <td className="py-3 pr-3 text-on-surface-variant">{row.phone || <span className="text-error text-xs italic">missing</span>}</td>
                          <td className="py-3 pr-3 text-on-surface-variant">{row.email || <span className="text-on-surface-variant/40 text-xs">—</span>}</td>
                          <td className="py-3 pr-3 text-on-surface">{row.shift}</td>
                          <td className="py-3 pr-3 font-mono text-xs text-on-surface">{row.seat || <span className="text-on-surface-variant/40 text-xs">auto</span>}</td>
                          <td className="py-3 pr-3">
                            <Badge variant={cfg.variant}>
                              <Icon size={10} /> {cfg.label}
                            </Badge>
                          </td>
                          <td className="py-3 text-xs text-on-surface-variant">{row.issue || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button id="start-import-btn" variant="primary" onClick={handleImport}>
                <Upload size={16} /> Import {okCount} Valid Rows
              </Button>
              <Button id="reupload-btn" variant="ghost" onClick={handleReset}>
                <RefreshCw size={16} /> Re-upload File
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* ── STEP 3: IMPORTING ── */}
      {step === 'importing' && (
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-6 text-center">
            <div className="text-5xl animate-bounce">⏳</div>
            <div>
              <h2 className="text-xl font-bold text-on-surface mb-1">Importing Students...</h2>
              <p className="text-sm text-on-surface-variant">Please don't close this tab while import is in progress.</p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Progress</span>
                <span className="text-primary font-semibold">{importProgress}%</span>
              </div>
              <div className="h-3 rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
              <p className="text-xs text-on-surface-variant">
                {Math.round((importProgress / 100) * okCount)} of {okCount} rows imported
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── STEP 4: DONE ── */}
      {step === 'done' && (
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-6 text-center">
            <div className="h-24 w-24 rounded-full bg-green-500/15 flex items-center justify-center text-5xl">
              🎉
            </div>
            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-2">Import Complete!</h2>
              <p className="text-on-surface-variant">
                <span className="text-green-400 font-semibold">{okCount} students</span> were successfully imported into the system.
              </p>
              {errorCount > 0 && (
                <p className="text-sm text-on-surface-variant mt-2">
                  <span className="text-error font-semibold">{errorCount} rows</span> were skipped due to validation errors.
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button id="view-students-btn" variant="primary">
                👥 View All Students
              </Button>
              <Button id="import-again-btn" variant="ghost" onClick={handleReset}>
                <Upload size={16} /> Import Another File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
