'use client';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  BookOpen, Check, Plus, Trash2, ChevronRight, ChevronLeft,
  Rocket, SkipForward, LayoutDashboard, X, AlertTriangle,
} from 'lucide-react';
import {
  branchDetailsSchema, type BranchDetailsData,
  shiftsSchema,       type ShiftsData,
  seatsSchema,        type SeatsData,
  plansSchema,        type PlansData,
} from '@/app/superadmin/superadmin_reusable/schema';
import { SETUP_WIZARD_DATA as d } from '@/app/superadmin/superadmin_setup-wizard/setupWizard_constants';

const STEPS = [
  { num: 1, title: 'Branch Details', desc: 'Library info & address' },
  { num: 2, title: 'Define Shifts',  desc: 'Set time slots' },
  { num: 3, title: 'Add Seats',      desc: 'Configure capacity' },
  { num: 4, title: 'Fee Plans',      desc: 'Subscription pricing' },
  { num: 5, title: 'Launch',         desc: 'Review & go live' },
];

const inputCls = (hasErr?: boolean) => `sa-input${hasErr ? ' sa-input--error' : ''}`;

// ──── Step 1 ───────────────────────────────────────────────────────────────────
function Step1({ onNext }: { onNext: (d: BranchDetailsData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<BranchDetailsData>({
    resolver: zodResolver(branchDetailsSchema),
    defaultValues: { name: d.libraryName, address: d.address, city: d.city, gst: d.gst },
  });
  return (
    <form id="step1-form" onSubmit={handleSubmit(onNext)} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <label className="sa-wizard-field-label">
          Library Name <span className="sa-wizard-field-required">*</span>
        </label>
        <input {...register('name')} placeholder="e.g. City Reading Hub" className={inputCls(!!errors.name)} />
        {errors.name && <p className="sa-wizard-field-error">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="sa-wizard-field-label">
          Address <span className="sa-wizard-field-required">*</span>
        </label>
        <textarea {...register('address')} rows={3} placeholder="Full address..."
          className={`${inputCls(!!errors.address)} resize-none`} />
        {errors.address && <p className="sa-wizard-field-error">{errors.address.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="sa-wizard-field-label">
            City <span className="sa-wizard-field-required">*</span>
          </label>
          <input {...register('city')} placeholder="City" className={inputCls(!!errors.city)} />
          {errors.city && <p className="sa-wizard-field-error">{errors.city.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="sa-wizard-field-label">
            GST Number <span className="sa-wizard-field-optional">(optional)</span>
          </label>
          <input {...register('gst')} placeholder="22AAAAA0000A1Z5" className={inputCls()} />
        </div>
      </div>
    </form>
  );
}

// ──── Step 2 ───────────────────────────────────────────────────────────────────
function Step2({ onNext }: { onNext: (d: ShiftsData) => void }) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<ShiftsData>({
    resolver: zodResolver(shiftsSchema),
    defaultValues: { shifts: d.shifts },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'shifts' });

  return (
    <form id="step2-form" onSubmit={handleSubmit(onNext)} noValidate className="space-y-3">
      {fields.map((field, i) => (
        <div key={field.id} className="sa-wizard-row sa-wizard-row--shifts">
          <div className="space-y-1.5">
            <label className="sa-wizard-field-label--sm">Shift Name</label>
            <input {...register(`shifts.${i}.name`)} placeholder="e.g. Morning"
              className={inputCls(!!(errors.shifts?.[i]?.name))} />
            {errors.shifts?.[i]?.name && (
              <p className="sa-wizard-field-error">{errors.shifts[i].name?.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="sa-wizard-field-label--sm">Start</label>
            <input type="time" {...register(`shifts.${i}.start`)}
              className={`${inputCls()} [color-scheme:dark]`} />
          </div>
          <div className="space-y-1.5">
            <label className="sa-wizard-field-label--sm">End</label>
            <input type="time" {...register(`shifts.${i}.end`)}
              className={`${inputCls()} [color-scheme:dark]`} />
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            disabled={fields.length <= 1}
            className="sa-wizard-remove-btn"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ name: '', start: '06:00', end: '12:00' })}
        className="sa-btn-dashed"
      >
        <Plus size={15} /> Add Another Shift
      </button>
    </form>
  );
}

// ──── Step 3 ───────────────────────────────────────────────────────────────────
function Step3({ onNext }: { onNext: (d: SeatsData) => void }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SeatsData>({
    resolver: zodResolver(seatsSchema),
    defaultValues: { count: d.seatCount, prefix: d.seatPrefix },
  });
  const count  = watch('count')  || 0;
  const prefix = watch('prefix') || '';

  const preview =
    Array.from({ length: Math.min(count, 5) }, (_, i) =>
      `${prefix}${String(i + 1).padStart(2, '0')}`
    ).join(', ') + (count > 5 ? ` ... ${prefix}${String(count).padStart(2, '0')}` : '');

  const seatCellClass = (i: number) => {
    if (i === 0) return 'sa-wizard-seat-cell sa-wizard-seat-cell--occupied';
    if (i === 1) return 'sa-wizard-seat-cell sa-wizard-seat-cell--expiring';
    return 'sa-wizard-seat-cell sa-wizard-seat-cell--free';
  };

  return (
    <form id="step3-form" onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="sa-wizard-field-label">
            Total Seats <span className="sa-wizard-field-required">*</span>
          </label>
          <input type="number" min={1}
            {...register('count', { valueAsNumber: true })}
            className={inputCls(!!errors.count)} />
          {errors.count && <p className="sa-wizard-field-error">{errors.count.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="sa-wizard-field-label">
            Seat Prefix <span className="sa-wizard-field-optional">(max 3)</span>
          </label>
          <input maxLength={3} {...register('prefix')} placeholder="e.g. SL-"
            className={inputCls(!!errors.prefix)} />
          {errors.prefix && <p className="sa-wizard-field-error">{errors.prefix.message}</p>}
        </div>
      </div>

      <div className="sa-wizard-preview-card">
        <p className="sa-wizard-preview-label">💡 Seats will be generated as:</p>
        <p className="sa-wizard-seat-preview-text">
          {prefix ? preview : '(enter prefix to preview)'}
        </p>
        <p className="sa-wizard-seat-preview-sub">
          {count} seat{count !== 1 ? 's' : ''} total
        </p>
      </div>

      <div>
        <p className="sa-wizard-seat-grid-label">Sample grid preview:</p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: Math.min(count, 20) }, (_, i) => (
            <div key={i} className={seatCellClass(i)}>
              {prefix}{String(i + 1).padStart(2, '0')}
            </div>
          ))}
          {count > 20 && (
            <div className="sa-wizard-seat-cell sa-wizard-seat-cell--more">
              +{count - 20}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

// ──── Step 4 ───────────────────────────────────────────────────────────────────
function Step4({ onNext }: { onNext: (d: PlansData) => void }) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<PlansData>({
    resolver: zodResolver(plansSchema),
    defaultValues: { plans: d.plans },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'plans' });

  return (
    <form id="step4-form" onSubmit={handleSubmit(onNext)} noValidate className="space-y-3">
      {fields.map((field, i) => (
        <div key={field.id} className="sa-wizard-row sa-wizard-row--plans">
          <div className="space-y-1.5">
            <label className="sa-wizard-field-label--sm">
              Plan Name <span className="sa-wizard-field-required">*</span>
            </label>
            <input {...register(`plans.${i}.name`)} placeholder="e.g. Monthly"
              className={inputCls(!!(errors.plans?.[i]?.name))} />
          </div>
          <div className="space-y-1.5">
            <label className="sa-wizard-field-label--sm">Days</label>
            <input type="number" min={1}
              {...register(`plans.${i}.days`, { valueAsNumber: true })}
              className={inputCls()} />
          </div>
          <div className="space-y-1.5">
            <label className="sa-wizard-field-label--sm">Price (₹)</label>
            <input type="number" min={0}
              {...register(`plans.${i}.price`, { valueAsNumber: true })}
              placeholder="1000"
              className={inputCls()} />
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            disabled={fields.length <= 1}
            className="sa-wizard-remove-btn"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ name: '', days: 30, price: 0 })}
        className="sa-btn-dashed"
      >
        <Plus size={15} /> Add Another Plan
      </button>
    </form>
  );
}

// ──── Main Wizard ─────────────────────────────────────────────────────────────
export default function SetupWizardPage() {
  const [step,          setStep]          = useState(1);
  const [launching,     setLaunching]     = useState(false);
  const [launched,      setLaunched]      = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);

  const [branch, setBranch] = useState<BranchDetailsData>({
    name: d.libraryName, address: d.address, city: d.city, gst: d.gst,
  });
  const [shifts, setShifts] = useState<ShiftsData>({ shifts: d.shifts });
  const [seats,  setSeats]  = useState<SeatsData>({ count: d.seatCount, prefix: d.seatPrefix });
  const [plans,  setPlans]  = useState<PlansData>({ plans: d.plans });

  // ✅ RULE 3 — dynamic computed width is the ONLY style prop allowed
  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  const nextStep = () => setStep(s => Math.min(STEPS.length, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleLaunch = async () => {
    setLaunching(true);
    await new Promise(res => setTimeout(res, 2000));
    setLaunched(true);
    setTimeout(() => { window.location.href = '/superadmin/superadmin_dashboard'; }, 1000);
  };

  const handleSkipToDashboard = () => {
    window.location.href = '/superadmin/superadmin_dashboard';
  };

  return (
    <div className="sa-wizard-shell">
      <div className="sa-wizard-glow" />

      {/* ── SKIP CONFIRMATION MODAL ── */}
      {showSkipModal && (
        <div className="sa-wizard-modal-overlay">
          <div className="sa-wizard-modal">
            <div className="sa-wizard-modal-icon">
              <AlertTriangle size={22} className="sa-metric--warning" />
            </div>

            <h3 className="sa-wizard-modal-title">Skip Library Setup?</h3>
            <p className="sa-wizard-modal-desc">
              Your library will have{' '}
              <strong>no shifts, no seats, and no fee plans</strong>{' '}
              configured.
            </p>
            <p className="sa-wizard-modal-desc">
              You can complete setup anytime from{' '}
              <span className="sa-wizard-modal-desc-link">Dashboard → Settings → Setup Wizard</span>.
            </p>

            <div className="sa-wizard-modal-consequences">
              {[
                { icon: '⚠️', text: 'Students cannot be admitted without seats & shifts' },
                { icon: '⚠️', text: 'Fee collection requires at least one active plan' },
                { icon: '✅', text: 'You can still explore the dashboard and admin panel' },
              ].map(({ icon, text }) => (
                <div key={text} className="sa-wizard-consequence-chip">
                  <span className="sa-wizard-consequence-icon">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                id="skip-cancel-btn"
                type="button"
                onClick={() => setShowSkipModal(false)}
                className="sa-btn-ghost flex-1 py-2.5"
              >
                Continue Setup
              </button>
              <button
                id="skip-confirm-btn"
                type="button"
                onClick={handleSkipToDashboard}
                className="sa-wizard-modal-go-btn"
              >
                <LayoutDashboard size={15} /> Go to Dashboard
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSkipModal(false)}
              className="sa-wizard-modal-close"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEPPER SIDEBAR ── */}
      <aside className="sa-wizard-sidebar">
        <div className="sa-wizard-logo-area">
          <div className="sa-wizard-logo-box">
            <BookOpen size={18} className="text-white" />
          </div>
          <span className="sa-wizard-logo-title">Setup Wizard</span>
        </div>

        <div className="space-y-1">
          {STEPS.map((s, i) => {
            const isActive = s.num === step;
            const isDone   = s.num < step;
            return (
              <div key={s.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className={`sa-step-connector ${isDone ? 'sa-step-connector--done' : ''}`} />
                )}
                <div className={`sa-step-item ${isActive ? 'sa-step-item--active' : ''}`}>
                  <div className={`sa-step-dot ${isDone ? 'sa-step-dot--done' : isActive ? 'sa-step-dot--active' : ''}`}>
                    {isDone
                      ? <Check size={14} className="text-white" />
                      : <span className={`sa-wizard-step-num-badge ${isActive ? 'sa-wizard-step-num-badge--active' : ''}`}>{s.num}</span>
                    }
                  </div>
                  <div>
                    <p className={`sa-step-label ${isActive ? 'sa-step-label--active' : isDone ? 'sa-step-label--done' : ''}`}>
                      {s.title}
                    </p>
                    <p className="sa-wizard-field-label--sm-no-mb">{s.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto space-y-3">
          <div className="sa-tip-card">
            💡 You can update these settings anytime from your dashboard.
          </div>
          <button
            id="skip-setup-sidebar-btn"
            type="button"
            onClick={() => setShowSkipModal(true)}
            className="sa-wizard-skip-btn"
          >
            <SkipForward size={12} /> Skip setup for now
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col">
        <div className="sa-wizard-topbar">
          <div className="sa-wizard-progress-track">
            {/* ✅ RULE 3 — dynamic computed width */}
            <div className="sa-wizard-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <button
            id="skip-setup-btn"
            type="button"
            onClick={() => setShowSkipModal(true)}
            className="sa-wizard-topbar-skip"
          >
            <SkipForward size={13} /> Skip Setup
          </button>
        </div>

        <div className="sa-wizard-content-area">
          <div className="sa-wizard-content-inner">
            <div className="sa-wizard-step-header">
              <p className="sa-wizard-step-label">Step {step} of {STEPS.length}</p>
              <h2 className="sa-wizard-step-title">{STEPS[step - 1].title}</h2>
            </div>

            {step === 1 && <Step1 onNext={d => { setBranch(d); nextStep(); }} />}
            {step === 2 && <Step2 onNext={d => { setShifts(d); nextStep(); }} />}
            {step === 3 && <Step3 onNext={d => { setSeats(d);  nextStep(); }} />}
            {step === 4 && <Step4 onNext={d => { setPlans(d);  nextStep(); }} />}

            {/* ── Step 5: Launch ── */}
            {step === 5 && (
              <div className="space-y-5">
                <div className="sa-wizard-summary-card">
                  <h3 className="sa-wizard-summary-title">{branch.name}</h3>
                  <p className="sa-wizard-summary-address">
                    {branch.address}, {branch.city}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="sa-wizard-summary-badge sa-wizard-summary-badge--shifts">
                      ⏰ {shifts.shifts.length} Shifts Added
                    </span>
                    <span className="sa-wizard-summary-badge sa-wizard-summary-badge--seats">
                      🪑 {seats.count} Seats Created
                    </span>
                    <span className="sa-wizard-summary-badge sa-wizard-summary-badge--plans">
                      💳 {plans.plans.length} Plans Ready
                    </span>
                    {branch.gst && (
                      <span className="sa-wizard-summary-badge sa-wizard-summary-badge--gst">
                        🧾 GST Enabled
                      </span>
                    )}
                  </div>
                </div>

                <div className="sa-wizard-shifts-preview">
                  <p className="sa-wizard-preview-section-label">Shifts</p>
                  <div className="flex flex-wrap gap-2">
                    {shifts.shifts.map((s: any) => (
                      <span key={s.name} className="sa-wizard-preview-chip">
                        {s.name}: {s.start} – {s.end}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sa-wizard-plans-preview">
                  <p className="sa-wizard-preview-section-label">Fee Plans</p>
                  <div className="flex flex-wrap gap-2">
                    {plans.plans.map((pl: any) => (
                      <span key={pl.name} className="sa-wizard-preview-chip">
                        {pl.name} · {pl.days}d · ₹{pl.price}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  id="launch-dashboard-btn"
                  type="button"
                  onClick={handleLaunch}
                  disabled={launching || launched}
                  className={`sa-wizard-launch-btn ${launched ? 'sa-wizard-launch-btn--done' : ''}`}
                >
                  {launched ? (
                    <><Check size={20} /> Launched! Redirecting...</>
                  ) : launching ? (
                    <><span className="sa-wizard-launch-spinner" />Setting up your library...</>
                  ) : (
                    <><Rocket size={20} /> 🚀 Launch Dashboard</>
                  )}
                </button>
              </div>
            )}

            {/* ── FOOTER NAV ── */}
            {step !== 5 ? (
              <div className="sa-wizard-footer">
                <button
                  type="button"
                  id="wizard-back-btn"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="sa-btn-ghost sa-btn-ghost--sm disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} /> Back
                </button>
                <span className="sa-wizard-footer-step-count">Step {step} of {STEPS.length}</span>
                <button
                  type="submit"
                  id="wizard-next-btn"
                  form={`step${step}-form`}
                  className="sa-wizard-next-btn"
                >
                  Next Step <ChevronRight size={16} />
                </button>
              </div>
            ) : (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={prevStep}
                  className="sa-wizard-back-link"
                >
                  ← Back to Fee Plans
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
