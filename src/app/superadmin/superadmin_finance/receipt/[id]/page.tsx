'use client';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, CheckCircle, Printer, Send } from 'lucide-react';
import { openWhatsApp } from '@/lib/whatsappUtils';
import { printThermal } from '@/lib/thermalPrint';

const RECEIPT_DATA = {
  id:          'SL360-TRX-99421-X',
  receiptNo:   'REC-20260411-001',
  date:        '24 Oct 2024',
  studentName: 'Aravind Sharma',
  studentId:   'LIB-2024-883',
  phone:       '9876543210',
  shift:       'Morning',
  seat:        'A-01',
  plan:        'Premium Reading Zone (Monthly)',
  items: [
    { label: 'Subscription Fee', amount: 1200 },
    { label: 'Processing Fee',   amount: 49   },
  ],
  total:       1249,
  paymentMode: 'UPI (PhonePe)',
  txnId:       'UPI-9876543210',
};

export default function ReceiptDetail() {
  const router = useRouter();

  function handleWhatsApp() {
    const W = 42;
    const ln = '-'.repeat(W);
    const dln = '='.repeat(W);
    const c = (t: string) => ' '.repeat(Math.max(0, Math.floor((W - t.length) / 2))) + t;
    const r = (l: string, v: string) => l.slice(0,10).padEnd(10) + ' ' + v;

    const msg = [
      dln, c('Library OS'), c('Main Branch'), dln,
      c('FEE RECEIPT'), ln,
      r('Receipt :', RECEIPT_DATA.receiptNo),
      r('Date    :', RECEIPT_DATA.date), ln,
      r('Name    :', RECEIPT_DATA.studentName),
      r('ID      :', RECEIPT_DATA.studentId),
      r('Phone   :', RECEIPT_DATA.phone), ln,
      r('Plan    :', RECEIPT_DATA.plan), ln,
      ...RECEIPT_DATA.items.map((i: any) => r(i.label.slice(0,9)+':', `Rs.${i.amount.toLocaleString('en-IN')}`)),
      dln,
      r('TOTAL   :', `Rs.${RECEIPT_DATA.total.toLocaleString('en-IN')}`),
      dln,
      r('Mode    :', RECEIPT_DATA.paymentMode),
      r('Txn ID  :', RECEIPT_DATA.txnId), '',
      c('Payment Received & Confirmed'),
      c('Thank You! Keep Studying!'),
      dln,
    ].join('\n');

    openWhatsApp(RECEIPT_DATA.phone, msg);
  }

  function handlePrint() {
    printThermal({
      type:         'receipt',
      shopName:     'Library OS',
      branch:       'Main Branch',
      studentName:  RECEIPT_DATA.studentName,
      smartId:      RECEIPT_DATA.studentId,
      phone:        RECEIPT_DATA.phone,
      shift:        RECEIPT_DATA.shift,
      seat:         RECEIPT_DATA.seat,
      plan:         RECEIPT_DATA.plan,
      billNumber:   RECEIPT_DATA.receiptNo,
      date:         RECEIPT_DATA.date,
      totalPayable: RECEIPT_DATA.total,
      amountPaid:   RECEIPT_DATA.total,
      discount:     0,
      balance:      0,
      paymentMode:  RECEIPT_DATA.paymentMode,
      transactionId: RECEIPT_DATA.txnId,
    });
  }

  return (
    <div className="space-y-4">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => router.push('/superadmin/superadmin_finance/receipt')}>
          <ArrowLeft size={11} /> Back to Receipts
        </button>
        <div className="flex gap-2">
          <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={handlePrint}>
            <Printer size={11} /> Print (Thermal)
          </button>
          <button className="fin-badge fin-badge--success cursor-pointer" onClick={handleWhatsApp}>
            <Send size={11} /> WhatsApp
          </button>
        </div>
      </div>

      {/* Visual receipt */}
      <div className="flex flex-col items-center">
        <div className="fin-receipt-thermal">
          <div className="fin-receipt-zigzag fin-receipt-zigzag--top">
            {Array.from({ length: 20 }).map((_, i) => <div key={i} className="fin-receipt-zigzag-dot" />)}
          </div>
          <div className="fin-receipt-body">
            <div className="fin-receipt-logo-circle">
              <BookOpen size={28} className="fin-receipt-accent-icon" />
            </div>
            <p className="fin-receipt-brand">Library OS</p>
            <h2 className="fin-receipt-title">Payment Receipt</h2>
            <div className="fin-receipt-id-box">
              <p className="fin-receipt-id-label">Receipt No.</p>
              <p className="fin-receipt-id-value">{RECEIPT_DATA.receiptNo}</p>
            </div>
            <div className="space-y-3 text-left mb-6">
              {[
                ['Date',       RECEIPT_DATA.date],
                ['Student',    RECEIPT_DATA.studentName],
                ['Smart ID',   RECEIPT_DATA.studentId],
                ['Phone',      '+91 ' + RECEIPT_DATA.phone],
                ['Shift',      RECEIPT_DATA.shift],
                ['Seat',       RECEIPT_DATA.seat],
                ['Plan',       RECEIPT_DATA.plan],
                ['Mode',       RECEIPT_DATA.paymentMode],
                ['Txn ID',     RECEIPT_DATA.txnId],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between">
                  <span className="fin-receipt-row-label">{l}</span>
                  <span className="fin-receipt-row-value">{v}</span>
                </div>
              ))}
            </div>
            {/* Items */}
            <div className="text-left mb-4 w-full">
              {RECEIPT_DATA.items.map((item: any) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="fin-cell-subtext">{item.label}</span>
                  <span className="fin-text-body">Rs.{item.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="fin-receipt-dashed-line">
              <p className="fin-receipt-total-label">Total Paid</p>
              <p className="fin-receipt-total-amount">Rs.{RECEIPT_DATA.total.toLocaleString('en-IN')}</p>
            </div>
            <div className="fin-receipt-paid-badge">
              <CheckCircle size={16} className="fin-receipt-accent-icon" />
              <span className="fin-receipt-paid-text">Payment Received</span>
            </div>
            <p className="fin-receipt-footer-quote">&quot;Knowledge is the best investment.&quot;</p>
            <p className="fin-receipt-footer-thanks">Thank you! Keep studying 😊</p>
          </div>
          <div className="fin-receipt-zigzag fin-receipt-zigzag--bottom">
            {Array.from({ length: 20 }).map((_, i) => <div key={i} className="fin-receipt-zigzag-dot" />)}
          </div>
        </div>

        {/* Action buttons below card */}
        <div className="w-full max-w-xs mt-6 flex flex-col gap-3">
          <button className="fin-receipt-btn-wa" onClick={handleWhatsApp}>
            <Send size={16} /> Send via WhatsApp
          </button>
          <button className="fin-receipt-btn-secondary" onClick={handlePrint}>
            <Printer size={16} /> Print (80mm Thermal)
          </button>
        </div>
      </div>
    </div>
  );
}
