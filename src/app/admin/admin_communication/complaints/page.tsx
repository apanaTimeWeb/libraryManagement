'use client';
// RESPONSIBILITY: Entry page for the admin_communication module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useMemo, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { ChevronRight, Plus, X, Eye, RefreshCw, CheckCircle } from 'lucide-react';

type CStatus = 'Open' | 'In-Progress' | 'Resolved';

interface Complaint {
  id: string; title: string; student: string; isAnonymous: boolean;
  description: string; status: CStatus; date: string;
  resolvedBy: string; resolvedDate: string; resolvedNote: string;
}

const INIT: Complaint[] = [
  { id: '1', title: 'AC not cooling',     student: 'Rahul Sharma', isAnonymous: false, description: 'The AC in Zone A has not been cooling properly for the past 3 days. Very uncomfortable to study.', status: 'Open',        date: '2026-04-10', resolvedBy: '—', resolvedDate: '—', resolvedNote: '' },
  { id: '2', title: 'WiFi very slow',     student: 'Anonymous',    isAnonymous: true,  description: 'Internet speed is extremely slow during evening hours. Cannot load study materials.',              status: 'In-Progress', date: '2026-04-09', resolvedBy: 'Admin', resolvedDate: '—', resolvedNote: '' },
  { id: '3', title: 'Locker door broken', student: 'Priya Verma',  isAnonymous: false, description: 'Locker door hinge is broken. Cannot lock properly.',                                               status: 'Resolved',    date: '2026-04-07', resolvedBy: 'Staff Ravi', resolvedDate: '2026-04-08', resolvedNote: 'Hinge replaced.' },
  { id: '4', title: 'Noise from outside', student: 'Anonymous',    isAnonymous: true,  description: 'Construction noise from outside is very disturbing during morning hours.',                         status: 'Open',        date: '2026-04-11', resolvedBy: '—', resolvedDate: '—', resolvedNote: '' },
];

const TABS: (CStatus | 'All')[] = ['All', 'Open', 'In-Progress', 'Resolved'];

