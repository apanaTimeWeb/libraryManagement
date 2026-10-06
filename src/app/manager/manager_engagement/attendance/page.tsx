'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Save, FileBarChart2, Bell, CheckCircle, Clock } from 'lucide-react';

type AttStatus = 'present' | 'absent' | 'late' | null;

interface Student {
  id: string; smartId: string; name: string; initials: string;
  shift: string; consecutiveAbsent: number;
  status: AttStatus; inTime: string; outTime: string;
}

const INIT_STUDENTS: Student[] = [
  { id:'1', smartId:'SL-001', name:'Rahul Sharma',   initials:'RS', shift:'Morning',   consecutiveAbsent:0, status:null, inTime:'09:00', outTime:'13:00' },
  { id:'2', smartId:'SL-002', name:'Priya Verma',    initials:'PV', shift:'Morning',   consecutiveAbsent:4, status:null, inTime:'',      outTime:''      },
  { id:'3', smartId:'SL-003', name:'Amit Kumar',     initials:'AK', shift:'Afternoon', consecutiveAbsent:0, status:null, inTime:'13:00', outTime:'18:00' },
  { id:'4', smartId:'SL-004', name:'Sneha Patel',    initials:'SP', shift:'Morning',   consecutiveAbsent:7, status:null, inTime:'',      outTime:''      },
  { id:'5', smartId:'SL-005', name:'Rohan Das',      initials:'RD', shift:'Evening',   consecutiveAbsent:0, status:null, inTime:'18:00', outTime:'22:00' },
  { id:'6', smartId:'SL-006', name:'Kavita Singh',   initials:'KS', shift:'Afternoon', consecutiveAbsent:0, status:null, inTime:'13:00', outTime:'18:00' },
  { id:'7', smartId:'SL-007', name:'Arjun Mehta',    initials:'AM', shift:'Morning',   consecutiveAbsent:2, status:null, inTime:'',      outTime:''      },
  { id:'8', smartId:'SL-008', name:'Nisha Gupta',    initials:'NG', shift:'Evening',   consecutiveAbsent:0, status:null, inTime:'18:00', outTime:'22:00' },
];

const today = new Date().toISOString().split('T')[0];

