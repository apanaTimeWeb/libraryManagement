import { useRouter } from 'next/navigation';
import { PhoneCall, MoreHorizontal, Plus } from 'lucide-react';
import { KANBAN_COLUMNS, DOT_CLASS } from '../manager_crm_constants';
import type { EnquiryStatus, Enquiry } from '../manager_crm_types';
import { KanbanCard } from './KanbanCard';

// RESPONSIBILITY: Renders the entire Kanban board for CRM Enquiries.

interface EnquiriesKanbanProps {
  isEmpty: boolean;
  getCardsByStatus: (status: EnquiryStatus) => Enquiry[];
}

export function EnquiriesKanban({ isEmpty, getCardsByStatus }: EnquiriesKanbanProps) {
  const router = useRouter();

  if (isEmpty) {
    return (
      <div className="crm-empty-state crm-mt-48 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-12 text-center">
        <PhoneCall size={48} className="text-[var(--text-secondary)] mx-auto mb-4" />
        <p className="text-[var(--text-primary)] font-semibold text-lg mb-2">No enquiries yet</p>
        <p className="text-[var(--text-secondary)] text-sm mb-6">Add your first lead to start the pipeline</p>
        <button
          className="mgr-btn-primary"
          onClick={() => router.push('/manager/manager_crm/enquiries/add')}
        >
          <Plus size={15} /> Add Enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="crm-kanban-board">
      {KANBAN_COLUMNS.map((col) => {
        const cards = getCardsByStatus(col.id);
        return (
          <div key={col.id} className="crm-kanban-col">
            <div className="crm-kanban-col-header">
              <div className="crm-kanban-col-header-left">
                <span className={`crm-col-dot ${DOT_CLASS[col.id]}`} />
                <span className="crm-kanban-col-label">{col.label}</span>
                <span className="crm-col-count">{cards.length}</span>
              </div>
              <button className="crm-btn-icon" title="More options" aria-label="Column options">
                <MoreHorizontal size={15} />
              </button>
            </div>
            <div className="crm-kanban-col-body">
              {cards.length === 0 ? (
                <div className="crm-kanban-empty">
                  <PhoneCall size={28} />
                  <p className="crm-kanban-empty-title">No {col.label} leads</p>
                  <p className="crm-kanban-empty-sub">Leads will appear here when moved to {col.label}</p>
                </div>
              ) : (
                cards.map((enq) => (
                  <KanbanCard
                    key={enq.id}
                    enq={enq}
                    colClass={col.cardClass}
                    onClick={() => router.push(`/manager/manager_crm/enquiries/${enq.id}`)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
