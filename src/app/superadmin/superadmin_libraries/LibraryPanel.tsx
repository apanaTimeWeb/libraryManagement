'use client';
import { useState } from 'react';
import { MapPin, Edit2, X, Users, CheckCircle, AlertTriangle, Save, Loader, ShieldAlert, Mail, Phone, FileText, Calendar, IndianRupee } from 'lucide-react';
import type { Library, LibraryPanelMode } from '@/app/superadmin/superadmin_libraries/superadmin_libraries_types';

interface LibraryPanelProps {
  lib: Library;
  mode: LibraryPanelMode;
  onClose: () => void;
  onSave: (updated: Library) => Promise<void>;
  onSuspend: (id: string) => Promise<void>;
}

export default function LibraryPanel({ lib, mode, onClose, onSave, onSuspend }: LibraryPanelProps) {
  const [editing, setEditing] = useState(mode === 'edit');
  const [form, setForm] = useState({ 
    name: lib.name, owner: lib.owner, phone: lib.phone, email: lib.email, 
    location: lib.location, plan: lib.plan, gstNumber: lib.gstNumber 
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ ...lib, ...form });
      setSaved(true);
      setTimeout(() => { setSaved(false); setEditing(false); }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sa-panel-overlay" onClick={onClose}>
      <div className="sa-panel-backdrop" />
      <div className="sa-panel-drawer" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-primary">{lib.name}</h2>
            <p className="text-sm text-secondary flex items-center gap-1 mt-1"><MapPin size={12} />{lib.location}</p>
          </div>
          <div className="flex items-center gap-1">
            {!editing && <button className="sa-btn-icon" onClick={() => setEditing(true)}><Edit2 size={15} /></button>}
            <button className="sa-btn-icon" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        {editing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="sa-label">Library Name</label>
                <input className="sa-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="sa-label">Owner Name</label>
                <input className="sa-input" value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="sa-label">Email</label>
                <input className="sa-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="sa-label">Phone</label>
                <input className="sa-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="sa-label">GST Number</label>
              <input className="sa-input" value={form.gstNumber} onChange={e => setForm(f => ({ ...f, gstNumber: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="sa-label">Location</label>
                <input className="sa-input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>
              <div>
                <label className="sa-label">SaaS Plan</label>
                <select className="sa-input appearance-none" value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}>
                  <option>Starter</option>
                  <option>Pro</option>
                  <option>Enterprise</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="sa-card p-4 flex flex-col gap-4 border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="sa-label mb-1">Lifetime Revenue</p>
                  <p className="text-2xl font-black text-emerald-400">₹{lib.revenue.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="sa-label mb-1">Next Renewal</p>
                  <p className="text-sm font-bold text-white">{lib.nextRenewal}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="sa-panel-info-cell">
                <p className="sa-panel-info-label">Active Branches</p>
                <p className="sa-panel-info-value">{lib.branches}</p>
              </div>
              <div className="sa-panel-info-cell">
                <p className="sa-panel-info-label">Active Students</p>
                <p className="sa-panel-info-value">{lib.students}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="sa-panel-info-cell">
                <p className="sa-panel-info-label">Plan Type</p>
                <p className="sa-panel-info-value text-indigo-400">{lib.plan}</p>
              </div>
              <div className="sa-panel-info-cell">
                <p className="sa-panel-info-label">GST Number</p>
                <p className="sa-panel-info-value sa-panel-info-value--mono">{lib.gstNumber}</p>
              </div>
            </div>

            <div className="space-y-3 mt-2 border-t border-white/5 pt-4">
              <h3 className="text-xs font-bold text-secondary uppercase tracking-widest">Contact Information</h3>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                <Mail size={16} className="text-secondary" />
                <div>
                  <p className="text-xs text-secondary">Email Address</p>
                  <p className="text-sm font-medium text-white">{lib.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                <Phone size={16} className="text-secondary" />
                <div>
                  <p className="text-xs text-secondary">Phone Number</p>
                  <p className="text-sm font-medium text-white">{lib.phone}</p>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-auto pt-6 flex flex-col gap-3">
          {editing && (
            <button className="sa-btn-primary w-full" onClick={handleSave} disabled={saving}>
              {saving ? <Loader className="animate-spin" size={16} /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Details'}
            </button>
          )}
          {lib.status === 'Active' ? (
            <button className="w-full flex items-center justify-center gap-2 p-3 text-sm font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-colors border border-rose-500/20" onClick={() => onSuspend(lib.id)}>
              <ShieldAlert size={16} /> Suspend Library Account
            </button>
          ) : (
            <button className="w-full flex items-center justify-center gap-2 p-3 text-sm font-bold text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl transition-colors border border-emerald-500/20" onClick={() => onSuspend(lib.id)}>
              <CheckCircle size={16} /> Restore Library Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
