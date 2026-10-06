'use client';
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

ModuleRegistry.registerModules([AllCommunityModule]);
import { Eye, Edit2, ShieldAlert, Plus, X, MapPin, Users, CheckCircle, AlertTriangle, Save, Loader, Download } from 'lucide-react';
import { useLibraries } from '@/app/superadmin/superadmin_libraries/useLibraries';
import LibraryPanel from '@/app/superadmin/superadmin_libraries/LibraryPanel';
import type { Library, LibraryPanelMode } from '@/app/superadmin/superadmin_libraries/superadmin_libraries_types';
import { LIBRARIES_TOASTS } from '@/app/superadmin/superadmin_libraries/superadmin_libraries_constants';

export default function LibrariesPage() {
  const { libraries, loading, error, updateLibrary, toggleStatus } = useLibraries();
  const [selected, setSelected] = useState<Library | null>(null);
  const [panelMode, setPanelMode] = useState<LibraryPanelMode>('view');
  const [toast, setToast] = useState('');
  const gridRef = useRef<AgGridReact>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleSave = async (updated: Library) => {
    try {
      await updateLibrary(updated.id, updated);
      setSelected(updated);
      showToast(LIBRARIES_TOASTS.UPDATE_SUCCESS(updated.name));
    } catch (err) {
      showToast(LIBRARIES_TOASTS.UPDATE_ERROR);
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      await toggleStatus(id);
      showToast(LIBRARIES_TOASTS.STATUS_SUCCESS);
    } catch (err) {
      showToast(LIBRARIES_TOASTS.STATUS_ERROR);
    }
  };

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Library Name', field: 'name', flex: 2, minWidth: 180,
      cellRenderer: (p: ICellRendererParams<Library>) => (
        <div>
          <p className="font-medium text-primary">{p.data?.name}</p>
          <p className="text-xs text-secondary">{p.data?.plan} Plan</p>
        </div>
      ),
    },
    { headerName: 'Location', field: 'location', flex: 1.5, minWidth: 160, cellClass: () => 'sa-cell-muted' },
    {
      headerName: 'Capacity (Branches & Users)', flex: 1.5, minWidth: 160,
      cellRenderer: (p: ICellRendererParams<Library>) => (
        <div className="flex flex-col gap-1 justify-center h-full">
          <p className="text-sm font-bold text-white">{p.data?.branches} Branches</p>
          <p className="text-xs text-secondary">{p.data?.students} Active Students</p>
        </div>
      ),
    },
    {
      headerName: 'LTV Revenue', field: 'revenue', flex: 1, minWidth: 120,
      cellRenderer: (p: ICellRendererParams<Library>) => <span className="font-bold text-emerald-400">₹{p.data?.revenue?.toLocaleString() || 0}</span>
    },
    {
      headerName: 'Status', field: 'status', flex: 1, minWidth: 120,
      cellRenderer: (p: ICellRendererParams<Library>) => (
        p.data?.status === 'Active'
          ? <span className="sa-badge sa-badge--success">✅ Active</span>
          : <span className="sa-badge sa-badge--warning">⚠️ Maintenance</span>
      ),
    },
    {
      headerName: 'Actions', field: 'id', flex: 1, minWidth: 120, sortable: false, filter: false,
      cellRenderer: (p: ICellRendererParams<Library>) => (
        <div className="flex items-center gap-1 h-full">
          <button className="sa-btn-icon" onClick={e => { e.stopPropagation(); setPanelMode('view'); setSelected(p.data!); }}><Eye size={15} /></button>
          <button className="sa-btn-icon sa-btn-icon--success" onClick={e => { e.stopPropagation(); setPanelMode('edit'); setSelected(p.data!); }}><Edit2 size={15} /></button>
          <button className="sa-btn-icon sa-btn-icon--danger" onClick={e => { e.stopPropagation(); handleSuspend(p.data!.id); }}><ShieldAlert size={15} /></button>
        </div>
      ),
    },
  ], [libraries]);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <>
      {toast && <div className="sa-toast">{toast}</div>}
      {selected && (
        <LibraryPanel lib={selected} mode={panelMode} onClose={() => setSelected(null)} onSave={handleSave} onSuspend={handleSuspend} />
      )}

      <div className="flex flex-col gap-1 mb-6">
        <div className="sa-breadcrumb">
          <span>Library OS</span><span>/</span><span>Super Admin</span><span>/</span><span>Libraries</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="sa-page-title">Registered Libraries</h1>
          <Link href="/superadmin/superadmin_setup-wizard" className="sa-btn-primary"><Plus size={15} /> Add Branch</Link>
        </div>
      </div>

      <div className="sa-card overflow-hidden">
        <div className="sa-actions-bar justify-between">
          <input type="text" placeholder="Search by name or location..." className="sa-input w-72"
            onChange={e => gridRef.current?.api.setGridOption('quickFilterText', e.target.value)} />
          <span className="text-xs text-secondary">{libraries.length} libraries</span>
        </div>
        <div style={{ height: 420 }}>
          <AgGridReact
            ref={gridRef}
            theme={gridTheme}
            rowData={libraries}
            columnDefs={colDefs}
            rowHeight={60}
            headerHeight={44}
            onGridReady={onGridReady}
            onRowClicked={p => { setPanelMode('view'); setSelected(p.data); }}
            pagination={true}
            paginationPageSize={10}
            suppressCellFocus={true}
          />
        </div>
      </div>
    </>
  );
}
