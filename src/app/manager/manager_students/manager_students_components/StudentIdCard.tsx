'use client';

import React from 'react';
import { Phone, Shield, Wifi } from 'lucide-react';

/* ── Barcode SVG stripes — deterministic from ID ── */
function BarcodeStripes({ id }: { id: string }) {
  const bars: { width: number; gap: number }[] = [];
  for (let i = 0; i < 28; i++) {
    const code = id.charCodeAt(i % id.length) + i * 3;
    bars.push({ width: (code % 3) + 1, gap: (code % 2) + 1 });
  }
  return (
    <svg width="110" height="36" viewBox="0 0 110 36" xmlns="http://www.w3.org/2000/svg">
      {bars.reduce<{ x: number; els: React.ReactElement[] }>(
        (acc, bar, i) => {
          const el = (
            <rect key={i} x={acc.x} y="0" width={bar.width} height="36"
              fill={i % 5 === 0 ? '#6366F1' : i % 3 === 0 ? '#8B5CF6' : '#C0C1FF'} rx="0.5" />
          );
          return { x: acc.x + bar.width + bar.gap, els: [...acc.els, el] };
        },
        { x: 0, els: [] }
      ).els}
    </svg>
  );
}

/* ── QR-pattern visual — deterministic ── */
function QrPattern({ id }: { id: string }) {
  const pattern: boolean[] = [];
  for (let i = 0; i < 25; i++) {
    const c = id.charCodeAt(i % id.length) + i;
    pattern.push(c % 3 !== 0);
  }
  [0, 1, 5, 6, 4, 9, 20, 21, 24, 19, 15].forEach(idx => { pattern[idx] = true; });
  return (
    <div className="mgr-idcard-qr" aria-label={`QR code for ${id}`}>
      {pattern.map((on, i) => (
        <div key={i} className={`mgr-idcard-qr-cell ${on ? 'on' : 'off'}`} />
      ))}
    </div>
  );
}

export interface IdCardData {
  name: string;
  smartId: string;
  phone: string;
  shift: string;
  seat: string;
  locker: string;
  plan: string;
  joinDate: string;
  expiryDate: string;
  branch?: string;
  college?: string;
}

interface Props { data: IdCardData; }

