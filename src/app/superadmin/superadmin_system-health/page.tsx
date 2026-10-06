'use client';
import { useState, useEffect } from 'react';
import { 
  Database, Server, Globe, RefreshCw, Activity, ShieldCheck, Cpu, HardDrive, Wifi, 
  MessageCircle, CreditCard, Cloud, Zap, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, AlertTriangle 
} from 'lucide-react';

export default function SystemHealthPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState('Just now');
  const [uptime, setUptime] = useState(99.99);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefresh(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setUptime(prev => prev > 99.90 ? 99.98 : 99.99); // simulate slight fluctuation
    }, 1500);
  };

  const INFRA_NODES = [
    { name: 'App Server (ap-south-1a)', type: 'Compute', usage: 45, status: 'Healthy', ping: '12ms' },
    { name: 'App Server (ap-south-1b)', type: 'Compute', usage: 68, status: 'Healthy', ping: '14ms' },
    { name: 'Worker Node (Background Jobs)', type: 'Compute', usage: 92, status: 'Warning', ping: '45ms' },
  ];

  const DATABASE_NODES = [
    { name: 'PostgreSQL Primary Cluster', type: 'Database', metric: 'Connections', val: '840 / 1000', pct: 84, status: 'Healthy' },
    { name: 'Redis Cache Layer', type: 'Cache', metric: 'Hit Rate', val: '98.5%', pct: 98, status: 'Healthy' },
    { name: 'Block Storage (S3 Volume)', type: 'Storage', metric: 'Capacity', val: '4.2TB / 5TB', pct: 84, status: 'Healthy' },
  ];

  const THIRD_PARTY_APIS = [
    { name: 'Razorpay Payment Gateway', icon: CreditCard, status: 'Operational', latency: '120ms', uptime: '100%' },
    { name: 'WhatsApp Cloud API (Meta)', icon: MessageCircle, status: 'Operational', latency: '45ms', uptime: '99.99%' },
    { name: 'AWS S3 (Backups & Assets)', icon: Cloud, status: 'Operational', latency: '22ms', uptime: '100%' },
    { name: 'SendGrid Email Service', icon: Globe, status: 'Degraded', latency: '450ms', uptime: '98.5%' },
  ];

  const CRON_JOBS = [
    { name: 'Daily DB Snapshot Backup', schedule: 'At 02:00 AM', lastRun: '4 hours ago', duration: '14m 32s', status: 'Success' },
    { name: 'Subscription Auto-Renewal', schedule: 'At 12:00 AM', lastRun: '6 hours ago', duration: '45s', status: 'Success' },
    { name: 'Stale Sessions Cleanup', schedule: 'Every 1 Hour', lastRun: '15 mins ago', duration: '1.2s', status: 'Success' },
    { name: 'Overdue Invoice Reminders', schedule: 'At 09:00 AM', lastRun: 'Pending', duration: '-', status: 'Pending' },
  ];

  return (
    <div className="sa-page-animate pb-12">
      
      {/* Header */}
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Library OS</span><span>/</span><span>Super Admin</span><span>/</span><span>System Health</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title flex items-center gap-3">
            <Activity className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" size={28} /> System Health & Telemetry
          </h1>
          <button className="sa-btn-secondary" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={16} className={`text-emerald-400 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Polling Sensors...' : `Last Ping: ${lastRefresh}`}
          </button>
        </div>
      </div>

      {/* Main Global Status Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8 flex items-center justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <ShieldCheck size={32} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-400">All Systems Operational</h2>
            <p className="text-sm text-emerald-200/60 mt-1">Library OS Core, APIs, and Databases are running smoothly.</p>
          </div>
        </div>
        <div className="text-right relative z-10">
          <p className="text-sm font-semibold text-emerald-200/50 uppercase tracking-wider mb-1">Global Uptime (30 Days)</p>
          <div className="text-4xl font-extrabold text-white tracking-tight">{uptime}%</div>
        </div>
      </div>

      {/* Network Traffic & Load Mini KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Current RPS', val: '1,240', unit: 'req/s', icon: Zap, color: 'text-amber-400', trend: '+12%' },
          { label: 'Average Latency', val: '45', unit: 'ms', icon: Clock, color: 'text-indigo-400', trend: '-2ms' },
          { label: 'Error Rate (5xx)', val: '0.01', unit: '%', icon: AlertTriangle, color: 'text-rose-400', trend: 'Stable' },
          { label: 'Active WebSockets', val: '8,432', unit: 'conns', icon: Wifi, color: 'text-sky-400', trend: '+450' },
        ].map((kpi, i) => (
          <div key={i} className="sa-card p-5 border border-white/5 bg-white/[0.02]">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-white/5 ${kpi.color}`}><kpi.icon size={20} /></div>
              <span className="text-[10px] font-bold px-2 py-1 bg-white/5 text-white/50 rounded-full">{kpi.trend}</span>
            </div>
            <p className="text-xs text-white/50 font-medium uppercase tracking-wider mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-bold text-white">{kpi.val} <span className="text-sm text-white/30 font-normal">{kpi.unit}</span></h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Core Infrastructure */}
        <div className="sa-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Server size={20} className="text-indigo-400" /> Compute Infrastructure
            </h2>
            <span className="text-xs text-white/40">AWS Mumbai Region</span>
          </div>
          
          <div className="space-y-5 flex-1">
            {INFRA_NODES.map((node, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu size={14} className="text-white/40" />
                    <p className="text-sm font-bold text-white">{node.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-white/30">{node.ping} ping</span>
                    <span className={`text-xs font-bold ${node.usage > 85 ? 'text-amber-400' : 'text-emerald-400'}`}>{node.usage}% CPU</span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${node.usage > 85 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}
                    style={{ width: `${node.usage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Database & Storage */}
        <div className="sa-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database size={20} className="text-sky-400" /> Database & Storage
            </h2>
            <span className="text-xs text-white/40">Replication: Active</span>
          </div>
          
          <div className="space-y-5 flex-1">
            {DATABASE_NODES.map((node, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive size={14} className="text-white/40" />
                    <p className="text-sm font-bold text-white">{node.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/50">{node.metric}:</span>
                    <span className="text-xs font-bold text-sky-400">{node.val}</span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)] transition-all duration-1000"
                    style={{ width: `${node.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Third Party Integrations */}
        <div className="sa-card p-6 border-white/5">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Globe size={20} className="text-rose-400" /> API Integrations & Webhooks
          </h2>
          
          <div className="grid gap-3">
            {THIRD_PARTY_APIS.map((api, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-white/5 text-white/50">
                    <api.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white/90">{api.name}</h4>
                    <p className="text-xs text-white/40 mt-0.5">Uptime: {api.uptime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-1.5 justify-end text-[11px] font-bold uppercase ${api.status === 'Operational' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {api.status === 'Operational' ? <CheckCircle size={12}/> : <AlertTriangle size={12}/>}
                    {api.status}
                  </div>
                  <p className="text-[10px] font-mono text-white/30 mt-1">{api.latency} ping</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Cron Jobs */}
        <div className="sa-card p-6 border-white/5">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <RefreshCw size={20} className="text-amber-400" /> Background Tasks (Cron)
          </h2>
          
          <div className="grid gap-3">
            {CRON_JOBS.map((job, i) => (
              <div key={i} className="flex flex-col justify-center p-3 rounded-xl bg-black/20 border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-white/90">{job.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    job.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-white/40 flex items-center gap-1"><Clock size={12}/> {job.schedule}</span>
                  <span className="text-white/40">Last run: <strong className="text-white/70">{job.lastRun}</strong></span>
                  <span className="text-white/40">Took: <strong className="text-white/70">{job.duration}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
