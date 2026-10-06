'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';
import { Eye, Clock, MessageSquare, AlertTriangle, X, CheckCircle, Loader, Send, Paperclip, User, Tag, HelpCircle, Bug, CreditCard, Lock, Flag, FileText } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

const INITIAL_TICKETS = [
  { id: 'TKT-991', subject: 'Payment Gateway Failing for UPI',    tenant: 'City Reading Hub',      priority: 'High',   status: 'Open',        category: 'Billing',  assignee: 'Unassigned',   slaBreach: true,  age: '4 hours', replies: 2, hasAttachment: true, desc: 'UPI payments are failing with error code 502. Students unable to pay fees online. Razorpay dashboard shows gateway timeout.' },
  { id: 'TKT-988', subject: 'Cannot generate student ID card',    tenant: 'Scholar Spaces',        priority: 'Medium', status: 'In-Progress', category: 'Bug',      assignee: 'Rahul Sharma', slaBreach: false, age: '1 day',   replies: 5, hasAttachment: true, desc: 'The ID card generator throws a blank PDF when clicking Print. Issue started after the last update on 8th Apr.' },
  { id: 'TKT-987', subject: 'Change email address of owner',      tenant: 'The Alexandria Modern', priority: 'Low',    status: 'Resolved',    category: 'Account',  assignee: 'Amit Verma',   slaBreach: false, age: '3 days',  replies: 3, hasAttachment: false, desc: 'Owner wants to update their registered email from old@alex.com to new@alex.com. Identity verified via phone OTP.' },
  { id: 'TKT-980', subject: 'Seats occupancy showing wrong count',tenant: 'Quiet Corner Lib',      priority: 'High',   status: 'Resolved',    category: 'Bug',      assignee: 'Rahul Sharma', slaBreach: false, age: '5 days',  replies: 7, hasAttachment: true, desc: 'Dashboard shows 42/40 seats occupied which is impossible. Likely a sync issue after manual seat deletion.' },
  { id: 'TKT-975', subject: 'Need help setting up biometric',     tenant: 'StudyNest Patna',       priority: 'Medium', status: 'Open',        category: 'Support',  assignee: 'Unassigned',   slaBreach: false, age: '2 hours', replies: 1, hasAttachment: false, desc: 'We bought the eSSL biometric device. Need assistance integrating it with Library OS.' },
];

type Ticket = typeof INITIAL_TICKETS[0];

