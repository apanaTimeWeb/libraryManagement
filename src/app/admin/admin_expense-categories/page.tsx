'use client';

// RESPONSIBILITY: Entry page for the admin_expense-categories module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Plus, Trash2, Tag } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Electricity', description: 'Monthly electricity and power bills', status: 'Active' },
  { id: '2', name: 'Rent', description: 'Building or property rent', status: 'Active' },
  { id: '3', name: 'Maintenance', description: 'AC repair, plumbing, painting', status: 'Active' },
  { id: '4', name: 'Stationery', description: 'Pens, registers, printer ink, paper', status: 'Active' },
  { id: '5', name: 'Cleaning', description: 'Housekeeping and cleaning supplies', status: 'Active' },
  { id: '6', name: 'Internet', description: 'Broadband and Wi-Fi charges', status: 'Active' },
  { id: '7', name: 'Miscellaneous', description: 'Other unspecified expenses', status: 'Active' },
];

export default function ExpenseCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchApi('/admin/admin_expense-categories').then(data => {
      const mapped = data.map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        status: 'Active'
      }));
      setCategories(mapped);
    }).catch(console.error);
  }, []);
  const [showForm, setShowForm] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', description: '' });

  const handleAdd = () => {
    if (!newCat.name.trim()) return;
    setCategories([
      ...categories,
      { id: Date.now().toString(), name: newCat.name, description: newCat.description, status: 'Active' },
    ]);
    setNewCat({ name: '', description: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const toggleStatus = (id: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="admin-page-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 24 }}>
        <div>
          <p className="admin-breadcrumb">Library OS &gt; Admin &gt; Expense Categories</p>
          <h1 className="admin-page-title">Expense Categories</h1>
          <p className="admin-page-subtitle">Define the types of expenses managers can record in Daily Settlements.</p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn-primary" onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center' }}>
            <Plus size={16} className="mr-2" /> Add Category
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {categories.map(cat => (
          <div key={cat.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', boxShadow: 'none', border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)' }}>
            <div className="admin-card-header" style={{ padding: '24px 24px 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 className="admin-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', margin: 0 }}>
                  <Tag size={16} style={{ color: 'var(--primary)' }} />
                  {cat.name}
                </h2>
                <span 
                  className={`admin-badge ${cat.status === 'Active' ? 'admin-badge-success' : 'admin-badge-danger'}`} 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => toggleStatus(cat.id)}
                >
                  {cat.status === 'Active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="admin-card-body" style={{ flexGrow: 1, padding: '0 24px 24px' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', margin: 0 }}>{cat.description || 'No description provided.'}</p>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="admin-btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(cat.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2 className="admin-modal-title">Add Expense Category</h2>
            <div className="admin-form-grid" style={{ marginTop: '16px', marginBottom: '24px' }}>
              <div className="admin-form-field admin-form-field-full">
                <label className="admin-label admin-label-required" htmlFor="catName">Category Name</label>
                <input 
                  id="catName"
                  className="admin-input"
                  value={newCat.name} 
                  onChange={e => setNewCat({ ...newCat, name: e.target.value })} 
                  placeholder="e.g. Marketing" 
                />
              </div>
              <div className="admin-form-field admin-form-field-full">
                <label className="admin-label" htmlFor="catDesc">Description</label>
                <textarea 
                  id="catDesc"
                  className="admin-textarea"
                  value={newCat.description} 
                  onChange={e => setNewCat({ ...newCat, description: e.target.value })} 
                  placeholder="Brief description of this expense type"
                  rows={3}
                  style={{ resize: 'none' }}
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="admin-btn-primary" onClick={handleAdd}>Save Category</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
