'use client';
import { useState } from 'react';
import { ChevronDown, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const DAY_START_H = 6;
const DAY_END_H   = 23;
const TOTAL_HOURS = DAY_END_H - DAY_START_H;

interface BookedBlock { startH: number; endH: number; label: string; }
interface GapBlock    { startH: number; endH: number; seats: number; revLoss: number; }
interface ShiftData   { id: string; name: string; occupied: number; capacity: number; booked: BookedBlock[]; gaps: GapBlock[]; }

const SHIFTS: ShiftData[] = [
  {
    id: '1', name: 'Morning', occupied: 38, capacity: 60,
    booked: [
      { startH: 6,  endH: 10, label: 'Batch A (22 students)' },
      { startH: 10, endH: 12, label: 'Batch B (16 students)' },
    ],
    gaps: [{ startH: 8, endH: 10, seats: 6, revLoss: 600 }],
  },
  {
    id: '2', name: 'Afternoon', occupied: 18, capacity: 60,
    booked: [
      { startH: 12, endH: 14, label: 'Batch C (10 students)' },
      { startH: 16, endH: 18, label: 'Batch D (8 students)'  },
    ],
    gaps: [{ startH: 14, endH: 16, seats: 12, revLoss: 960 }],
  },
  {
    id: '3', name: 'Evening', occupied: 24, capacity: 40,
    booked: [
      { startH: 18, endH: 20, label: 'Batch E (14 students)' },
      { startH: 20, endH: 22, label: 'Batch F (10 students)' },
    ],
    gaps: [{ startH: 19, endH: 21, seats: 8, revLoss: 800 }],
  },
];

const VIEW_PERIODS = ['Today', 'This Week', 'This Month'];

function pct(h: number) { return ((h - DAY_START_H) / TOTAL_HOURS) * 100; }

function fmtH(h: number) {
  const suffix  = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:00 ${suffix}`;
}

export default function ShiftGapAnalyzerPage() {
  const [shiftFilter, setShiftFilter] = useState('All');
  const [period, setPeriod]           = useState('Today');

  const visible = shiftFilter === 'All' ? SHIFTS : SHIFTS.filter(s => s.name === shiftFilter);

  return (
    <>

      <div className="ss-page">
        <div className="ss-page-header">
          <div>
            <h1 className="ss-page-title">Shift Gap Analyzer</h1>
            <p className="ss-page-subtitle">Identify revenue-loss gaps and fill empty time slots</p>
          </div>
        </div>

        <div className="ss-filter-bar">
          <div className="ss-filter-bar__select-wrap">
            <select className="ss-select" value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}>
              <option value="All">All Shifts</option>
              {SHIFTS.map((s: any) => <option key={s.id}>{s.name}</option>)}
            </select>
            <ChevronDown size={14} className="ss-select-icon" />
          </div>
          <div className="ss-filter-bar__select-wrap">
            <select className="ss-select" value={period} onChange={e => setPeriod(e.target.value)}>
              {VIEW_PERIODS.map((p: any) => <option key={p}>{p}</option>)}
            </select>
            <ChevronDown size={14} className="ss-select-icon" />
          </div>
        </div>

        {visible.map((shift: any) => {
          const utilPct = Math.round((shift.occupied / shift.capacity) * 100);
          return (
            <div key={shift.id} className="ss-gap-card">

              <div className="ss-gap-card__header">
                <div>
                  <h2 className="ss-gap-card__title">{shift.name} Shift</h2>
                  <p className="ss-gap-card__meta">{shift.occupied} / {shift.capacity} seats occupied</p>
                </div>
                <div className="ss-kpi-card ss-gap-kpi-mini">
                  <span className="ss-kpi-card__label">Utilization</span>
                  <span className="ss-gap-card__util">{utilPct}%</span>
                  <div className="ss-progress-track">
                    {/* dynamic computed width — only allowed inline style */}
                    <div className="ss-progress-fill" style={{ width: `${utilPct}%` }} />
                  </div>
                </div>
              </div>

              <div className="ss-gap-card__body">

                {/* Time-slot bar — left/width are runtime-computed positions */}
                <div className="ss-timebar">
                  {shift.booked.map((b: any, i: number) => (
                    <div
                      key={i}
                      className="ss-timebar__block ss-timebar__block--booked"
                      style={{ left: `${pct(b.startH)}%`, width: `${pct(b.endH) - pct(b.startH)}%` }}
                      title={b.label}
                    >
                      {b.label}
                    </div>
                  ))}
                  {shift.gaps.map((g: any, i: number) => (
                    <div
                      key={i}
                      className="ss-timebar__block ss-timebar__block--gap"
                      style={{ left: `${pct(g.startH)}%`, width: `${pct(g.endH) - pct(g.startH)}%` }}
                      title={`Gap: ${fmtH(g.startH)} – ${fmtH(g.endH)}`}
                    >
                      GAP
                    </div>
                  ))}
                </div>

                {/* Time axis labels */}
                <div className="ss-timebar-axis">
                  <span className="ss-text-caption">{fmtH(DAY_START_H)}</span>
                  <span className="ss-text-caption">{fmtH(Math.round((DAY_START_H + DAY_END_H) / 2))}</span>
                  <span className="ss-text-caption">{fmtH(DAY_END_H)}</span>
                </div>

                {shift.gaps.length === 0 ? (
                  <p className="ss-text-secondary ss-text-caption">No gaps detected — fully utilized.</p>
                ) : (
                  <div className="ss-gap-list">
                    {shift.gaps.map((g: any, i: number) => (
                      <div key={i} className="ss-gap-row">
                        <div className="ss-gap-row__left">
                          <span className="ss-badge ss-badge--warning">🕳️ Gap</span>
                          <div>
                            <p className="ss-gap-row__time">{fmtH(g.startH)} – {fmtH(g.endH)} · {g.seats} seats free</p>
                            <p className="ss-gap-row__loss">Est. revenue loss: ₹{g.revLoss}/day</p>
                          </div>
                        </div>
                        <button
                          className="ss-btn-primary ss-btn--sm"
                          onClick={() => toast.success(`Opening new admission pre-filled with ${shift.name} ${fmtH(g.startH)}–${fmtH(g.endH)} slot`)}
                        >
                          <Zap size={13} />Quick Fill
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
