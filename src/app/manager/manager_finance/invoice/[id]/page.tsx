'use client';
// RESPONSIBILITY: Entry page for the manager_finance module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '../../lib/format';
import { Printer, ArrowLeft, Send } from 'lucide-react';
import { openWhatsApp } from '@/lib/whatsappUtils';
import { printThermal } from '@/lib/thermalPrint';

const INV = {
  invoiceNumber:        'INV-20260411-001',
  libraryName:          'Library OS',
  libraryAddress:       'Main Branch, Pune',
  libraryGstin:         '22AAACP1234B1Z5',
  libraryPhone:         '+91 98765 43210',
  studentName:          'Gajodhar Prasad',
  studentSmartId:       'STU-001234',
  studentPhone:         '9876543210',
  studentAddress:       'Burla, Sambalpur, Odisha',
  invoiceDate:          '2026-04-01T00:00:00Z',
  paymentDate:          '2026-04-05T00:00:00Z',
  shift:                'Evening',
  seat:                 'B-05',
  items: [
    { description: 'Annual Library Membership', hsnCode: '9992', duration: '12 months', amount: 1200, gstPercent: 18, gstAmount: 216 },
    { description: 'Book Issue Fee',            hsnCode: '9992', duration: '—',         amount: 300,  gstPercent: 0,  gstAmount: 0   },
  ],
  subtotal:             1500,
  totalGst:             216,
  grandTotal:           1716,
  paymentMode:          'UPI',
  paymentTransactionId: 'UPI-1234567890',
  paymentStatus:        'paid',
};

