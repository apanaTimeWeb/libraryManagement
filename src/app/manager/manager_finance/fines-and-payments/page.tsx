'use client';
import { useState, useMemo } from 'react';
import { 
  AlertCircle, DollarSign, Wallet, FileText, CheckCircle, 
  RotateCcw, Receipt, History, AlertTriangle, Send, Search, IndianRupee, HandCoins, Clock
} from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/manager/manager_reusable/gridTheme';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function FinesAndPaymentsPage() {
  const [activeTab, setActiveTab] = useState('Fine Dashboard');
  const [toast, setToast] = useState('');
  
  // Collect Fine State
  const [collectForm, setCollectForm] = useState({
    member: '',
    fineId: '',
    amount: '',
    mode: 'Cash',
    txnId: ''
  });
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<any>(null);

  // Refund State
  const [refundForm, setRefundForm] = useState({
    member: '',
    receiptNo: '',
    reason: ''
  });

  const TABS = [
    { name: 'Fine Dashboard', icon: DollarSign },
    { name: 'Pending Fines', icon: AlertCircle },
    { name: 'Collect Fine', icon: HandCoins },
    { name: 'Paid Fines', icon: CheckCircle },
    { name: 'Partially Paid', icon: RotateCcw },
    { name: 'Payment History', icon: History },
    { name: 'Receipts', icon: Receipt },
    { name: 'Refund Requests', icon: RotateCcw },
  ];

  const PENDING_FINES = [
    { id: 'F-101', member: 'Rahul Sharma (LIB-001)', type: 'Overdue Book', amount: 150, status: 'Pending', date: '2026-09-25' },
    { id: 'F-102', member: 'Priya Verma (LIB-022)', type: 'Lost Book Charge', amount: 500, status: 'Pending', date: '2026-09-28' },
    { id: 'F-103', member: 'Amit Kumar (LIB-045)', type: 'Damage Charge', amount: 200, status: 'Partially Paid', date: '2026-09-29' },
  ];

  const PAYMENT_HISTORY = [
    { id: 'TXN-901', receipt: 'REC-26010', member: 'Sneha Patel (LIB-012)', type: 'Overdue Book', amount: 50, mode: 'UPI', date: '2026-10-01 10:15', collectedBy: 'Manager' },
    { id: 'TXN-902', receipt: 'REC-26011', member: 'Rohan Gupta (LIB-034)', type: 'Late Fee', amount: 100, mode: 'Cash', date: '2026-10-01 11:30', collectedBy: 'Staff A' },
  ];

  const REFUND_REQUESTS = [
    { id: 'REF-001', member: 'Kavita Singh (LIB-055)', receipt: 'REC-25900', amount: 500, reason: 'Duplicate Payment', status: 'Pending Approval' },
  ];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleCollectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectForm.member || !collectForm.amount) {
      showToast('Member and Amount are required.');
      return;
    }
    const receiptData = {
      receiptNo: 'REC-' + Math.floor(10000 + Math.random() * 90000),
      member: collectForm.member,
      fineType: collectForm.fineId || 'General Fine',
      amount: collectForm.amount,
      mode: collectForm.mode,
      date: new Date().toLocaleString(),
      collectedBy: 'Manager',
      txnId: collectForm.txnId
    };
    setLastReceipt(receiptData);
    setShowReceipt(true);
    showToast('Payment collected successfully!');
    setCollectForm({ member: '', fineId: '', amount: '', mode: 'Cash', txnId: '' });
  };

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundForm.member || !refundForm.reason) {
      showToast('Member and Reason are required.');
      return;
    }
    showToast('Refund request created and sent to SuperAdmin for approval.');
    setRefundForm({ member: '', receiptNo: '', reason: '' });
  };

  // AG Grid ColDefs
  const pendingCols: any[] = useMemo(() => [
    { field: 'id', headerName: 'Fine ID', width: 120 },
    { field: 'member', headerName: 'Member', flex: 1 },
    { field: 'type', headerName: 'Type', flex: 1 },
    { field: 'amount', headerName: 'Amount', width: 120, valueFormatter: (p: any) => `₹${p.value}` },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'status', headerName: 'Status', width: 150, cellRenderer: (p: any) => <span className="mgr-badge mgr-badge--warning">{p.value}</span> },
  ], []);

  const historyCols: any[] = useMemo(() => [
    { field: 'receipt', headerName: 'Receipt #', width: 130 },
    { field: 'member', headerName: 'Member', flex: 1 },
    { field: 'type', headerName: 'Fine Type', flex: 1 },
    { field: 'amount', headerName: 'Amount', width: 120, cellClass: 'text-emerald-400 font-bold', valueFormatter: (p: any) => `₹${p.value}` },
    { field: 'mode', headerName: 'Mode', width: 120, cellRenderer: (p: any) => <span className="mgr-badge mgr-badge--info">{p.value}</span> },
    { field: 'date', headerName: 'Date/Time', width: 160 },
    { field: 'collectedBy', headerName: 'Collected By', width: 140 },
  ], []);

  return (
    <div className="mgr-page-animate relative pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[var(--mgr-primary)] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-fade-in border border-white/20">
          <CheckCircle size={18} /> <span className="font-medium">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-1 mb-8">
        <div className="mgr-breadcrumb">
          <span>Finance</span><span>/</span><span>Fines & Payments</span>
        </div>
        <h1 className="mgr-page-title flex items-center gap-3 mt-2">
          <DollarSign className="text-[var(--mgr-primary)]" size={28} /> Fines & Payments
        </h1>
        <p className="text-sm text-[var(--mgr-text-secondary)]">Manage fine collections, view pending dues, and request refunds.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Sidebar Tabs */}
        <div className="xl:col-span-3 space-y-2">
          {TABS.map(tab => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                type="button"
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-[var(--mgr-primary)] text-white shadow-lg' 
                    : 'text-[var(--mgr-text-secondary)] hover:bg-[var(--mgr-surface)] hover:text-white'
                }`}
              >
                <tab.icon size={18} className={isActive ? 'text-white' : 'opacity-70'} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="xl:col-span-9 mgr-card p-6 min-h-[500px]">
          
          {/* DASHBOARD */}
          {activeTab === 'Fine Dashboard' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-[var(--mgr-border)] pb-4">Fine Collection Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Pending', value: '₹4,500', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
                  { label: "Today's Collection", value: '₹1,250', icon: IndianRupee, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { label: 'Overdue Fines', value: '₹2,100', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                  { label: 'Lost Book Charges', value: '₹1,500', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { label: 'Damage Charges', value: '₹850', icon: AlertTriangle, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                ].map((kpi, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[var(--mgr-surface)] border border-[var(--mgr-border)] hover:bg-[var(--mgr-surface-hover)] transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                        <kpi.icon size={20} />
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-[var(--mgr-text-secondary)] uppercase tracking-wider mb-1">{kpi.label}</p>
                    <h3 className="text-2xl font-black text-white">{kpi.value}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COLLECT FINE */}
          {activeTab === 'Collect Fine' && (
            <div className="animate-fade-in max-w-2xl relative">
              <h2 className="text-xl font-bold text-white mb-2">Collect Payment</h2>
              <p className="text-sm text-[var(--mgr-text-secondary)] mb-6 border-b border-[var(--mgr-border)] pb-4">
                Record a payment for an outstanding fine or charge.
              </p>
              
              {!showReceipt ? (
                <form onSubmit={handleCollectSubmit} className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/90">Select Member</label>
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--mgr-text-secondary)]" />
                      <input required type="text" className="mgr-input pl-9" placeholder="Search by Name or LIB ID..." 
                        value={collectForm.member} onChange={e => setCollectForm({...collectForm, member: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-white/90">Select Outstanding Fine</label>
                      <select className="mgr-input" value={collectForm.fineId} onChange={e => setCollectForm({...collectForm, fineId: e.target.value})}>
                        <option value="">-- Select or enter custom --</option>
                        {PENDING_FINES.map(f => (
                          <option key={f.id} value={f.type}>{f.id} - {f.type} (₹{f.amount})</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-white/90">Amount (₹)</label>
                      <input required type="number" min="1" className="mgr-input" placeholder="e.g. 150"
                        value={collectForm.amount} onChange={e => setCollectForm({...collectForm, amount: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-white/90">Payment Mode</label>
                      <select className="mgr-input" value={collectForm.mode} onChange={e => setCollectForm({...collectForm, mode: e.target.value})}>
                        <option>Cash</option>
                        <option>UPI</option>
                        <option>Card</option>
                        <option>Bank</option>
                        <option>Other</option>
                      </select>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-white/90">Transaction ID (Optional)</label>
                      <input type="text" className="mgr-input" placeholder="Required for UPI/Card/Bank"
                        value={collectForm.txnId} onChange={e => setCollectForm({...collectForm, txnId: e.target.value})}
                        required={['UPI', 'Card', 'Bank'].includes(collectForm.mode)}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="submit" className="mgr-btn-primary px-8 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                      <CheckCircle size={16} className="mr-2 inline" /> Confirm Payment
                    </button>
                  </div>
                </form>
              ) : (
                // RECEIPT MODAL/VIEW
                <div className="p-6 rounded-xl border border-[var(--mgr-primary)] bg-[var(--mgr-primary)]/5 animate-scale-up">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-emerald-400 flex items-center gap-2">
                        <CheckCircle size={24} /> Payment Successful
                      </h3>
                      <p className="text-sm text-[var(--mgr-text-secondary)] mt-1">Official Receipt Generated</p>
                    </div>
                    <button onClick={() => setShowReceipt(false)} className="mgr-btn-secondary mgr-btn-sm">Create New</button>
                  </div>
                  
                  <div className="space-y-3 bg-black/20 p-5 rounded-lg border border-[var(--mgr-border)] font-mono text-sm">
                    <div className="flex justify-between"><span className="text-[var(--mgr-text-secondary)]">Receipt Number:</span> <span className="font-bold text-white">{lastReceipt.receiptNo}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--mgr-text-secondary)]">Member:</span> <span className="text-white">{lastReceipt.member}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--mgr-text-secondary)]">Fine Type:</span> <span className="text-white">{lastReceipt.fineType}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--mgr-text-secondary)]">Amount Paid:</span> <span className="font-bold text-emerald-400">₹{lastReceipt.amount}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--mgr-text-secondary)]">Payment Mode:</span> <span className="text-white">{lastReceipt.mode}</span></div>
                    {lastReceipt.txnId && <div className="flex justify-between"><span className="text-[var(--mgr-text-secondary)]">Txn ID:</span> <span className="text-white">{lastReceipt.txnId}</span></div>}
                    <div className="flex justify-between"><span className="text-[var(--mgr-text-secondary)]">Date/Time:</span> <span className="text-white">{lastReceipt.date}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--mgr-text-secondary)]">Collected By:</span> <span className="text-white">{lastReceipt.collectedBy}</span></div>
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                    <button className="mgr-btn-primary flex-1"><Receipt size={16} className="mr-2 inline" /> Print Receipt</button>
                    <button className="mgr-btn-secondary flex-1"><Send size={16} className="mr-2 inline" /> Send to WhatsApp</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PENDING FINES (AG GRID) */}
          {(activeTab === 'Pending Fines' || activeTab === 'Partially Paid') && (
            <div className="animate-fade-in h-full flex flex-col">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-[var(--mgr-border)] pb-4">{activeTab}</h2>
              <div className="flex-1 w-full h-[400px]">
                <AgGridReact
                  theme={gridTheme}
                  rowData={PENDING_FINES.filter(f => activeTab === 'Pending Fines' ? f.status === 'Pending' : f.status === 'Partially Paid')}
                  columnDefs={pendingCols}
                  headerHeight={48}
                  rowHeight={56}
                />
              </div>
            </div>
          )}

          {/* PAYMENT HISTORY & RECEIPTS (AG GRID) */}
          {(activeTab === 'Payment History' || activeTab === 'Paid Fines' || activeTab === 'Receipts') && (
            <div className="animate-fade-in h-full flex flex-col">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-[var(--mgr-border)] pb-4">{activeTab}</h2>
              <div className="flex-1 w-full h-[400px]">
                <AgGridReact
                  theme={gridTheme}
                  rowData={PAYMENT_HISTORY}
                  columnDefs={historyCols}
                  headerHeight={48}
                  rowHeight={56}
                />
              </div>
            </div>
          )}

          {/* REFUND REQUESTS */}
          {activeTab === 'Refund Requests' && (
            <div className="animate-fade-in max-w-2xl">
              <div className="flex justify-between items-center mb-6 border-b border-[var(--mgr-border)] pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Initiate Refund Request</h2>
                  <p className="text-sm text-[var(--mgr-text-secondary)]">Manager normally refund request create karega. Final approval Admin/SuperAdmin policy ke according hoti hai.</p>
                </div>
              </div>
              
              <form onSubmit={handleRefundSubmit} className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/90">Member Name/ID</label>
                  <input required type="text" className="mgr-input" placeholder="e.g. Kavita Singh" 
                    value={refundForm.member} onChange={e => setRefundForm({...refundForm, member: e.target.value})}
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/90">Original Receipt Number</label>
                  <input required type="text" className="mgr-input" placeholder="e.g. REC-25900" 
                    value={refundForm.receiptNo} onChange={e => setRefundForm({...refundForm, receiptNo: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/90">Reason for Refund</label>
                  <textarea required rows={4} className="mgr-input resize-none py-3" placeholder="Explain why the refund is being requested (e.g. Duplicate Payment)..."
                    value={refundForm.reason} onChange={e => setRefundForm({...refundForm, reason: e.target.value})}
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button type="submit" className="mgr-btn-primary !bg-orange-500 hover:!bg-orange-600 !border-orange-500 text-white w-full">
                    <Send size={16} className="mr-2 inline" /> Send Request to Admin
                  </button>
                </div>
              </form>

              <div className="mt-12">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-[var(--mgr-border)] pb-2">Pending Approvals</h3>
                {REFUND_REQUESTS.map(r => (
                  <div key={r.id} className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold mb-1 flex items-center gap-2"><RotateCcw size={14}/> {r.id} - {r.member}</h4>
                      <p className="text-xs opacity-80 mb-1">Receipt: {r.receipt} | Amount: ₹{r.amount}</p>
                      <p className="text-xs opacity-60">Reason: {r.reason}</p>
                    </div>
                    <span className="mgr-badge !bg-orange-500/20 !text-orange-400">{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
