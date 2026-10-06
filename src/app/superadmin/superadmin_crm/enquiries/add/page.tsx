'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, PhoneCall } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { addEnquirySchema, type AddEnquiryFormData } from '@/app/superadmin/superadmin_crm/reusable/schema';
import { CRM_CONSTANTS as data } from '@/app/superadmin/superadmin_crm/crm_constants';

export default function AddEnquiryPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddEnquiryFormData>({
    resolver: zodResolver(addEnquirySchema),
    defaultValues: {
      name: '',
      phone: '',
      preferredShift: '',
      source: '',
      handledBy: '',
      notes: '',
    },
  });

  const onSubmit = async (formData: AddEnquiryFormData) => {
    await new Promise((r) => setTimeout(r, 800));

    toast.success('Lead saved successfully!', { className: 'crm-toast crm-toast--success' });
    setTimeout(() => router.push('/superadmin/superadmin_crm/enquiries'), 600);
  };

  const handleClose = () => router.push('/superadmin/superadmin_crm/enquiries');

  return (
    <>
      <Toaster position="bottom-right" />

      {/* ── Overlay ── */}
      <div
        className="crm-drawer-overlay"
        onClick={handleClose}
        aria-label="Close drawer"
      />

      {/* ── Drawer ── */}
      <aside className="crm-drawer" role="dialog" aria-label="New Enquiry" aria-modal="true">

        {/* Header */}
        <div className="crm-drawer-header">
          <div className="crm-drawer-header-left">
            <div className="crm-drawer-icon">
              <PhoneCall size={18} color="var(--text-primary)" />
            </div>
            <div>
              <h2 className="crm-drawer-title">New Enquiry</h2>
              <p className="crm-drawer-subtitle">Capture a new prospective student</p>
            </div>
          </div>
          <button
            className="crm-btn-icon"
            onClick={handleClose}
            title="Close"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body — Form */}
        <form id="add-enquiry-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="crm-drawer-body">
            <div className="crm-form-stack">

              {/* ── Name ── */}
              <div className="crm-field">
                <label htmlFor="enq-name" className="crm-label crm-label--required">
                  Full Name
                </label>
                <input
                  id="enq-name"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. Aarav Sharma"
                  className={`crm-input${errors.name ? ' crm-input--error' : ''}`}
                  {...register('name')}
                />
                {errors.name && <p className="crm-error">{errors.name.message}</p>}
              </div>

              {/* ── Phone ── */}
              <div className="crm-field">
                <label htmlFor="enq-phone" className="crm-label crm-label--required">
                  Mobile Number
                </label>
                <div className="crm-phone-wrap">
                  <span className="crm-phone-prefix">+91</span>
                  <input
                    id="enq-phone"
                    type="tel"
                    maxLength={10}
                    placeholder="98765 43210"
                    className={`crm-input crm-input-phone${errors.phone ? ' crm-input--error' : ''}`}
                    {...register('phone')}
                  />
                </div>
                {errors.phone && <p className="crm-error">{errors.phone.message}</p>}
              </div>

              {/* ── Preferred Shift ── */}
              <div className="crm-field">
                <label htmlFor="enq-shift" className="crm-label">
                  Preferred Shift{' '}
                  <span className="crm-label-optional">(optional)</span>
                </label>
                <select
                  id="enq-shift"
                  className="crm-select"
                  {...register('preferredShift')}
                >
                  <option value="">Select a shift</option>
                  {data.shifts.map((s: any) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.time})
                    </option>
                  ))}
                </select>
              </div>

              {/* ── Source ── */}
              <div className="crm-field">
                <label htmlFor="enq-source" className="crm-label">
                  Source{' '}
                  <span className="crm-label-optional">(optional)</span>
                </label>
                <select
                  id="enq-source"
                  className="crm-select"
                  {...register('source')}
                >
                  <option value="">How did they find us?</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* ── Handled By ── */}
              <div className="crm-field">
                <label htmlFor="enq-handled-by" className="crm-label">
                  Handled By{' '}
                  <span className="crm-label-optional">(optional)</span>
                </label>
                <select
                  id="enq-handled-by"
                  className="crm-select"
                  {...register('handledBy')}
                >
                  <option value="">Assign a staff member</option>
                  {data.staff.map((s: any) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ── Notes ── */}
              <div className="crm-field">
                <label htmlFor="enq-notes" className="crm-label">
                  Notes <span className="crm-label-optional">(optional)</span>
                </label>
                <textarea
                  id="enq-notes"
                  rows={3}
                  placeholder="Initial remarks, special requirements, seat preference…"
                  className="crm-textarea"
                  {...register('notes')}
                />
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="crm-drawer-footer">
            <button
              type="button"
              className="crm-btn-ghost crm-btn-flex-1"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-enquiry-form"
              className="crm-btn-primary crm-btn-flex-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="crm-spinner" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={15} />
                  Save Lead
                </>
              )}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
