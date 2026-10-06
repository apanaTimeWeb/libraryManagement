'use client';
// RESPONSIBILITY: Entry page for the admin_engagement module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Plus, X, Trash2, CalendarDays } from 'lucide-react';

interface Holiday { id: string; date: string; name: string; type: string; }

const INIT_HOLIDAYS: Holiday[] = [
  { id:'1', date:'2026-04-14', name:'Dr. Ambedkar Jayanti',      type:'National'  },
  { id:'2', date:'2026-04-21', name:'Ram Navami',                type:'Religious' },
  { id:'3', date:'2026-05-01', name:'International Labour Day',  type:'National'  },
  { id:'4', date:'2026-08-15', name:'Independence Day',          type:'National'  },
  { id:'5', date:'2026-10-02', name:'Gandhi Jayanti',            type:'National'  },
];

const WEEK_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function getDays(y:number, m:number) { return new Date(y, m+1, 0).getDate(); }
function getFirstDayIdx(y:number, m:number) { const d=new Date(y,m,1).getDay(); return d===0?6:d-1; }

const TYPE_BADGE: Record<string, string> = {
  National:  'eng-badge--primary',
  Religious: 'eng-badge--warning',
  Library:   'eng-badge--info',
};

export default function HolidayCalendarPage() {
  const now = new Date();
  const [year, setYear]         = useState(now.getFullYear());
  const [month, setMonth]       = useState(now.getMonth());
  const [holidays, setHolidays] = useState<Holiday[]>(INIT_HOLIDAYS);
  const [showAdd, setShowAdd]   = useState(false);
  const [form, setForm]         = useState({ date:'', name:'', type:'National' });
  const [toast, setToast]       = useState('');

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const prevMonth = () => month===0 ? (setYear(y=>y-1), setMonth(11)) : setMonth(m=>m-1);
  const nextMonth = () => month===11 ? (setYear(y=>y+1), setMonth(0))  : setMonth(m=>m+1);

  const daysInMonth = getDays(year, month);
  const firstDayIdx = getFirstDayIdx(year, month);
  const todayStr = now.toISOString().split('T')[0];

  const holidayMap = new Map<number, Holiday>();
  holidays.forEach(h => {
    const d = new Date(h.date);
    if (d.getFullYear()===year && d.getMonth()===month) holidayMap.set(d.getDate(), h);
  });

  const cells: (number|null)[] = [
    ...Array(firstDayIdx).fill(null),
    ...Array.from({length:daysInMonth}, (_,i)=>i+1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const addHoliday = () => {
    if (!form.date || !form.name) return;
    setHolidays(p => [...p, { id: Date.now().toString(), ...form }]);
    setForm({ date:'', name:'', type:'National' });
    setShowAdd(false);
    showToast('📅 Holiday added successfully');
  };

  const removeHoliday = (id: string) => {
    setHolidays(p => p.filter(h => h.id !== id));
    showToast('🗑️ Holiday removed');
  };

  const monthLabel = new Date(year, month).toLocaleDateString('en-IN', { month:'long', year:'numeric' });

  const thisMonthHolidays = holidays
    .filter(h => { const d=new Date(h.date); return d.getFullYear()===year && d.getMonth()===month; })
    .sort((a,b) => a.date.localeCompare(b.date));

  return (
    <div className="eng-page">
      {/* ── Toast ── */}
      {toast && (
        <div className="eng-toast-wrap">
          <div className="eng-toast">{toast}</div>
        </div>
      )}

      {/* ── Add Holiday Modal ── */}
      {showAdd && (
        <div className="eng-overlay">
          <div className="eng-modal eng-modal--sm">
            <button onClick={()=>setShowAdd(false)} className="eng-modal-close"><X size={16}/></button>
            <p className="eng-modal-title">📅 Add Holiday</p>
            <p className="eng-modal-sub">Mark a library closure or holiday in the calendar.</p>

            <div className="eng-field">
              <label className="eng-label">Date <span className="eng-required">*</span></label>
              <input type="date" className="eng-input" value={form.date}
                onChange={e => setForm(f=>({...f, date:e.target.value}))} />
            </div>
            <div className="eng-field">
              <label className="eng-label">Event Name <span className="eng-required">*</span></label>
              <input className="eng-input" placeholder="e.g. Diwali" value={form.name}
                onChange={e => setForm(f=>({...f, name:e.target.value}))} />
            </div>
            <div className="eng-field">
              <label className="eng-label">Type</label>
              <select className="eng-select" value={form.type}
                onChange={e => setForm(f=>({...f, type:e.target.value}))}>
                <option>National</option>
                <option>Religious</option>
                <option>Library</option>
              </select>
            </div>

            <div className="eng-modal-footer">
              <button onClick={()=>setShowAdd(false)} className="eng-btn eng-btn--ghost">Cancel</button>
              <button onClick={addHoliday} disabled={!form.date||!form.name}
                className="eng-btn eng-btn--primary">
                <CalendarDays size={14}/> Add Holiday
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Breadcrumb ── */}
      <div className="eng-breadcrumb">
        <Link href="/admin/admin_engagement/attendance">Engagement</Link>
        <ChevronRight size={12} className="eng-breadcrumb-sep"/>
        <span>Holiday Calendar</span>
      </div>

      {/* ── Page Header ── */}
      <div className="eng-page-header">
        <div className="eng-page-title-row">
          <div>
            <h1 className="eng-page-title">📅 Holiday Calendar</h1>
            <p className="eng-page-subtitle">Manage library holidays, closures, and special events.</p>
          </div>
          <div className="eng-page-actions">
            <button onClick={()=>setShowAdd(true)} className="eng-btn eng-btn--primary">
              <Plus size={14}/> Add Holiday
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="eng-stats-row">
        <div className="eng-stat-card">
          <div className="eng-stat-label">Total Holidays</div>
          <div className="eng-stat-value">{holidays.length}</div>
          <div className="eng-stat-sub">This year</div>
        </div>
        <div className="eng-stat-card">
          <div className="eng-stat-label">This Month</div>
          <div className="eng-stat-value">{thisMonthHolidays.length}</div>
          <div className="eng-stat-sub">{monthLabel}</div>
        </div>
        <div className="eng-stat-card">
          <div className="eng-stat-label">National</div>
          <div className="eng-stat-value">{holidays.filter(h=>h.type==='National').length}</div>
          <div className="eng-stat-sub">National holidays</div>
        </div>
        <div className="eng-stat-card">
          <div className="eng-stat-label">Religious</div>
          <div className="eng-stat-value">{holidays.filter(h=>h.type==='Religious').length}</div>
          <div className="eng-stat-sub">Religious observances</div>
        </div>
      </div>

      {/* ── Two-column Layout ── */}
      <div className="eng-cal-layout">

        {/* Left: Calendar Grid */}
        <div className="eng-cal-main">
          <div className="eng-card">
            {/* Month navigation */}
            <div className="eng-cal-nav">
              <button onClick={prevMonth} className="eng-btn eng-btn--icon">
                <ChevronLeft size={18}/>
              </button>
              <span className="eng-cal-month">{monthLabel}</span>
              <button onClick={nextMonth} className="eng-btn eng-btn--icon">
                <ChevronRight size={18}/>
              </button>
            </div>

            {/* Day headers */}
            <div className="eng-cal-grid eng-cal-mb-2">
              {WEEK_DAYS.map(d => (
                <div key={d} className="eng-cal-day-hdr">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="eng-cal-grid">
              {cells.map((day, i) => {
                if (!day) return <div key={i} className="eng-cal-cell eng-cal-cell--empty"/>;
                const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const isToday   = ds === todayStr;
                const hol       = holidayMap.get(day);
                return (
                  <div key={i}
                    className={[
                      'eng-cal-cell',
                      isToday  ? 'eng-cal-cell--today'   : '',
                      hol      ? 'eng-cal-cell--holiday' : '',
                    ].filter(Boolean).join(' ')}
                    title={hol?.name}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="eng-cal-legend">
              <div className="eng-cal-legend-item">
                <div className="eng-cal-dot eng-cal-dot--holiday"/>
                <span>Holiday</span>
              </div>
              <div className="eng-cal-legend-item">
                <div className="eng-cal-dot eng-cal-dot--today"/>
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Holiday List */}
        <div className="eng-cal-panel">
          <div className="eng-card">
            <div className="eng-holiday-header">
              <div>
                <div className="eng-card-title">
                  {monthLabel} Holidays
                </div>
                <div className="eng-card-desc">{thisMonthHolidays.length} this month</div>
              </div>
              <button onClick={()=>setShowAdd(true)} className="eng-btn eng-btn--primary eng-btn--sm">
                <Plus size={13}/> Add
              </button>
            </div>

            {thisMonthHolidays.length === 0 ? (
              <div className="eng-holiday-empty">
                No holidays in {monthLabel} 🎉
              </div>
            ) : (
              <div className="eng-holiday-list">
                {thisMonthHolidays.map(h => (
                  <div key={h.id} className="eng-holiday-item">
                    <div>
                      <div className="eng-holiday-name">{h.name}</div>
                      <div className="eng-holiday-date-row">
                        <div className="eng-holiday-date">{h.date}</div>
                        <span className={`eng-badge ${TYPE_BADGE[h.type]||'eng-badge--ghost'} eng-badge--micro`}>
                          {h.type}
                        </span>
                      </div>
                    </div>
                    <button onClick={()=>removeHoliday(h.id)}
                      className="eng-btn eng-btn--icon eng-btn--icon-danger">
                      <Trash2 size={13}/>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* All holidays summary */}
            {holidays.length > 0 && (
              <>
                <div className="eng-divider" />
                <div className="eng-card-title--sm">
                  All Holidays ({holidays.length})
                </div>
                <div className="eng-holiday-list">
                  {holidays
                    .sort((a,b)=>a.date.localeCompare(b.date))
                    .map(h => (
                    <div key={h.id} className="eng-holiday-item">
                      <div>
                        <div className="eng-holiday-name--sm">{h.name}</div>
                        <div className="eng-holiday-date">{h.date}</div>
                      </div>
                      <button onClick={()=>removeHoliday(h.id)}
                        className="eng-btn eng-btn--icon eng-btn--icon-danger">
                        <Trash2 size={11}/>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
