'use client';

// RESPONSIBILITY: Entry page for the admin_crm module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';
import {
  ArrowLeft,
  Phone,
  MapPin,
  User,
  CalendarDays,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Edit2,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import { getEnquiries, updateEnquiry, deleteEnquiry } from '@/app/admin/admin_crm/admin_crm_components/EnquiryStorage';
import data from '@/app/admin/admin_crm/admin_crm_components/hardcoded.json';
import {
  type Enquiry,
  type EnquiryStatus,
  type FollowUp,
  STATUS_BADGE,
  maskPhone,
  getInitials,
} from '@/app/admin/admin_crm/admin_crm_components/AdminCrmtypes/AdminCrmtypes';
import {
  followUpSchema,
  type FollowUpFormData,
  markLostSchema,
  type MarkLostFormData,
} from '@/app/admin/admin_crm/admin_crm_components/AdminCrmschema/AdminCrmschema';

/* ── Status Select options ─────────────────────────────── */
const STATUS_OPTIONS: EnquiryStatus[] = ['New', 'Visited', 'Interested', 'Converted', 'Lost'];

/* ── Timeline dot color by staff ──────────────────────── */
function timelineDotClass(by: string): string {
  if (by === 'System') return 'crm-timeline-dot--system';
  const lower = by.toLowerCase();
  if (lower.includes('sarah')) return 'crm-timeline-dot--success';
  if (lower.includes('mike'))  return 'crm-timeline-dot--info';
  if (lower.includes('admin')) return 'crm-timeline-dot--warning';
  return '';
}

/* ── Mark Lost Modal ───────────────────────────────────── */
interface MarkLostModalProps {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}
function MarkLostModal({ onConfirm, onCancel, isSubmitting }: MarkLostModalProps) {
  const { register, handleSubmit } = useForm<MarkLostFormData>({
    resolver: zodResolver(markLostSchema),
    defaultValues: { reason: '' },
  });

  const onSubmit = (d: MarkLostFormData) => onConfirm(d.reason ?? '');

  return (
    <div className="crm-modal-overlay" onClick={onCancel}>
      <div
        className="crm-modal"
        role="dialog"
        aria-label="Mark enquiry as lost"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon + title */}
        <div className="crm-modal-header">
          <div className="crm-modal-icon-wrap">
            <AlertTriangle size={22} className="crm-modal-icon-danger" />
          </div>
          <div>
            <h3 className="crm-modal-title">Mark as Lost?</h3>
            <p className="crm-modal-desc">
              This will move the enquiry to the{' '}
              <strong className="crm-modal-desc-danger">Lost</strong> column.
              You can still view the full history and re-open it later.
            </p>
          </div>
        </div>

        {/* Optional reason */}
        <form id="mark-lost-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="crm-modal-field">
            <label className="crm-label" htmlFor="lost-reason">
              Reason <span className="crm-label-optional">(optional)</span>
            </label>
            <textarea
              id="lost-reason"
              rows={3}
              className="crm-textarea"
              placeholder="e.g. Didn't respond after 3 follow-ups, found another library…"
              {...register('reason')}
            />
          </div>

          {/* Buttons */}
          <div className="crm-modal-btns">
            <button
              type="button"
              className="crm-btn-ghost crm-btn-flex-1"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="mark-lost-form"
              className="crm-btn-danger-solid crm-btn-flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="crm-spinner" />
                  Marking…
                </>
              ) : (
                <>
                  <XCircle size={15} />
                  Mark as Lost
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Info Item helper ─────────────────────────────────── */
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="crm-info-item-label">
        {icon}
        {label}
      </p>
      <p className="crm-info-item-value">{value}</p>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
export default function EnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  // ── Local state ──
  const [enquiry, setEnquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<EnquiryStatus>('New');
  const [showLostModal, setShowLostModal] = useState(false);
  const [lostSubmitting, setLostSubmitting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    const all = getEnquiries();
    const found = all.find((x) => x.id === id);
    if (found) {
      const mapped = {
        id: found.id,
        name: found.name,
        phone: found.phone,
        shift: found.shift,
        status: found.status.charAt(0).toUpperCase() + found.status.slice(1),
        handledBy: found.handledBy || 'Unassigned',
        addedDate: found.addedDate,
        avatar: found.avatar,
        source: 'Walk-in',
        preferredBranch: 'Main Branch',
        enquiryDate: found.addedDate,
        followUps: [],
        isOverdue: false,
        isToday: true,
        isUpcoming: false,
      };
      setEnquiry(mapped);
      setCurrentStatus(mapped.status as EnquiryStatus);
    }
    setLoading(false);
  }, [id]);

  // ── Follow-up form ──
  const {
    register: registerFU,
    handleSubmit: handleSubmitFU,
    reset: resetFU,
    formState: { errors: fuErrors, isSubmitting: fuSubmitting },
  } = useForm<FollowUpFormData>({
    resolver: zodResolver(followUpSchema),
    defaultValues: { date: '', remark: '' },
  });

  /* ── Loading / Not found ── */
  if (loading) {
    return <div className="crm-page crm-empty-state"><p>Loading...</p></div>;
  }

  if (!enquiry) {
    return (
      <div className="crm-page crm-empty-state crm-not-found">
        <XCircle size={48} className="crm-empty-icon" />
        <p className="crm-empty-title">Enquiry Not Found</p>
        <p className="crm-empty-sub">
          The enquiry with ID &ldquo;{id}&rdquo; does not exist.
        </p>
        <button
          className="crm-btn-ghost crm-mt-12"
          onClick={() => router.push('/admin/admin_crm/enquiries')}
        >
          <ArrowLeft size={15} />
          Back to Pipeline
        </button>
      </div>
    );
  }

  /* ── Handlers ── */
  const handleStatusUpdate = async () => {
    setStatusUpdating(true);
    try {
      updateEnquiry(id, { status: currentStatus });
      setEnquiry((prev: any) => (prev ? { ...prev, status: currentStatus } : prev));
      toast.success(`Status updated to "${currentStatus}"`, {
        className: 'crm-toast crm-toast--success',
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAddFollowUp = async (formData: FollowUpFormData) => {
    try {
      const newEntry: FollowUp = {
        id: `fu_${Date.now()}`,
        date: new Date(formData.date).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        by: 'Admin',
        remark: formData.remark,
      };
      setEnquiry((prev: any) => {
        if (!prev) return prev;
        const updated = { ...prev, followUps: [newEntry, ...prev.followUps] };
        // We could also persist followUps to LocalStorage if we added a followUps array to EnquiryStorage type
        return updated;
      });
      resetFU();
      toast.success('Follow-up added!', {
        className: 'crm-toast crm-toast--success',
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to add follow-up');
    }
  };

  const handleConvert = () => {
    router.push(
      `/manager/manager_students/new?name=${encodeURIComponent(enquiry.name)}&phone=${encodeURIComponent(enquiry.phone)}`
    );
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this enquiry? This cannot be undone.')) {
      deleteEnquiry(id);
      toast.success('Enquiry deleted', { className: 'crm-toast crm-toast--success' });
      router.push('/admin/admin_crm/enquiries');
    }
  };

  const handleMarkLostConfirm = async (reason: string) => {
    setLostSubmitting(true);
    try {
      updateEnquiry(id, { status: 'Lost' });
      const lostEntry: FollowUp = {
        id: `fu_${Date.now()}`,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        by: 'Admin',
        remark: reason ? `Marked as Lost — ${reason}` : 'Marked as Lost.',
      };
      setEnquiry((prev: any) =>
        prev
          ? { ...prev, status: 'Lost', followUps: [lostEntry, ...prev.followUps] }
          : prev
      );
      setCurrentStatus('Lost');
      setShowLostModal(false);
      toast('Enquiry marked as lost.', {
        icon: '❌',
        className: 'crm-toast crm-toast--danger',
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to mark as lost');
    } finally {
      setLostSubmitting(false);
    }
  };

  /* ── Status badge class ── */
  const statusBadgeCls = STATUS_BADGE[enquiry.status as keyof typeof STATUS_BADGE];

  /* ── Follow-up next date label ── */
  const followUpDateClass = enquiry.isOverdue
    ? 'crm-followup-date-overdue'
    : enquiry.isToday
    ? 'crm-followup-date-today'
    : 'crm-followup-date-upcoming';

  const followUpDateLabel = enquiry.isOverdue
    ? 'Overdue'
    : enquiry.isToday
    ? 'Today'
    : 'Upcoming';

  return (
    <>
      <Toaster position="bottom-right" />

      {/* Mark Lost Modal */}
      {showLostModal && (
        <MarkLostModal
          onConfirm={handleMarkLostConfirm}
          onCancel={() => setShowLostModal(false)}
          isSubmitting={lostSubmitting}
        />
      )}

      <div className="crm-page">

        {/* ── Breadcrumb + Back ── */}
        <div className="crm-detail-topbar">
          <button
            className="crm-btn-icon crm-btn-icon-back"
            onClick={() => router.push('/admin/admin_crm/enquiries')}
            title="Back to Pipeline"
            aria-label="Back to pipeline"
          >
            <ArrowLeft size={18} />
          </button>
          <nav className="crm-breadcrumb">
            CRM &rsaquo; Enquiries &rsaquo;{' '}
            <span className="crm-breadcrumb-current">{enquiry.name}</span>
          </nav>
        </div>

        {/* ── Two-column layout ── */}
        <div className="crm-detail-grid">

          {/* ══════════════════════════════
              LEFT COLUMN  (60%)
          ══════════════════════════════ */}
          <div className="crm-detail-left">

            {/* ── Info Card ── */}
            <div className="crm-card">
              <div className="crm-lead-header">
                {/* Avatar */}
                <div className="crm-avatar crm-avatar--lg">
                  {getInitials(enquiry.name)}
                </div>
                <div className="crm-lead-header-body">
                  <div className="crm-lead-title-row">
                    <h1 className="crm-lead-name">{enquiry.name}</h1>
                    <span className={`crm-badge ${statusBadgeCls}`}>{enquiry.status}</span>
                  </div>
                  <p className="crm-lead-phone">
                    <Phone size={13} />
                    +91 {enquiry.phone}
                  </p>
                </div>
              </div>

              {/* Details grid */}
              <div className="crm-info-grid">
                <InfoItem icon={<Tag size={14} />}          label="Source"           value={enquiry.source} />
                <InfoItem icon={<Clock size={14} />}        label="Preferred Shift"  value={enquiry.shift} />
                <InfoItem icon={<User size={14} />}         label="Handled By"       value={enquiry.handledBy} />
                <InfoItem icon={<MapPin size={14} />}       label="Branch Preference" value={enquiry.preferredBranch} />
                <InfoItem icon={<CalendarDays size={14} />} label="Enquiry Date"     value={enquiry.enquiryDate} />
                <InfoItem icon={<Phone size={14} />}        label="Phone (masked)"   value={maskPhone(enquiry.phone)} />
              </div>
            </div>

            {/* ── Timeline ── */}
            <div className="crm-card">
              <h2 className="crm-section-title">Activity Timeline</h2>

              {enquiry.followUps.length === 0 ? (
                <div className="crm-empty-state-sm">
                  <Clock size={32} className="crm-empty-icon" />
                  <p className="crm-empty-sub">No follow-ups recorded yet</p>
                </div>
              ) : (
                <div className="crm-timeline">
                  {enquiry.followUps.map((fu: any) => (
                    <div className="crm-timeline-entry" key={fu.id}>
                      <div className={`crm-timeline-dot ${timelineDotClass(fu.by)}`} />
                      <div className="crm-timeline-card">
                        <div className="crm-timeline-card-header">
                          <p className="crm-timeline-date">
                            {fu.date}
                            <span className="crm-timeline-time">{fu.time}</span>
                          </p>
                          <p className="crm-timeline-by">by {fu.by}</p>
                        </div>
                        <p className="crm-timeline-remark">{fu.remark}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ══════════════════════════════
              RIGHT COLUMN  (40%) — sticky
          ══════════════════════════════ */}
          <div className="crm-detail-right">

            {/* ── Status Update Card (View-Only) ── */}
            <div className="crm-card">
              <h3 className="crm-section-label">Current Status</h3>
              <div className="crm-status-row">
                <div className="crm-select-wrap">
                  <select className="crm-select" value={currentStatus} disabled>
                    <option value={currentStatus}>{currentStatus}</option>
                  </select>
                </div>
              </div>
              <p className="crm-text-sm crm-mt-8" style={{ color: 'var(--text-secondary)' }}>Status updates are disabled for Admin role.</p>
            </div>

            {/* ── Add Follow-Up Card (View-Only) ── */}
            <div className="crm-card">
              <h3 className="crm-section-label">Follow-Up Actions</h3>
              <p className="crm-text-sm" style={{ color: 'var(--text-secondary)' }}>Adding follow-ups is disabled for Admin role.</p>

              {/* Next follow-up display */}
              {(enquiry.isToday || enquiry.isUpcoming || enquiry.isOverdue) && (
                <>
                  <div className="crm-divider" />
                  <div className="crm-followup-next">
                    <div className="crm-followup-next-left">
                      <CalendarDays size={13} />
                      <span>
                        Next follow-up:{' '}
                        <strong className={followUpDateClass}>{followUpDateLabel}</strong>
                      </span>
                    </div>
                    <button
                      className="crm-btn-icon"
                      title="Edit follow-up date"
                      aria-label="Edit follow-up date"
                    >
                      <Edit2 size={13} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* ── Actions Card (View-Only) ── */}
            <div className="crm-card crm-form-stack">
              <h3 className="crm-section-label">Actions</h3>
              <p className="crm-text-sm" style={{ color: 'var(--text-secondary)' }}>Action operations are disabled for Admin role.</p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
