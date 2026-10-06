'use client';

// RESPONSIBILITY: Entry page for the admin_finance module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { formatCurrency } from '../lib/format';
import { Search, CheckCircle, IndianRupee, BookOpen, MessageSquare, Printer, X } from 'lucide-react';
import { openWhatsApp } from '@/lib/whatsappUtils';
import { printThermal } from '@/lib/thermalPrint';

const MOCK_STUDENTS = [
  { id: 1, name: 'Aarav Sharma',  smartId: 'STU001', phone: '8084350824', status: 'active',    dueAmount: 0,    plan: 'Premium Plan', shift: 'Morning', seat: 'A-01', validUpto: '10 Nov 2024' },
  { id: 2, name: 'Priya Patel',   smartId: 'STU002', phone: '8084350824', status: 'active',    dueAmount: 1800, plan: 'Basic Plan',   shift: 'Evening', seat: 'B-05', validUpto: '01 Oct 2024' },
  { id: 3, name: 'Rohan Kumar',   smartId: 'STU003', phone: '8084350824', status: 'expired',   dueAmount: 4000, plan: 'Premium Plan', shift: 'Night',   seat: 'C-12', validUpto: '15 Sep 2024' },
  { id: 4, name: 'Sneha Singh',   smartId: 'STU004', phone: '8084350824', status: 'suspended', dueAmount: 4500, plan: 'Basic Plan',   shift: 'Morning', seat: 'A-08', validUpto: '01 Sep 2024' },
  { id: 5, name: 'Vikram Rao',    smartId: 'STU005', phone: '8084350824', status: 'active',    dueAmount: 0,    plan: 'Elite Plan',   shift: 'Full Day','seat': 'D-03', validUpto: '20 Dec 2024' },
  { id: 6, name: 'Ananya Gupta',  smartId: 'STU006', phone: '8084350824', status: 'active',    dueAmount: 0,    plan: 'Basic Plan',   shift: 'Evening', seat: 'B-10', validUpto: '15 Nov 2024' },
];

const MODES = ['cash', 'upi', 'card', 'bank'] as const;
type Mode = typeof MODES[number];
const MODE_LABELS: Record<Mode, string> = { cash: 'Cash', upi: 'UPI', card: 'Card', bank: 'Bank Transfer' };

let receiptCounter = 124;

function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, '').slice(-10);
  return `${d.slice(0, 2)}****${d.slice(6)}`;
}

function buildWhatsAppReceipt(params: {
  receiptNo: string; student: typeof MOCK_STUDENTS[0];
  amount: number; mode: Mode; txnId: string;
  lateFee: number; couponDiscount: number; total: number;
  remark: string; date: string; monthsToRenew?: string;
}): string {
  const { receiptNo, student, amount, mode, txnId, lateFee, couponDiscount, total, remark, date, monthsToRenew = '1' } = params;
  const W = 42;
  const line = '─'.repeat(W);
  const c = (t: string) => ' '.repeat(Math.max(0, Math.floor((W - t.length) / 2))) + t;
  const r = (l: string, v: string) => l + ' '.repeat(Math.max(1, W - l.length - v.length)) + v;

  const lines = [
    c('★ Library OS ★'),
    c('Main Branch'),
    line,
    c('[ FEE RECEIPT ]'),
    line,
    r('Receipt :', receiptNo),
    r('Date    :', date),
    '',
    r('Name    :', student.name),
    r('Smart ID:', '#' + student.smartId),
    r('Phone   :', student.phone),
    '',
    line,
    r('Plan    :', student.plan),
    r('Cycle   :', monthsToRenew + (monthsToRenew === '1' ? ' Month' : ' Months')),
    r('Shift   :', student.shift),
    r('Seat    :', student.seat),
    line,
    r('Base Amt:', `Rs.${amount.toLocaleString('en-IN')}`),
    ...(lateFee > 0 ? [r('Late Fee:', `Rs.${lateFee.toLocaleString('en-IN')}`)] : []),
    ...(couponDiscount > 0 ? [r('Discount:', `-Rs.${couponDiscount.toLocaleString('en-IN')}`)] : []),
    r('PAID    :', `Rs.${total.toLocaleString('en-IN')}`),
    line,
    r('Mode    :', MODE_LABELS[mode]),
    ...(txnId ? [r('Txn ID  :', txnId)] : []),
    '',
    ...(remark ? [`Note    : ${remark}`, ''] : []),
    c('✅ Payment Received & Confirmed'),
    c('Thank You! Keep Studying 😊'),
    line,
    c('Library OS'),
  ];
  return lines.join('\n');
}

