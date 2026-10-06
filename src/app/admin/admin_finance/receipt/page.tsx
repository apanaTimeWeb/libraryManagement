'use client';
// RESPONSIBILITY: Entry page for the admin_finance module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '../lib/format';
import { Search, Receipt, Eye, Printer, Send } from 'lucide-react';
import { openWhatsApp } from '@/lib/whatsappUtils';
import { printThermal } from '@/lib/thermalPrint';

const MOCK_RECEIPTS = [
  { id: 'SL360-TRX-99421-X', receiptNumber: 'REC-20260411-001', studentName: 'Aravind Sharma',  studentId: 'LIB-2024-883', phone: '9876543210', date: '2024-10-24T00:00:00Z', amount: 1249, paymentMode: 'UPI',          planName: 'Premium Reading Zone (Monthly)',  shift: 'Morning', seat: 'A-01' },
  { id: 'SL360-TRX-88310-Y', receiptNumber: 'REC-20260410-002', studentName: 'Gajodhar Prasad', studentId: 'STU-001234',   phone: '8765432109', date: '2026-04-10T00:00:00Z', amount: 1716, paymentMode: 'UPI',          planName: 'Annual Library Membership',       shift: 'Evening', seat: 'B-05' },
  { id: 'SL360-TRX-77203-Z', receiptNumber: 'REC-20260409-003', studentName: 'Sara Mishra',     studentId: 'STU-008821',   phone: '7654321098', date: '2024-10-10T00:00:00Z', amount: 9750, paymentMode: 'Bank Transfer', planName: 'Security Deposit Refund',         shift: 'Night',   seat: 'C-12' },
  { id: 'SL360-TRX-66192-A', receiptNumber: 'REC-20260408-004', studentName: 'Rohan Khanna',    studentId: 'STU-007654',   phone: '6543210987', date: '2026-04-08T00:00:00Z', amount: 900,  paymentMode: 'Cash',         planName: 'Monthly Basic Plan',              shift: 'Morning', seat: 'D-10' },
  { id: 'SL360-TRX-55081-B', receiptNumber: 'REC-20260407-005', studentName: 'Priya Nair',      studentId: 'STU-003891',   phone: '5432109876', date: '2026-04-07T00:00:00Z', amount: 2400, paymentMode: 'Card',         planName: 'Quarterly Premium Plan',          shift: 'Full Day','seat': 'A-05' },
];

const MODE_BADGE: Record<string, string> = {
  upi: 'fin-badge fin-badge--upi', cash: 'fin-badge fin-badge--cash',
  card: 'fin-badge fin-badge--card', 'bank transfer': 'fin-badge fin-badge--bank',
};

type FilterMode = 'all' | 'upi' | 'cash' | 'card' | 'bank transfer';

export default function ReceiptsPage() {
  const [search, setSearch]           = useState('');
  const [modeFilter, setModeFilter]   = useState<FilterMode>('all');

  const filtered = MOCK_RECEIPTS.filter(r => {
    const ms = !search || r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId.toLowerCase().includes(search.toLowerCase());
    const mm = modeFilter === 'all' || r.paymentMode.toLowerCase() === modeFilter;
    return ms && mm;
  });

  const totalCollected = MOCK_RECEIPTS.reduce((s, r) => s + r.amount, 0);

  function handleWhatsApp(r: typeof MOCK_RECEIPTS[0]) {
    const W = 42;
    const line = '─'.repeat(W);
    const c = (t: string) => ' '.repeat(Math.max(0, Math.floor((W - t.length) / 2))) + t;
    const row = (l: string, v: string) => l + ' '.repeat(Math.max(1, W - l.length - v.length)) + v;
    const msg = [
      c('★ Library OS ★'),
      c('Main Branch'),
      line,
      c('[ PAYMENT RECEIPT ]'),
      line,
      row('Receipt :', r.receiptNumber),
      row('Date    :', formatDate(r.date)),
      '',
      row('Name    :', r.studentName),
      row('Smart ID:', r.studentId),
      '',
      line,
      row('Plan    :', r.planName),
      line,
      row('PAID    :', `Rs.${r.amount.toLocaleString('en-IN')}`),
      row('Mode    :', r.paymentMode),
      '',
      c('✅ Payment Confirmed'),
      c('Thank You! Keep Studying 😊'),
      line,
    ].join('\n');
    openWhatsApp(r.phone, msg);
  }

  function handlePrint(r: typeof MOCK_RECEIPTS[0]) {
    printThermal({
      type: 'receipt', shopName: 'Library OS', branch: 'Main Branch',
      studentName: r.studentName, smartId: r.studentId, phone: r.phone,
      shift: r.shift, seat: r.seat, plan: r.planName,
      billNumber: r.receiptNumber, date: formatDate(r.date),
      totalPayable: r.amount, amountPaid: r.amount, discount: 0,
      balance: 0, paymentMode: r.paymentMode,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fin-page-title">Receipts</h1>
        <p className="fin-page-subtitle">View and share payment receipts for all transactions.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'TOTAL RECEIPTS',  value: MOCK_RECEIPTS.length.toString() },
          { label: 'TOTAL COLLECTED', value: formatCurrency(totalCollected), success: true },
          { label: 'THIS MONTH',      value: MOCK_RECEIPTS.filter(r => r.date.startsWith(new Date().toISOString().slice(0, 7))).length.toString() },
        ].map(k => (
          <div key={k.label} className="fin-kpi-card">
            <div className="fin-kpi-card__header"><p className="fin-kpi-label">{k.label}</p><Receipt size={18} className="fin-icon-muted" /></div>
            <p className={`fin-kpi-value${k.success ? ' fin-text-success' : ''}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="fin-filter-bar">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 fin-icon-muted" />
          <input className="fin-input fin-input--pl9" placeholder="Search by receipt no., student name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="fin-select w-40" value={modeFilter} onChange={e => setModeFilter(e.target.value as FilterMode)}>
          <option value="all">All Modes</option>
          <option value="upi">UPI</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="bank transfer">Bank Transfer</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">Receipt No.</th>
              <th className="text-left py-3 px-4">Student</th>
              <th className="text-left py-3 px-4">Plan</th>
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-right py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Mode</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7}><div className="fin-empty-state"><div className="fin-empty-state__icon">🧾</div><p className="fin-empty-state__title">No receipts found.</p></div></td></tr>
            ) : filtered.map(r => (
              <tr key={r.id} className="fin-table-hover-row fin-table-row">
                <td className="py-3 px-4"><span className="fin-mono">{r.receiptNumber}</span></td>
                <td className="py-3 px-4">
                  <p className="fin-cell-name">{r.studentName}</p>
                  <p className="fin-cell-subtext">{r.studentId}</p>
                </td>
                <td className="py-3 px-4 fin-cell-subtext" style={{ maxWidth: 180 }}>{r.planName}</td>
                <td className="py-3 px-4 fin-cell-subtext">{formatDate(r.date)}</td>
                <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(r.amount)}</td>
                <td className="py-3 px-4">
                  <span className={MODE_BADGE[r.paymentMode.toLowerCase()] || 'fin-badge fin-badge--info'}>{r.paymentMode}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/admin_finance/receipt/${r.id}`}>
                      <button className="fin-badge fin-badge--neutral cursor-pointer"><Eye size={11} /> View</button>
                    </Link>
                    <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => handlePrint(r)} title="Print (Thermal)">
                      <Printer size={11} />
                    </button>
                    <button className="fin-badge fin-badge--success cursor-pointer" onClick={() => handleWhatsApp(r)} title="Send WhatsApp">
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
