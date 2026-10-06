'use client';

// RESPONSIBILITY: Entry page for the admin_finance module.
// DATA FLOW: Next.js Router -> Page -> Components

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';

import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '../lib/format';
import { Receipt, Trash2, FileText } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

type Payment = {
  id: number;
  receiptNumber: string;
  date: string;
  studentName: string;
  smartId: string;
  amount: number;
  mode: 'cash' | 'upi' | 'card' | 'bank';
  txnId?: string;
  lateFee: number;
  receivedBy: string;
  remark?: string;
  status: 'valid' | 'deleted';
  deletionReason?: string;
};

const MOCK_PAYMENTS: Payment[] = [
  { id: 1, receiptNumber: 'REC-20260401-001', date: '2026-04-01', studentName: 'Aarav Sharma',  smartId: 'STU001', amount: 1499, mode: 'cash', lateFee: 0,   receivedBy: 'Admin',   status: 'valid'   },
  { id: 2, receiptNumber: 'REC-20260402-002', date: '2026-04-02', studentName: 'Priya Patel',   smartId: 'STU002', amount: 999,  mode: 'upi',  txnId: 'UPI123', lateFee: 100, receivedBy: 'Staff',   status: 'valid'   },
  { id: 3, receiptNumber: 'REC-20260403-003', date: '2026-04-03', studentName: 'Rohan Kumar',   smartId: 'STU003', amount: 2499, mode: 'card', txnId: 'CARD456', lateFee: 0,   receivedBy: 'Admin',   status: 'deleted', deletionReason: 'Student left the institute' },
  { id: 4, receiptNumber: 'REC-20260405-004', date: '2026-04-05', studentName: 'Ananya Singh',  smartId: 'STU004', amount: 1499, mode: 'bank', txnId: 'BANK789', lateFee: 0,   receivedBy: 'Manager', status: 'valid'   },
  { id: 5, receiptNumber: 'REC-20260406-005', date: '2026-04-06', studentName: 'Vikram Rao',    smartId: 'STU005', amount: 999,  mode: 'cash', lateFee: 150, receivedBy: 'Staff',   status: 'valid'   },
  { id: 6, receiptNumber: 'REC-20260408-006', date: '2026-04-08', studentName: 'Sneha Gupta',   smartId: 'STU006', amount: 2499, mode: 'upi',  txnId: 'UPI999', lateFee: 0,   receivedBy: 'Admin',   status: 'valid'   },
];

const MODE_BADGE: Record<string, string> = {
  cash: 'fin-badge fin-badge--cash',
  upi:  'fin-badge fin-badge--upi',
  card: 'fin-badge fin-badge--card',
  bank: 'fin-badge fin-badge--bank',
};

