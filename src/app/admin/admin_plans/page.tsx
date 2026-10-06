'use client';

// RESPONSIBILITY: Entry page for the admin_plans module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Plus, Pencil, Trash2, CheckCircle, IndianRupee } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  durationDays: number;
  features: string[];
  status: 'Active' | 'Inactive';
  subscribers: number;
}

const PLANS: Plan[] = [
  {
    id: 'P1', name: 'Monthly', price: 1000, duration: '1 Month', durationDays: 30,
    features: ['Any single shift', 'Locker access', 'WiFi included', 'ID card'],
    status: 'Active', subscribers: 420,
  },
  {
    id: 'P2', name: 'Quarterly', price: 2800, duration: '3 Months', durationDays: 90,
    features: ['Any single shift', 'Locker access', 'WiFi included', 'ID card', '7% discount'],
    status: 'Active', subscribers: 310,
  },
  {
    id: 'P3', name: 'Half-Yearly', price: 5200, duration: '6 Months', durationDays: 180,
    features: ['Any single shift', 'Locker access', 'WiFi included', 'ID card', '13% discount'],
    status: 'Active', subscribers: 180,
  },
  {
    id: 'P4', name: 'Annual', price: 9500, duration: '12 Months', durationDays: 365,
    features: ['Any single shift', 'Locker access', 'WiFi included', 'ID card', '21% discount', 'Priority seat'],
    status: 'Active', subscribers: 95,
  },
  {
    id: 'P5', name: 'Day Pass', price: 80, duration: '1 Day', durationDays: 1,
    features: ['Single day access', 'WiFi included'],
    status: 'Inactive', subscribers: 0,
  },
];

interface FormState { name: string; price: string; duration: string; durationDays: string; features: string; }
const EMPTY: FormState = { name: '', price: '', duration: '', durationDays: '', features: '' };

export default function AdminPlansPage() {
  const [plans, setPlans]       = useState<Plan[]>([]);

  useEffect(() => {
    fetchApi('/admin/admin_plans').then(data => {
      const mapped = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        duration: p.durationInDays + ' Days',
        durationDays: p.durationInDays,
        features: ['Any single shift', 'Locker access', 'WiFi included'],
        status: p.isActive ? 'Active' : 'Inactive',
        subscribers: 0
      }));
      setPlans(mapped);
    }).catch(console.error);
  }, []);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<string | null>(null);
  const [form, setForm]         = useState<FormState>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const toggleStatus = (id: string) => {
    setPlans(p => p.map(plan =>
      plan.id === id ? { ...plan, status: plan.status === 'Active' ? 'Inactive' : 'Active' } : plan
    ));
  };

  const handleEdit = (plan: Plan) => {
    setEditing(plan.id);
    setForm({
      name: plan.name,
      price: plan.price.toString(),
      duration: plan.duration,
      durationDays: plan.durationDays.toString(),
      features: plan.features.join('\n'),
    });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) return;
    const parsedFeatures = form.features.split('\n').map(s => s.trim()).filter(Boolean);
    if (editing) {
      setPlans(p => p.map(plan =>
        plan.id === editing ? {
          ...plan,
          name: form.name,
          price: Number(form.price),
          duration: form.duration,
          durationDays: Number(form.durationDays),
          features: parsedFeatures,
        } : plan
      ));
    } else {
      setPlans([...plans, {
        id: `P${Date.now()}`,
        name: form.name,
        price: Number(form.price),
        duration: form.duration,
        durationDays: Number(form.durationDays),
        features: parsedFeatures,
        status: 'Active',
        subscribers: 0,
      }]);
    }
    setShowForm(false);
  };

  const handleDelete = () => {
    if (deleteId) setPlans(p => p.filter(plan => plan.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div className="admin-page-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 24 }}>
        <div>
          <p className="admin-breadcrumb">Library OS › Admin › Plans</p>
          <h1 className="admin-page-title">Membership Plans</h1>
          <p className="admin-page-subtitle">Create and manage pricing plans available across all branches.</p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn-primary" onClick={handleCreate}>
            <Plus size={16} /> Create Plan
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {plans.map(plan => (
          <div
            key={plan.id}
            className="admin-plan-card"
            style={{ opacity: plan.status === 'Inactive' ? 0.72 : 1 }}
          >
            {/* Card Top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{plan.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{plan.duration} ({plan.durationDays} Days)</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <span
                  className={`admin-badge ${plan.status === 'Active' ? 'admin-badge-success' : 'admin-badge-danger'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleStatus(plan.id)}
                >
                  {plan.status}
                </span>
                <span className="admin-badge admin-badge-primary">{plan.duration}</span>
              </div>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <IndianRupee size={20} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{plan.price}</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 4 }}>/ {plan.duration.toLowerCase()}</span>
            </div>

            {/* Subscribers */}
            <div>
              <span className="admin-badge admin-badge-info">👥 {plan.subscribers} active subscribers</span>
            </div>

            {/* Features */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Features</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {plan.features.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 13, color: 'var(--text-primary)' }}>
                    <CheckCircle size={13} style={{ color: 'var(--success)', marginTop: 2, flexShrink: 0 }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <button className="admin-btn-icon" onClick={() => handleEdit(plan)} title="Edit" style={{ color: 'var(--info)' }}>
                <Pencil size={15} />
              </button>
              <button className="admin-btn-icon" onClick={() => setDeleteId(plan.id)} title="Delete" style={{ color: 'var(--danger)' }}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2 className="admin-modal-title">{editing ? 'Edit Plan' : 'Create New Plan'}</h2>
            <div className="admin-form-grid">
              <div className="admin-form-field admin-form-field-full">
                <label className="admin-label admin-label-required">Plan Name</label>
                <input className="admin-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Monthly" />
              </div>
              <div className="admin-form-field">
                <label className="admin-label admin-label-required">Price (₹)</label>
                <input className="admin-input" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="1000" />
              </div>
              <div className="admin-form-field">
                <label className="admin-label">Duration (Text)</label>
                <input className="admin-input" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 1 Month" />
              </div>
              <div className="admin-form-field admin-form-field-full">
                <label className="admin-label">Validity (Days)</label>
                <input className="admin-input" type="number" value={form.durationDays} onChange={e => setForm({ ...form, durationDays: e.target.value })} placeholder="30" />
              </div>
              <div className="admin-form-field admin-form-field-full">
                <label className="admin-label">Features (One per line)</label>
                <textarea
                  className="admin-textarea"
                  value={form.features}
                  onChange={e => setForm({ ...form, features: e.target.value })}
                  rows={4}
                  style={{ resize: 'none' }}
                  placeholder={'Locker access\nWiFi included'}
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="admin-btn-primary" onClick={handleSave}>
                <CheckCircle size={14} /> Save Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h2 className="admin-modal-title" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trash2 size={18} /> Delete Plan
            </h2>
            <p className="admin-modal-desc">
              Delete <strong>{plans.find(p => p.id === deleteId)?.name}</strong>? This action cannot be undone.
            </p>
            <div className="admin-modal-footer">
              <button className="admin-btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="admin-btn-danger" onClick={handleDelete}>Delete Plan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
