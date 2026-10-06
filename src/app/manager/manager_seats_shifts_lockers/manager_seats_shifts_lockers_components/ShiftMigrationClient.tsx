'use client';
import { useState } from 'react';
import { ArrowLeft, Search, ChevronDown, CreditCard, QrCode, Banknote, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Student {
  id: string; name: string; smartId: string;
  currentShift: string; currentSeat: string; validTill: string; plan: string; dailyRate: number;
}

const STUDENTS: Student[] = [
  { id: '1', name: 'Alex Rivera',  smartId: 'LIB-88429', currentShift: 'Morning',  currentSeat: 'A-12', validTill: '2025-04-30', plan: 'Monthly ₹1000', dailyRate: 33 },
  { id: '2', name: 'Priya Sharma', smartId: 'LIB-00234', currentShift: 'Evening',  currentSeat: 'B-05', validTill: '2025-05-15', plan: 'Monthly ₹1200', dailyRate: 40 },
  { id: '3', name: 'Rohan Mehta',  smartId: 'LIB-00567', currentShift: 'Full Day', currentSeat: 'C-08', validTill: '2025-06-01', plan: 'Monthly ₹1500', dailyRate: 50 },
];

const SHIFTS = [
  { name: 'Morning',   seats: 4, rate: 33 },
  { name: 'Afternoon', seats: 8, rate: 36 },
  { name: 'Evening',   seats: 2, rate: 40 },
  { name: 'Full Day',  seats: 1, rate: 50 },
];

type PayMode = 'Cash' | 'UPI' | 'Card';

function daysRemaining(validTill: string): number {
  const diff = new Date(validTill).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

export function ShiftMigrationClient() {
  const [step, setStep]                         = useState(1);
  const [search, setSearch]                     = useState('');
  const [selectedStudent, setSelectedStudent]   = useState<Student | null>(null);
  const [newShift, setNewShift]                 = useState('');
  const [newSeat, setNewSeat]                   = useState('');
  const [showCustomSlot, setShowCustomSlot]     = useState(false);
  const [customStart, setCustomStart]           = useState('');
  const [customEnd, setCustomEnd]               = useState('');
  const [payMode, setPayMode]                   = useState<PayMode>('Cash');
  const [txnId, setTxnId]                       = useState('');
  const [remark, setRemark]                     = useState('');
  const [showConfirm, setShowConfirm]           = useState(false);

  const filteredStudents = STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.smartId.toLowerCase().includes(search.toLowerCase())
  );

  const daysLeft       = selectedStudent ? daysRemaining(selectedStudent.validTill) : 0;
  const selectedShiftData = SHIFTS.find(s => s.name === newShift);
  const newRate        = selectedShiftData?.rate ?? 0;
  const oldRate        = selectedStudent?.dailyRate ?? 0;
  const adjustment     = (newRate - oldRate) * daysLeft;
  const isPaying       = adjustment > 0;

  function handleConfirmMigration() {
    setShowConfirm(false);
    toast.success(`✅ ${selectedStudent?.name} migrated to ${newShift} — Seat ${newSeat}`);
    setStep(1); setSelectedStudent(null); setSearch('');
    setNewShift(''); setNewSeat(''); setTxnId(''); setRemark('');
    setShowCustomSlot(false); setCustomStart(''); setCustomEnd('');
  }

  const STEPS = [
    { n: 1, label: 'Select Student' },
    { n: 2, label: 'Choose New Slot' },
    { n: 3, label: 'Review & Pay' },
  ];

  return (
    <>
      <div className="ss-page ss-page--with-footer">
        <div className="ss-page-header-center">
          <h1 className="ss-page-title ss-page-title--lg">Shift Migration Wizard</h1>
          <p className="ss-page-subtitle ss-page-subtitle--mt">Move a student to a different shift with automatic fee adjustment.</p>
        </div>

        <div className="ss-stepper">
          <div className="ss-stepper__track" />
          <div className="ss-stepper__progress" style={{ width: `${((step - 1) / 2) * 100}%` }} />
          <div className="ss-stepper__steps">
            {STEPS.map(s => (
              <div key={s.n} className="ss-stepper__step">
                <div className={`ss-stepper__circle ${step >= s.n ? 'ss-stepper__circle--active' : 'ss-stepper__circle--inactive'}`}>
                  {step > s.n ? <CheckCircle size={18} /> : s.n}
                </div>
                <span className={`ss-stepper__label ${step >= s.n ? 'ss-stepper__label--active' : 'ss-stepper__label--inactive'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="ss-migration-layout">
          <div className="ss-migration-main">
            {step === 1 && (
              <div className="ss-card">
                <h3 className="ss-card-section-heading">
                  <Search size={18} className="ss-text-primary-brand" />
                  Select Student
                </h3>
                <div className="ss-filter-bar__input-wrap">
                  <Search size={14} className="ss-input-icon" />
                  <input
                    className="ss-input"
                    placeholder="Search by name or Smart ID..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setSelectedStudent(null); }}
                  />
                </div>
                {search && (
                  <div className="ss-search-results">
                    {filteredStudents.length === 0 ? (
                      <p className="ss-text-secondary ss-text-caption">No students found.</p>
                    ) : filteredStudents.map(s => (
                      <button
                        key={s.id}
                        className={`ss-search-result-item${selectedStudent?.id === s.id ? ' ss-search-result-item--active' : ''}`}
                        onClick={() => {
                          setSelectedStudent(s);
                          setNewShift(s.currentShift);
                          setNewSeat(s.currentSeat);
                        }}
                      >
                        <p className="ss-cell-name">{s.name}</p>
                        <p className="ss-table__cell-sub">{s.smartId} · {s.currentShift}</p>
                      </button>
                    ))}
                  </div>
                )}
                {selectedStudent && (
                  <div className="ss-info-box ss-info-box--mt">
                    <div>
                      <p className="ss-info-box__title">Current Details — {selectedStudent.name}</p>
                      <p className="ss-info-box__desc">
                        Shift: <strong>{selectedStudent.currentShift}</strong> · Seat: <strong>{selectedStudent.currentSeat}</strong> · Valid Till: <strong>{selectedStudent.validTill}</strong> · Plan: <strong>{selectedStudent.plan}</strong> · Days Left: <strong>{daysLeft}</strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="ss-card">
                <h3 className="ss-card-section-heading">
                  <ChevronDown size={18} className="ss-text-primary-brand" />
                  Choose New Slot
                </h3>
                <div className="ss-migration-form-grid">
                  <div>
                    <label className="ss-label">New Shift <span className="ss-text-danger">*</span></label>
                    <div className="ss-select-wrap">
                      <select className="ss-select" value={newShift} onChange={e => { setNewShift(e.target.value); setNewSeat(''); }}>
                        <option value="">Select shift...</option>
                        {SHIFTS.map(s => (
                          <option key={s.name} value={s.name}>{s.name} ({s.seats} seats free)</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="ss-select-icon" />
                    </div>
                  </div>
                  <div>
                    <label className="ss-label">New Seat <span className="ss-text-danger">*</span></label>
                    <div className="ss-select-wrap">
                      <select className="ss-select" value={newSeat} onChange={e => setNewSeat(e.target.value)} disabled={!newShift}>
                        <option value="">Select seat...</option>
                        {newShift && ['B-01', 'B-02', 'B-03', 'B-04'].map(seat => (
                          <option key={seat}>{seat}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="ss-select-icon" />
                    </div>
                  </div>
                </div>

                <div className="ss-custom-slot-toggle">
                  <button
                    className={`ss-btn-ghost ss-btn--sm ss-custom-slot-toggle__btn`}
                    onClick={() => setShowCustomSlot(v => !v)}
                  >
                    <Clock size={13} />
                    {showCustomSlot ? 'Remove Custom Slot' : '+ Add Custom Time Slot (Optional)'}
                  </button>
                </div>
                {showCustomSlot && (
                  <div className="ss-migration-form-grid ss-custom-slot-fields">
                    <div>
                      <label className="ss-label">Custom Start Time</label>
                      <input type="time" className="ss-input ss-input--no-icon" value={customStart} onChange={e => setCustomStart(e.target.value)} />
                    </div>
                    <div>
                      <label className="ss-label">Custom End Time</label>
                      <input type="time" className="ss-input ss-input--no-icon" value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
                    </div>
                  </div>
                )}

                {newShift && (
                  <div className="ss-info-box ss-info-box--mt">
                    <div>
                      <p className="ss-info-box__title">Availability</p>
                      <p className="ss-info-box__desc">
                        {selectedShiftData?.seats} seats available in {newShift} shift. Rate: ₹{newRate}/day.
                        {showCustomSlot && customStart && customEnd && (
                          <> Custom slot: <strong>{customStart} – {customEnd}</strong>.</>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <>
                <div className="ss-card">
                  <h3 className="ss-card-section-heading">
                    <CheckCircle size={18} className="ss-text-primary-brand" />
                    Fee Adjustment
                  </h3>
                  <div className="ss-reconcile-list">
                    <div className="ss-reconcile-row">
                      <span className="ss-reconcile-row__label">Old Rate</span>
                      <span className="ss-reconcile-row__value ss-text-mono">₹{oldRate}/day</span>
                    </div>
                    <div className="ss-reconcile-row">
                      <span className="ss-reconcile-row__label">New Rate</span>
                      <span className="ss-reconcile-row__value ss-text-mono">₹{newRate}/day</span>
                    </div>
                    <div className="ss-reconcile-row">
                      <span className="ss-reconcile-row__label">Days Remaining</span>
                      <span className="ss-reconcile-row__value ss-text-mono">{daysLeft} days</span>
                    </div>
                    <div className="ss-divider" />
                    <div className="ss-reconcile-total">
                      <span className="ss-reconcile-total__label">Fee Adjustment</span>
                      <span className={`ss-reconcile-total__value ${isPaying ? 'ss-text-danger' : 'ss-text-success'}`}>
                        {isPaying ? '+' : ''}₹{Math.abs(adjustment)}
                      </span>
                    </div>
                  </div>
                  <div className="ss-info-box ss-info-box--mt">
                    <div>
                      <p className="ss-info-box__desc">
                        {isPaying
                          ? '🔴 Student pays more — collect ₹' + adjustment + ' before confirming.'
                          : adjustment < 0
                            ? '🔵 Refund ₹' + Math.abs(adjustment) + ' to student.'
                            : '✅ No fee adjustment needed.'}
                      </p>
                    </div>
                  </div>
                </div>

                {isPaying && (
                  <div className="ss-card">
                    <h3 className="ss-card-section-heading">Payment</h3>
                    <div className="ss-payment-grid">
                      {(['Cash', 'UPI', 'Card'] as PayMode[]).map(m => (
                        <button
                          key={m}
                          onClick={() => setPayMode(m)}
                          className={`ss-toolkit-btn ss-btn--pad ${payMode === m ? 'ss-btn-primary' : 'ss-btn-ghost'}`}
                        >
                          {m === 'Cash' ? <Banknote size={15} /> : m === 'UPI' ? <QrCode size={15} /> : <CreditCard size={15} />}
                          {m}
                        </button>
                      ))}
                    </div>
                    {payMode !== 'Cash' && (
                      <div className="ss-form-field ss-info-box--mt">
                        <label className="ss-label">Transaction ID</label>
                        <input className="ss-input ss-input--no-icon" placeholder="Enter transaction reference" value={txnId} onChange={e => setTxnId(e.target.value)} />
                      </div>
                    )}
                  </div>
                )}

                <div className="ss-card">
                  <label className="ss-label">Remark (optional)</label>
                  <textarea className="ss-textarea" rows={2} placeholder="Any notes about this migration..." value={remark} onChange={e => setRemark(e.target.value)} />
                </div>
              </>
            )}
          </div>

          {selectedStudent && (
            <div className="ss-migration-aside">
              <div className="ss-profile-card">
                <h4 className="ss-profile-card__name">{selectedStudent.name}</h4>
                <p className="ss-profile-card__id">{selectedStudent.smartId}</p>
                <div className="ss-profile-card__details">
                  {[
                    { label: 'Current Shift', value: selectedStudent.currentShift },
                    { label: 'Current Seat',  value: selectedStudent.currentSeat  },
                    { label: 'Valid Till',     value: selectedStudent.validTill    },
                    { label: 'Days Left',      value: `${daysLeft} days`           },
                    ...(newShift ? [{ label: 'New Shift', value: newShift }] : []),
                    ...(newSeat  ? [{ label: 'New Seat',  value: newSeat  }] : []),
                    ...(showCustomSlot && customStart && customEnd ? [{ label: 'Custom Slot', value: `${customStart} – ${customEnd}` }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="ss-profile-detail">
                      <p className="ss-profile-detail__label">{label}</p>
                      <p className="ss-profile-detail__value">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="ss-sticky-footer">
          <div className="ss-sticky-footer__inner">
            <button className="ss-btn-ghost ss-footer-prev" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>
              <ArrowLeft size={15} />Back
            </button>
            <div className="ss-sticky-footer__right">
              {step < 3 ? (
                <button
                  className="ss-btn-primary ss-footer-confirm"
                  disabled={step === 1 ? !selectedStudent : !newShift || !newSeat}
                  onClick={() => setStep(s => s + 1)}
                >
                  Next →
                </button>
              ) : (
                <button className="ss-btn-primary ss-footer-confirm" onClick={() => setShowConfirm(true)}>
                  ✅ Confirm Migration
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showConfirm && selectedStudent && (
        <div className="ss-modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="ss-modal" onClick={e => e.stopPropagation()}>
            <h2 className="ss-modal-title">✅ Confirm Migration</h2>
            <p className="ss-modal-desc">
              Old Seat <strong>{selectedStudent.currentSeat}</strong> ({selectedStudent.currentShift}) will be freed.
              New Seat <strong>{newSeat}</strong> ({newShift}) assigned.
              {showCustomSlot && customStart && customEnd && <> Custom slot: <strong>{customStart} – {customEnd}</strong>.</>}
              {' '}Fee adjustment: <strong>{isPaying ? '+' : ''}₹{Math.abs(adjustment)}</strong>. Confirm?
            </p>
            <div className="ss-modal-footer">
              <button className="ss-btn-ghost" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="ss-btn-primary" onClick={handleConfirmMigration}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
