'use client';

import { useRouter } from 'next/navigation';
import { LayoutGrid, List, Plus, Search } from 'lucide-react';
import { useEnquiries } from '../manager_crm_hooks/useEnquiries';
import { EnquiriesKanban } from './EnquiriesKanban';
import { EnquiriesTable } from './EnquiriesTable';

// RESPONSIBILITY: Main Client view for CRM Enquiries.

export function EnquiriesClient() {
  const router = useRouter();
  const {
    status, error, filtered,
    view, setView,
    search, setSearch,
    statusFilter, setStatusFilter,
    getCardsByStatus, updateEnquiryStatus
  } = useEnquiries();

  if (status === 'error') return <div className="p-8 text-[var(--danger)]">Failed to load: {error}</div>;

  return (
    <div className="crm-page">
      {/* ── Page Header ── */}
      <div className="crm-page-header">
        <nav className="crm-breadcrumb">CRM &rsaquo; Enquiries</nav>
        <div className="crm-page-header-row">
          <div>
            <h1 className="crm-page-title">Enquiry Pipeline</h1>
            <p className="crm-page-subtitle">
              {status === 'loading' ? 'Loading...' : `${filtered.length} leads`} {'•'} Track every prospect from enquiry to admission
            </p>
          </div>
          <div className="crm-page-header-actions">
            {/* View toggle */}
            <div className="flex bg-[var(--bg-elevated)] p-1 rounded-md border border-[var(--border)]">
              <button
                className={`p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors ${view === 'kanban' ? 'bg-[var(--bg-card)] shadow-sm text-[var(--text-primary)]' : ''}`}
                onClick={() => setView('kanban')} title="Kanban view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className={`p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors ${view === 'table' ? 'bg-[var(--bg-card)] shadow-sm text-[var(--text-primary)]' : ''}`}
                onClick={() => setView('table')} title="Table view"
              >
                <List size={16} />
              </button>
            </div>
            <button className="mgr-btn-primary" onClick={() => router.push('/manager/manager_crm/enquiries/add')}>
              <Plus size={16} /> Add Enquiry
            </button>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative flex-grow max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            className="w-full pl-9 pr-3 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-md text-sm text-[var(--text-primary)] outline-none focus:border-[var(--mgr-primary)] transition-colors"
            placeholder="Search by name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="py-2 px-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-md text-sm text-[var(--text-primary)] outline-none focus:border-[var(--mgr-primary)] transition-colors"
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

      {/* ── Views ── */}
      {status === 'loading' ? (
        <div className="flex items-center justify-center p-24 text-[var(--text-secondary)]">Loading pipeline...</div>
      ) : view === 'kanban' ? (
        <EnquiriesKanban isEmpty={filtered.length === 0} getCardsByStatus={getCardsByStatus} />
      ) : (
        <EnquiriesTable filtered={filtered} updateEnquiryStatus={updateEnquiryStatus} />
      )}
    </div>
  );
}