export default function ComplaintsPage() {
  const [tab, setTab]                   = useState<CStatus | 'All'>('All');
  const [complaints, setComplaints]     = useState<Complaint[]>(INIT);
  const [showAdd, setShowAdd]           = useState(false);
  const [viewItem, setViewItem]         = useState<Complaint | null>(null);
  const [resolveItem, setResolveItem]   = useState<Complaint | null>(null);
  const [resolveNote, setResolveNote]   = useState('');

  useEffect(() => {
    fetchApi('/communication/complaints').then(data => {
      const mapped = data.map((c: any) => ({
        id: c.id,
        title: c.subject,
        desc: c.description,
        date: new Date(c.createdAt).toLocaleDateString(),
        status: c.status === 'open' ? 'Open' : (c.status === 'resolved' ? 'Resolved' : 'In-Progress'),
        student: 'Mock Student (S-001)',
      }));
      setComplaints(mapped);
    }).catch(console.error);
  }, []);
  const [toast, setToast]               = useState('');
  const [addForm, setAddForm]           = useState({ student: '', anonymous: false, title: '', description: '' });
  const [expandedDesc, setExpandedDesc] = useState<string[]>([]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = tab === 'All' ? complaints : complaints.filter(c => c.status === tab);

  const handleAdd = () => {
    if (!addForm.title || !addForm.description) return;
    const c: Complaint = {
      id: Date.now().toString(),
      title: addForm.title,
      student: addForm.anonymous ? 'Anonymous' : (addForm.student || 'Anonymous'),
      isAnonymous: addForm.anonymous,
      description: addForm.description,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      resolvedBy: '—', resolvedDate: '—', resolvedNote: '',
    };
    setComplaints(prev => [c, ...prev]);
    setAddForm({ student: '', anonymous: false, title: '', description: '' });
    setShowAdd(false);
    showToast('✅ Complaint submitted');
  };

  const markInProgress = (id: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'In-Progress' } : c));
    showToast('🔄 Marked In-Progress');
  };

  const handleResolve = () => {
    if (!resolveItem || !resolveNote) return;
    setComplaints(prev => prev.map(c => c.id === resolveItem.id
      ? { ...c, status: 'Resolved', resolvedBy: 'Admin', resolvedDate: new Date().toISOString().split('T')[0], resolvedNote: resolveNote }
      : c));
    setResolveItem(null); setResolveNote('');
    showToast('✅ Complaint resolved');
  };

  const statusBadge = (s: CStatus) => {
    if (s === 'Open')        return <span className="eng-badge eng-badge--danger">🔴 Open</span>;
    if (s === 'In-Progress') return <span className="eng-badge eng-badge--warning">🟡 In-Progress</span>;
    return <span className="eng-badge eng-badge--success">✅ Resolved</span>;
  };

  const toggleDesc = (id: string) =>
    setExpandedDesc(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="eng-page">
      {toast && <div className="eng-toast">{toast}</div>}

      {/* Add Complaint Modal */}
      {showAdd && (
        <div className="eng-overlay">
          <div className="eng-modal eng-modal--md">
            <button onClick={() => setShowAdd(false)} className="eng-modal-close"><X size={16} /></button>
            <p className="eng-modal-title">➕ Add Complaint</p>
            <p className="eng-modal-desc">Staff raises complaint on student&apos;s behalf.</p>
            <div className="eng-form-stack">
              <div>
                <label className="eng-label">Student (optional)</label>
                <input className="eng-input" placeholder="Search student name..."
                  value={addForm.student} onChange={e => setAddForm(f => ({ ...f, student: e.target.value }))} />
              </div>
              <label className="eng-checkbox-row">
                <input type="checkbox" checked={addForm.anonymous}
                  onChange={e => setAddForm(f => ({ ...f, anonymous: e.target.checked }))} />
                Hide student identity from staff view
              </label>
              <div>
                <label className="eng-label">Title <span className="eng-required">*</span></label>
                <input className="eng-input" placeholder="Brief complaint title"
                  value={addForm.title} onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label className="eng-label">Description <span className="eng-required">*</span></label>
                <textarea className="eng-textarea" rows={4} placeholder="Describe the issue in detail..."
                  value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
            <div className="eng-modal-footer">
              <button onClick={() => setShowAdd(false)} className="eng-btn-ghost">Cancel</button>
              <button onClick={handleAdd} className="eng-btn-primary"
                disabled={!addForm.title || !addForm.description}>Submit Complaint</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="eng-overlay">
          <div className="eng-modal eng-modal--md">
            <button onClick={() => setViewItem(null)} className="eng-modal-close"><X size={16} /></button>
            <p className="eng-modal-title">{viewItem.title}</p>
            <div className="eng-modal-badge-row">
              {statusBadge(viewItem.status)}
              <span className="eng-badge eng-badge--outline">{viewItem.date}</span>
            </div>
            <p className="eng-complaint-by">
              By: <span className={viewItem.isAnonymous ? 'eng-complaint-anon' : 'eng-complaint-named'}>
                {viewItem.student}
              </span>
            </p>
            <p className="eng-complaint-desc">{viewItem.description}</p>
            {viewItem.resolvedNote && (
              <div className="eng-info-box mt-4">
                <strong>Resolution:</strong> {viewItem.resolvedNote} — {viewItem.resolvedBy} on {viewItem.resolvedDate}
              </div>
            )}
            <div className="eng-modal-footer">
              <button onClick={() => setViewItem(null)} className="eng-btn-ghost">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {resolveItem && (
        <div className="eng-overlay">
          <div className="eng-modal eng-modal--md">
            <button onClick={() => setResolveItem(null)} className="eng-modal-close"><X size={16} /></button>
            <p className="eng-modal-title">✅ Resolve Complaint</p>
            <p className="eng-modal-desc">&quot;{resolveItem.title}&quot;</p>
            <div>
              <label className="eng-label">Resolution Note <span className="eng-required">*</span></label>
              <textarea className="eng-textarea" rows={3} placeholder="Describe how the issue was resolved..."
                value={resolveNote} onChange={e => setResolveNote(e.target.value)} />
            </div>
            <div className="eng-modal-footer">
              <button onClick={() => setResolveItem(null)} className="eng-btn-ghost">Cancel</button>
              <button onClick={handleResolve} className="eng-btn-success" disabled={!resolveNote}>
                ✅ Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="eng-breadcrumb">
          <span>Communication</span><ChevronRight size={12} /><span>Complaints</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="eng-page-title">💬 Complaints</h1>
            <p className="eng-page-subtitle">Track and resolve student complaints.</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="eng-btn-primary">
            <Plus size={16} /> Add Complaint
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="eng-tabs eng-tabs-inline mb-6">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`eng-tab${tab === t ? ' eng-tab--active' : ''}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="eng-card eng-card--flush">
        {filtered.length === 0 ? (
          <div className="eng-empty">
            <div className="eng-empty__icon">😊</div>
            <p className="eng-empty__title">No open complaints! All issues are resolved.</p>
          </div>
        ) : (
          <div className="eng-scroll-x">
            <table className="eng-table">
              <thead>
                <tr>
                  <th>#</th><th>Title</th><th>Student</th><th>Description</th>
                  <th>Status</th><th>Date</th><th>Resolved By</th><th>Resolved Date</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const isExpanded = expandedDesc.includes(c.id);
                  const isLong = c.description.length > 60;
                  return (
                    <tr key={c.id}>
                      <td className="eng-td-mono">{i + 1}</td>
                      <td className="eng-td-bold">{c.title}</td>
                      <td className={c.isAnonymous ? 'eng-td-italic-muted' : ''}>{c.student}</td>
                      <td>
                        <span>{isLong && !isExpanded ? c.description.slice(0, 60) + '…' : c.description}</span>
                        {isLong && (
                          <button onClick={() => toggleDesc(c.id)} className="eng-link-btn ml-1">
                            {isExpanded ? 'less' : 'more'}
                          </button>
                        )}
                      </td>
                      <td>{statusBadge(c.status)}</td>
                      <td className="eng-td-muted">{c.date}</td>
                      <td className="eng-td-muted">{c.resolvedBy}</td>
                      <td className="eng-td-muted">{c.resolvedDate}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setViewItem(c)} className="eng-btn-icon" title="View">
                            <Eye size={14} />
                          </button>
                          {c.status === 'Open' && (
                            <button onClick={() => markInProgress(c.id)} className="eng-btn-icon" title="Mark In-Progress">
                              <RefreshCw size={14} />
                            </button>
                          )}
                          {c.status !== 'Resolved' && (
                            <button onClick={() => setResolveItem(c)} className="eng-btn-icon" title="Resolve">
                              <CheckCircle size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
