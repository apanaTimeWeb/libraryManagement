'use client';
import type { ICellRendererParams } from 'ag-grid-community';
import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

ModuleRegistry.registerModules([AllCommunityModule]);

type Entry = {
  id: number;
  shift: string;
  openingBalance: number;
  cashCollected: number;
  upiCollected: number;
  expenses: number;
  closingBalance: number;
  settledBy: string;
  status: 'pending' | 'settled';
};

const TODAY = new Date().toISOString().split('T')[0];

const MOCK: Entry[] = [
  { id: 1, shift: 'Morning (6AM–2PM)',   openingBalance: 2000, cashCollected: 4500, upiCollected: 3200, expenses: 800,  closingBalance: 5700, settledBy: 'Ravi Kumar',  status: 'settled' },
  { id: 2, shift: 'Afternoon (2PM–9PM)', openingBalance: 5700, cashCollected: 3100, upiCollected: 2800, expenses: 400,  closingBalance: 8400, settledBy: 'Priya Singh', status: 'pending' },
  { id: 3, shift: 'Night (9PM–6AM)',     openingBalance: 8400, cashCollected: 1200, upiCollected: 900,  expenses: 200,  closingBalance: 9400, settledBy: '—',           status: 'pending' },
];

export default function DailySettlementPage() {
  const [date, setDate] = useState(TODAY);
  const [entries, setEntries] = useState(MOCK);

  const handleSettle = (id: number) => {
    setEntries(p => p.map((e: any) => e.id === id ? { ...e, status: 'settled', settledBy: 'Current User' } : e));
    toast.success('Shift settled successfully.');
  };

  const totalCash = entries.reduce((s, e) => s + e.cashCollected, 0);
  const totalUpi  = entries.reduce((s, e) => s + e.upiCollected, 0);
  const totalExp  = entries.reduce((s, e) => s + e.expenses, 0);

  const colDefs = [
    { field: 'shift', headerName: 'Shift', flex: 1, minWidth: 180, cellRenderer: (p: ICellRendererParams) => <span className="fin-cell-name font-medium">{p.value}</span> },
    { 
      field: 'openingBalance', 
      headerName: 'Opening ₹', 
      width: 130,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: ICellRendererParams) => <span className="fin-cell-subtext text-sm">₹{p.value.toLocaleString()}</span>
    },
    { 
      field: 'cashCollected', 
      headerName: 'Cash ₹', 
      width: 120,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: ICellRendererParams) => <span className="fin-text-success font-medium">₹{p.value.toLocaleString()}</span>
    },
    { 
      field: 'upiCollected', 
      headerName: 'UPI ₹', 
      width: 120,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: ICellRendererParams) => <span className="fin-text-info font-medium">₹{p.value.toLocaleString()}</span>
    },
    { 
      field: 'expenses', 
      headerName: 'Expenses ₹', 
      width: 130,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: ICellRendererParams) => <span className="fin-text-danger font-medium">₹{p.value.toLocaleString()}</span>
    },
    { 
      field: 'closingBalance', 
      headerName: 'Closing ₹', 
      width: 130,
      cellStyle: { textAlign: 'right', fontWeight: 600 },
      cellRenderer: (p: ICellRendererParams) => <span className="fin-text-body">₹{p.value.toLocaleString()}</span>
    },
    { field: 'settledBy', headerName: 'Settled By', width: 140, cellRenderer: (p: ICellRendererParams) => <span className="fin-cell-subtext">{p.value}</span> },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      cellRenderer: (p: ICellRendererParams) => (
        <span className={`fin-badge ${p.value === 'settled' ? 'fin-badge--success' : 'fin-badge--warning'} inline-block mt-2`}>
          {p.value}
        </span>
      )
    },
    {
      headerName: 'Action',
      width: 120,
      sortable: false,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (params: ICellRendererParams) => {
        if (params.data.status === 'pending') {
          return (
            <div className="h-full flex justify-end items-center">
              <button 
                className="fin-badge fin-badge--success cursor-pointer hover:bg-green-600 hover:text-white transition-colors duration-200" 
                onClick={() => handleSettle(params.data.id)}
              >
                <CheckCircle size={12} className="mr-1" /> Settle
              </button>
            </div>
          );
        }
        return null;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="fin-page-title">Daily Settlement</h1>
          <p className="fin-page-subtitle">Shift-wise cash & UPI reconciliation.</p>
        </div>
        <input type="date" className="fin-input w-44" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fin-kpi-card"><p className="fin-kpi-label fin-text-success">Cash Collected</p><p className="fin-kpi-value fin-text-success">₹{totalCash.toLocaleString()}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label fin-text-info">UPI Collected</p><p className="fin-kpi-value fin-text-info">₹{totalUpi.toLocaleString()}</p></div>
        <div className="fin-kpi-card fin-kpi-card--danger"><p className="fin-kpi-label fin-kpi-label--danger">Expenses</p><p className="fin-kpi-value fin-kpi-value--danger">₹{totalExp.toLocaleString()}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label">Net</p><p className="fin-kpi-value">₹{(totalCash + totalUpi - totalExp).toLocaleString()}</p></div>
      </div>

      <div className="fin-card p-4">
        {entries.length === 0 ? (
          <div className="fin-empty-state py-12">
            <div className="fin-empty-state__icon">📋</div>
            <p className="fin-empty-state__title">No settlement entries for this date.</p>
          </div>
        ) : (
          <div className="mgr-table-wrapper h-[350px]">
            <AgGridReact
              theme={gridTheme}
              rowData={entries}
              columnDefs={colDefs as any}
              rowHeight={56}
              headerHeight={48}
              pagination={false}
              defaultColDef={{
                sortable: true,
                filter: false,
                resizable: true
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
