'use client';

import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, type ColDef } from 'ag-grid-community';
import { Search, Filter, Mail, Award } from 'lucide-react';
import { gridTheme } from '@/app/manager/manager_reusable/gridTheme';

ModuleRegistry.registerModules([AllCommunityModule]);

const ALUMNI_DATA = [
  { id: 'AL-1001', name: 'Neha Reddy',  phone: '+91 9988776655', leftDate: '2025-12-01', duration: '12 Months', exam: 'UPSC CSE',  currentStatus: 'Selected (IAS)'      },
  { id: 'AL-1002', name: 'Karan Mehra', phone: '+91 8877665544', leftDate: '2026-02-15', duration: '6 Months',  exam: 'SSC CGL',   currentStatus: 'Selected'             },
  { id: 'AL-1003', name: 'Anita Desai', phone: '+91 7766554433', leftDate: '2026-04-10', duration: '8 Months',  exam: 'Bank PO',   currentStatus: 'Preparing from home'  },
];

export function AlumniClient() {
  const [rowData] = useState(ALUMNI_DATA);

  const colDefs: ColDef[] = [
    { field: 'id',   headerName: 'ID', width: 100 },
    {
      field: 'name', headerName: 'Alumni Name', flex: 1,
      cellRenderer: (p: any) => (
        <div className="flex items-center gap-3 py-2">
          <div className="mgr-avatar-sm">{p.value?.charAt(0)}</div>
          <div>
            <p className="mgr-cell-name">{p.value}</p>
            <p className="mgr-cell-sub">{p.data?.phone}</p>
          </div>
        </div>
      ),
    },
    { field: 'duration',      headerName: 'Studied For',    width: 130 },
    { field: 'exam',          headerName: 'Target Exam',    width: 140 },
    {
      field: 'currentStatus', headerName: 'Current Status', width: 200,
      cellRenderer: (p: any) => {
        const isSelected = p.value?.includes('Selected');
        return (
          <span className={isSelected ? 'mgr-text-success' : 'mgr-text-secondary'} style={{ fontWeight: isSelected ? 600 : 400 }}>
            {isSelected && <Award size={14} style={{ display: 'inline', marginRight: 4 }} />}
            {p.value}
          </span>
        );
      },
    },
    { field: 'leftDate', headerName: 'Left On', width: 120 },
    {
      headerName: 'Actions', width: 100, sortable: false,
      cellRenderer: () => (
        <div className="flex gap-2 items-center h-full">
          <button className="mgr-btn-icon" title="Send Message"><Mail size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="mgr-page">
      <div className="mgr-page-header">
        <div>
          <div className="mgr-breadcrumb">Students › Alumni</div>
          <h1 className="mgr-page-title">Alumni Directory</h1>
          <p className="mgr-page-subtitle">Students who have successfully completed their journey here.</p>
        </div>
        <div className="mgr-page-actions">
          <button className="mgr-btn-ghost"><Award size={16} /> Success Stories</button>
        </div>
      </div>

      <div className="mgr-card">
        <div className="mgr-card-header">
          <div className="mgr-input-icon-wrap" style={{ maxWidth: 320 }}>
            <Search size={14} className="mgr-input-icon" />
            <input type="text" placeholder="Search alumni by name or exam…" className="mgr-input mgr-input-with-icon" />
          </div>
          <button className="mgr-btn-ghost mgr-btn-sm"><Filter size={14} /> Filters</button>
        </div>
        <div className="mgr-table-wrapper" style={{ height: 500 }}>
          <AgGridReact
            theme={gridTheme}
            rowData={rowData}
            columnDefs={colDefs}
            rowHeight={56}
            headerHeight={48}
            suppressMovableColumns
            suppressCellFocus
            defaultColDef={{ resizable: false }}
          />
        </div>
      </div>
    </div>
  );
}
