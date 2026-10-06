'use client';

// RESPONSIBILITY: Entry page for the admin_expenses module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useMemo, useEffect } from 'react';
import { IndianRupee, Download, Search } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/admin/admin_reusable/gridTheme';
import { useAdmin } from '@/app/admin/admin_context/AdminContext';
import { fetchApi } from '@/lib/api';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function AdminExpensesPage() {
  const [search, setSearch] = useState('');
  const [expenses, setExpenses] = useState<any[]>([]);
  const { selectedBranch } = useAdmin();

  useEffect(() => {
    fetchApi('/admin/admin_expenses').then(data => {
      const mapped = data.map((e: any) => ({
        id: e.id,
        date: new Date(e.expenseDate).toLocaleDateString(),
        category: 'Monthly Expense',
        recordedBy: 'Admin',
        amount: e.amount,
        status: 'Approved'
      }));
      setExpenses(mapped);
    }).catch(console.error);
  }, []);

  const filtered = expenses.filter(e => {
    if (selectedBranch !== 'All Branches' && e.branch !== selectedBranch) return false;
    
    return e.category.toLowerCase().includes(search.toLowerCase()) ||
           e.recordedBy.toLowerCase().includes(search.toLowerCase());
  });

  const colDefs = useMemo<any[]>(() => [
    { field: 'date', headerName: 'Date', flex: 1, minWidth: 120 },
    { field: 'category', headerName: 'Category', flex: 1.5, minWidth: 150 },
    { field: 'recordedBy', headerName: 'Recorded By', flex: 1.5, minWidth: 150 },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      flex: 1, 
      minWidth: 120,
      cellRenderer: (params: any) => <span style={{ fontWeight: 600 }}>₹{params.value}</span>
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 1, 
      minWidth: 120, 
      cellRenderer: (params: any) => (
        <span className={`admin-badge ${params.value === 'Approved' ? 'admin-badge-success' : 'admin-badge-info'}`}>
            {params.value}
        </span>
    ) },
  ], []);

  return (
    <div className="h-full flex flex-col pb-10 space-y-6">
      <div className="admin-page-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 24 }}>
        <div>
          <p className="admin-breadcrumb">Library OS &gt; Admin &gt; Expenses</p>
          <h1 className="admin-page-title">{selectedBranch} - Expenses</h1>
          <p className="admin-page-subtitle">Monitor expenses logged by managers for the currently selected branch.</p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn-outline" style={{ display: 'flex', alignItems: 'center' }}>
            <Download size={16} className="mr-2" /> Export CSV
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
          <input
            className="admin-input"
            style={{ paddingLeft: '36px', width: '100%' }}
            placeholder="Search by branch, category or manager..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-wrapper" style={{ flex: 1, minHeight: 400 }}>
        <AgGridReact
          rowData={filtered}
          columnDefs={colDefs}
          theme={gridTheme}
          defaultColDef={{ sortable: true, filter: true, resizable: true }}
          headerHeight={44}
          rowHeight={56}
        />
      </div>
    </div>
  );
}
