'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, LogOut, AlertTriangle } from 'lucide-react';
import { fetchStudents } from '../manager_students_api/manager_students_api';
import type { Student } from '../manager_students_types';

export function ExitClient() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('');
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetchStudents().then(setStudents).catch(console.error);
  }, []);

  const filtered = students.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.smartId.toLowerCase().includes(search.toLowerCase())
  );

  const student = students.find(s => s.smartId === selected);

  function handleExit() {
    if (!selected || !reason) return;
    setConfirmed(true);
  }

  if (confirmed && student) {
    return (
      <div className="mgr-page">
        <div className="mgr-card" style={{ maxWidth: 480, margin: '60px auto' }}>
          <div className="mgr-empty-state">
            <div className="mgr-empty-icon">✅</div>
            <p className="mgr-empty-title">Exit Processed</p>
            <p className="mgr-empty-sub">{student.name} ({student.smartId}) has been marked as exited.</p>
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <Link href="/manager/manager_students" className="mgr-btn-primary mgr-btn-sm">Back to Students</Link>
              <button className="mgr-btn-ghost mgr-btn-sm" onClick={() => { setConfirmed(false); setSelected(''); setReason(''); }}>
                Process Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mgr-page">
      <div className="mgr-page-header">
        <div>
          <Link href="/manager/manager_students" className="mgr-back-link">
            <ArrowLeft size={14} /> Back to Students
          </Link>
          <h1 className="mgr-page-title">Student Exit</h1>
          <p className="mgr-page-subtitle">Process a student exit / de-registration from the library.</p>
        </div>
      </div>

      <div className="mgr-dashboard-row2">
        <div className="mgr-card">
          <div className="mgr-card-header">
            <h2 className="mgr-section-title">Select Student</h2>
          </div>
          <div className="mgr-card-body">
            <div className="mgr-input-icon-wrap" style={{ marginBottom: 16 }}>
              <Search size={14} className="mgr-input-icon" />
              <input
                className="mgr-input mgr-input-with-icon"
                placeholder="Search name or Smart ID…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map(s => (
                <button
                  key={s.smartId}
                  onClick={() => setSelected(s.smartId)}
                  className={`mgr-idcard-student-row${selected === s.smartId ? ' mgr-idcard-student-row--active' : ''}`}
                >
                  <div className="mgr-avatar-sm">{s.name.split(' ').map((n: string) => n[0]).join('').slice(0,2)}</div>
                  <div className="mgr-idcard-student-info">
                    <p className="mgr-cell-name">{s.name}</p>
                    <p className="mgr-cell-sub">{s.smartId} · {s.shift} · {s.seat}</p>
                  </div>
                  <span className={s.status === 'Active' ? 'mgr-badge mgr-badge--success' : 'mgr-badge mgr-badge--danger'}>
                    {s.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {student && (
            <div className="mgr-card">
              <div className="mgr-card-header">
                <h2 className="mgr-section-title">Exit Details</h2>
              </div>
              <div className="mgr-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="mgr-action-item">
                  <span className="mgr-action-label">Student</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{student.name}</span>
                </div>
                <div className="mgr-action-item">
                  <span className="mgr-action-label">Smart ID</span>
                  <span className="mgr-smartid-chip">{student.smartId}</span>
                </div>
                <div className="mgr-action-item">
                  <span className="mgr-action-label">Dues</span>
                  <span className={student.due > 0 ? 'mgr-text-danger' : 'mgr-text-success'} style={{ fontWeight: 700 }}>
                    {student.due > 0 ? `⚠️ ₹${student.due} pending` : '✅ Clear'}
                  </span>
                </div>

                <div className="mgr-form-field" style={{ marginTop: 8 }}>
                  <label className="mgr-label mgr-label-required">Reason for Exit</label>
                  <select className="mgr-select" value={reason} onChange={e => setReason(e.target.value)}>
                    <option value="">Select reason…</option>
                    <option>Exam completed</option>
                    <option>Moved to another city</option>
                    <option>Fee non-payment</option>
                    <option>Personal reasons</option>
                    <option>Other</option>
                  </select>
                </div>

                {student.due > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--danger-bg)', borderRadius: 8, border: '1px solid color-mix(in srgb, var(--danger) 30%, transparent)' }}>
                    <AlertTriangle size={14} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'var(--danger)' }}>Student has pending dues of ₹{student.due}. Please collect before exit.</span>
                  </div>
                )}

                <button
                  className="mgr-btn-danger mgr-btn-full"
                  onClick={handleExit}
                  disabled={!reason}
                >
                  <LogOut size={14} />
                  Confirm Exit
                </button>
              </div>
            </div>
          )}

          {!student && (
            <div className="mgr-card">
              <div className="mgr-empty-state">
                <div className="mgr-empty-icon">👈</div>
                <p className="mgr-empty-title">Select a student</p>
                <p className="mgr-empty-sub">Choose a student from the left panel to process their exit.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