interface ReceiptData {
  receiptNo: string; studentName: string; studentId: string;
  phone: string; total: number; mode: Mode; date: string; waMessage: string;
  student: typeof MOCK_STUDENTS[0]; amount: number; lateFee: number;
  couponDiscount: number; txnId: string; remark: string; monthsToRenew: string;
}

export default function CollectFee() {
  const [search, setSearch]             = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<typeof MOCK_STUDENTS[0] | null>(null);
  const [amount, setAmount]             = useState('');
  const [mode, setMode]                 = useState<Mode>('cash');
  const [txnId, setTxnId]               = useState('');
  const [couponCode, setCouponCode]     = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponStatus, setCouponStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [lateFee, setLateFee]           = useState('0');
  const [lateFeeOverride, setLateFeeOverride] = useState(false);
  const [monthsToRenew, setMonthsToRenew] = useState('1');
  const [remark, setRemark]             = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptData, setReceiptData]   = useState<ReceiptData | null>(null);

  const filteredStudents = MOCK_STUDENTS.filter(s =>
    search.length >= 2 &&
    (s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.smartId.toLowerCase().includes(search.toLowerCase()))
  );

  const baseAmount  = parseFloat(amount) || 0;
  const lateFeeAmt  = parseFloat(lateFee) || 0;
  const total       = baseAmount + lateFeeAmt - couponDiscount;

  function resetForm() {
    setSelectedStudent(null); setSearch(''); setAmount(''); setTxnId('');
    setCouponCode(''); setCouponDiscount(0); setCouponStatus('idle');
    setLateFee('0'); setLateFeeOverride(false); setRemark(''); setMonthsToRenew('1'); setIsSubmitting(false);
  }

  function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    if (couponCode.toUpperCase() === 'SAVE50')     { setCouponDiscount(50);  setCouponStatus('valid');   toast.success('₹50 discount applied'); }
    else if (couponCode.toUpperCase() === 'FRIEND100') { setCouponDiscount(100); setCouponStatus('valid');   toast.success('₹100 discount applied'); }
    else                                            { setCouponDiscount(0);   setCouponStatus('invalid'); toast.error('Invalid/expired code'); }
  }

  function handleCollect() {
    if (!selectedStudent || !amount || parseFloat(amount) <= 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const rn   = `REC-${receiptCounter++}`;
      const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const waMsg = buildWhatsAppReceipt({ receiptNo: rn, student: selectedStudent, amount: baseAmount, mode, txnId, lateFee: lateFeeAmt, couponDiscount, total, remark, date, monthsToRenew: monthsToRenew as any });

      setReceiptData({ receiptNo: rn, studentName: selectedStudent.name, studentId: selectedStudent.smartId, phone: selectedStudent.phone, total, mode, date, waMessage: waMsg, student: selectedStudent, amount: baseAmount, lateFee: lateFeeAmt, couponDiscount, txnId, remark, monthsToRenew });

      if (selectedStudent.status === 'suspended') {
        setTimeout(() => toast.success('🔓 Seat access automatically restored.'), 500);
      }
      resetForm();
    }, 900);
  }

  function handlePrintReceipt() {
    if (!receiptData) return;
    printThermal({
      type: 'receipt', shopName: 'Library OS', branch: 'Main Branch',
      studentName: receiptData.studentName, smartId: receiptData.studentId,
      phone: receiptData.phone, shift: receiptData.student.shift,
      seat: receiptData.student.seat, plan: receiptData.student.plan,
      billNumber: receiptData.receiptNo, date: receiptData.date,
      totalPayable: receiptData.amount + receiptData.lateFee,
      amountPaid: receiptData.total, discount: receiptData.couponDiscount,
      balance: 0, paymentMode: MODE_LABELS[receiptData.mode],
      transactionId: receiptData.txnId || undefined,
    });
  }

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#1A1A2E', color: '#F0F0FF', border: '1px solid #2A2A3E', fontSize: 13 }
      }} />

      {/* Receipt Modal */}
      {receiptData && (
        <div className="fin-receipt-modal-overlay" onClick={() => setReceiptData(null)} role="dialog" aria-modal="true">
          <div className="fin-receipt-modal" onClick={e => e.stopPropagation()}>
            <div className="fin-receipt-modal-header">
              <div>
                <h2 className="fin-receipt-modal-title">🎉 Payment Collected!</h2>
                <span className="fin-receipt-modal-badge"><CheckCircle size={11} /> {receiptData.receiptNo}</span>
              </div>
              <button className="fin-receipt-modal-close" onClick={() => setReceiptData(null)} aria-label="Close"><X size={15} /></button>
            </div>
            <div className="fin-receipt-modal-body">
              <div className="fin-receipt-thermal fin-receipt-modal-card">
                <div className="fin-receipt-zigzag fin-receipt-zigzag--top">
                  {Array.from({ length: 20 }).map((_, i) => <div key={i} className="fin-receipt-zigzag-dot" />)}
                </div>
                <div className="fin-receipt-body">
                  <div className="fin-receipt-logo-circle"><BookOpen size={28} className="fin-receipt-accent-icon" /></div>
                  <p className="fin-receipt-brand">Library OS</p>
                  <p className="fin-receipt-title">Payment Receipt</p>
                  <div className="fin-receipt-id-box" style={{ marginTop: 24 }}>
                    <p className="fin-receipt-id-label">Receipt Number</p>
                    <p className="fin-receipt-id-value">{receiptData.receiptNo}</p>
                  </div>
                  <div className="fin-receipt-modal-details">
                    {[
                      ['Date',    receiptData.date],
                      ['Student', receiptData.studentName],
                      ['Smart ID',receiptData.studentId],
                      ['Phone',   `+91-${maskPhone(receiptData.phone)}`],
                      ['Cycle',   receiptData.monthsToRenew + (receiptData.monthsToRenew === '1' ? ' Month' : ' Months')],
                      ['Mode',    MODE_LABELS[receiptData.mode]],
                    ].map(([l, v]) => (
                      <div key={l} className="fin-receipt-modal-row">
                        <span className="fin-receipt-row-label">{l}</span>
                        <span className="fin-receipt-row-value">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="fin-receipt-dashed-line">
                    <p className="fin-receipt-total-label">Total Paid</p>
                    <p className="fin-receipt-total-amount">₹{receiptData.total.toFixed(0)}</p>
                  </div>
                  <div className="fin-receipt-paid-badge">
                    <CheckCircle size={16} className="fin-receipt-accent-icon" />
                    <span className="fin-receipt-paid-text">✅ Payment Received</span>
                  </div>
                  <p className="fin-receipt-footer-quote">&quot;Knowledge is the best investment.&quot;</p>
                  <p className="fin-receipt-footer-thanks">Thank you! Keep studying 😊</p>
                </div>
                <div className="fin-receipt-zigzag fin-receipt-zigzag--bottom">
                  {Array.from({ length: 20 }).map((_, i) => <div key={i} className="fin-receipt-zigzag-dot" />)}
                </div>
              </div>

              <div className="fin-receipt-modal-actions">
                <p className="fin-receipt-modal-actions-title">Send / Print Receipt</p>
                <button className="fin-receipt-btn-wa fin-receipt-btn-wa--full" onClick={() => openWhatsApp(receiptData.phone, receiptData.waMessage)}>
                  <MessageSquare size={16} /> Send Receipt on WhatsApp
                </button>
                <p className="fin-receipt-wa-hint">📱 +91-{maskPhone(receiptData.phone)} · {receiptData.studentName}</p>
                <div className="fin-divider" />
                <button className="fin-receipt-btn-secondary" onClick={handlePrintReceipt} style={{ width: '100%' }}>
                  <Printer size={15} /> Print Receipt (Thermal 80mm)
                </button>
                <button className="fin-receipt-btn-download" onClick={() => setReceiptData(null)} style={{ width: '100%', marginTop: 0 }}>
                  ✅ Done
                </button>
                <div className="fin-receipt-modal-info">
                  {[
                    { l: 'Receipt', v: receiptData.receiptNo },
                    { l: 'Amount',  v: formatCurrency(receiptData.total), color: 'var(--success)' },
                    { l: 'Mode',    v: MODE_LABELS[receiptData.mode] },
                  ].map(r => (
                    <div key={r.l} className="fin-receipt-modal-info-row">
                      <span className="fin-cell-subtext">{r.l}</span>
                      <span className="fin-cell-name" style={{ color: (r as any).color }}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h1 className="fin-page-title">Collect Fee</h1>
          <p className="fin-page-subtitle">Record a new payment from a student.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 fin-collect-fee-grid">
          {/* Left — Form */}
          <div className="lg:col-span-3 space-y-4">
            <div className="fin-card p-6 space-y-3">
              <p className="fin-section-label">Student <span className="fin-text-danger">*</span></p>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 fin-icon-muted" />
                <input className="fin-input fin-input--pl9" placeholder="Search by name or Smart ID..." value={search}
                  onChange={e => { setSearch(e.target.value); setSelectedStudent(null); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)} />
              </div>
              {showDropdown && search.length >= 2 && !selectedStudent && (
                <div className="fin-dropdown-list">
                  {filteredStudents.length === 0 ? (
                    <div className="fin-table-empty-cell">No students found</div>
                  ) : filteredStudents.map(s => (
                    <button key={s.id} className="fin-dropdown-item" onClick={() => {
                      setSelectedStudent(s); setSearch(s.name); setShowDropdown(false);
                      if (s.dueAmount > 0) { setLateFee('50'); setAmount(s.dueAmount.toString()); }
                      else { setLateFee('0'); setAmount(''); }
                    }}>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="fin-cell-subtext">{s.smartId} · {s.plan} · Valid till {s.validUpto}</div>
                      </div>
                      <span className={`fin-badge ${s.status === 'active' ? 'fin-badge--success' : s.status === 'suspended' ? 'fin-badge--danger' : 'fin-badge--warning'}`}>{s.status}</span>
                    </button>
                  ))}
                </div>
              )}
              {selectedStudent && (
                <div className="fin-student-confirmed">
                  <CheckCircle size={16} />
                  <span className="fin-cell-name">{selectedStudent.name}</span>
                  <span className="fin-cell-subtext">({selectedStudent.smartId})</span>
                  <span className="fin-cell-subtext">· +91-{maskPhone(selectedStudent.phone)}</span>
                </div>
              )}
              {selectedStudent != null && selectedStudent.dueAmount > 0 && (
                <div className="fin-badge fin-badge--danger w-full justify-center py-2">
                  🔴 Due Amount: {formatCurrency(selectedStudent?.dueAmount ?? 0)} pending
                </div>
              )}
            </div>

            <div className="fin-card p-6 space-y-4">
              <p className="fin-section-label">Payment Details</p>
              <div>
                <label className="fin-label">Months Paying For (Cycle)</label>
                <select className="fin-select w-full mt-1" value={monthsToRenew} onChange={e => setMonthsToRenew(e.target.value)}>
                  <option value="1">1 Month</option>
                  <option value="3">3 Months (Quarterly)</option>
                  <option value="6">6 Months (Half-Yearly)</option>
                  <option value="12">12 Months (Annual)</option>
                </select>
              </div>
              <div>
                <label className="fin-label">Amount <span className="fin-text-danger">*</span></label>
                <div className="relative mt-1">
                  <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 fin-icon-muted" />
                  <input type="number" className="fin-input fin-input--pl8" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="fin-label">Payment Mode</label>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {MODES.map(m => (
                    <button key={m} onClick={() => setMode(m)} className={`fin-badge cursor-pointer ${mode === m ? 'fin-badge--info' : 'fin-badge--neutral'}`}>
                      {MODE_LABELS[m]}
                    </button>
                  ))}
                </div>
              </div>
              {mode !== 'cash' && (
                <div>
                  <label className="fin-label">Transaction ID <span className="fin-text-danger">*</span></label>
                  <input className="fin-input w-full mt-1" placeholder="Enter transaction reference" value={txnId} onChange={e => setTxnId(e.target.value)} />
                </div>
              )}
              <div>
                <label className="fin-label">Coupon Code</label>
                <div className="flex gap-2 mt-1">
                  <input className="fin-input flex-1" placeholder="e.g. SAVE50" value={couponCode}
                    onChange={e => { setCouponCode(e.target.value); setCouponStatus('idle'); setCouponDiscount(0); }} />
                  <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={handleApplyCoupon}>Apply</button>
                </div>
                {couponStatus === 'valid'   && <p className="fin-input-hint fin-text-success">✅ {formatCurrency(couponDiscount)} discount applied</p>}
                {couponStatus === 'invalid' && <p className="fin-input-hint fin-text-danger">❌ Invalid/expired code</p>}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="fin-label">Late Fee</label>
                  <label className="flex items-center gap-1 fin-text-xs cursor-pointer">
                    <input type="checkbox" checked={lateFeeOverride} onChange={e => setLateFeeOverride(e.target.checked)} /> Override
                  </label>
                </div>
                <input type="number" className="fin-input w-full mt-1" value={lateFee} onChange={e => setLateFee(e.target.value)} readOnly={!lateFeeOverride} />
              </div>
              <div>
                <label className="fin-label">Remark (optional)</label>
                <textarea className="fin-textarea mt-1" rows={2} placeholder="Any notes..." value={remark} onChange={e => setRemark(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Right — Receipt Preview */}
          <div className="lg:col-span-2">
            <div className="fin-receipt-preview">
              <div className="fin-receipt-thermal">
                <div className="fin-receipt-zigzag fin-receipt-zigzag--top">
                  {Array.from({ length: 20 }).map((_, i) => <div key={i} className="fin-receipt-zigzag-dot" />)}
                </div>
                <div className="fin-receipt-body">
                  <div className="fin-receipt-logo-circle"><BookOpen size={28} className="fin-receipt-accent-icon" /></div>
                  <p className="fin-receipt-brand">Library OS</p>
                  <p className="fin-receipt-title">Payment Receipt</p>
                  <div className="fin-receipt-id-box mt-6">
                    <p className="fin-receipt-id-label">Receipt Number</p>
                    <p className="fin-receipt-id-value">REC-{receiptCounter}</p>
                  </div>
                  <div className="space-y-3 text-left mb-6">
                    {[
                      ['Date',    new Date().toLocaleDateString('en-IN')],
                      ['Student', selectedStudent?.name || '—'],
                      ['Smart ID',selectedStudent?.smartId || '—'],
                      ['Phone',   selectedStudent ? `+91-${maskPhone(selectedStudent.phone)}` : '—'],
                      ['Mode',    MODE_LABELS[mode]],
                    ].map(([l, v]) => (
                      <div key={l} className="flex justify-between">
                        <span className="fin-receipt-row-label">{l}</span>
                        <span className="fin-receipt-row-value">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="fin-receipt-dashed-line">
                    <p className="fin-receipt-total-label">Total Amount</p>
                    <p className="fin-receipt-total-amount">₹{total > 0 ? total.toFixed(0) : '0'}</p>
                  </div>
                  <button
                    className="fin-receipt-paid-badge"
                    onClick={handleCollect}
                    disabled={!selectedStudent || !amount || parseFloat(amount) <= 0 || isSubmitting}
                    style={{
                      border: 'none', width: '100%',
                      cursor: (!selectedStudent || !amount || parseFloat(amount) <= 0 || isSubmitting) ? 'not-allowed' : 'pointer',
                      opacity: (!selectedStudent || !amount || parseFloat(amount) <= 0 || isSubmitting) ? 0.5 : 1,
                      backgroundColor: (!selectedStudent || !amount || parseFloat(amount) <= 0 || isSubmitting) ? 'rgba(192,193,255,0.1)' : 'var(--success)',
                      color: (!selectedStudent || !amount || parseFloat(amount) <= 0 || isSubmitting) ? 'var(--receipt-accent)' : '#ffffff',
                      transition: 'all 0.2s',
                    }}
                  >
                    <CheckCircle size={16} color={(!selectedStudent || !amount || parseFloat(amount) <= 0 || isSubmitting) ? 'var(--receipt-accent)' : '#ffffff'} />
                    <span className="fin-receipt-paid-text" style={{ color: (!selectedStudent || !amount || parseFloat(amount) <= 0 || isSubmitting) ? 'var(--receipt-accent)' : '#ffffff' }}>
                      {isSubmitting ? 'Processing...' : 'Received by Manager'}
                    </span>
                  </button>
                  <p className="fin-receipt-footer-quote">&quot;Knowledge is the best investment.&quot;</p>
                  <p className="fin-receipt-footer-thanks">Thank you! See you again 😊</p>
                </div>
                <div className="fin-receipt-zigzag fin-receipt-zigzag--bottom">
                  {Array.from({ length: 20 }).map((_, i) => <div key={i} className="fin-receipt-zigzag-dot" />)}
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <button className="fin-receipt-btn-secondary flex items-center justify-center gap-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }} onClick={resetForm}><X size={16} /> Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