function TicketPanel({ tkt, onClose, onSave }: { tkt: Ticket; onClose: () => void; onSave: (t: Ticket) => void }) {
  const [status, setStatus] = useState(tkt.status);
  const [assignee, setAssignee] = useState(tkt.assignee);
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const handleSendReply = () => {
    if(!replyText.trim()) return;
    setSaving(true);
    setTimeout(() => {
      onSave({ ...tkt, status: status === 'Open' ? 'In-Progress' : status, assignee: assignee === 'Unassigned' ? 'Me' : assignee });
      setSaving(false);
      setSaved(true);
      setTimeout(() => { setSaved(false); onClose(); }, 1000);
    }, 800);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Billing': return <CreditCard size={12} />;
      case 'Bug': return <Bug size={12} />;
      case 'Account': return <Lock size={12} />;
      default: return <HelpCircle size={12} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{tkt.id}</span>
              <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                tkt.status === 'Resolved' ? 'text-emerald-400 bg-emerald-500/10' : tkt.status === 'Open' ? 'text-rose-400 bg-rose-500/10' : 'text-amber-400 bg-amber-500/10'
              }`}>
                {tkt.status}
              </span>
              {tkt.slaBreach && <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full text-rose-500 bg-rose-500/10 animate-pulse"><Flag size={10}/> SLA BREACH</span>}
            </div>
            <h2 className="text-xl font-bold text-white">{tkt.subject}</h2>
            <div className="flex items-center gap-4 mt-2 text-xs text-white/50">
              <span className="flex items-center gap-1"><User size={12} /> {tkt.tenant}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> Opened {tkt.age} ago</span>
              <span className="flex items-center gap-1">{getCategoryIcon(tkt.category)} {tkt.category}</span>
            </div>
          </div>
          <button className="text-white/40 hover:text-white p-1 rounded hover:bg-white/5 transition-colors" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Quick Actions & Meta */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1">Assignee</p>
              <select className="bg-transparent text-sm text-white font-medium outline-none cursor-pointer w-full" value={assignee} onChange={e => setAssignee(e.target.value)}>
                <option value="Unassigned">Unassigned</option>
                <option value="Rahul Sharma">Rahul Sharma</option>
                <option value="Amit Verma">Amit Verma</option>
                <option value="Me">Assign to Me</option>
              </select>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1">Priority</p>
              <span className={`text-sm font-bold ${tkt.priority === 'High' ? 'text-rose-400' : tkt.priority === 'Medium' ? 'text-amber-400' : 'text-white/70'}`}>{tkt.priority}</span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1">Update Status</p>
              <select className="bg-transparent text-sm text-white font-medium outline-none cursor-pointer w-full" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="Open">Open</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Original Message */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
              <span className="text-indigo-400 font-bold text-sm">{tkt.tenant.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 text-sm text-white/80 leading-relaxed">
                {tkt.desc}
                {tkt.hasAttachment && (
                  <div className="mt-4 flex items-center gap-2 p-2 rounded-lg bg-black/20 border border-white/5 w-max cursor-pointer hover:bg-black/40">
                    <Paperclip size={14} className="text-indigo-400" />
                    <span className="text-xs text-indigo-400 font-medium">error_screenshot.png</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-white/40 mt-1.5 ml-1">{tkt.age} ago</p>
            </div>
          </div>

          {/* Thread (Mock) */}
          {tkt.replies > 1 && (
            <div className="flex gap-4 flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <span className="text-emerald-400 font-bold text-sm">S</span>
              </div>
              <div className="flex-1 flex flex-col items-end">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl rounded-tr-none p-4 text-sm text-white/90 leading-relaxed">
                  We are looking into this issue right now. Could you please confirm if this happens on mobile app as well?
                </div>
                <p className="text-xs text-white/40 mt-1.5 mr-1">Support Agent • {tkt.age} ago</p>
              </div>
            </div>
          )}

        </div>

        {/* Reply Box */}
        <div className="p-5 border-t border-white/5 bg-black/40">
          <div className="flex items-center gap-4 mb-3">
            <button 
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${!isInternalNote ? 'bg-indigo-500/20 text-indigo-400' : 'text-white/40 hover:text-white'}`}
              onClick={() => setIsInternalNote(false)}
            >
              Public Reply
            </button>
            <button 
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${isInternalNote ? 'bg-amber-500/20 text-amber-400' : 'text-white/40 hover:text-white'}`}
              onClick={() => setIsInternalNote(true)}
            >
              Internal Note (Hidden)
            </button>
          </div>
          
          <div className={`relative rounded-xl border ${isInternalNote ? 'border-amber-500/30 bg-amber-500/5' : 'border-indigo-500/30 bg-indigo-500/5'} p-1`}>
            <textarea 
              className="w-full bg-transparent text-sm text-white p-3 outline-none resize-none min-h-[100px]"
              placeholder={isInternalNote ? "Type a private note for other admins..." : "Type your reply to the tenant..."}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
            />
            <div className="flex items-center justify-between p-2">
              <button className="text-white/40 hover:text-white p-2 rounded hover:bg-white/5 transition-colors" title="Attach file"><Paperclip size={16} /></button>
              
              <button 
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg ${
                  isInternalNote ? 'bg-amber-500 hover:bg-amber-600 text-amber-950' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                } disabled:opacity-50`}
                onClick={handleSendReply}
                disabled={saving || saved || !replyText.trim()}
              >
                {saved ? <CheckCircle size={16} /> : saving ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                {saved ? 'Sent!' : saving ? 'Sending...' : isInternalNote ? 'Add Note' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [filter, setFilter]   = useState('All');
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [toast, setToast]     = useState('');
  const gridRef = useRef<AgGridReact>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleSave = (updated: Ticket) => {
    setTickets(t => t.map((x: any) => x.id === updated.id ? updated : x));
    showToast(`Ticket ${updated.id} updated successfully.`);
  };

  const filtered = filter === 'All' ? tickets : tickets.filter(t => t.status === filter);

  // KPI calculations
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const slaBreachCount = tickets.filter(t => t.slaBreach && t.status !== 'Resolved').length;
  const avgResponse = '1h 15m';

  const colDefs = useMemo<any[]>(() => [
    {
      headerName: 'Subject & ID', field: 'subject', flex: 2, minWidth: 250,
      cellRenderer: (p: ICellRendererParams<Ticket>) => (
        <div className="py-2">
          <p className="font-bold text-white leading-tight flex items-center gap-2">
            {p.data?.slaBreach && p.data?.status !== 'Resolved' && <AlertTriangle size={12} className="text-rose-500 animate-pulse" />}
            {p.data?.subject}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">{p.data?.id}</span>
            <span className="flex items-center gap-1 text-[11px] text-white/50"><Tag size={10} /> {p.data?.category}</span>
            {p.data?.hasAttachment && <span className="flex items-center gap-1 text-[11px] text-white/50"><Paperclip size={10} /></span>}
          </div>
        </div>
      ),
    },
    { 
      headerName: 'Tenant', field: 'tenant', flex: 1.5, minWidth: 150,
      cellRenderer: (p: ICellRendererParams<Ticket>) => (
        <div className="flex items-center gap-2 h-full">
          <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/70">
            {p.value.charAt(0)}
          </div>
          <span className="text-sm text-white/80 font-medium">{p.value}</span>
        </div>
      )
    },
    {
      headerName: 'Assignee', field: 'assignee', flex: 1, minWidth: 130,
      cellRenderer: (p: ICellRendererParams<Ticket>) => (
        <span className={`text-xs font-medium ${p.value === 'Unassigned' ? 'text-white/30 italic' : 'text-emerald-400'}`}>
          {p.value}
        </span>
      )
    },
    {
      headerName: 'Status', field: 'status', flex: 1, minWidth: 110,
      cellRenderer: (p: ICellRendererParams<Ticket>) => (
        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          p.value === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
          p.value === 'Open' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        }`}>
          {p.value}
        </span>
      ),
    },
    {
      headerName: 'Priority', field: 'priority', flex: 0.8, minWidth: 100,
      cellRenderer: (p: ICellRendererParams<Ticket>) => (
        <span className={`text-xs font-bold ${
          p.data?.priority === 'High' ? 'text-rose-400' : p.data?.priority === 'Medium' ? 'text-amber-400' : 'text-white/50'
        }`}>{p.value}</span>
      ),
    },
    {
      headerName: 'Age', field: 'age', flex: 0.8, minWidth: 100,
      cellRenderer: (p: ICellRendererParams<Ticket>) => (
        <span className="text-xs text-white/50">{p.value}</span>
      ),
    },
    {
      headerName: '', field: 'id', flex: 0.5, minWidth: 70, sortable: false, filter: false,
      cellRenderer: (p: ICellRendererParams<Ticket>) => (
        <button 
          className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-colors"
          onClick={e => { e.stopPropagation(); setSelected(p.data!); }}
          title="Open Ticket"
        >
          <MessageSquare size={14} />
        </button>
      ),
    },
  ], []);

  const onGridReady = useCallback((e: GridReadyEvent) => { e.api.sizeColumnsToFit(); }, []);

  return (
    <div className="sa-page-animate pb-10">
      {toast && (
        <div className="fixed bottom-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded shadow-lg animate-in slide-in-from-bottom-5 flex items-center gap-2 text-sm font-medium z-50">
          <CheckCircle size={16} /> {toast}
        </div>
      )}
      
      {selected && <TicketPanel tkt={selected} onClose={() => setSelected(null)} onSave={handleSave} />}

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Library OS</span><span>/</span><span>Super Admin</span><span>/</span><span>Support Helpdesk</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title">SaaS Support Helpdesk</h1>
          <button className="sa-btn-secondary" onClick={() => showToast('Exporting tickets to CSV...')}>
            <FileText size={16} className="text-secondary" /> Export Logs
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="sa-card relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-medium text-white/50 mb-1">Open Tickets</p>
              <h3 className="text-3xl font-bold text-white">{openCount}</h3>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10"><MessageSquare size={20} className="text-rose-400" /></div>
          </div>
        </div>
        
        <div className="sa-card relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-medium text-white/50 mb-1">SLA Breached</p>
              <h3 className="text-3xl font-bold text-white">{slaBreachCount}</h3>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10"><Flag size={20} className="text-amber-400" /></div>
          </div>
        </div>

        <div className="sa-card relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-medium text-white/50 mb-1">Avg Response Time</p>
              <h3 className="text-3xl font-bold text-white">{avgResponse}</h3>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10"><Clock size={20} className="text-indigo-400" /></div>
          </div>
        </div>
      </div>

      <div className="sa-card overflow-hidden p-0 border border-white/5 shadow-2xl">
        <div className="flex items-center gap-4 p-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex gap-2">
            {['All', 'Open', 'In-Progress', 'Resolved'].map((f: any) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  filter === f 
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}>
                {f}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs font-medium text-white/30">{filtered.length} matching tickets</span>
        </div>
        
        <div style={{ height: 480 }}>
          <AgGridReact
            ref={gridRef}
            theme={gridTheme}
            rowData={filtered}
            columnDefs={colDefs as any}
            rowHeight={72}
            headerHeight={48}
            onGridReady={onGridReady}
            onRowClicked={p => setSelected(p.data)}
            pagination={true}
            paginationPageSize={15}
            suppressCellFocus={true}
          />
        </div>
      </div>
    </div>
  );
}
