'use client';

// RESPONSIBILITY: Entry page for the admin_crm module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  Phone,
  Eye,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  PhoneCall,
  Clock,
  CalendarDays,
  User,
  Upload, Download, Printer, MessageSquare, Send, Mail
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { getEnquiries, updateEnquiry } from '@/app/admin/admin_crm/admin_crm_components/EnquiryStorage';
import {
  type Enquiry,
  type EnquiryStatus,
  KANBAN_COLUMNS,
  STATUS_BADGE,
  maskPhone,
} from '@/app/admin/admin_crm/admin_crm_components/AdminCrmtypes/AdminCrmtypes';

/* ── Helpers ─────────────────────────────────────────────── */
function StatusBadge({ status }: { status: EnquiryStatus }) {
  const cls = STATUS_BADGE[status];
  return <span className={`crm-badge ${cls}`}>{status}</span>;
}

function FollowUpBadge({
  isOverdue,
  isToday,
  isUpcoming,
}: {
  isOverdue?: boolean;
  isToday?: boolean;
  isUpcoming?: boolean;
}) {
  if (isOverdue)
    return (
      <span className="crm-badge crm-badge--danger">
        <Clock size={10} /> Overdue
      </span>
    );
  if (isToday)
    return (
      <span className="crm-badge crm-badge--warning">
        <Clock size={10} /> Today
      </span>
    );
  if (isUpcoming)
    return (
      <span className="crm-badge crm-badge--success">
        <Clock size={10} /> Upcoming
      </span>
    );
  return null;
}

/* ── Kanban status dot class lookup ─────────────────────── */
const DOT_CLASS: Record<EnquiryStatus, string> = {
  New:        'crm-col-dot--new',
  Visited:    'crm-col-dot--visited',
  Interested: 'crm-col-dot--interested',
  Converted:  'crm-col-dot--converted',
  Lost:       'crm-col-dot--lost',
};

