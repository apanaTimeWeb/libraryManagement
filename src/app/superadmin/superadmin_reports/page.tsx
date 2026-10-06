'use client';
import { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { 
  IndianRupee, TrendingUp, TrendingDown, Download, Building2, 
  Activity, Calendar, Filter, Eye
} from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '@/app/superadmin/superadmin_reusable/gridTheme';

ModuleRegistry.registerModules([AllCommunityModule]);

const REVENUE_DATA = [
  { month: 'Nov', MRR: 120000, Target: 100000 },
  { month: 'Dec', MRR: 145000, Target: 110000 },
  { month: 'Jan', MRR: 135000, Target: 120000 },
  { month: 'Feb', MRR: 175000, Target: 130000 },
  { month: 'Mar', MRR: 210000, Target: 145000 },
  { month: 'Apr', MRR: 245000, Target: 160000 },
];

const TENANT_GROWTH = [
  { month: 'Nov', Active: 12, Churned: 1 },
  { month: 'Dec', Active: 15, Churned: 0 },
  { month: 'Jan', Active: 14, Churned: 2 },
  { month: 'Feb', Active: 22, Churned: 1 },
  { month: 'Mar', Active: 28, Churned: 0 },
  { month: 'Apr', Active: 35, Churned: 1 },
];

const PLAN_DISTRIBUTION = [
  { name: 'Basic Plan', value: 45, color: 'var(--info)' },
  { name: 'Pro Plan', value: 35, color: 'var(--primary)' },
  { name: 'Enterprise', value: 20, color: 'var(--warning)' },
];

const TOP_TENANTS = [
  { id: 'LIB-001', name: 'Central City Library', plan: 'Enterprise', mrr: 25000, students: 1200, status: 'Active' },
  { id: 'LIB-042', name: 'Westside Study Center', plan: 'Pro Plan', mrr: 15000, students: 800, status: 'Active' },
  { id: 'LIB-018', name: 'Downtown Reading Room', plan: 'Pro Plan', mrr: 12000, students: 650, status: 'Active' },
  { id: 'LIB-007', name: 'Suburban Community Library', plan: 'Basic Plan', mrr: 5000, students: 250, status: 'Active' },
  { id: 'LIB-025', name: 'East End Study Space', plan: 'Basic Plan', mrr: 4500, students: 200, status: 'Churn Risk' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-3 rounded-lg shadow-xl">
        <p className="text-white font-bold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            {entry.name}: <span className="font-bold">{entry.name.includes('MRR') || entry.name.includes('Target') ? `₹${entry.value.toLocaleString()}` : entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ReportsAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('Financials');
  const [dateRange, setDateRange] = useState('Last 6 Months');

  const KPI_CARDS = [
    { label: 'Monthly Recurring Revenue', value: '₹2,45,000', icon: IndianRupee, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', trend: '+16.6%', up: true },
    { label: 'Annual Run Rate (ARR)', value: '₹29,40,000', icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', trend: 'Projected', up: true },
    { label: 'Active SaaS Tenants', value: '35', icon: Building2, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20', trend: '+7 new', up: true },
    { label: 'Gross Churn Rate', value: '2.8%', icon: TrendingDown, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', trend: '-0.5%', up: true },
  ];

  const colDefs: any[] = useMemo(() => [
    { field: 'id', headerName: 'Library ID', flex: 1, cellClass: 'text-white/60' },
    { field: 'name', headerName: 'Library Name', flex: 2, cellClass: 'text-white font-medium' },
    { field: 'plan', headerName: 'Current Plan', flex: 1, 
      cellRenderer: (p: any) => {
        const colors: any = { 'Enterprise': 'sa-badge--warning', 'Pro Plan': 'sa-badge--primary', 'Basic Plan': 'sa-badge--info' };
        return <span className={`sa-badge ${colors[p.value]}`}>{p.value}</span>;
      }
    },
    { field: 'mrr', headerName: 'MRR (₹)', flex: 1, cellClass: 'text-emerald-400 font-bold', valueFormatter: (p: any) => `₹${p.value.toLocaleString()}` },
    { field: 'students', headerName: 'Students', flex: 1, cellClass: 'text-sky-400' },
    { field: 'status', headerName: 'Status', flex: 1, 
      cellRenderer: (p: any) => (
        <span className={`flex items-center gap-1.5 ${p.value === 'Active' ? 'text-emerald-400' : 'text-rose-400'}`}>
          <div className={`w-2 h-2 rounded-full ${p.value === 'Active' ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`} />
          {p.value}
        </span>
      )
    },
    { headerName: 'Action', flex: 1, sortable: false, filter: false,
      cellRenderer: () => (
        <button type="button" className="sa-btn-ghost sa-btn-ghost--sm text-primary">
          <Eye size={14} className="mr-1 inline" /> View
        </button>
      )
    }
  ], []);

  return (
    <div className="sa-page-animate pb-12">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <div className="sa-breadcrumb">
            <span>Library OS</span><span>/</span><span>Super Admin</span><span>/</span><span>Reports & Analytics</span>
          </div>
          <h1 className="sa-page-title flex items-center gap-3 mt-2">
            <Activity className="text-primary" size={28} /> Global SaaS Analytics
          </h1>
          <p className="text-sm text-white/50">Comprehensive overview of platform revenue and tenant growth.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
            <select 
              className="sa-input pl-9 text-sm"
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
            >
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>
          <button className="sa-btn-primary shrink-0 group shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" /> <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {KPI_CARDS.map((kpi, i) => (
          <div key={i} className="sa-card p-5 border border-white/10 bg-white/[0.02] hover:-translate-y-1 transition-transform group cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${kpi.bg} border ${kpi.border} group-hover:scale-110 transition-transform`}>
                <kpi.icon size={22} className={kpi.color} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${kpi.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {kpi.up ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} {kpi.trend}
              </span>
            </div>
            <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-1">{kpi.label}</p>
            <h3 className="text-2xl md:text-3xl font-black text-white">{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="sa-card p-0 mb-8 border border-white/5 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b border-white/5 overflow-x-auto hide-scrollbar bg-black/20">
          {[
            { name: 'Financials', icon: IndianRupee, color: 'text-emerald-400' },
            { name: 'Tenant Growth', icon: Building2, color: 'text-sky-400' },
            { name: 'Subscription Mix', icon: PieChart, color: 'text-purple-400' }
          ].map((tab) => (
            <button
              key={tab.name}
              type="button"
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.name 
                  ? 'bg-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
                  : 'text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              <tab.icon size={16} className={activeTab === tab.name ? 'text-white' : tab.color} /> {tab.name}
            </button>
          ))}
        </div>

        <div className="p-6 h-[400px]">
          {activeTab === 'Financials' && (
            <div className="h-full flex flex-col animate-fade-in">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white">MRR Growth ({dateRange})</h2>
                  <p className="text-sm text-white/50">Actual Monthly Recurring Revenue vs Target Goal.</p>
                </div>
                <button type="button" className="sa-btn-secondary sa-btn-secondary--sm"><Filter size={14}/> Filter</button>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                    <Area type="monotone" dataKey="MRR" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorMRR)" />
                    <Line type="monotone" dataKey="Target" stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'Tenant Growth' && (
            <div className="h-full flex flex-col animate-fade-in">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white">Active Tenants vs Churn</h2>
                  <p className="text-sm text-white/50">Number of live libraries using the platform and those that cancelled.</p>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={TENANT_GROWTH} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                    <Bar dataKey="Active" fill="var(--success)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="Churned" fill="var(--danger)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'Subscription Mix' && (
            <div className="h-full flex flex-col animate-fade-in">
              <div className="mb-2">
                <h2 className="text-lg font-bold text-white">Subscription Distribution</h2>
                <p className="text-sm text-white/50">Breakdown of tenants by pricing tier.</p>
              </div>
              <div className="flex-1 min-h-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PLAN_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {PLAN_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Table Section */}
      <div className="sa-card p-6 border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Top Performing Tenants</h2>
            <p className="text-sm text-white/50">Detailed breakdown of top contributors by MRR.</p>
          </div>
          <button type="button" className="sa-btn-ghost text-sm font-bold text-primary">View All Tenants</button>
        </div>
        
        <div className="h-[350px] w-full">
          <AgGridReact
            theme={gridTheme}
            rowData={TOP_TENANTS}
            columnDefs={colDefs}
            headerHeight={48}
            rowHeight={56}
            suppressCellFocus
          />
        </div>
      </div>

    </div>
  );
}
