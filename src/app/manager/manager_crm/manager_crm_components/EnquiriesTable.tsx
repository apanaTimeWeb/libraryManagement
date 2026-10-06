import { useRouter } from 'next/navigation';
import { Eye, CheckCircle, XCircle, PhoneCall, Plus } from 'lucide-react';
import { maskPhone } from '../reusable/types';
import { STATUS_BADGE } from '../manager_crm_constants';
import type { Enquiry, EnquiryStatus } from '../manager_crm_types';

// RESPONSIBILITY: Renders the Table view for CRM Enquiries.

interface EnquiriesTableProps {
  filtered: Enquiry[];
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => void;
}

export function EnquiriesTable({ filtered, updateEnquiryStatus }: EnquiriesTableProps) {
  const router = useRouter();

  if (filtered.length === 0) {
    return (
      <div className="crm-card crm-card--flush">
        <div className="crm-empty-state bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-12 text-center">
          <PhoneCall size={40} className="text-[var(--text-secondary)] mx-auto mb-4" />
          <p className="text-[var(--text-primary)] font-semibold text-lg mb-2">No enquiries found</p>
          <p className="text-[var(--text-secondary)] text-sm mb-6">Try a different search or status filter</p>
          <button className="mgr-btn-primary" onClick={() => router.push('/manager/manager_crm/enquiries/add')}>
            <Plus size={15} /> Add Enquiry
          </button>
        </div>
      </div>
    );
  }

  const handleQuickConvert = (e: React.MouseEvent, id: string, name: string, phone: string) => {
    e.stopPropagation();
    router.push(`/manager/manager_students/new?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`);
  };

  const handleQuickLost = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    updateEnquiryStatus(id, 'Lost');
  };

  return (
    <div className="crm-card crm-card--flush">
      <div className="crm-table-wrap">
        <table className="crm-table w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--text-secondary)] text-sm">
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Shift</th>
              <th className="p-3">Status</th>
              <th className="p-3">Handled By</th>
              <th className="p-3">Date Added</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((enq, idx) => (
              <tr
                key={enq.id}
                onClick={() => router.push(`/manager/manager_crm/enquiries/${enq.id}`)}
                className="border-b border-[var(--border)] hover:bg-[var(--bg-hover)] cursor-pointer transition-colors"
              >
                <td className="p-3 text-[var(--text-secondary)]">{idx + 1}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)]">
                      {enq.avatar}
                    </div>
                    <span className="font-medium text-[var(--text-primary)]">{enq.name}</span>
                  </div>
                </td>
                <td className="p-3 font-mono text-sm text-[var(--text-secondary)]">{maskPhone(enq.phone)}</td>
                <td className="p-3"><span className="mgr-badge mgr-badge--info">{enq.shift}</span></td>
                <td className="p-3"><span className={`mgr-badge ${STATUS_BADGE[enq.status]}`}>{enq.status}</span></td>
                <td className="p-3 text-[var(--text-secondary)]">{enq.handledBy}</td>
                <td className="p-3 text-[var(--text-secondary)]">{enq.addedDate}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button className="mgr-btn-icon" title="View details" onClick={(e) => { e.stopPropagation(); router.push(`/manager/manager_crm/enquiries/${enq.id}`); }}>
                      <Eye size={14} />
                    </button>
                    <button className="mgr-btn-icon text-[var(--success)]" title="Convert to Admission" onClick={(e) => handleQuickConvert(e, enq.id, enq.name, enq.phone)}>
                      <CheckCircle size={14} />
                    </button>
                    <button className="mgr-btn-icon text-[var(--danger)]" title="Mark as Lost" onClick={(e) => handleQuickLost(e, enq.id)}>
                      <XCircle size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