export default function AttendancePage() {
  const [date, setDate]         = useState(today);
  const [shift, setShift]       = useState('All');
  const [students, setStudents] = useState<Student[]>(INIT_STUDENTS);
  const [saved, setSaved]       = useState(false);
  const [alerted, setAlerted]   = useState<Set<string>>(new Set());

  const filtered = shift === 'All' ? students : students.filter(s => s.shift === shift);
  const marked   = filtered.filter(s => s.status !== null).length;
  const present  = filtered.filter(s => s.status === 'present').length;
  const absent   = filtered.filter(s => s.status === 'absent').length;
  const late     = filtered.filter(s => s.status === 'late').length;

  const setStatus = (id: string, status: AttStatus) =>
    setStudents(p => p.map(s => s.id === id ? { ...s, status } : s));

  const setField = (id: string, field: 'inTime'|'outTime', val: string) =>
    setStudents(p => p.map(s => s.id === id ? { ...s, [field]: val } : s));

  const handleAlert = (id: string) => setAlerted(p => new Set(p).add(id));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="eng-page">
      {/* ── Breadcrumb ── */}
      <div className="eng-breadcrumb">
        <Link href="/manager/manager_engagement/attendance">Engagement</Link>
        <ChevronRight size={12} className="eng-breadcrumb-sep" />
        <span>Attendance</span>
      </div>

      {/* ── Page Header ── */}
      <div className="eng-page-header">
        <div className="eng-page-title-row">
          <div>
            <h1 className="eng-page-title">📅 Daily Attendance</h1>
            <p className="eng-page-subtitle">Mark attendance for all enrolled students by shift.</p>
          </div>
          <div className="eng-page-actions">
            <Link href="/manager/manager_engagement/absentee-report" className="eng-btn eng-btn--ghost eng-btn--sm">
              <FileBarChart2 size={14} /> Absentee Report
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI Stats ── */}
      <div className="eng-stats-row">
        <div className="eng-stat-card">
          <div className="eng-stat-label">Total Students</div>
          <div className="eng-stat-value">{filtered.length}</div>
          <div className="eng-stat-sub">{shift} shift</div>
        </div>
        <div className="eng-stat-card">
          <div className="eng-stat-label">Present</div>
          <div className="eng-stat-value eng-stat-value--success">{present}</div>
          <div className="eng-stat-sub">{filtered.length ? Math.round(present/filtered.length*100) : 0}% rate</div>
        </div>
        <div className="eng-stat-card">
          <div className="eng-stat-label">Absent</div>
          <div className="eng-stat-value eng-stat-value--danger">{absent}</div>
          <div className="eng-stat-sub">{filtered.filter(s=>s.consecutiveAbsent>=3).length} need alerts</div>
        </div>
        <div className="eng-stat-card">
          <div className="eng-stat-label">Late</div>
          <div className="eng-stat-value eng-stat-value--warning">{late}</div>
          <div className="eng-stat-sub">{marked}/{filtered.length} marked</div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="eng-card eng-card--flush eng-mb-6">
        <div className="eng-filter-row">
          <div className="eng-filter-field">
            <label className="eng-label">Date</label>
            <input type="date" className="eng-input" value={date}
              onChange={e => setDate(e.target.value)} />
          </div>
          <div className="eng-filter-field">
            <label className="eng-label">Shift</label>
            <select className="eng-select eng-filter-select" value={shift}
              onChange={e => setShift(e.target.value)}>
              <option>All</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>
          </div>
          <div className="eng-filter-badges">
            <span className="eng-badge eng-badge--success">{present} Present</span>
            <span className="eng-badge eng-badge--danger">{absent} Absent</span>
            <span className="eng-badge eng-badge--warning">{late} Late</span>
          </div>
        </div>
      </div>

      {/* ── Student List ── */}
      <div className="eng-card eng-card--flush">
        <div className="eng-att-list">
          {filtered.length === 0 ? (
            <div className="eng-empty">
              <div className="eng-empty-icon">📅</div>
              <p className="eng-empty-title">No students in this shift</p>
              <p className="eng-empty-sub">Try selecting a different shift or date.</p>
            </div>
          ) : filtered.map(s => {
            const isAlert = s.consecutiveAbsent >= 3;
            const hasAlerted = alerted.has(s.id);
            return (
              <div key={s.id} className={`eng-att-row${isAlert ? ' eng-att-row--alert' : ''}`}>

                {/* Avatar */}
                <div className="eng-att-avatar">{s.initials}</div>

                {/* Info */}
                <div className="eng-att-info">
                  <div className="eng-att-name">{s.name}</div>
                  <div className="eng-att-meta">{s.smartId} · {s.shift} shift</div>
                </div>

                {/* Status buttons */}
                <div className="eng-seg-group">
                  {(['present', 'absent', 'late'] as AttStatus[]).map(st => (
                    <button key={st} onClick={() => setStatus(s.id, st)}
                      className={`eng-seg-btn${s.status === st ? ` eng-seg-btn--${st}` : ''}`}>
                      {st === 'present' ? <><CheckCircle size={12}/> Present</>
                       : st === 'absent' ? '✕ Absent'
                       : <><Clock size={12}/> Late</>}
                    </button>
                  ))}
                </div>

                {/* Time inputs */}
                {(s.status === 'present' || s.status === 'late') && (
                  <div className="eng-time-pair">
                    <div className="eng-time-field">
                      <span className="eng-label eng-label--no-margin">In</span>
                      <input type="time" className="eng-time-input" value={s.inTime}
                        onChange={e => setField(s.id, 'inTime', e.target.value)} />
                    </div>
                    {s.status === 'present' && (
                      <div className="eng-time-field">
                        <span className="eng-label eng-label--no-margin">Out</span>
                        <input type="time" className="eng-time-input" value={s.outTime}
                          onChange={e => setField(s.id, 'outTime', e.target.value)} />
                      </div>
                    )}
                  </div>
                )}

                {/* Absent alert */}
                {isAlert && (
                  <div className="eng-att-alert">
                    <span className="eng-badge eng-badge--warning">
                      ⚠️ {s.consecutiveAbsent} days consecutive
                    </span>
                    {!hasAlerted ? (
                      <button onClick={() => handleAlert(s.id)} className="eng-btn eng-btn--ghost eng-btn--sm">
                        <Bell size={12} /> Alert Parents
                      </button>
                    ) : (
                      <span className="eng-badge eng-badge--success">✅ Parents Alerted</span>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* ── Sticky Save Bar ── */}
      <div className="eng-save-bar">
        <p className="eng-save-bar-info">
          <strong>{marked}</strong> of <strong>{filtered.length}</strong> marked for <strong>{date}</strong>
        </p>
        <button onClick={handleSave} className="eng-btn eng-btn--primary">
          {saved ? <><CheckCircle size={15}/> Saved!</> : <><Save size={15}/> Save Attendance</>}
        </button>
      </div>
    </div>
  );
}
