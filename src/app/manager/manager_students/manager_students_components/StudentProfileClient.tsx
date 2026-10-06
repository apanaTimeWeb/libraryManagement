'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, Armchair, Calendar, CreditCard, Shield } from 'lucide-react';
import { calcExpiryDate, formatDateIN } from '@/lib/whatsappUtils';
import { fetchStudentById } from '../manager_students_api/manager_students_api';

export function StudentProfileClient({ id }: { id: string }) {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentById(id)
      .then(data => {
        setStudent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="mgr-page"><div className="mgr-card" style={{ padding: 20 }}>Loading...</div></div>;
  }

  if (!student) {
    return (
      <div className="mgr-page">
        <div className="mgr-card">
          <div className="mgr-empty-state">
            <div className="mgr-empty-icon">🔍</div>
            <p className="mgr-empty-title">Student not found</p>
            <p className="mgr-empty-sub">ID: {id}</p>
          </div>
        </div>
      </div>
    );
  }

  const [dd, mm, yyyy] = student.joined.split('/');
  const joinDate = new Date(`${yyyy}-${mm}-${dd}`);
  const expiryDate = calcExpiryDate(joinDate, student.plan);

  return (
    <div className="mgr-page">
      <div className="mgr-page-header">
        <div>
          <Link href="/manager/manager_students" className="mgr-back-link">
            <ArrowLeft size={14} /> Back to Students
          </Link>
          <h1 className="mgr-page-title">Student Profile</h1>
          <p className="mgr-breadcrumb">Manager › Students › {student.name}</p>
        </div>
        <div className="mgr-page-actions">
          <Link href={`/manager/manager_students/${id}/edit`} className="mgr-btn-ghost mgr-btn-sm">
            Edit
          </Link>
        </div>
      </div>

      <div className="mgr-dashboard-row2">
        <div className="mgr-card">
          <div className="mgr-card-header">
            <h2 className="mgr-section-title">Personal Details</h2>
            <span className={
              student.status === 'Active'    ? 'mgr-badge mgr-badge--success' :
              student.status === 'Suspended' ? 'mgr-badge mgr-badge--warning' :
                                               'mgr-badge mgr-badge--danger'
            }>{student.status}</span>
          </div>
          <div className="mgr-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div className="mgr-avatar" style={{ width: 56, height: 56, fontSize: 20, borderRadius: 14 }}>
                {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="mgr-page-title" style={{ fontSize: 18 }}>{student.name}</p>
                <span className="mgr-smartid-chip">{student.smartId}</span>
              </div>
            </div>

            <div className="mgr-form-grid">
              <div className="mgr-form-field">
                <label className="mgr-label">Phone</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Phone size={14} style={{ color: 'var(--primary)' }} />
                  <span style={{ color: 'var(--text-primary)' }}>{student.phone}</span>
                </div>
              </div>
              <div className="mgr-form-field">
                <label className="mgr-label">Branch</label>
                <span style={{ color: 'var(--text-primary)' }}>{student.branch}</span>
              </div>
              <div className="mgr-form-field">
                <label className="mgr-label">Shift</label>
                <span className="mgr-badge mgr-badge--info">{student.shift}</span>
              </div>
              <div className="mgr-form-field">
                <label className="mgr-label">Seat</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Armchair size={14} style={{ color: 'var(--primary)' }} />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{student.seat}</span>
                </div>
              </div>
              <div className="mgr-form-field">
                <label className="mgr-label">Plan</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CreditCard size={14} style={{ color: 'var(--primary)' }} />
                  <span style={{ color: 'var(--text-primary)' }}>{student.plan}</span>
                </div>
              </div>
              <div className="mgr-form-field">
                <label className="mgr-label">Dues</label>
                <span className={student.due > 0 ? 'mgr-text-danger' : 'mgr-text-success'} style={{ fontWeight: 700 }}>
                  {student.due > 0 ? `₹${student.due.toLocaleString('en-IN')}` : '✅ Clear'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="mgr-card">
            <div className="mgr-card-header">
              <h2 className="mgr-section-title">Validity</h2>
            </div>
            <div className="mgr-card-body">
              <div className="mgr-action-item">
                <span className="mgr-action-label">
                  <Calendar size={13} style={{ display: 'inline', marginRight: 6 }} />
                  Joined
                </span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{student.joined}</span>
              </div>
              <div className="mgr-action-item">
                <span className="mgr-action-label">
                  <Shield size={13} style={{ display: 'inline', marginRight: 6 }} />
                  Expires
                </span>
                <span style={{ color: 'var(--warning)', fontWeight: 600 }}>{formatDateIN(expiryDate)}</span>
              </div>
            </div>
          </div>

          <div className="mgr-card">
            <div className="mgr-card-header">
              <h2 className="mgr-section-title">Quick Actions</h2>
            </div>
            <div className="mgr-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href={`/manager/manager_finance/collect-fee?id=${student.smartId}`} className="mgr-btn-primary mgr-btn-full">
                Collect Fee
              </Link>
              <Link href={`/manager/manager_students/id-card?id=${student.smartId}`} className="mgr-btn-ghost mgr-btn-full">
                View ID Card
              </Link>
              <Link href={`/manager/manager_finance/renewals?id=${student.smartId}`} className="mgr-btn-ghost mgr-btn-full">
                Renew Subscription
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