import { gridTheme } from '@/app/admin/admin_finance/admin_finance_components/AdminFinancegridTheme/AdminFinancegridTheme';
export default function Payments() {
  const router = useRouter();
  const [modeFilter, setModeFilter] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ id: number; receipt: string } | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [allPayments, setAllPayments] = useState<Payment[]>([]);

  useEffect(() => {
    fetchApi('/finance/payments').then(data => {
      const mapped = data.map((p: any) => ({
        id: p.id,
        receiptNumber: 'REC-' + p.id.substring(0, 8),
        date: new Date(p.date).toISOString().split('T')[0],
        studentName: p.studentName,
        smartId: 'S-001',
        amount: p.amount,
        mode: 'cash',
        lateFee: 0,
        receivedBy: 'Admin',
        status: p.status === 'completed' ? 'valid' : 'deleted',
      }));
      setAllPayments(mapped);
    }).catch(console.error);
  }, []);

  const visible = allPayments.filter((p) => {
    const modeMatch = modeFilter === 'all' || p.mode === modeFilter;
    const deletedMatch = showDeleted || p.status !== 'deleted';
    return modeMatch && deletedMatch;
  });

  const handleDelete = () => {
    if (!deleteDialog || !deleteReason.trim()) return;
    setIsDeleting(true);
    setTimeout(() => {
      setAllPayments((prev) =>
        prev.map((p) =>
          p.id === deleteDialog.id ? { ...p, status: 'deleted', deletionReason: deleteReason } : p
        )
      );
      toast.success(`Payment ${deleteDialog.receipt} has been voided.`);
      setDeleteDialog(null);
      setDeleteReason('');
      setIsDeleting(false);
    }, 700);
  };

  const colDefs = [
    { 
      field: 'receiptNumber', 
      headerName: 'Receipt #', 
      width: 150,
      cellRenderer: (params: any) => (
        <span className={`fin-mono font-medium ${params.data.status === 'deleted' ? 'line-through opacity-50' : ''}`}>
          {params.value}
        </span>
      )
    },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 120,
      valueFormatter: (p: any) => formatDate(p.value)
    },
    { 
      field: 'studentName', 
      headerName: 'Student', 
      flex: 1,
      minWidth: 180,
      cellRenderer: (params: any) => (
        <div className={`py-1 ${params.data.status === 'deleted' ? 'opacity-50' : ''}`}>
          <div className="fin-cell-name">{params.value}</div>
          <div className="fin-cell-subtext">{params.data.smartId}</div>
        </div>
      )
    },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      width: 120,
      cellStyle: { textAlign: 'right', fontWeight: 600 },
      valueFormatter: (p: any) => formatCurrency(p.value)
    },
    { 
      field: 'mode', 
      headerName: 'Mode', 
      width: 110,
      cellRenderer: (params: any) => (
        <div className={`h-full flex items-center ${params.data.status === 'deleted' ? 'opacity-50' : ''}`}>
          <span className={MODE_BADGE[params.value] || 'fin-badge fin-badge--neutral'}>{params.value}</span>
        </div>
      )
    },
    { field: 'txnId', headerName: 'Txn ID', width: 130, cellRenderer: (p: any) => <span className="fin-mono">{p.value || '—'}</span> },
    { 
      field: 'lateFee', 
      headerName: 'Late Fee', 
      width: 110,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: any) => (
        <span className={p.value > 0 ? 'fin-text-warning' : 'fin-text-muted'}>
          {formatCurrency(p.value)}
        </span>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      cellRenderer: (params: any) => (
        <div className="h-full flex flex-col justify-center py-1">
          {params.value === 'valid' ? (
            <span className="fin-badge fin-badge--success self-start">Valid</span>
          ) : (
            <span className="fin-badge fin-badge--neutral self-start">DELETED</span>
          )}
          {params.value === 'deleted' && params.data.deletionReason && (
            <div className="fin-cell-subtext mt-1 text-[10px] leading-tight" title={params.data.deletionReason}>
              {params.data.deletionReason.length > 15 ? params.data.deletionReason.substring(0, 15) + '...' : params.data.deletionReason}
            </div>
          )}
        </div>
      )
    },
    {
      headerName: 'Actions',
      width: 140,
      sortable: false,
      cellRenderer: (params: any) => {
        if (params.data.status !== 'valid') return null;
        return (
          <div className="flex items-center gap-2 h-full">
            <button
              className="fin-badge fin-badge--neutral cursor-pointer hover:border-[var(--mgr-primary)]"
              onClick={() => router.push(`/admin/admin_finance/receipt/${params.data.id}`)}
              title="View Receipt"
            >
              <Receipt size={14} />
            </button>
            <button
              className="fin-badge fin-badge--neutral cursor-pointer hover:border-[var(--mgr-primary)]"
              onClick={() => router.push(`/admin/admin_finance/invoice/${params.data.id}`)}
              title="View Invoice"
            >
              <FileText size={14} />
            </button>
            <button
              className="fin-badge fin-badge--danger cursor-pointer"
              onClick={() => setDeleteDialog({ id: params.data.id, receipt: params.data.receiptNumber })}
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fin-page-title">Payment History</h1>
        <p className="fin-page-subtitle">Complete payment ledger with audit trail.</p>
      </div>

      <div className="fin-filter-bar">
        <select className="fin-select w-40" value={modeFilter} onChange={(e) => setModeFilter(e.target.value)}>
          <option value="all">All Modes</option>
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
          <option value="bank">Bank Transfer</option>
        </select>
        <div className="flex items-center gap-2">
          <button
            className={`fin-switch ${showDeleted ? 'fin-switch--on' : 'fin-switch--off'}`}
            onClick={() => setShowDeleted((v) => !v)}
            type="button"
          >
            <span className="fin-switch__thumb" />
          </button>
          <span className="fin-text-muted">Show Deleted</span>
        </div>
        <button className="fin-badge fin-badge--neutral cursor-pointer ml-auto">📤 Export</button>
      </div>

      <div className="fin-card p-4">
        <div className="mgr-table-wrapper h-[500px]">
          <AgGridReact
            theme={gridTheme}
            rowData={visible}
            columnDefs={colDefs as any}
            rowHeight={56}
            headerHeight={48}
            pagination={true}
            paginationPageSize={10}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true
            }}
          />
        </div>
      </div>

      {deleteDialog && (
        <div className="fin-dialog-overlay">
          <div className="fin-dialog">
            <h2 className="fin-dialog__title">🗑️ Delete Payment — {deleteDialog.receipt}</h2>
            <button className="fin-dialog__close" onClick={() => setDeleteDialog(null)}>✕</button>
            <p className="fin-dialog-helper">Soft-delete this payment? This action is permanent and logged in Audit Logs.</p>
            <div className="space-y-2">
              <label className="fin-label">Deletion reason <span className="fin-text-danger">*</span></label>
              <textarea
                className="fin-textarea"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Enter reason for deletion..."
                rows={2}
              />
            </div>
            <div className="fin-dialog__footer">
              <button className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => setDeleteDialog(null)}>Cancel</button>
              <button
                className="fin-badge fin-badge--danger cursor-pointer"
                onClick={handleDelete}
                disabled={isDeleting || !deleteReason.trim()}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