/* ── Kanban Card ─────────────────────────────────────────── */
function KanbanCard({
  enq,
  colClass,
  onClick,
}: {
  enq: Enquiry;
  colClass: string;
  onClick: () => void;
}) {
  return (
    <div
      className={`crm-kanban-card ${colClass}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Name + phone */}
      <div className="crm-card-name-block">
        <p className="crm-card-name">{enq.name}</p>
        <p className="crm-card-phone">
          <Phone size={11} />
          {maskPhone(enq.phone)}
        </p>
      </div>

      {/* Badges row */}
      <div className="crm-card-badges">
        <span className="crm-badge crm-badge--info">{enq.shift}</span>
        <FollowUpBadge
          isOverdue={enq.isOverdue}
          isToday={enq.isToday}
          isUpcoming={enq.isUpcoming}
        />
      </div>

      {/* Footer */}
      <div className="crm-card-footer">
        <span className="crm-card-footer-item">
          <CalendarDays size={11} />
          {enq.addedDate}
        </span>
        {enq.convertedDate && (
          <span className="crm-card-footer-converted">
            <CheckCircle size={11} />
            {enq.convertedDate}
          </span>
        )}
        <span className="crm-card-footer-item">
          <User size={11} />
          {typeof enq.handledBy === 'string' 
            ? (enq.handledBy.split(' ')[0] || 'Unassigned') 
            : ((enq.handledBy as any)?.name?.split(' ')[0] || 'Unassigned')}
        </span>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
export default function EnquiriesPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    setEnquiries(getEnquiries());
  }, []);

  /* ── Filter logic ── */
  const filtered = enquiries.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search.replace(/\D/g, ''));
    const matchStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const colEnquiries = (status: EnquiryStatus) =>
    filtered.filter((e) => e.status === status);

  /* ── Quick actions are removed for Admin (View-Only) ── */

  return (
    <div className="crm-page">

      {/* ── Page Header ── */}
      <div className="crm-page-header">
        <nav className="crm-breadcrumb">CRM &rsaquo; Enquiries</nav>
        <div className="crm-page-header-row">
          <div>
            <h1 className="crm-page-title">Enquiry Pipeline</h1>
            <p className="crm-page-subtitle">
              {filtered.length} lead{filtered.length !== 1 ? 's' : ''} {'•'} Track every prospect from enquiry to admission
            </p>
          </div>
          <div className="crm-page-header-actions">
            {/* View toggle */}
            <div className="crm-view-toggle">
              <button
                className={`crm-view-btn ${view === 'kanban' ? 'crm-view-btn--active' : ''}`}
                onClick={() => setView('kanban')}
                title="Kanban view"
                aria-label="Switch to kanban view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className={`crm-view-btn ${view === 'table' ? 'crm-view-btn--active' : ''}`}
                onClick={() => setView('table')}
                title="Table view"
                aria-label="Switch to table view"
              >
                <List size={16} />
              </button>
            </div>

            <button className="crm-btn-ghost" onClick={() => toast.success('Importing...')}>
              <Upload size={14} /> Import
            </button>
            <button className="crm-btn-ghost" onClick={() => toast.success('Exporting CSV...')}>
              <Download size={14} /> CSV
            </button>
            <button className="crm-btn-ghost" onClick={() => toast.success('Printing...')}>
              <Printer size={14} /> Print
            </button>
            <button className="crm-btn-ghost" style={{ color: '#10B981' }} onClick={() => toast.success('WhatsApp All...')}>
              <MessageSquare size={14} /> WA
            </button>
            <button className="crm-btn-ghost" style={{ color: '#3B82F6' }} onClick={() => toast.success('Telegram All...')}>
              <Send size={14} /> TG
            </button>
            <button className="crm-btn-ghost" style={{ color: '#6366F1' }} onClick={() => toast.success('Email All...')}>
              <Mail size={14} /> Email
            </button>

            {/* Admin is View-Only: No Add Enquiry Button */}
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="crm-toolbar">
        {/* Search */}
        <div className="crm-search-wrap">
          <Search size={15} />
          <input
            type="text"
            className="crm-search-input"
            placeholder="Search by name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status filter */}
        <select
          className="crm-select crm-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Visited">Visited</option>
          <option value="Interested">Interested</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      {/* ════════════════════════════════════════
          KANBAN VIEW
      ════════════════════════════════════════ */}
      {view === 'kanban' && (
        <>
          {filtered.length === 0 ? (
            <div className="crm-empty-state crm-mt-48">
              <PhoneCall size={48} className="crm-empty-icon" />
              <p className="crm-empty-title">No enquiries yet</p>
              <p className="crm-empty-sub">No leads match your criteria</p>
            </div>
          ) : (
            <div className="crm-kanban-board">
              {KANBAN_COLUMNS.map((col) => {
                const cards = colEnquiries(col.id);
                return (
                  <div key={col.id} className="crm-kanban-col">
                    {/* Column header */}
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

                    {/* Column body */}
                    <div className="crm-kanban-col-body">
                      {cards.length === 0 ? (
                        <div className="crm-kanban-empty">
                          <PhoneCall size={28} />
                          <p className="crm-kanban-empty-title">No {col.label} leads</p>
                          <p className="crm-kanban-empty-sub">
                            Leads will appear here when moved to {col.label}
                          </p>
                        </div>
                      ) : (
                        cards.map((enq) => (
                          <KanbanCard
                            key={enq.id}
                            enq={enq}
                            colClass={col.cardClass}
                            onClick={() => router.push(`/admin/admin_crm/enquiries/${enq.id}`)}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════════════
          TABLE VIEW
      ════════════════════════════════════════ */}
      {view === 'table' && (
        <div className="crm-card crm-card--flush">
          {filtered.length === 0 ? (
            <div className="crm-empty-state">
              <PhoneCall size={40} className="crm-empty-icon" />
              <p className="crm-empty-title">No enquiries found</p>
              <p className="crm-empty-sub">Try a different search or status filter</p>
            </div>
          ) : (
            <div className="crm-table-wrap">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Preferred Shift</th>
                    <th>Status</th>
                    <th>Handled By</th>
                    <th>Date Added</th>
                    <th>Follow-up</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((enq, idx) => (
                    <tr
                      key={enq.id}
                      onClick={() => router.push(`/admin/admin_crm/enquiries/${enq.id}`)}
                    >
                      <td className="crm-td-index">{idx + 1}</td>
                      <td>
                        <div className="crm-table-name-cell">
                          <div className="crm-avatar crm-avatar--sm">{enq.avatar}</div>
                          <span className="crm-table-name-text">{enq.name}</span>
                        </div>
                      </td>
                      <td className="crm-masked">{maskPhone(enq.phone)}</td>
                      <td>
                        <span className="crm-badge crm-badge--info">{enq.shift}</span>
                      </td>
                      <td>
                        <StatusBadge status={enq.status} />
                      </td>
                      <td className="crm-td-secondary">
                        {typeof enq.handledBy === 'string' ? enq.handledBy : (enq.handledBy as any)?.name || 'Unassigned'}
                      </td>
                      <td className="crm-td-secondary">{enq.addedDate}</td>
                      <td>
                        <FollowUpBadge
                          isOverdue={enq.isOverdue}
                          isToday={enq.isToday}
                          isUpcoming={enq.isUpcoming}
                        />
                      </td>
                      <td>
                        <div className="crm-row-actions">
                          <button
                            className="crm-btn-icon"
                            title="View details"
                            aria-label="View details"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/admin_crm/enquiries/${enq.id}`);
                            }}
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
