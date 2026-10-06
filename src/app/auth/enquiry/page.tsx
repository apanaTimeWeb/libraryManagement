'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { BookOpen, Send, CheckCircle, Phone, User, MessageSquare, Clock } from 'lucide-react';
import { enquirySchema, type EnquiryFormData } from '@/app/auth/reusable/schema';

// ─── Hardcoded Data ───────────────────────────────────────────────────────────
const LIBRARY = {
  name:    'City Reading Hub',
  tagline: 'Your focused study destination',
  address: 'Block A, Sector 18, Civil Lines, Allahabad',
  phone:   '+91 98765 43210',
};

const SHIFTS = [
  { id: 'morning',   label: 'Morning',   time: '6:00 AM – 12:00 PM', available: true  },
  { id: 'afternoon', label: 'Afternoon', time: '12:00 PM – 6:00 PM', available: true  },
  { id: 'evening',   label: 'Evening',   time: '6:00 PM – 10:00 PM', available: false },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function PublicEnquiryPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [submittedPhone, setSubmittedPhone] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: '', phone: '+91 ', shift: '', message: '' },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    await new Promise(res => setTimeout(res, 1200));
    setSubmittedName(data.name);
    setSubmittedPhone(data.phone);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center p-4 sm:p-6 pt-8 sm:pt-6 bg-[var(--bg-page)] overflow-y-auto">
      <div className="auth-glow-tr" />
      <div className="auth-glow-bl" />

      <div className="w-full max-w-[440px] space-y-5 pb-8">

        {/* Library Branding Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="auth-logo-box auth-logo-box--lg">
              <BookOpen size={26} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {LIBRARY.name}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">{LIBRARY.tagline}</p>
          </div>
          <div className="auth-availability-badge">
            <span className="auth-availability-dot" />
            Seats Available — Enquire Now
          </div>
        </div>

        {/* Main Card */}
        <div className="auth-card">
          {!submitted ? (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Submit Your Enquiry</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Fill in your details and we&apos;ll contact you shortly to confirm your seat.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

                {/* Full Name */}
                <div>
                  <label htmlFor="enq-name" className="auth-label auth-label--required">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
                    <input
                      id="enq-name"
                      type="text"
                      placeholder="Your Full Name"
                      {...register('name')}
                      className={`auth-input pl-9 ${errors.name ? 'auth-input--error' : ''}`}
                    />
                  </div>
                  {errors.name && <p className="auth-error">{errors.name.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="enq-phone" className="auth-label auth-label--required">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
                    <input
                      id="enq-phone"
                      type="tel"
                      placeholder="+91 9800000000"
                      {...register('phone')}
                      className={`auth-input pl-9 ${errors.phone ? 'auth-input--error' : ''}`}
                    />
                  </div>
                  {errors.phone && <p className="auth-error">{errors.phone.message}</p>}
                </div>

                {/* Preferred Shift */}
                <div>
                  <label className="auth-label auth-label--required">Preferred Shift</label>
                  <div className="space-y-2 mt-1">
                    {SHIFTS.map(shift => (
                      <label
                        key={shift.id}
                        htmlFor={`shift-${shift.id}`}
                        className={`auth-shift-option ${!shift.available ? 'auth-shift-option--disabled' : ''}`}
                      >
                        <input
                          id={`shift-${shift.id}`}
                          type="radio"
                          value={shift.id}
                          disabled={!shift.available}
                          {...register('shift')}
                          className="accent-[var(--primary)] w-4 h-4 shrink-0"
                        />
                        <Clock size={14} className="text-[var(--text-secondary)] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--text-primary)]">{shift.label}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{shift.time}</p>
                        </div>
                        {!shift.available && <span className="auth-shift-full-badge">Full</span>}
                      </label>
                    ))}
                  </div>
                  {errors.shift && <p className="auth-error mt-1">{errors.shift.message}</p>}
                </div>

                {/* Message (optional) */}
                <div>
                  <label htmlFor="enq-message" className="auth-label">
                    Message <span className="text-[var(--text-disabled)] font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <MessageSquare size={15} className="absolute left-3 top-3 text-[var(--text-secondary)] pointer-events-none" />
                    <textarea
                      id="enq-message"
                      rows={2}
                      placeholder="Any questions or special requirements?"
                      {...register('message')}
                      className="auth-input pl-9 resize-none"
                    />
                  </div>
                </div>

                <button
                  id="submit-enquiry-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="auth-btn-primary mt-2"
                >
                  {isSubmitting
                    ? <><span className="auth-spinner" /> Submitting...</>
                    : <><Send size={15} /> Submit Enquiry</>
                  }
                </button>
              </form>
            </>
          ) : (
            <div className="auth-success-state py-6">
              <div className="flex justify-center mb-5">
                <div className="auth-enquiry-success-icon">
                  <CheckCircle size={40} className="text-[var(--success)]" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                Thank you, {submittedName}!
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs mx-auto">
                We&apos;ll contact you on{' '}
                <strong className="text-[var(--text-primary)]">{submittedPhone}</strong>{' '}
                shortly to confirm your seat. 🎉
              </p>

              <div className="auth-next-steps-box mt-6 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-3">
                  What Happens Next
                </p>
                {[
                  { icon: '📞', text: 'We call you within 24 hours' },
                  { icon: '🪑', text: 'Seat confirmed & reserved for you' },
                  { icon: '🎓', text: 'Collect your ID card on arrival' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                    <span className="text-base">{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <button
                id="submit-another-btn"
                type="button"
                onClick={() => setSubmitted(false)}
                className="auth-btn-ghost mt-6 w-full"
              >
                Submit Another Enquiry
              </button>
            </div>
          )}
        </div>

        {/* Library info footer */}
        <div className="text-center space-y-1.5">
          <p className="text-xs text-[var(--text-secondary)]">{LIBRARY.address}</p>
          <a
            href={`tel:${LIBRARY.phone.replace(/\s/g, '')}`}
            className="text-xs text-[var(--primary)] font-medium hover:underline"
          >
            {LIBRARY.phone}
          </a>
          <p className="text-[10px] text-[var(--text-disabled)] pt-1">
            © 2026 {LIBRARY.name} · Powered by Library OS
          </p>
        </div>
      </div>
    </div>
  );
}