export default function InvoiceDetail() {
  const router = useRouter();

  function handleWhatsApp() {
    const W = 42;
    const ln = '-'.repeat(W);
    const dln = '='.repeat(W);
    const c = (t: string) => ' '.repeat(Math.max(0, Math.floor((W - t.length) / 2))) + t;
    const r = (l: string, v: string) => l.slice(0, 10).padEnd(10) + ' ' + v;

    const msg = [
      dln, c('Library OS'), c('Main Branch'), dln,
      c('TAX INVOICE'), ln,
      r('Invoice :', INV.invoiceNumber),
      r('Date    :', formatDate(INV.invoiceDate)), ln,
      r('Name    :', INV.studentName),
      r('Smart ID:', INV.studentSmartId), ln,
      ...INV.items.map(i => r(i.description.slice(0, 9) + ':', `Rs.${i.amount.toLocaleString('en-IN')}`)),
      r('GST     :', `Rs.${INV.totalGst.toLocaleString('en-IN')}`),
      dln,
      r('TOTAL   :', `Rs.${INV.grandTotal.toLocaleString('en-IN')}`),
      dln,
      r('Mode    :', INV.paymentMode),
      r('Txn ID  :', INV.paymentTransactionId),
      r('Status  :', INV.paymentStatus.toUpperCase()), '',
      c('Thank You for choosing'),
      c('Library OS'),
      dln,
    ].join('\n');

    openWhatsApp(INV.studentPhone, msg);
  }

  function handlePrint() {
    printThermal({
      type:         'receipt',
      shopName:     INV.libraryName,
      branch:       'Main Branch',
      studentName:  INV.studentName,
      smartId:      INV.studentSmartId,
      phone:        INV.studentPhone,
      shift:        INV.shift,
      seat:         INV.seat,
      plan:         INV.items[0].description,
      billNumber:   INV.invoiceNumber,
      date:         formatDate(INV.invoiceDate),
      totalPayable: INV.grandTotal,
      amountPaid:   INV.paymentStatus === 'paid' ? INV.grandTotal : 0,
      discount:     0,
      balance:      INV.paymentStatus === 'paid' ? 0 : INV.grandTotal,
      paymentMode:  INV.paymentMode,
      transactionId: INV.paymentTransactionId,
    });
  }

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => router.push('/manager/manager_finance/invoice')}>
          <ArrowLeft size={11} /> Back to Invoices
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

      {/* A4 Invoice */}
      <div className="fin-card max-w-3xl mx-auto p-8">
        <div className="text-center mb-6">
          <h1 className="fin-invoice-title">TAX INVOICE</h1>
          <p className="fin-invoice-number">{INV.invoiceNumber}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="fin-invoice-section-head">From</p>
            <p className="fin-text-body font-bold">{INV.libraryName}</p>
            <p className="fin-invoice-field-label">{INV.libraryAddress}</p>
            <p className="fin-invoice-field-label">GSTIN: {INV.libraryGstin}</p>
            <p className="fin-invoice-field-label">{INV.libraryPhone}</p>
          </div>
          <div>
            <p className="fin-invoice-section-head">Billed To</p>
            <p className="fin-text-body font-bold">{INV.studentName}</p>
            <p className="fin-invoice-field-label">Smart ID: {INV.studentSmartId}</p>
            <p className="fin-invoice-field-label">{INV.studentAddress}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span className="fin-text-muted text-sm">Invoice Date: </span>
            <span className="fin-text-body font-medium">{formatDate(INV.invoiceDate)}</span>
          </div>
          <div>
            <span className="fin-text-muted text-sm">Payment Date: </span>
            <span className="fin-text-body font-medium">{formatDate(INV.paymentDate)}</span>
          </div>
        </div>

        <div className="fin-divider" />

        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-2 px-3">Description</th>
              <th className="text-left py-2 px-3">HSN</th>
              <th className="text-left py-2 px-3">Duration</th>
              <th className="text-right py-2 px-3">Amount</th>
              <th className="text-right py-2 px-3">GST %</th>
              <th className="text-right py-2 px-3">GST</th>
              <th className="text-right py-2 px-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {INV.items.map((item, i) => (
              <tr key={i} className="fin-table-row">
                <td className="py-2 px-3 fin-text-body">{item.description}</td>
                <td className="py-2 px-3 fin-mono">{item.hsnCode}</td>
                <td className="py-2 px-3 fin-cell-subtext">{item.duration}</td>
                <td className="py-2 px-3 text-right fin-text-body">{formatCurrency(item.amount)}</td>
                <td className="py-2 px-3 text-right fin-text-body">{item.gstPercent}%</td>
                <td className="py-2 px-3 text-right fin-text-body">{formatCurrency(item.gstAmount)}</td>
                <td className="py-2 px-3 text-right font-semibold fin-text-body">{formatCurrency(item.amount + item.gstAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col items-end gap-1 mb-6">
          {[
            { l: 'Subtotal:', v: formatCurrency(INV.subtotal) },
            { l: 'GST:',      v: formatCurrency(INV.totalGst) },
          ].map(r => (
            <div key={r.l} className="flex justify-between w-52">
              <span className="fin-text-muted">{r.l}</span>
              <span className="fin-text-body">{r.v}</span>
            </div>
          ))}
          <div className="fin-divider" style={{ width: '13rem' }} />
          <div className="flex justify-between w-52 font-bold">
            <span className="fin-text-body">Grand Total:</span>
            <span className="fin-text-success">{formatCurrency(INV.grandTotal)}</span>
          </div>
        </div>

        <div className="fin-divider" />

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p className="fin-invoice-section-head">Payment Mode</p>
            <p className="fin-text-body font-medium">{INV.paymentMode}</p>
          </div>
          <div>
            <p className="fin-invoice-section-head">Transaction ID</p>
            <p className="fin-mono">{INV.paymentTransactionId}</p>
          </div>
          <div>
            <p className="fin-invoice-section-head">Status</p>
            <span className="fin-badge fin-badge--success">{INV.paymentStatus}</span>
          </div>
        </div>

        <div className="fin-divider" />
        <div className="text-center mt-4">
          <p className="fin-text-muted text-sm">_________________________</p>
          <p className="fin-text-muted text-sm">Authorized Signature</p>
          <p className="fin-cell-subtext mt-4">Thank you for choosing {INV.libraryName}</p>
        </div>

        {/* Print/WhatsApp buttons inside card too */}
        <div className="flex gap-3 justify-center mt-6">
          <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={handlePrint}>
            <Printer size={13} /> Print Thermal Receipt
          </button>
          <button className="fin-badge fin-badge--success cursor-pointer" onClick={handleWhatsApp}>
            <Send size={13} /> Send via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
