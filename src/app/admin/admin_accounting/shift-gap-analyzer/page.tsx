'use client';

// RESPONSIBILITY: Entry page for the admin_accounting module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';

type ShiftGap = {
  shift: string;
  totalSeats: number;
  occupied: number;
  vacant: number;
  occupancyPct: number;
  avgGapDays: number;
  revenueLoss: number;
};

const MOCK: ShiftGap[] = [
  { shift: 'Morning (6AM–2PM)',   totalSeats: 40, occupied: 34, vacant: 6,  occupancyPct: 85, avgGapDays: 12, revenueLoss: 3600  },
  { shift: 'Afternoon (2PM–9PM)', totalSeats: 40, occupied: 28, vacant: 12, occupancyPct: 70, avgGapDays: 18, revenueLoss: 7200  },
  { shift: 'Night (9PM–6AM)',     totalSeats: 30, occupied: 18, vacant: 12, occupancyPct: 60, avgGapDays: 24, revenueLoss: 8640  },
  { shift: '24-Hour',             totalSeats: 20, occupied: 19, vacant: 1,  occupancyPct: 95, avgGapDays: 5,  revenueLoss: 600   },
];

type DayGap = { date: string; shift: string; seatNo: string; gapDays: number; loss: number };

const DAY_GAPS: DayGap[] = [
  { date: '2026-04-10', shift: 'Afternoon', seatNo: 'B-11', gapDays: 22, loss: 1100 },
  { date: '2026-04-09', shift: 'Night',     seatNo: 'C-07', gapDays: 18, loss: 900  },
  { date: '2026-04-08', shift: 'Morning',   seatNo: 'A-04', gapDays: 14, loss: 700  },
  { date: '2026-04-07', shift: 'Night',     seatNo: 'C-12', gapDays: 30, loss: 1500 },
  { date: '2026-04-06', shift: 'Afternoon', seatNo: 'B-03', gapDays: 9,  loss: 450  },
];

export default function ShiftGapAnalyzerPage() {
  const [shiftFilter, setShiftFilter] = useState('all');

  const visibleDays = shiftFilter === 'all' ? DAY_GAPS : DAY_GAPS.filter(d => d.shift === shiftFilter);
  const totalLoss = MOCK.reduce((s, m) => s + m.revenueLoss, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fin-page-title">Shift Gap Analyzer</h1>
        <p className="fin-page-subtitle">Analyze occupancy gaps and revenue loss per shift.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fin-kpi-card fin-kpi-card--danger"><p className="fin-kpi-label fin-kpi-label--danger">Total Revenue Loss</p><p className="fin-kpi-value fin-kpi-value--danger">₹{totalLoss.toLocaleString()}</p></div>
        <div className="fin-kpi-card fin-kpi-card--warning"><p className="fin-kpi-label fin-kpi-label--warning">Total Vacant Seats</p><p className="fin-kpi-value fin-kpi-value--warning">{MOCK.reduce((s,m)=>s+m.vacant,0)}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label">Avg Occupancy</p><p className="fin-kpi-value">{Math.round(MOCK.reduce((s,m)=>s+m.occupancyPct,0)/MOCK.length)}%</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label">Shifts Analyzed</p><p className="fin-kpi-value">{MOCK.length}</p></div>
      </div>

      {/* Shift Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK.map(m => (
          <div key={m.shift} className="fin-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="fin-cell-name">{m.shift}</p>
              <span className={`fin-badge ${m.occupancyPct >= 90 ? 'fin-badge--success' : m.occupancyPct >= 70 ? 'fin-badge--warning' : 'fin-badge--danger'}`}>{m.occupancyPct}% full</span>
            </div>
            <div className="fin-progress-track">
              <div className="h-full rounded-full" style={{ width: `${m.occupancyPct}%`, backgroundColor: m.occupancyPct >= 90 ? 'var(--success)' : m.occupancyPct >= 70 ? 'var(--warning)' : 'var(--danger)' }} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><p className="fin-cell-subtext">Occupied</p><p className="fin-text-success font-semibold">{m.occupied}</p></div>
              <div><p className="fin-cell-subtext">Vacant</p><p className="fin-text-danger font-semibold">{m.vacant}</p></div>
              <div><p className="fin-cell-subtext">Loss</p><p className="fin-text-warning font-semibold">₹{m.revenueLoss.toLocaleString()}</p></div>
            </div>
          </div>
        ))}
      </div>

      {/* Day-wise Gap Table */}
      <div className="fin-filter-bar">
        <p className="fin-section-label">Day-wise Gap Log</p>
        <select className="fin-select w-40 ml-auto" value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}>
          <option value="all">All Shifts</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Night">Night</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-left py-3 px-4">Shift</th>
              <th className="text-left py-3 px-4">Seat No</th>
              <th className="text-right py-3 px-4">Gap Days</th>
              <th className="text-right py-3 px-4">Revenue Loss ₹</th>
            </tr>
          </thead>
          <tbody>
            {visibleDays.map((d, i) => (
              <tr key={i} className="fin-table-hover-row fin-table-row">
                <td className="py-3 px-4 fin-cell-subtext">{d.date}</td>
                <td className="py-3 px-4"><span className="fin-badge fin-badge--neutral">{d.shift}</span></td>
                <td className="py-3 px-4 fin-cell-name">{d.seatNo}</td>
                <td className={`py-3 px-4 text-right font-semibold ${d.gapDays > 20 ? 'fin-text-danger' : 'fin-text-warning'}`}>{d.gapDays}d</td>
                <td className="py-3 px-4 text-right fin-text-danger font-semibold">₹{d.loss.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
