'use client';

import { useRouter } from 'next/navigation';
import { X, Printer, MessageSquare, Users, CheckCircle } from 'lucide-react';
import StudentIdCard, { type IdCardData } from './StudentIdCard';
import { formatIdCardMessage, openWhatsApp, type StudentWhatsAppData } from '@/lib/whatsappUtils';
import { printThermal } from '@/lib/thermalPrint';

interface Props {
  data: IdCardData & {
    phone: string;
    parentPhone?: string;
    amountPaid: number;
    totalPayable: number;
    discount: number;
    paymentMode: string;
    transactionId?: string;
  };
  onClose: () => void;
}

export default function AdmissionSuccessModal({ data, onClose }: Props) {
  const router  = useRouter();
  const balance = data.totalPayable - data.amountPaid;

  const waData: StudentWhatsAppData = {
    name: data.name, smartId: data.smartId, phone: data.phone,
    parentPhone: data.parentPhone, shift: data.shift, seat: data.seat,
    locker: data.locker, plan: data.plan, amountPaid: data.amountPaid,
    totalPayable: data.totalPayable, discount: data.discount,
    paymentMode: data.paymentMode, transactionId: data.transactionId,
    joinDate: data.joinDate, expiryDate: data.expiryDate, branch: data.branch,
  };

  function handleSendIdCard() {
    openWhatsApp(data.phone, formatIdCardMessage(waData));
  }

  function handleSendParent() {
    if (data.parentPhone) openWhatsApp(data.parentPhone, formatIdCardMessage(waData));
  }

  function handlePrintReceipt() {
    printThermal({
      type: 'receipt', shopName: 'Library OS', branch: data.branch,
      studentName: data.name, smartId: data.smartId, phone: data.phone,
      shift: data.shift, seat: data.seat, plan: data.plan,
      joinDate: data.joinDate, expiryDate: data.expiryDate,
      totalPayable: data.totalPayable, amountPaid: data.amountPaid,
      discount: data.discount, balance,
      paymentMode: data.paymentMode, transactionId: data.transactionId,
      date: new Date().toLocaleString('en-IN'),
    });
  }

  function handlePrintIdCard() {
    printThermal({
      type: 'idcard', shopName: 'Library OS', branch: data.branch,
      studentName: data.name, smartId: data.smartId, phone: data.phone,
      shift: data.shift, seat: data.seat, locker: data.locker, plan: data.plan,
      joinDate: data.joinDate, expiryDate: data.expiryDate,
    });
  }

  return (
    <div
      className="mgr-success-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      onClick={onClose}
    >
      <div className="mgr-success-modal" onClick={e => e.stopPropagation()}>

        <div className="mgr-success-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h2 className="mgr-success-title" id="success-modal-title">🎉 Admission Confirmed!</h2>
            <span className="mgr-success-badge"><CheckCircle size={12} /> Active</span>
          </div>
          <button className="mgr-success-close" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <div className="mgr-success-body">

          <StudentIdCard data={data} />

          <div className="mgr-success-actions-panel">
            <p className="mgr-success-actions-title">Quick Actions</p>

            <button className="mgr-btn-whatsapp" onClick={handleSendIdCard}>
              <MessageSquare size={16} /> Send ID Card via WhatsApp
            </button>

            {data.parentPhone && (
              <button className="mgr-btn-whatsapp-dues" onClick={handleSendParent}>
                <MessageSquare size={16} /> Send to Parent WhatsApp
              </button>
            )}

            <div className="mgr-success-divider" />

            <button className="mgr-btn-ghost" onClick={handlePrintIdCard} style={{ width: '100%', justifyContent: 'center' }}>
              <Printer size={15} /> Print ID Card (Thermal)
            </button>

            <button className="mgr-btn-ghost" onClick={handlePrintReceipt} style={{ width: '100%', justifyContent: 'center' }}>
              <Printer size={15} /> Print Fee Receipt (Thermal)
            </button>

            <button className="mgr-btn-primary" onClick={() => { onClose(); router.push('/manager/manager_students'); }} style={{ width: '100%', justifyContent: 'center' }}>
              <Users size={15} /> Go to Students
            </button>

            <div className="mgr-success-info-box">
              {[
                { label: 'Smart ID',    value: data.smartId,     mono: true },
                { label: 'Plan',        value: data.plan },
                { label: 'Valid Until', value: data.expiryDate },
                { label: 'Paid',        value: `₹${data.amountPaid.toLocaleString('en-IN')}`, color: 'var(--success)' },
                ...(balance > 0 ? [{ label: 'Balance Due', value: `₹${balance.toLocaleString('en-IN')}`, color: 'var(--danger)' }] : []),
              ].map(r => (
                <div key={r.label} className="mgr-success-info-row">
                  <span className="mgr-success-info-label">{r.label}</span>
                  <span className="mgr-success-info-value" style={{ fontFamily: (r as any).mono ? 'monospace' : undefined, color: (r as any).color }}>
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
