'use client';

import React from 'react';
import { Users2, Plus, Upload, Download } from 'lucide-react';
import Link from 'next/link';

export default function GroupAdmissionPage() {
  return (
    <div className="mgr-page">
      <div className="mgr-page-header">
        <div>
          <Link href="/manager/manager_students" className="mgr-back-link">
            ← Back to Students
          </Link>
          <h1 className="mgr-page-title">Group Admission</h1>
        </div>
        <div className="mgr-page-actions">
          <button className="mgr-btn-ghost">
            <Download size={16} />
            <span>Download Excel Template</span>
          </button>
          <button className="mgr-btn-primary">
            <Plus size={16} />
            <span>New Group</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mgr-card p-6 flex flex-col items-center justify-center text-center gap-4 border-dashed border-2 border-[var(--border)] bg-transparent hover:border-[var(--primary)] transition-colors cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-[var(--primary-subtle)] flex items-center justify-center text-[var(--primary)] mb-2">
            <Upload size={28} />
          </div>
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold mb-1">Bulk Upload (Excel/CSV)</h3>
            <p className="text-[var(--text-secondary)] text-sm max-w-[250px]">Upload multiple student records at once using our standard template.</p>
          </div>
          <button className="mgr-btn-primary mt-2">Choose File</button>
        </div>

        <div className="mgr-card p-6 flex flex-col items-center justify-center text-center gap-4 border-dashed border-2 border-[var(--border)] bg-transparent hover:border-[var(--success)] transition-colors cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-[color-mix(in_srgb,var(--success)_15%,transparent)] flex items-center justify-center text-[var(--success)] mb-2">
            <Users2 size={28} />
          </div>
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold mb-1">Manual Group Entry</h3>
            <p className="text-[var(--text-secondary)] text-sm max-w-[250px]">Manually add multiple students who are joining together (e.g., friends sharing a plan).</p>
          </div>
          <button className="mgr-btn-primary mt-2 bg-[var(--success)] border-none">Start Manual Entry</button>
        </div>
      </div>

      <div className="mgr-card p-6 mt-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Recent Group Admissions</h3>
        <div className="text-center text-[var(--text-secondary)] py-12">
          No recent group admissions found.
        </div>
      </div>
    </div>
  );
}
