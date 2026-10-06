'use client';

import { CalendarDays } from 'lucide-react';
import { useSeatMatrix } from '../manager_seats_shifts_lockers_hooks/useSeatMatrix';
import { SHIFT_TABS, LEGEND_ITEMS } from '../manager_seats_shifts_lockers_constants';
import { SeatMatrixModal } from './SeatMatrixModal';

// RESPONSIBILITY: Main Client view for Seat Matrix. Glues data hook to UI.

export function SeatMatrixClient() {
  const {
    status, error, visible, freeCount,
    activeTab, setActiveTab,
    selectedSeat, setSelectedSeat,
    date, setDate
  } = useSeatMatrix();

  if (status === 'error') return <div className="p-8 text-[var(--danger)]">Failed to load: {error}</div>;

  return (
    <div className="ss-page">
      {/* ── Filter bar ── */}
      <div className="ss-matrix-filter-bar flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="ss-tab-group flex bg-[var(--bg-elevated)] p-1 rounded-lg border border-[var(--border)]">
          {SHIFT_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <label className="ss-date-btn flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] px-3 py-2 rounded-lg cursor-pointer hover:border-[var(--mgr-primary)] transition-colors">
          <CalendarDays size={15} className="text-[var(--text-secondary)]" />
          <input
            type="date"
            className="bg-transparent border-none outline-none text-sm text-[var(--text-primary)] cursor-pointer"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </label>
      </div>

      {/* ── Legend ── */}
      <div className="ss-legend-card flex flex-wrap gap-6 mb-6 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
        {LEGEND_ITEMS.map(({ cls, label }) => (
          <div key={label} className="ss-legend-item flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${cls === 'ss-legend-dot--success' ? 'bg-[var(--success)]' : cls === 'ss-legend-dot--danger' ? 'bg-[var(--danger)]' : cls === 'ss-legend-dot--warning' ? 'bg-[var(--warning)]' : 'bg-[var(--text-secondary)]'}`} />
            <span className="text-sm text-[var(--text-secondary)]">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Grid ── */}
      <div className="ss-card ss-card--p-lg ss-locker-grid-card bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <div className="ss-matrix-grid-header flex justify-between items-end mb-6 border-b border-[var(--border)] pb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">A-Wing Floor Plan</h2>
          <span className="text-sm text-[var(--success)] font-medium">{status === 'loading' ? '...' : freeCount} seats free</span>
        </div>
        
        {status === 'loading' ? (
          <div className="flex items-center justify-center py-24 text-[var(--text-secondary)]">Loading seat matrix...</div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(48px,1fr))] gap-3">
            {visible.map((seat, index) => (
              <button
                key={seat.uuid || seat.id + '-' + index}
                className={`h-12 rounded-lg text-sm font-semibold flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${
                  seat.status === 'free' ? 'bg-[var(--bg-elevated)] border border-[var(--success)] text-[var(--success)] hover:bg-[var(--success)] hover:text-white' :
                  seat.status === 'occupied' ? 'bg-[var(--danger)] text-white border-transparent opacity-90' :
                  seat.status === 'expiring' ? 'bg-[var(--warning)] text-white border-transparent' :
                  'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-transparent opacity-50 cursor-not-allowed'
                }`}
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
        )}
      </div>

      <SeatMatrixModal selectedSeat={selectedSeat} onClose={() => setSelectedSeat(null)} />
    </div>
  );
}
