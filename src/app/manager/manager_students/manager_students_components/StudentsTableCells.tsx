import Link from 'next/link';
import { Eye, Pencil, MessageSquare } from 'lucide-react';
import { openWhatsApp } from '@/lib/whatsappUtils';
import { MANAGER_ROUTES } from '../../manager_url_config';
import type { Student } from '../manager_students_types';
import { MANAGER_BRANCH } from '../manager_students_constants';

// RESPONSIBILITY: Micro-components for AG Grid cells

export function NameCell({ data }: { data: Student }) {
  const initials = data.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: '100%' }}>
      <div className="mgr-avatar-sm">{initials}</div>
      <div>
        <p className="mgr-cell-name">{data.name}</p>
        <p className="mgr-cell-sub">{data.phone}</p>
      </div>
    </div>
  );
}

export function ShiftCell({ data }: { data: Student }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
      <span className="mgr-cell-name">{data.shift}</span>
      <span className="mgr-cell-sub">{data.seat}</span>
    </div>
  );
}

export function StatusCell({ value }: { value: string }) {
  const cls = value === 'Active' ? 'mgr-badge mgr-badge--success'
    : value === 'Suspended' ? 'mgr-badge mgr-badge--warning'
    : 'mgr-badge mgr-badge--danger';
  return <span className={cls}>{value}</span>;
}

export function DueCell({ value }: { value: number }) {
  return (
    <span style={{ fontWeight: 600, color: value > 0 ? 'var(--danger)' : 'var(--success)' }}>
      {value > 0 ? `₹${value.toLocaleString('en-IN')}` : '✅ Clear'}
    </span>
  );
}

export function ActionsCell({ data }: { data: Student }) {
  function sendDuesReminder() {
    if (data.due <= 0) return;
    const W = 42;
    const line = '─'.repeat(W);
    const c = (t: string) => ' '.repeat(Math.max(0, Math.floor((W - t.length) / 2))) + t;
    const row = (l: string, v: string) => l + ' '.repeat(Math.max(1, W - l.length - v.length)) + v;
    const msg = [
      c('★ Library OS ★'),
      c(MANAGER_BRANCH),
      line,
      c('[ FEE REMINDER ]'),
      line,
      row('Name    :', data.name),
      row('Smart ID:', data.smartId),
      '',
      line,
      row('DUE AMT :', `Rs.${data.due.toLocaleString('en-IN')}`),
      line,
      '',
      c('⚠️ Please clear dues to avoid'),
      c('seat suspension.'),
      '',
      c('Library OS | Main Branch'),
    ].join('\n');
    openWhatsApp(data.phone, msg);
  }

  const profileUrl = `${MANAGER_ROUTES.STUDENTS}/${data.id || data.smartId}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: '100%' }}>
      <Link href={profileUrl} className="mgr-btn-icon" title="View Profile">
        <Eye size={13} />
      </Link>
      <Link href={`${profileUrl}/edit`} className="mgr-btn-icon" title="Edit">
        <Pencil size={13} />
      </Link>
      {data.due > 0 && (
        <button
          className="mgr-btn-icon mgr-btn-icon--wa"
          title={`Send dues reminder — ₹${data.due}`}
          onClick={sendDuesReminder}
        >
          <MessageSquare size={13} />
        </button>
      )}
    </div>
  );
}
