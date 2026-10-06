'use client';

import { useState } from 'react';

type GapRow = {
  seatNo: string;
  shift: string;
  floor: string;
  lastOccupied: string;
  gapDays: number;
  revenueLoss: number;
  status: 'vacant' | 'maintenance';
};

const MOCK: GapRow[] = [
  { seatNo: 'A-04', shift: 'Morning',   floor: 'Ground', lastOccupied: '2026-03-28', gapDays: 14, revenueLoss: 700,  status: 'vacant'      },
  { seatNo: 'B-11', shift: 'Afternoon', floor: 'First',  lastOccupied: '2026-03-20', gapDays: 22, revenueLoss: 1100, status: 'vacant'      },
  { seatNo: 'C-07', shift: 'Night',     floor: 'Ground', lastOccupied: '2026-04-01', gapDays: 10, revenueLoss: 500,  status: 'maintenance' },
  { seatNo: 'A-09', shift: 'Morning',   floor: 'First',  lastOccupied: '2026-03-15', gapDays: 27, revenueLoss: 1350, status: 'vacant'      },
  { seatNo: 'D-02', shift: 'Afternoon', floor: 'Second', lastOccupied: '2026-04-05', gapDays: 6,  revenueLoss: 300,  status: 'vacant'      },
  { seatNo: 'B-15', shift: 'Morning',   floor: 'Ground', lastOccupied: '2026-03-10', gapDays: 32, revenueLoss: 1600, status: 'vacant'      },
];

export default function SeatGapReportPage() {
  const [shiftFilter, setShiftFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const visible = MOCK.filter(r =>
    (shiftFilter === 'all' || r.shift === shiftFilter) &&
    (statusFilter === 'all' || r.status === statusFilter)
  );

  const totalLoss = visible.reduce((s, r) => s + r.revenueLoss, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fin-page-title">Seat Gap Report</h1>
        <p className="fin-page-subtitle">Identify vacant seats and estimated revenue loss.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fin-kpi-card fin-kpi-card--danger"><p className="fin-kpi-label fin-kpi-label--danger">Total Gap Seats</p><p className="fin-kpi-value fin-kpi-value--danger">{MOCK.length}</p></div>
        <div className="fin-kpi-card fin-kpi-card--warning"><p className="fin-kpi-label fin-kpi-label--warning">Revenue Loss</p><p className="fin-kpi-value fin-kpi-value--warning">₹{totalLoss.toLocaleString()}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label">Avg Gap Days</p><p className="fin-kpi-value">{Math.round(MOCK.reduce((s,r)=>s+r.gapDays,0)/MOCK.length)}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label">Under Maintenance</p><p className="fin-kpi-value">{MOCK.filter(r=>r.status==='maintenance').length}</p></div>
      </div>

      <div className="fin-filter-bar">
        <select className="fin-select w-40" value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}>
          <option value="all">All Shifts</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Night">Night</option>
        </select>
        <select className="fin-select w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="vacant">Vacant</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <button className="fin-badge fin-badge--neutral cursor-pointer ml-auto">📤 Export</button>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">Seat No</th>
              <th className="text-left py-3 px-4">Shift</th>
              <th className="text-left py-3 px-4">Floor</th>
              <th className="text-left py-3 px-4">Last Occupied</th>
              <th className="text-right py-3 px-4">Gap Days</th>
              <th className="text-right py-3 px-4">Revenue Loss ₹</th>
              <th className="text-left py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={7}><div className="fin-empty-state"><div className="fin-empty-state__icon">🪑</div><p className="fin-empty-state__title">No gap seats found.</p></div></td></tr>
            ) : visible.map((r: any) => (
              <tr key={r.seatNo} className="fin-table-hover-row fin-table-row">
                <td className="py-3 px-4 fin-cell-name">{r.seatNo}</td>
                <td className="py-3 px-4 fin-cell-subtext">{r.shift}</td>
                <td className="py-3 px-4 fin-cell-subtext">{r.floor}</td>
                <td className="py-3 px-4 fin-cell-subtext">{r.lastOccupied}</td>
                <td className={`py-3 px-4 text-right font-semibold ${r.gapDays > 20 ? 'fin-text-danger' : 'fin-text-warning'}`}>{r.gapDays}d</td>
                <td className="py-3 px-4 text-right fin-text-danger font-semibold">₹{r.revenueLoss.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`fin-badge ${r.status === 'vacant' ? 'fin-badge--warning' : 'fin-badge--danger'}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
