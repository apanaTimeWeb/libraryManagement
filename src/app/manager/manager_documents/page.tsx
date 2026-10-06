'use client';

import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { FolderOpen, Upload, Search, FileText, Download, Trash2, Image as ImageIcon, File } from 'lucide-react';
import { gridTheme } from '@/app/manager/manager_reusable/gridTheme';

ModuleRegistry.registerModules([AllCommunityModule]);

const DOCUMENTS_DATA = [
  { id: 'DOC-101', name: 'Aadhar_Rahul_Sharma.pdf', type: 'PDF', size: '2.4 MB', uploadedBy: 'Rahul Sharma', date: '2026-06-01', category: 'ID Proof' },
  { id: 'DOC-102', name: 'Photo_Sneha.jpg', type: 'Image', size: '1.1 MB', uploadedBy: 'Sneha Gupta', date: '2026-06-02', category: 'Profile Photo' },
  { id: 'DOC-103', name: 'Fee_Receipt_Amit.pdf', type: 'PDF', size: '0.8 MB', uploadedBy: 'System', date: '2026-06-02', category: 'Finance' },
  { id: 'DOC-104', name: 'UPSC_Syllabus.docx', type: 'Document', size: '3.5 MB', uploadedBy: 'Manager', date: '2026-06-03', category: 'Study Material' },
];

export default function DocumentVaultPage() {
  const [rowData] = useState(DOCUMENTS_DATA);

  const getFileIcon = (type: string) => {
    if (type === 'PDF') return <FileText size={18} className="text-[var(--danger)]" />;
    if (type === 'Image') return <ImageIcon size={18} className="text-[var(--primary)]" />;
    return <File size={18} className="text-[var(--info)]" />;
  };

  const colDefs = [
    { 
      field: 'name', 
      headerName: 'File Name', 
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-3 h-full">
          {getFileIcon(params.data.type)}
          <span className="mgr-cell-name font-medium">{params.value}</span>
        </div>
      )
    },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'size', headerName: 'Size', width: 100 },
    { field: 'uploadedBy', headerName: 'Uploaded By', width: 160 },
    { field: 'date', headerName: 'Date', width: 120 },
    {
      headerName: 'Actions',
      width: 120,
      sortable: false,
      cellRenderer: () => (
        <div className="flex gap-2 items-center h-full">
          <button className="mgr-btn-ghost mgr-btn-sm" title="Download">
            <Download size={16} />
          </button>
          <button className="mgr-btn-ghost mgr-btn-sm text-[var(--danger)]" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="mgr-page">
      <div className="mgr-page-header">
        <div>
          <div className="mgr-breadcrumb">Home / Documents</div>
          <h1 className="mgr-page-title">Document Vault</h1>
        </div>
        <div className="mgr-page-actions">
          <button className="mgr-btn-primary">
            <Upload size={16} />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="mgr-card p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--primary)] transition-colors border-2 border-transparent">
          <FolderOpen size={32} className="text-[var(--primary)] mb-2" />
          <p className="font-medium text-[var(--text-primary)]">ID Proofs</p>
          <p className="text-xs text-[var(--text-secondary)]">124 Files</p>
        </div>
        <div className="mgr-card p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--primary)] transition-colors border-2 border-transparent">
          <FolderOpen size={32} className="text-[var(--success)] mb-2" />
          <p className="font-medium text-[var(--text-primary)]">Finance</p>
          <p className="text-xs text-[var(--text-secondary)]">845 Files</p>
        </div>
        <div className="mgr-card p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--primary)] transition-colors border-2 border-transparent">
          <FolderOpen size={32} className="text-[var(--warning)] mb-2" />
          <p className="font-medium text-[var(--text-primary)]">Study Material</p>
          <p className="text-xs text-[var(--text-secondary)]">42 Files</p>
        </div>
        <div className="mgr-card p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--primary)] transition-colors border-2 border-transparent">
          <FolderOpen size={32} className="text-[var(--info)] mb-2" />
          <p className="font-medium text-[var(--text-primary)]">Other</p>
          <p className="text-xs text-[var(--text-secondary)]">19 Files</p>
        </div>
      </div>

      <div className="mgr-card p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="mgr-input-icon-wrap w-full max-w-sm">
            <Search size={16} className="mgr-input-icon" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              className="mgr-input mgr-input-with-icon"
            />
          </div>
        </div>

        <div className="mgr-table-wrapper h-[400px]">
          <AgGridReact
            theme={gridTheme}
            rowData={rowData}
            columnDefs={colDefs as any}
            rowHeight={56}
            headerHeight={48}
          />
        </div>
      </div>
    </div>
  );
}
