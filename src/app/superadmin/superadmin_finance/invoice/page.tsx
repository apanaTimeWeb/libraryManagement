'use client';
import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/app/superadmin/superadmin_finance/lib/format';
import { Search, FileText, Printer, Download, Eye, Send } from 'lucide-react';
import { openWhatsApp } from '@/lib/whatsappUtils';
import { printThermal } from '@/lib/thermalPrint';

const MOCK_INVOICES = [
  { id: '1', invoiceNumber: 'INV-20260411-001', studentName: 'Gajodhar Prasad', studentId: 'STU-001234', phone: '9876543210', invoiceDate: '2026-04-11T00:00:00Z', grandTotal: 1716, paymentStatus: 'paid',    paymentMode: 'UPI',          planName: 'Annual Library Membership',       shift: 'Evening', seat: 'B-05' },
  { id: '2', invoiceNumber: 'INV-20260410-002', studentName: 'Aravind Sharma',  studentId: 'STU-002567', phone: '8765432109', invoiceDate: '2026-04-10T00:00:00Z', grandTotal: 1200, paymentStatus: 'paid',    paymentMode: 'Cash',         planName: 'Monthly Basic Plan',              shift: 'Morning', seat: 'A-01' },
  { id: '3', invoiceNumber: 'INV-20260409-003', studentName: 'Priya Nair',      studentId: 'STU-003891', phone: '7654321098', invoiceDate: '2026-04-09T00:00:00Z', grandTotal: 2400, paymentStatus: 'pending', paymentMode: 'Bank Transfer', planName: 'Quarterly Premium Plan',          shift: 'Full Day','seat': 'A-05' },
  { id: '4', invoiceNumber: 'INV-20260408-004', studentName: 'Rohan Khanna',    studentId: 'STU-004312', phone: '6543210987', invoiceDate: '2026-04-08T00:00:00Z', grandTotal: 900,  paymentStatus: 'paid',    paymentMode: 'Card',         planName: 'Monthly Basic Plan',              shift: 'Morning', seat: 'D-10' },
  { id: '5', invoiceNumber: 'INV-20260407-005', studentName: 'Sara Mishra',     studentId: 'STU-005678', phone: '5432109876', invoiceDate: '2026-04-07T00:00:00Z', grandTotal: 1500, paymentStatus: 'overdue', paymentMode: '',             planName: 'Half-Yearly Plan',                shift: 'Night',   seat: 'C-12' },
];

const STATUS_BADGE: Record<string, string> = {
  paid: 'fin-badge fin-badge--success', pending: 'fin-badge fin-badge--warning', overdue: 'fin-badge fin-badge--danger',
};

type FilterStatus = 'all' | 'paid' | 'pending' | 'overdue';

