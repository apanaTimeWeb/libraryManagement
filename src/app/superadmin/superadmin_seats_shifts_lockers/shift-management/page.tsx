'use client';
import { useState } from 'react';
import { Plus, Edit, PowerOff, Zap, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  occupancy: number;
  capacity: number;
  active: boolean;
}

const INITIAL_SHIFTS: Shift[] = [
  { id: '1', name: 'Morning',   startTime: '06:00', endTime: '12:00', occupancy: 32, capacity: 40, active: true  },
  { id: '2', name: 'Afternoon', startTime: '12:00', endTime: '18:00', occupancy: 18, capacity: 40, active: true  },
  { id: '3', name: 'Evening',   startTime: '18:00', endTime: '22:00', occupancy: 0,  capacity: 40, active: false },
];

const EMPTY_FORM = { name: '', startTime: '', endTime: '', active: true };

export default function ShiftManagementPage() {
  const [shifts, setShifts]             = useState<Shift[]>(INITIAL_SHIFTS);
  const [showModal, setShowModal]       = useState(false);
  const [editShift, setEditShift]       = useState<Shift | null>(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [errors, setErrors]             = useState<Record<string, string>>({});
  const [deactivateTarget, setDeactivateTarget] = useState<Shift | null>(null);

  function openAdd() {
    setEditShift(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowModal(true);
  }

  function openEdit(shift: Shift) {
    setEditShift(shift);
    setForm({ name: shift.name, startTime: shift.startTime, endTime: shift.endTime, active: shift.active });
    setErrors({});
    setShowModal(true);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim())      e.name      = 'Shift name is required';
    if (!form.startTime)        e.startTime = 'Start time is required';
    if (!form.endTime)          e.endTime   = 'End time is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    if (editShift) {
      setShifts(prev => prev.map((s: any) => s.id === editShift.id ? { ...s, ...form } : s));
      toast.success('Shift updated.');
    } else {
      setShifts(prev => [...prev, { id: Date.now().toString(), ...form, occupancy: 0, capacity: 40 }]);
      toast.success('Shift added.');
    }
    setShowModal(false);
  }

  function handleDeactivate() {
    if (!deactivateTarget) return;
    setShifts(prev => prev.map((s: any) => s.id === deactivateTarget.id ? { ...s, active: false } : s));
    toast.success(`${deactivateTarget.name} shift deactivated.`);
    setDeactivateTarget(null);
  }

  function handleActivate(shift: Shift) {
    setShifts(prev => prev.map((s: any) => s.id === shift.id ? { ...s, active: true } : s));
    toast.success(`${shift.name} shift activated.`);
  }

  return (
    <>

      <div className="ss-page">
        <div className="ss-page-header">
          <div>
            <h1 className="ss-page-title">Shifts</h1>
            <p className="ss-page-subtitle">Define active hours and availability windows</p>
          </div>
          <button className="ss-btn-primary ss-btn-start" onClick={openAdd}>
            <Plus size={16} />Add Shift
          </button>
        </div>

        {shifts.length === 0 ? (
          <div className="ss-empty-state">
            <p className="ss-empty-state__icon">🕐</p>
            <p className="ss-empty-state__title">No shifts defined.</p>
            <p className="ss-empty-state__sub">Use Setup Wizard or add manually.</p>
            <button className="ss-btn-primary" onClick={openAdd}><Plus size={15} />Add Shift</button>
          </div>
        ) : (
          <div className="ss-shift-cards-grid">
            {shifts.map((shift: any) => (
              <div key={shift.id} className={`ss-shift-card${!shift.active ? ' ss-shift-card--inactive' : ''}`}>
                <div className="ss-shift-card__body">

                  <div className="ss-shift-card__header">
                    <h3 className="ss-section-heading">{shift.name}</h3>
                    <span className={`ss-badge ${shift.active ? 'ss-badge--success' : 'ss-badge--inactive'}`}>
                      {shift.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="ss-shift-card__time-section">
                    <p className={`ss-shift-time${!shift.active ? ' ss-shift-time--inactive' : ''}`}>
                      {shift.startTime} → {shift.endTime}
                    </p>
                  </div>

                  <div className="ss-shift-occupancy">
                    <div>
                      <p className="ss-shift-occupancy__label">Occupancy</p>
                      <p className="ss-shift-occupancy__value">
                        {shift.occupancy} students
                        <span className="ss-shift-occupancy__fraction"> / {shift.capacity}</span>
                      </p>
                    </div>
                    <div className="ss-occupancy-bar">
                      <div className="ss-occupancy-bar__fill" style={{ width: `${Math.round((shift.occupancy / shift.capacity) * 100)}%` }} />
                    </div>
                  </div>

                  <div className="ss-shift-card__footer">
                    <button className="ss-btn-ghost" onClick={() => openEdit(shift)}>
                      <Edit size={14} />Edit
                    </button>
                    {shift.active ? (
                      <button className="ss-btn-danger" onClick={() => setDeactivateTarget(shift)}>
                        <PowerOff size={14} />Deactivate
                      </button>
                    ) : (
                      <button className="ss-btn-primary" onClick={() => handleActivate(shift)}>
                        <Zap size={14} />Activate
                      </button>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="ss-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="ss-modal" onClick={e => e.stopPropagation()}>
            <h2 className="ss-modal-title">{editShift ? '✏️ Edit Shift' : '➕ Add Shift'}</h2>
            <div className="ss-form-grid">
              <div className="ss-form-field ss-form-field--full">
                <label className="ss-label">Shift Name <span className="ss-text-danger">*</span></label>
                <input className={`ss-input ss-input--no-icon${errors.name ? ' ss-input--error' : ''}`} placeholder="Morning / Evening / Custom-1" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                {errors.name && <p className="ss-error">{errors.name}</p>}
              </div>
              <div className="ss-form-field">
                <label className="ss-label">Start Time <span className="ss-text-danger">*</span></label>
                <input type="time" className={`ss-input ss-input--no-icon${errors.startTime ? ' ss-input--error' : ''}`} value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} />
                {errors.startTime && <p className="ss-error">{errors.startTime}</p>}
              </div>
              <div className="ss-form-field">
                <label className="ss-label">End Time <span className="ss-text-danger">*</span></label>
                <input type="time" className={`ss-input ss-input--no-icon${errors.endTime ? ' ss-input--error' : ''}`} value={form.endTime} onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))} />
                {errors.endTime && <p className="ss-error">{errors.endTime}</p>}
              </div>
              <div className="ss-form-field ss-form-field--full">
                <label className="ss-label">Active</label>
                <div className="ss-select-wrap">
                  <select className="ss-select" value={form.active ? 'yes' : 'no'} onChange={e => setForm(p => ({ ...p, active: e.target.value === 'yes' }))}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  <ChevronDown size={14} className="ss-select-icon" />
                </div>
              </div>
            </div>
            <div className="ss-modal-footer">
              <button className="ss-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="ss-btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Confirm */}
      {deactivateTarget && (
        <div className="ss-modal-overlay" onClick={() => setDeactivateTarget(null)}>
          <div className="ss-modal" onClick={e => e.stopPropagation()}>
            <h2 className="ss-modal-title">⚠️ Deactivate Shift</h2>
            <p className="ss-modal-desc">
              Deactivate <strong>{deactivateTarget.name}</strong>? Existing students are unaffected but new admissions cannot be assigned to this shift.
            </p>
            <div className="ss-modal-footer">
              <button className="ss-btn-ghost" onClick={() => setDeactivateTarget(null)}>Cancel</button>
              <button className="ss-btn-danger" onClick={handleDeactivate}>Deactivate</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
