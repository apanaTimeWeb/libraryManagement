'use client';

// RESPONSIBILITY: Renders the Admin Students page — View-Only with detailed student modal.
// DATA FLOW: fetchAdminStudents -> AdminStudentsPage -> AgGridReact + StudentDetailModal

import { useState, useMemo, useEffect } from 'react';
import {
  Users, Download, Search, Printer, Upload, MessageSquare, Mail,
  Send, X, Phone, CalendarDays, Armchair, IndianRupee, Clock, ShieldAlert
} from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/admin/admin_reusable/gridTheme';
import { useAdmin } from '@/app/admin/admin_context/AdminContext';
import { fetchAdminStudents } from '@/app/admin/admin_api/admin_api';
import toast, { Toaster } from 'react-hot-toast';

ModuleRegistry.registerModules([AllCommunityModule]);

interface Student {
  id: string;
  name: string;
  phone: string;
  shift: string;
  seat: string;
  plan: string;
  joinDate: string;
  expiryDate: string;
  status: string;
  branch: string;
  feeStatus?: string;
  locker?: string;
  consecutiveAbsent?: number;
  totalPaid?: string;
  dueFee?: string;
}

export default function AdminStudentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { selectedBranch } = useAdmin();

  useEffect(() => {
    const mockStudents = [
      { id: '1001', fullName: 'Rahul Sharma',  phone: '+91 9876543210', joinDate: '01 Jan 2024', expiryDate: '01 Jan 2025', branch: 'Main Branch',     status: 'Active',    shift: 'Morning',  seat: 'A-01', plan: 'Premium', locker: 'L-02', feeStatus: 'Paid',    totalPaid: '₹12,000', dueFee: '₹0',    consecutiveAbsent: 0 },
      { id: '1002', fullName: 'Sneha Patil',   phone: '+91 9123456789', joinDate: '15 Feb 2024', expiryDate: '15 Aug 2024', branch: 'Main Branch',     status: 'Active',    shift: 'Evening',  seat: 'B-05', plan: 'Basic',   locker: '—',    feeStatus: 'Paid',    totalPaid: '₹4,800',  dueFee: '₹0',    consecutiveAbsent: 1 },
      { id: '1003', fullName: 'Amit Kumar',    phone: '+91 9988776655', joinDate: '10 Mar 2024', expiryDate: '10 Sep 2024', branch: 'Main Branch',     status: 'Suspended', shift: 'Morning',  seat: 'C-12', plan: 'Premium', locker: 'L-07', feeStatus: 'Due',     totalPaid: '₹6,000',  dueFee: '₹3,000', consecutiveAbsent: 7 },
      { id: '1004', fullName: 'Priya Singh',   phone: '+91 9001122334', joinDate: '01 Apr 2024', expiryDate: '01 Oct 2024', branch: 'Downtown Branch', status: 'Active',    shift: 'Full Day', seat: 'D-03', plan: 'Elite',   locker: 'L-11', feeStatus: 'Paid',    totalPaid: '₹9,600',  dueFee: '₹0',    consecutiveAbsent: 0 },
      { id: '1005', fullName: 'Vikram Verma',  phone: '+91 9888123456', joinDate: '20 May 2024', expiryDate: '20 Nov 2024', branch: 'Main Branch',     status: 'Blocked',   shift: 'Evening',  seat: '—',    plan: 'Basic',   locker: '—',    feeStatus: 'Due',     totalPaid: '₹2,400',  dueFee: '₹1,800', consecutiveAbsent: 14 },
      { id: '1006', fullName: 'Kavita Rao',    phone: '+91 9777654321', joinDate: '05 Jun 2024', expiryDate: '05 Dec 2024', branch: 'Main Branch',     status: 'Active',    shift: 'Morning',  seat: 'A-08', plan: 'Premium', locker: '—',    feeStatus: 'Paid',    totalPaid: '₹8,000',  dueFee: '₹0',    consecutiveAbsent: 0 },
    ];

    fetchAdminStudents().then(data => {
      const source = (Array.isArray(data) && data.length > 0) ? data : mockStudents;
      const mapped: Student[] = source.map((s: any) => ({
        id: 'STU-' + s.id.substring(0, 4).toUpperCase(),
        name: s.fullName || s.name,
        phone: s.phone || '+91 9XXXX XXXX',
        shift: s.shift || 'Morning',
        seat: s.seat || `A-${s.id.slice(-2)}`,
        plan: s.plan || 'Monthly',
        joinDate: s.joinDate || '01 Jan 2024',
        expiryDate: s.expiryDate || '01 Jan 2025',
        status: s.status || 'Active',
        branch: s.branch || 'Main Branch',
        feeStatus: s.feeStatus || 'Paid',
        locker: s.locker || '—',
        consecutiveAbsent: s.consecutiveAbsent || 0,
        totalPaid: s.totalPaid || '₹0',
        dueFee: s.dueFee || '₹0',
      }));
      setStudents(mapped);
    }).catch(() => {
      const mapped: Student[] = mockStudents.map(s => ({
        id: 'STU-' + s.id.substring(0, 4).toUpperCase(),
        name: s.fullName,
        phone: s.phone,
        shift: s.shift,
        seat: s.seat,
        plan: s.plan,
        joinDate: s.joinDate,
        expiryDate: s.expiryDate,
        status: s.status,
        branch: s.branch,
        feeStatus: s.feeStatus,
        locker: s.locker,
        consecutiveAbsent: s.consecutiveAbsent,
        totalPaid: s.totalPaid,
        dueFee: s.dueFee,
      }));
      setStudents(mapped);
    });
  }, []);

  const filtered = students.filter(s => {
    if (selectedBranch !== 'All Branches' && s.branch !== selectedBranch) return false;
    if (statusFilter !== 'All' && s.status !== statusFilter) return false;
    return s.name.toLowerCase().includes(search.toLowerCase()) ||
           s.id.toLowerCase().includes(search.toLowerCase()) ||
           s.phone.includes(search);
  });

  const colDefs = useMemo<any[]>(() => [
    {
      field: 'id', headerName: 'ID', flex: 0.8, minWidth: 90,
      cellStyle: { fontFamily: 'monospace', fontSize: '12px', color: 'var(--primary)' }
    },
    {
      field: 'name', headerName: 'Student Name', flex: 1.5, minWidth: 150,
      cellRenderer: (p: any) => (
        <div style={{ fontWeight: 600, fontSize: '13px' }}>{p.value}</div>
      )
    },
    {
      field: 'phone', headerName: 'Mobile', flex: 1.2, minWidth: 120,
      cellRenderer: (p: any) => (
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{p.value}</div>
      )
    },
    { field: 'shift', headerName: 'Shift', flex: 1, minWidth: 110 },
    { field: 'seat', headerName: 'Seat', flex: 0.8, minWidth: 90 },
    { field: 'plan', headerName: 'Plan', flex: 1, minWidth: 100 },
    { field: 'joinDate', headerName: 'Joined', flex: 1.2, minWidth: 120 },
    { field: 'expiryDate', headerName: 'Expires', flex: 1.2, minWidth: 120,
      cellRenderer: (p: any) => {
        const isExpired = new Date(p.value) < new Date();
        return <span style={{ color: isExpired ? 'var(--danger)' : 'inherit', fontWeight: isExpired ? 600 : 400 }}>{p.value}</span>;
      }
    },
    {
      field: 'feeStatus', headerName: 'Fee', flex: 0.8, minWidth: 90,
      cellRenderer: (p: any) => (
        <span style={{
          display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
          background: p.value === 'Paid' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          color: p.value === 'Paid' ? 'var(--success)' : 'var(--danger)',
        }}>{p.value}</span>
      )
    },
    {
      field: 'status', headerName: 'Status', flex: 1, minWidth: 110,
      cellRenderer: (p: any) => {
        const color = p.value === 'Active' ? 'var(--success)' : p.value === 'Suspended' ? 'var(--warning)' : 'var(--danger)';
        const bg = p.value === 'Active' ? 'rgba(16,185,129,0.1)' : p.value === 'Suspended' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';
        return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: bg, color }}>{p.value}</span>;
      }
    },
    {
      headerName: 'Actions', flex: 1.2, minWidth: 220, sortable: false,
      cellRenderer: (params: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '100%' }}>
          <button
            style={{ fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '6px', background: 'rgba(99,102,241,0.1)', color: '#6366F1', border: 'none', cursor: 'pointer' }}
            onClick={() => setSelectedStudent(params.data)}
          >View</button>
          {params.data.status === 'Active' && (
            <button
              style={{ fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '6px', background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: 'none', cursor: 'pointer' }}
              onClick={() => toast.success(`Suspending ${params.data.name}...`)}
            >Suspend</button>
          )}
          {params.data.status !== 'Blocked' && (
            <button
              style={{ fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', cursor: 'pointer' }}
              onClick={() => toast.error(`Blocking ${params.data.name}...`)}
            >Block</button>
          )}
        </div>
      )
    }
  ], []);

  const statuses = ['All', 'Active', 'Suspended', 'Blocked'];

  return (
    <div className="h-full flex flex-col pb-10 space-y-6">
      <Toaster position="bottom-right" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <p className="text-xs text-[var(--text-secondary)] mb-1 tracking-widest uppercase font-medium">Library OS › Admin › Students</p>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{selectedBranch} — Students</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Overview of all enrolled students. Click a row or View to see full details.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--primary-subtle)] transition-colors">
            <Upload size={14} /> Import
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--primary-subtle)] transition-colors">
            <Download size={14} /> CSV
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--primary-subtle)] transition-colors">
            <Printer size={14} /> Print
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[#10B981] hover:bg-[rgba(16,185,129,0.1)] transition-colors">
            <MessageSquare size={14} /> WhatsApp
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[#3B82F6] hover:bg-[rgba(59,130,246,0.1)] transition-colors">
            <Send size={14} /> Telegram
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[#6366F1] hover:bg-[rgba(99,102,241,0.1)] transition-colors">
            <Mail size={14} /> Email
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Total', value: students.length, color: 'var(--primary)' },
          { label: 'Active', value: students.filter(s => s.status === 'Active').length, color: 'var(--success)' },
          { label: 'Suspended', value: students.filter(s => s.status === 'Suspended').length, color: 'var(--warning)' },
          { label: 'Blocked', value: students.filter(s => s.status === 'Blocked').length, color: 'var(--danger)' },
          { label: 'Fee Due', value: students.filter(s => s.feeStatus === 'Due').length, color: 'var(--danger)' },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 18px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{k.label}</p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', maxWidth: '380px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 12px 10px 36px', fontSize: '13px', color: 'var(--text-primary)', outline: 'none' }}
            placeholder="Search name, ID, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              background: statusFilter === s ? 'var(--primary)' : 'var(--bg-card)',
              color: statusFilter === s ? '#fff' : 'var(--text-secondary)',
              border: statusFilter === s ? 'none' : '1px solid var(--border)',
            }}
          >{s}</button>
        ))}
      </div>

      {/* AG Grid */}
      <div style={{ width: '100%', height: '500px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <AgGridReact
          rowData={filtered}
          columnDefs={colDefs}
          theme={gridTheme}
          defaultColDef={{ sortable: true, filter: true, resizable: true }}
          headerHeight={44}
          rowHeight={58}
          onRowClicked={(e) => setSelectedStudent(e.data || null)}
        />
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setSelectedStudent(null)}
        >
          <div
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                  {selectedStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{selectedStudent.name}</h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>{selectedStudent.id} · {selectedStudent.branch}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Status badge */}
            <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              {(() => {
                const color = selectedStudent.status === 'Active' ? 'var(--success)' : selectedStudent.status === 'Suspended' ? 'var(--warning)' : 'var(--danger)';
                const bg = selectedStudent.status === 'Active' ? 'rgba(16,185,129,0.12)' : selectedStudent.status === 'Suspended' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)';
                return <span style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: bg, color }}>{selectedStudent.status}</span>;
              })()}
              <span style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: selectedStudent.feeStatus === 'Paid' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: selectedStudent.feeStatus === 'Paid' ? 'var(--success)' : 'var(--danger)' }}>
                Fee: {selectedStudent.feeStatus}
              </span>
              {(selectedStudent.consecutiveAbsent || 0) >= 3 && (
                <span style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: 'rgba(245,158,11,0.12)', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldAlert size={12} /> {selectedStudent.consecutiveAbsent} days absent
                </span>
              )}
            </div>

            {/* Details grid */}
            <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { icon: <Phone size={14}/>, label: 'Phone', value: selectedStudent.phone },
                { icon: <Clock size={14}/>, label: 'Shift', value: selectedStudent.shift },
                { icon: <Armchair size={14}/>, label: 'Seat', value: selectedStudent.seat },
                { icon: <Armchair size={14}/>, label: 'Locker', value: selectedStudent.locker || '—' },
                { icon: <CalendarDays size={14}/>, label: 'Joined', value: selectedStudent.joinDate },
                { icon: <CalendarDays size={14}/>, label: 'Expires', value: selectedStudent.expiryDate },
                { icon: <IndianRupee size={14}/>, label: 'Plan', value: selectedStudent.plan },
                { icon: <IndianRupee size={14}/>, label: 'Total Paid', value: selectedStudent.totalPaid || '—' },
                { icon: <IndianRupee size={14}/>, label: 'Due Fee', value: selectedStudent.dueFee || '₹0' },
                { icon: <Users size={14}/>, label: 'Branch', value: selectedStudent.branch },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--bg-input)', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '11px', marginBottom: '4px' }}>
                    {item.icon} {item.label}
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Admin Actions (Suspend/Block only) */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginRight: 'auto' }}>Admin Actions:</span>
              <button
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, background: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.2)', cursor: 'pointer' }}
                onClick={() => {
                  toast.success(`WhatsApp message sent to ${selectedStudent.name}`);
                }}
              >
                <MessageSquare size={14} /> WhatsApp
              </button>
              {selectedStudent.status === 'Active' && (
                <button
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.2)', cursor: 'pointer' }}
                  onClick={() => { toast.success(`${selectedStudent.name} suspended.`); setSelectedStudent(null); }}
                >Suspend</button>
              )}
              {selectedStudent.status !== 'Blocked' && (
                <button
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}
                  onClick={() => { toast.error(`${selectedStudent.name} blocked.`); setSelectedStudent(null); }}
                >Block</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