export default function InvoicesPage() {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  const filtered = MOCK_INVOICES.filter(inv => {
    const ms = !search || inv.studentName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.studentId.toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === 'all' || inv.paymentStatus === statusFilter;
    return ms && mst;
  });

  function handleWhatsApp(inv: typeof MOCK_INVOICES[0]) {
    const W = 42;
    const line = '─'.repeat(W);
    const c = (t: string) => ' '.repeat(Math.max(0, Math.floor((W - t.length) / 2))) + t;
    const row = (l: string, v: string) => l + ' '.repeat(Math.max(1, W - l.length - v.length)) + v;
    const statusEmoji = inv.paymentStatus === 'paid' ? '✅' : inv.paymentStatus === 'pending' ? '⏳' : '⚠️';
    const msg = [
      c('★ Library OS ★'),
      c('Main Branch'),
      line,
      c('[ TAX INVOICE ]'),
      line,
      row('Invoice :', inv.invoiceNumber),
      row('Date    :', formatDate(inv.invoiceDate)),
      '',
      row('Name    :', inv.studentName),
      row('Smart ID:', inv.studentId),
      '',
      line,
      row('Plan    :', inv.planName),
      row('Amount  :', `Rs.${inv.grandTotal.toLocaleString('en-IN')}`),
      ...(inv.paymentMode ? [row('Mode    :', inv.paymentMode)] : []),
      line,
      row('Status  :', `${statusEmoji} ${inv.paymentStatus.toUpperCase()}`),
      '',
      c('Library OS | Main Branch'),
      line,
    ].join('\n');
    openWhatsApp(inv.phone, msg);
  }

  function handlePrint(inv: typeof MOCK_INVOICES[0]) {
    printThermal({
      type: 'receipt', shopName: 'Library OS', branch: 'Main Branch',
      studentName: inv.studentName, smartId: inv.studentId, phone: inv.phone,
      shift: inv.shift, seat: inv.seat, plan: inv.planName,
      billNumber: inv.invoiceNumber, date: formatDate(inv.invoiceDate),
      totalPayable: inv.grandTotal,
      amountPaid: inv.paymentStatus === 'paid' ? inv.grandTotal : 0,
      discount: 0, balance: inv.paymentStatus === 'paid' ? 0 : inv.grandTotal,
      paymentMode: inv.paymentMode || 'Pending',
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fin-page-title">Invoices</h1>
        <p className="fin-page-subtitle">View and download GST-compliant tax invoices.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'TOTAL INVOICES',    value: MOCK_INVOICES.length.toString() },
          { label: 'TOTAL BILLED',      value: formatCurrency(MOCK_INVOICES.reduce((s, i) => s + i.grandTotal, 0)), success: true },
          { label: 'PENDING / OVERDUE', value: MOCK_INVOICES.filter(i => i.paymentStatus !== 'paid').length.toString(), warning: true },
        ].map((k: any) => (
          <div key={k.label} className={`fin-kpi-card${k.warning ? ' fin-kpi-card--warning' : ''}`}>
            <div className="fin-kpi-card__header"><p className={`fin-kpi-label${k.warning ? ' fin-kpi-label--warning' : ''}`}>{k.label}</p><FileText size={18} className={k.warning ? 'fin-text-warning' : 'fin-icon-muted'} /></div>
            <p className={`fin-kpi-value${k.success ? ' fin-text-success' : k.warning ? ' fin-kpi-value--warning' : ''}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="fin-filter-bar">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 fin-icon-muted" />
          <input className="fin-input fin-input--pl9" placeholder="Search by invoice no., student name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="fin-select w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value as FilterStatus)}>
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">Invoice No.</th>
              <th className="text-left py-3 px-4">Student</th>
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-right py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Mode</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7}><div className="fin-empty-state"><div className="fin-empty-state__icon">🧾</div><p className="fin-empty-state__title">No invoices found.</p></div></td></tr>
            ) : filtered.map((inv: any) => (
              <tr key={inv.id} className="fin-table-hover-row fin-table-row">
                <td className="py-3 px-4"><span className="fin-mono">{inv.invoiceNumber}</span></td>
                <td className="py-3 px-4">
                  <p className="fin-cell-name">{inv.studentName}</p>
                  <p className="fin-cell-subtext">{inv.studentId}</p>
                </td>
                <td className="py-3 px-4 fin-cell-subtext">{formatDate(inv.invoiceDate)}</td>
                <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(inv.grandTotal)}</td>
                <td className="py-3 px-4">
                  {inv.paymentMode
                    ? <span className={`fin-badge fin-badge--${inv.paymentMode.toLowerCase().replace(' ', '-')}`}>{inv.paymentMode}</span>
                    : <span className="fin-text-muted">—</span>}
                </td>
                <td className="py-3 px-4">
                  <span className={STATUS_BADGE[inv.paymentStatus] || 'fin-badge fin-badge--neutral'}>{inv.paymentStatus}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/superadmin/superadmin_finance/invoice/${inv.id}`}>
                      <button className="fin-badge fin-badge--neutral cursor-pointer"><Eye size={11} /> View</button>
                    </Link>
                    <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => handlePrint(inv)} title="Print (Thermal)">
                      <Printer size={11} />
                    </button>
                    <button className="fin-badge fin-badge--success cursor-pointer" onClick={() => handleWhatsApp(inv)} title="Send WhatsApp">
                      <Send size={11} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
