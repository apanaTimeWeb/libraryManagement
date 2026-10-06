'use client';
import { useState } from 'react';
import { Building2, Save, MapPin, Phone, Mail, User, Clock, Building, Hash } from 'lucide-react';

export default function BranchInformationPage() {
  const [toast, setToast] = useState('');
  
  // State for Branch Info form
  const [branchData, setBranchData] = useState({
    branchName: 'Library OS - Connaught Place',
    branchCode: 'SL360-CP-01',
    address: 'Block A, Connaught Place, New Delhi, 110001',
    phone: '+91 9876543210',
    email: 'cp.branch@smartlibrary.com',
    managerName: 'Rahul Verma',
    workingHours: '08:00 AM - 10:00 PM (All Days)'
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Branch Information updated successfully!');
  };

  return (
    <div className="mgr-page-animate relative pb-12">
      {/* Toast */}
      {toast && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[var(--mgr-primary)] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-fade-in border border-white/20">
          <Save size={18} /> <span className="font-medium">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-1 mb-8">
        <div className="mgr-breadcrumb">
          <span>Settings</span><span>/</span><span>Branch Information</span>
        </div>
        <h1 className="mgr-page-title flex items-center gap-3 mt-2">
          <Building2 className="text-[var(--mgr-primary)]" size={28} /> Branch Profile
        </h1>
        <p className="text-sm text-[var(--mgr-text-secondary)]">Manage your branch details, contact information, and operational hours.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Summary Card */}
        <div className="lg:col-span-4">
          <div className="mgr-card p-6 sticky top-6">
            <div className="w-16 h-16 rounded-2xl bg-[var(--mgr-primary)]/10 text-[var(--mgr-primary)] flex items-center justify-center mb-6 border border-[var(--mgr-primary)]/20">
              <Building size={32} />
            </div>
            
            <h2 className="text-xl font-black text-white mb-1">{branchData.branchName}</h2>
            <p className="text-sm text-emerald-400 font-bold mb-6">Code: {branchData.branchCode}</p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[var(--mgr-text-secondary)] mt-0.5 shrink-0" />
                <span className="text-sm text-white/90">{branchData.address || 'Address not set'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[var(--mgr-text-secondary)] shrink-0" />
                <span className="text-sm text-white/90">{branchData.phone || 'Phone not set'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[var(--mgr-text-secondary)] shrink-0" />
                <span className="text-sm text-white/90">{branchData.email || 'Email not set'}</span>
              </div>
              <div className="flex items-center gap-3">
                <User size={18} className="text-[var(--mgr-text-secondary)] shrink-0" />
                <span className="text-sm text-white/90">{branchData.managerName || 'Manager not set'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-[var(--mgr-text-secondary)] shrink-0" />
                <span className="text-sm text-white/90">{branchData.workingHours || 'Hours not set'}</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-[var(--mgr-surface)] rounded-xl border border-[var(--mgr-border)]">
              <p className="text-xs text-[var(--mgr-text-secondary)] text-center">
                Updates to branch information will reflect instantly across student apps and portals.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Edit Form */}
        <div className="lg:col-span-8">
          <div className="mgr-card p-6">
            <div className="flex justify-between items-center mb-6 border-b border-[var(--mgr-border)] pb-4">
              <h2 className="text-xl font-bold text-white">Edit Details</h2>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                    <Building size={14} className="text-[var(--mgr-primary)]" /> Branch Name
                  </label>
                  <input required type="text" className="mgr-input" 
                    value={branchData.branchName} onChange={e => setBranchData({...branchData, branchName: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                    <Hash size={14} className="text-[var(--mgr-primary)]" /> Branch Code
                  </label>
                  <input required type="text" className="mgr-input opacity-70" disabled
                    value={branchData.branchCode} onChange={e => setBranchData({...branchData, branchCode: e.target.value})}
                    title="Branch Code is assigned by SuperAdmin and cannot be changed here."
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                    <MapPin size={14} className="text-[var(--mgr-primary)]" /> Address
                  </label>
                  <textarea required rows={2} className="mgr-input resize-none py-3" 
                    value={branchData.address} onChange={e => setBranchData({...branchData, address: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                    <Phone size={14} className="text-[var(--mgr-primary)]" /> Phone Number
                  </label>
                  <input required type="tel" className="mgr-input" 
                    value={branchData.phone} onChange={e => setBranchData({...branchData, phone: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                    <Mail size={14} className="text-[var(--mgr-primary)]" /> Email Address
                  </label>
                  <input required type="email" className="mgr-input" 
                    value={branchData.email} onChange={e => setBranchData({...branchData, email: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                    <User size={14} className="text-[var(--mgr-primary)]" /> Manager Name
                  </label>
                  <input required type="text" className="mgr-input" 
                    value={branchData.managerName} onChange={e => setBranchData({...branchData, managerName: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                    <Clock size={14} className="text-[var(--mgr-primary)]" /> Working Hours
                  </label>
                  <input required type="text" className="mgr-input" placeholder="e.g. 08:00 AM - 10:00 PM (Mon-Sat)"
                    value={branchData.workingHours} onChange={e => setBranchData({...branchData, workingHours: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-[var(--mgr-border)] mt-8">
                <button type="submit" className="mgr-btn-primary px-8">
                  <Save size={16} className="mr-2 inline" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
