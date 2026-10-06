'use client';
// RESPONSIBILITY: Entry page for the admin_seats_shifts_lockers module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { CalendarDays, UserPlus, User, Printer, Download, MessageSquare } from 'lucide-react';

interface SeatData {
  uuid?: string;
  id: string;
  status: 'free' | 'occupied' | 'expiring' | 'maintenance';
  student?: string;
  smartId?: string;
  phone?: string;
  shift?: string;
  plan?: string;
  locker?: string;
  validFrom?: string;
  expiry?: string;
}


const SHIFT_TABS = ['All', 'Morning', 'Evening', 'Full Day'];

const LEGEND_ITEMS = [
  { cls: 'ss-legend-dot--success',     label: 'Free' },
  { cls: 'ss-legend-dot--danger',      label: 'Occupied' },
  { cls: 'ss-legend-dot--warning',     label: 'Expiring ≤7 days' },
  { cls: 'ss-legend-dot--maintenance', label: 'Maintenance' },
];

const SHIFT_BADGE: Record<string, string> = {
  Morning:  'ss-badge ss-badge--primary',
  Evening:  'ss-badge ss-badge--success',
  'Full Day':'ss-badge ss-badge--info',
};

export default function SeatMatrixPage() {
  const [activeTab, setActiveTab]       = useState('All');
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [date, setDate]                 = useState(() => new Date().toISOString().slice(0, 10));
  const [seatsData, setSeatsData]       = useState<SeatData[]>([]);

  useEffect(() => {
    // Generate 60 seats (A-01 to A-60) for a realistic layout mock
    const mockSeats: SeatData[] = Array.from({ length: 60 }, (_, i) => {
      const num = String(i + 1).padStart(2, '0');
      const rand = Math.random();
      let status: 'free' | 'occupied' | 'expiring' | 'maintenance' = 'free';
      let shift = 'Morning';
      if (rand > 0.85) status = 'maintenance';
      else if (rand > 0.7) status = 'expiring';
      else if (rand > 0.4) {
        status = 'occupied';
        shift = Math.random() > 0.5 ? 'Evening' : 'Full Day';
      }

      return {
        id: num,
        status,
        shift: status !== 'maintenance' ? shift : undefined,
        student: status === 'occupied' || status === 'expiring' ? `Student ${num}` : undefined,
        smartId: status === 'occupied' || status === 'expiring' ? `LIB-00${i + 1}` : undefined,
        phone: status === 'occupied' || status === 'expiring' ? `+91 98765${String(Math.floor(10000 + Math.random() * 90000))}` : undefined,
        plan: status === 'occupied' || status === 'expiring' ? (Math.random() > 0.5 ? 'Premium Plan' : 'Standard Plan') : undefined,
        locker: status === 'occupied' || status === 'expiring' ? (Math.random() > 0.5 ? `L-${num}` : 'Not Assigned') : undefined,
        validFrom: status === 'occupied' || status === 'expiring' ? '01 Sep 2024' : undefined,
        expiry: status === 'occupied' || status === 'expiring' ? '30 Sep 2024' : undefined,
      };
    });

    fetchApi('/seats_shifts_lockers/seat-matrix')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: SeatData[] = data.map((s: any) => ({
            uuid: s.id,
            id: s.seatNumber.replace('S-', ''),
            status: s.isActive ? 'free' : 'maintenance',
          }));
          setSeatsData(mapped);
        } else {
          setSeatsData(mockSeats);
        }
      })
      .catch(() => setSeatsData(mockSeats));
  }, []);

  const visible = activeTab === 'All'
    ? seatsData
    : seatsData.filter(s => s.shift === activeTab || s.status === 'free' || s.status === 'maintenance');

  return (
    <div className="ss-page">
      {/* Action Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '16px' }}>
        <button className="ss-tab-btn ss-tab-btn--inactive" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={14} /> Export Matrix
        </button>
        <button className="ss-tab-btn ss-tab-btn--inactive" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Printer size={14} /> Print Floor Plan
        </button>
        <button className="ss-tab-btn ss-tab-btn--inactive" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981' }}>
          <MessageSquare size={14} /> Notify Students
        </button>
      </div>

      {/* Filter bar */}
      <div className="ss-matrix-filter-bar">
        <div className="ss-tab-group">
          {SHIFT_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`ss-tab-btn ${activeTab === tab ? 'ss-tab-btn--active' : 'ss-tab-btn--inactive'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <label className="ss-date-btn">
          <CalendarDays size={15} className="ss-date-btn__icon" />
          <input
            type="date"
            className="ss-date-input"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </label>
      </div>

      {/* Legend */}
      <div className="ss-legend-card">
        {LEGEND_ITEMS.map(({ cls, label }) => (
          <div key={label} className="ss-legend-item">
            <span className={`ss-legend-dot ${cls}`} />
            <span className="ss-legend-label">{label}</span>
          </div>
        ))}
      </div>

      {/* Full-width Grid Card */}
      <div className="ss-card ss-card--p-lg ss-locker-grid-card">
        <div className="ss-matrix-grid-header">
          <h2 className="ss-section-heading">A-Wing Floor Plan</h2>
          <span className="ss-text-caption">{visible.filter(s => s.status === 'free').length} seats free</span>
        </div>
        <div className="ss-seat-grid">
          {visible.map((seat, index) => (
            <button
              key={seat.uuid || seat.id + '-' + index}
              className={`ss-seat-cell ss-seat-cell--${seat.status}`}
              onClick={() => setSelectedSeat(seat)}
              title={
                seat.student
                  ? `${seat.student} · ${seat.shift} · Expires ${seat.expiry}`
                  : seat.status === 'maintenance' ? 'Under Maintenance' : 'Available'
              }
            >
              {seat.id}
            </button>
          ))}
        </div>
      </div>

      {/* Modal replacing the Sidebar */}
      {selectedSeat && (
        <div className="ss-modal-overlay" onClick={() => setSelectedSeat(null)}>
          <div className="ss-modal" onClick={e => e.stopPropagation()}>
            {selectedSeat.status === 'free' ? (
              /* Free seat panel */
              <>
                <div className="ss-occupied-header__row" style={{marginBottom: '1rem'}}>
                  <span className="ss-badge ss-badge--success">Free</span>
                  <span className="ss-occupied-header__seat">Seat {selectedSeat.id}</span>
                </div>
                <p className="ss-text-secondary ss-text-caption" style={{marginBottom: '1.5rem'}}>This seat is available for assignment.</p>
                <div className="ss-modal-footer">
                  <button className="ss-btn-ghost" onClick={() => setSelectedSeat(null)}>Close</button>
                  {/* Admin is View-Only: Assign Student button removed */}
                </div>
              </>
            ) : selectedSeat.status === 'maintenance' ? (
              /* Maintenance panel */
              <>
                <div className="ss-occupied-header__row" style={{marginBottom: '1rem'}}>
                  <span className="ss-badge ss-badge--inactive">Maintenance</span>
                  <span className="ss-occupied-header__seat">Seat {selectedSeat.id}</span>
                </div>
                <p className="ss-text-secondary ss-text-caption" style={{marginBottom: '1.5rem'}}>This seat is under maintenance and unavailable.</p>
                <div className="ss-modal-footer">
                  <button className="ss-btn-ghost" onClick={() => setSelectedSeat(null)}>Close</button>
                </div>
              </>
            ) : (
              /* Occupied / expiring panel */
              <>
                <div className="ss-occupied-header" style={{margin: '-1.5rem -1.5rem 1.5rem -1.5rem'}}>
                  <div className="ss-occupied-header__row">
                    <span className={`ss-badge ${selectedSeat.status === 'expiring' ? 'ss-badge--warning' : 'ss-badge--danger'}`}>
                      {selectedSeat.status === 'expiring' ? 'Expiring Soon' : 'Occupied'}
                    </span>
                    <span className="ss-occupied-header__seat">Seat {selectedSeat.id}</span>
                  </div>
                  <div className="ss-occupied-avatar-wrap">
                    <div className="ss-occupied-avatar">
                      <User size={40} className="ss-text-secondary" />
                    </div>
                    <h3 className="ss-occupied-name">{selectedSeat.student}</h3>
                    <p className="ss-occupied-id">{selectedSeat.smartId}</p>
                  </div>
                </div>
                <div className="ss-detail-grid">
                  <div className="ss-detail-cell">
                    <p className="ss-kpi-card__label">Shift</p>
                    <span className={SHIFT_BADGE[selectedSeat.shift ?? ''] ?? 'ss-badge ss-badge--inactive'}>
                      {selectedSeat.shift}
                    </span>
                  </div>
                  <div className="ss-detail-cell">
                    <p className="ss-kpi-card__label">Phone</p>
                    <p className="ss-detail-cell__value" style={{ fontSize: '13px' }}>
                      {selectedSeat.phone || 'N/A'}
                    </p>
                  </div>
                  <div className="ss-detail-cell">
                    <p className="ss-kpi-card__label">Plan</p>
                    <p className="ss-detail-cell__value" style={{ fontSize: '13px' }}>
                      {selectedSeat.plan || 'N/A'}
                    </p>
                  </div>
                  <div className="ss-detail-cell">
                    <p className="ss-kpi-card__label">Locker</p>
                    <p className="ss-detail-cell__value" style={{ fontSize: '13px' }}>
                      {selectedSeat.locker || 'N/A'}
                    </p>
                  </div>
                  <div className="ss-detail-cell">
                    <p className="ss-kpi-card__label">Valid From</p>
                    <p className="ss-detail-cell__value" style={{ fontSize: '13px' }}>
                      {selectedSeat.validFrom || 'N/A'}
                    </p>
                  </div>
                  <div className="ss-detail-cell">
                    <p className="ss-kpi-card__label">Expires</p>
                    <p className={`ss-detail-cell__value ${selectedSeat.status === 'expiring' ? 'ss-detail-cell__value--danger' : ''}`} style={{ fontSize: '13px' }}>
                      {selectedSeat.expiry || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="ss-modal-footer" style={{marginTop: '1.5rem'}}>
                  <button className="ss-btn-ghost" onClick={() => setSelectedSeat(null)}>Close</button>
                  <button className="ss-btn-primary">View Full Profile</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