export default function StudentIdCard({ data }: Props) {
  const initials = data.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const shiftLabel = data.shift.split(' ')[0];
  const avatarColors = ['#6366F1', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  const colorIdx = data.smartId.charCodeAt(data.smartId.length - 1) % avatarColors.length;
  const avatarColor = avatarColors[colorIdx];

  return (
    <div className="mgr-idcard-wrap">
      {/* ── FRONT of ID card ── */}
      <div className="mgr-idcard" id="student-id-card-print">

        {/* Holographic diagonal lines overlay */}
        <div className="mgr-idcard-holo-lines" aria-hidden="true" />

        {/* ── Header band ── */}
        <div className="mgr-idcard-header">
          <div className="mgr-idcard-header-left">
            <div className="mgr-idcard-logo-icon">📚</div>
            <div>
              <div className="mgr-idcard-logo-text">Library OS</div>
              <div className="mgr-idcard-branch-text">{data.branch ?? 'MAIN BRANCH'}</div>
            </div>
          </div>
          <div className="mgr-idcard-header-right">
            <Wifi size={14} color="rgba(255,255,255,0.7)" />
            <div className="mgr-idcard-header-chip">STUDENT ID</div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="mgr-idcard-body">

          {/* Profile row */}
          <div className="mgr-idcard-profile-row">
            {/* Photo avatar with color */}
            <div className="mgr-idcard-photo" style={{ background: `linear-gradient(135deg, ${avatarColor}55, ${avatarColor}22)`, borderColor: `${avatarColor}88` }}>
              <span className="mgr-idcard-photo-initials" style={{ color: avatarColor }}>{initials}</span>
              {/* Chip icon on avatar */}
              <div className="mgr-idcard-chip">
                <div className="mgr-idcard-chip-line" />
                <div className="mgr-idcard-chip-line" />
                <div className="mgr-idcard-chip-line" />
              </div>
            </div>

            <div className="mgr-idcard-identity">
              <p className="mgr-idcard-name">{data.name}</p>
              <span className="mgr-idcard-smartid">#{data.smartId}</span>
              {data.college && <p className="mgr-idcard-college-name">🎓 {data.college}</p>}
              <p className="mgr-idcard-phone-row">
                <Phone size={10} /> {data.phone}
              </p>
            </div>
          </div>

          {/* Colored divider */}
          <div className="mgr-idcard-color-bar">
            <div className="mgr-idcard-color-seg" style={{ background: '#6366F1' }} />
            <div className="mgr-idcard-color-seg" style={{ background: '#8B5CF6' }} />
            <div className="mgr-idcard-color-seg" style={{ background: '#3B82F6' }} />
            <div className="mgr-idcard-color-seg" style={{ background: '#10B981' }} />
          </div>

          {/* Details grid — 4 boxes */}
          <div className="mgr-idcard-details-grid">
            <div className="mgr-idcard-detail-item" style={{ borderTopColor: '#6366F1' }}>
              <div className="mgr-idcard-detail-label">⏰ SHIFT</div>
              <div className="mgr-idcard-detail-value">{shiftLabel}</div>
            </div>
            <div className="mgr-idcard-detail-item" style={{ borderTopColor: '#8B5CF6' }}>
              <div className="mgr-idcard-detail-label">💺 SEAT</div>
              <div className="mgr-idcard-detail-value">{data.seat}</div>
            </div>
            <div className="mgr-idcard-detail-item" style={{ borderTopColor: '#3B82F6' }}>
              <div className="mgr-idcard-detail-label">📋 PLAN</div>
              <div className="mgr-idcard-detail-value">{data.plan.split(' ')[0]}</div>
            </div>
            <div className="mgr-idcard-detail-item" style={{ borderTopColor: '#10B981' }}>
              <div className="mgr-idcard-detail-label">🔐 LOCKER</div>
              <div className="mgr-idcard-detail-value">{data.locker === 'None' ? 'N/A' : data.locker.split(' ')[0]}</div>
            </div>
          </div>

          {/* Validity row */}
          <div className="mgr-idcard-validity-row">
            <div>
              <div className="mgr-idcard-validity-label">VALID FROM</div>
              <div className="mgr-idcard-validity-value">{data.joinDate}</div>
            </div>
            <div className="mgr-idcard-validity-sep">▶</div>
            <div className="mgr-idcard-validity-right">
              <div className="mgr-idcard-validity-label">EXPIRES</div>
              <div className="mgr-idcard-validity-value mgr-idcard-validity-value--expiry">{data.expiryDate}</div>
            </div>
          </div>

          {/* QR + Barcode row */}
          <div className="mgr-idcard-bottom-row">
            <div className="mgr-idcard-qr-wrap">
              <QrPattern id={data.smartId} />
              <span className="mgr-idcard-qr-label">Scan to Verify</span>
            </div>

            <div className="mgr-idcard-barcode-wrap">
              <BarcodeStripes id={data.smartId} />
              <span className="mgr-idcard-barcode-id">{data.smartId}</span>
              <span className="mgr-idcard-barcode-sub">Member ID</span>
            </div>

            <div className="mgr-idcard-tamper-seal">
              <Shield size={14} color="#10B981" />
              <span className="mgr-idcard-tamper-text">VERIFIED</span>
              <span className="mgr-idcard-tamper-sub">Tamper Evident</span>
            </div>
          </div>
        </div>

        {/* Rainbow holographic stripe at bottom */}
        <div className="mgr-idcard-stripe" aria-hidden="true" />
      </div>
    </div>
  );
}
