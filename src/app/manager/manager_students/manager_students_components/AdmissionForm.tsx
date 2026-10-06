'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import {
  ArrowLeft, CheckCircle, User, Phone, Mail, GraduationCap,
  Armchair, Lock, FileText, IndianRupee, CreditCard,
} from 'lucide-react';
import AdmissionSuccessModal from './AdmissionSuccessModal';
import { calcExpiryDate, formatDateIN } from '@/lib/whatsappUtils';
import { useStudentsStore } from '../manager_students_context/manager_students_store';
import type { IdCardData } from './StudentIdCard';
import { fetchApi } from '@/lib/api';
import { createStudent } from '../manager_students_api/manager_students_api';

/* ── Zod Schema ── */
const schema = z.object({
  fullName:      z.string().min(2, 'Full name is required'),
  phone:         z.string().min(10, 'Valid phone number required'),
  parentPhone:   z.string().optional(),
  email:         z.string().email('Valid email required').optional().or(z.literal('')),
  college:       z.string().optional(),
  shift:         z.string().min(1, 'Select a shift'),
  seat:          z.string().min(1, 'Select a seat'),
  locker:        z.string(),
  plan:          z.string().min(1, 'Select a plan'),
  manualDiscount:z.string(),
  amountPaid:    z.string().min(1, 'Amount paid is required'),
  paymentMode:   z.enum(['Cash', 'UPI', 'Card', 'Bank']),
  transactionId: z.string().optional(),
  remark:        z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const PLANS = [
  { label: 'Monthly — ₹1,500',    value: 'Monthly',    amount: 1500 },
  { label: 'Quarterly — ₹4,200',  value: 'Quarterly',  amount: 4200 },
  { label: 'Half-Yearly — ₹7,800',value: 'Half-Yearly',amount: 7800 },
  { label: 'Annual — ₹14,000',    value: 'Annual',     amount: 14000 },
];

const SHIFTS = ['Morning (8 AM–2 PM)', 'Evening (2 PM–8 PM)', 'Full Day (8 AM–8 PM)', 'Night (10 PM–6 AM)'];
const SEATS  = ['A-12', 'A-15', 'B-03', 'B-04', 'C-01', 'C-05'];
const LOCKERS = ['None', 'L-001 (+₹200)', 'L-005 (+₹200)', 'L-012 (+₹200)'];

const SMART_ID = 'LIB003'; // simulated auto-generated

/* Admitted student data shape for the success modal */
type AdmittedData = IdCardData & {
  phone: string;
  parentPhone?: string;
  amountPaid: number;
  totalPayable: number;
  discount: number;
  paymentMode: string;
  transactionId?: string;
};

export default function AdmissionForm() {
  const searchParams = useSearchParams();
  const [admittedData, setAdmittedData] = useState<AdmittedData | null>(null);

  const defaultName = searchParams.get('name') || '';
  const defaultPhone = searchParams.get('phone') || '';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName:      defaultName,
      phone:         defaultPhone,
      shift:         SHIFTS[0],
      seat:          SEATS[0],
      locker:        'None',
      plan:          'Monthly',
      paymentMode:   'UPI',
      manualDiscount:'0',
      amountPaid:    '1500',
    },
  });

  const watchedPlan      = watch('plan');
  const watchedDiscount  = watch('manualDiscount');
  const watchedAmount    = watch('amountPaid');
  const watchedMode      = watch('paymentMode');
  const watchedShift     = watch('shift');
  const watchedSeat      = watch('seat');
  const watchedLocker    = watch('locker');

  const planMeta  = PLANS.find(p => p.value === watchedPlan);
  const baseAmt   = planMeta?.amount ?? 1500;
  const discount  = Number(watchedDiscount) || 0;
  const totalPayable = baseAmt - discount;

  async function onSubmit(data: FormValues) {
    try {
      const joinDate = new Date();
      const expiryDate = calcExpiryDate(joinDate, data.plan);
      
      const payload = {
        ...data,
      };

      const res = await createStudent(payload);

      const admitted: AdmittedData = {
        name:          data.fullName,
        smartId:       res.smartId || SMART_ID,
        phone:         data.phone,
        parentPhone:   data.parentPhone,
        shift:         data.shift,
        seat:          data.seat,
        locker:        data.locker,
        plan:          data.plan,
        joinDate:      formatDateIN(joinDate),
        expiryDate:    formatDateIN(expiryDate),
        branch:        'Main Branch',
        college:       data.college,
        amountPaid:    Number(data.amountPaid),
        totalPayable,
        discount,
        paymentMode:   data.paymentMode,
        transactionId: data.transactionId,
      };

      setAdmittedData(admitted);
      toast.success('🎉 Admission confirmed! ID Card ready.', { duration: 3000 });
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit admission');
    }
  }

  return (
    <>
      {/* Success Modal — shows after admission confirmed */}
      {admittedData && (
        <AdmissionSuccessModal
          data={admittedData}
          onClose={() => setAdmittedData(null)}
        />
      )}

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--mgr-bg-card)',
            color: 'var(--mgr-text-primary)',
            border: '1px solid var(--mgr-border)',
            fontSize: 13,
          },
        }}
      />

      <div className="mgr-page">

        {/* Page Header */}
        <div className="mgr-page-header">
          <div>
            <Link href="/manager/manager_students" className="mgr-back-link">
              <ArrowLeft size={14} /> Back to Students
            </Link>
            <h1 className="mgr-page-title">New Student Admission</h1>
            <p className="mgr-page-subtitle">Fill all mandatory (*) fields accurately. Smart ID is auto-generated.</p>
          </div>
          {/* Smart ID Badge */}
          <div className="mgr-smartid-badge">
            <span className="mgr-smartid-label">Smart ID</span>
            <span className="mgr-smartid-value">{SMART_ID}</span>
            <span className="mgr-badge mgr-badge--info">Gap slot reused</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mgr-admission-layout">

            {/* ── LEFT: Form Sections ── */}
            <div className="mgr-admission-main">

              {/* Section 1: Personal Info */}
              <div className="mgr-card">
                <div className="mgr-card-header">
                  <div className="mgr-section-number">01</div>
                  <h2 className="mgr-section-title">Personal Information</h2>
                </div>
                <div className="mgr-card-body">
                  <div className="mgr-form-grid">

                    <div className="mgr-form-field mgr-form-field-full">
                      <label className="mgr-label mgr-label-required">Full Name</label>
                      <div className="mgr-input-icon-wrap">
                        <User size={14} className="mgr-input-icon" />
                        <input
                          {...register('fullName')}
                          className={`mgr-input mgr-input-with-icon${errors.fullName ? ' mgr-input-error' : ''}`}
                          placeholder="Enter student full name"
                        />
                      </div>
                      {errors.fullName && <p className="mgr-error">{errors.fullName.message}</p>}
                    </div>

                    <div className="mgr-form-field">
                      <label className="mgr-label mgr-label-required">Phone Number</label>
                      <div className="mgr-input-icon-wrap">
                        <Phone size={14} className="mgr-input-icon" />
                        <input
                          {...register('phone')}
                          type="tel"
                          className={`mgr-input mgr-input-with-icon${errors.phone ? ' mgr-input-error' : ''}`}
                          placeholder="9876543210"
                        />
                      </div>
                      {errors.phone && <p className="mgr-error">{errors.phone.message}</p>}
                    </div>

                    <div className="mgr-form-field">
                      <label className="mgr-label">Parent / Guardian Phone</label>
                      <div className="mgr-input-icon-wrap">
                        <Phone size={14} className="mgr-input-icon" />
                        <input
                          {...register('parentPhone')}
                          type="tel"
                          className="mgr-input mgr-input-with-icon"
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div className="mgr-form-field">
                      <label className="mgr-label">Email Address</label>
                      <div className="mgr-input-icon-wrap">
                        <Mail size={14} className="mgr-input-icon" />
                        <input
                          {...register('email')}
                          type="email"
                          className={`mgr-input mgr-input-with-icon${errors.email ? ' mgr-input-error' : ''}`}
                          placeholder="student@email.com"
                        />
                      </div>
                      {errors.email && <p className="mgr-error">{errors.email.message}</p>}
                    </div>

                    <div className="mgr-form-field">
                      <label className="mgr-label">College / Preparing For</label>
                      <div className="mgr-input-icon-wrap">
                        <GraduationCap size={14} className="mgr-input-icon" />
                        <input
                          {...register('college')}
                          className="mgr-input mgr-input-with-icon"
                          placeholder="e.g. UPSC / IIT / Delhi University"
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Section 2: Seat & Shift */}
              <div className="mgr-card">
                <div className="mgr-card-header">
                  <div className="mgr-section-number">02</div>
                  <h2 className="mgr-section-title">Seat & Shift Allocation</h2>
                </div>
                <div className="mgr-card-body">
                  <div className="mgr-form-grid">

                    <div className="mgr-form-field">
                      <label className="mgr-label mgr-label-required">Select Shift</label>
                      <div className="mgr-input-icon-wrap">
                        <Armchair size={14} className="mgr-input-icon" />
                        <select
                          {...register('shift')}
                          className={`mgr-select mgr-input-with-icon${errors.shift ? ' mgr-input-error' : ''}`}
                        >
                          {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      {errors.shift && <p className="mgr-error">{errors.shift.message}</p>}
                    </div>

                    <div className="mgr-form-field">
                      <label className="mgr-label mgr-label-required">Seat Number</label>
                      <select
                        {...register('seat')}
                        className={`mgr-select${errors.seat ? ' mgr-input-error' : ''}`}
                      >
                        {SEATS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.seat && <p className="mgr-error">{errors.seat.message}</p>}
                    </div>

                    <div className="mgr-form-field">
                      <label className="mgr-label">Locker (Optional)</label>
                      <div className="mgr-input-icon-wrap">
                        <Lock size={14} className="mgr-input-icon" />
                        <select {...register('locker')} className="mgr-select mgr-input-with-icon">
                          {LOCKERS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Section 3: Fee & Payment */}
              <div className="mgr-card">
                <div className="mgr-card-header">
                  <div className="mgr-section-number">03</div>
                  <h2 className="mgr-section-title">Fee & Payment</h2>
                </div>
                <div className="mgr-card-body">
                  <div className="mgr-form-grid">

                    <div className="mgr-form-field">
                      <label className="mgr-label mgr-label-required">Subscription Plan</label>
                      <div className="mgr-input-icon-wrap">
                        <FileText size={14} className="mgr-input-icon" />
                        <select
                          {...register('plan')}
                          className="mgr-select mgr-input-with-icon"
                          onChange={e => {
                            setValue('plan', e.target.value);
                            const p = PLANS.find(p => p.value === e.target.value);
                            if (p) setValue('amountPaid', String(p.amount - discount));
                          }}
                        >
                          {PLANS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="mgr-form-field">
                      <label className="mgr-label">Manual Discount (₹)</label>
                      <div className="mgr-input-icon-wrap">
                        <IndianRupee size={14} className="mgr-input-icon" />
                        <input
                          {...register('manualDiscount')}
                          type="number"
                          min="0"
                          className="mgr-input mgr-input-with-icon"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="mgr-form-field">
                      <label className="mgr-label">Coupon Code</label>
                      <div className="flex gap-2">
                        <input className="mgr-input uppercase" placeholder="e.g. SUMMER50" />
                        <button type="button" className="mgr-btn-ghost mgr-btn-sm">Apply</button>
                      </div>
                    </div>

                    <div className="mgr-form-field">
                      <label className="mgr-label mgr-label-required">Amount Paid Now (₹)</label>
                      <div className="mgr-input-icon-wrap">
                        <IndianRupee size={14} className="mgr-input-icon" />
                        <input
                          {...register('amountPaid')}
                          type="number"
                          className={`mgr-input mgr-input-with-icon${errors.amountPaid ? ' mgr-input-error' : ''}`}
                        />
                      </div>
                      {errors.amountPaid && <p className="mgr-error">{errors.amountPaid.message}</p>}
                    </div>

                    <div className="mgr-form-field mgr-form-field-full">
                      <label className="mgr-label mgr-label-required">Payment Mode</label>
                      <div className="mgr-payment-mode-group">
                        {(['Cash', 'UPI', 'Card', 'Bank'] as const).map(mode => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setValue('paymentMode', mode)}
                            className={`mgr-payment-mode-btn${watchedMode === mode ? ' active' : ''}`}
                          >
                            <CreditCard size={13} />
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mgr-form-field">
                      <label className="mgr-label">Transaction ID / Reference</label>
                      <input
                        {...register('transactionId')}
                        className="mgr-input"
                        placeholder="e.g. 41220912…"
                      />
                    </div>

                    <div className="mgr-form-field">
                      <label className="mgr-label">Remark</label>
                      <textarea
                        {...register('remark')}
                        className="mgr-textarea"
                        rows={2}
                        placeholder="Optional note"
                      />
                    </div>

                  </div>
                </div>
              </div>

            </div>{/* end main */}

            {/* ── RIGHT: Admission Summary ── */}
            <aside className="mgr-admission-summary">
              <div className="mgr-card sticky top-[80px]">
                <div className="mgr-card-header">
                  <h2 className="mgr-section-title">Admission Summary</h2>
                </div>
                <div className="mgr-card-body">
                  <div className="mgr-summary-rows">
                    <div className="mgr-summary-row">
                      <span className="mgr-summary-label">Smart ID</span>
                      <span className="mgr-smartid-chip">{SMART_ID}</span>
                    </div>
                    <div className="mgr-summary-row">
                      <span className="mgr-summary-label">Plan</span>
                      <span className="mgr-summary-value">{watchedPlan}</span>
                    </div>
                    <div className="mgr-summary-row">
                      <span className="mgr-summary-label">Shift</span>
                      <span className="mgr-summary-value">{watchedShift.split(' ')[0]}</span>
                    </div>
                    <div className="mgr-summary-row">
                      <span className="mgr-summary-label">Seat</span>
                      <span className="mgr-summary-value">{watchedSeat}</span>
                    </div>
                    <div className="mgr-summary-row">
                      <span className="mgr-summary-label">Locker</span>
                      <span className="mgr-summary-value">{watchedLocker}</span>
                    </div>
                    <div className="mgr-summary-divider" />
                    <div className="mgr-summary-row">
                      <span className="mgr-summary-label">Base Amount</span>
                      <span className="mgr-summary-value">₹{baseAmt.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="mgr-summary-row">
                      <span className="mgr-summary-label">Discount</span>
                      <span className="mgr-text-warning">− ₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="mgr-summary-total-row">
                      <span className="mgr-summary-total-label">Total Payable</span>
                      <span className="mgr-summary-total-value">₹{totalPayable.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="mgr-summary-row">
                      <span className="mgr-summary-label">Paid Now</span>
                      <span className="mgr-text-success">₹{Number(watchedAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                    {totalPayable - Number(watchedAmount || 0) > 0 && (
                      <div className="mgr-summary-row">
                        <span className="mgr-summary-label">Balance Due</span>
                        <span className="mgr-text-danger">₹{(totalPayable - Number(watchedAmount || 0)).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>

                  <div className="mgr-summary-actions">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mgr-btn-primary mgr-btn-full"
                    >
                      <CheckCircle size={15} />
                      {isSubmitting ? 'Confirming…' : 'Confirm Admission'}
                    </button>
                    <Link href="/manager/manager_students" className="mgr-btn-ghost mgr-btn-full">
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

          </div>{/* end layout */}
        </form>
      </div>
    </>
  );
}
