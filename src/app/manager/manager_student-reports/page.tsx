'use client';

import { useEffect, useState } from 'react';
import { Users, CalendarCheck, UserPlus, Phone } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import { fetchApi } from '@/lib/api';

const COLORS = ['var(--chart-indigo)', 'var(--chart-green)', 'var(--chart-amber)', 'var(--chart-red)', 'var(--chart-blue)'];
const iconMap: Record<string, React.ElementType> = { Users, CalendarCheck, UserPlus, Phone };

const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: 12,
    color: 'var(--text-primary)',
  },
};

export default function StudentReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('This Month');

  useEffect(() => {
    fetchApi(`/manager/manager_student-reports?range=${encodeURIComponent(dateRange)}`)
      .then(res => { setData(res); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [dateRange]);

  if (loading) return <div className="mgr-page"><div style={{ padding: 20 }}>Loading...</div></div>;
  if (!data)   return <div className="mgr-page"><div style={{ padding: 20 }}>Failed to load reports</div></div>;

  return (
    <div className="mgr-page">
      <div className="mgr-page-header">
        <div>
          <p className="mgr-breadcrumb">Manager › Student Reports</p>
          <h1 className="mgr-page-title">Student Reports</h1>
          <p className="mgr-page-subtitle">Operational overview (finance reports blocked)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <select className="mgr-select" value={dateRange} onChange={e => setDateRange(e.target.value)}>
          <option>This Week</option>
          <option>This Month</option>
          <option>Last 30 Days</option>
        </select>
        <select className="mgr-select" disabled>
          <option>Main Branch (read-only)</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {data.kpiCards?.map((kpi: any) => {
          const Icon = iconMap[kpi.icon];
          return (
            <div key={kpi.title} className="mgr-kpi-card">
              <div className="mgr-kpi-card-header">
                <div className="mgr-kpi-card-icon" style={{ backgroundColor: `${kpi.color}20` }}>
                  {Icon && <Icon size={20} style={{ color: kpi.color }} />}
                </div>
                <span className="mgr-kpi-card-label">{kpi.title}</span>
              </div>
              <div className="mgr-kpi-card-value">{kpi.value}</div>
              {kpi.trend && <div className="mgr-kpi-card-trend">{kpi.trend}</div>}
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="mgr-charts-grid">

        <div className="mgr-card">
          <h3 className="font-semibold mb-4">Shift-wise Occupancy</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.shiftOccupancyData} cx="50%" cy="50%" labelLine={false}
                outerRadius={80} dataKey="occupancy" nameKey="name"
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {data.shiftOccupancyData?.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`, 'Occupancy']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mgr-card">
          <h3 className="font-semibold mb-4">Student Growth Trend (Last 30 days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.studentGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend />
              <Line type="monotone" dataKey="joined" name="Joined" stroke="var(--success)" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="exited" name="Exited" stroke="var(--danger)"  strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mgr-card">
          <h3 className="font-semibold mb-4">Daily Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.attendanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="attendance" name="Attendance %" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mgr-card">
          <h3 className="font-semibold mb-4">Top Absentees (Top 5 students)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart layout="vertical" data={data.topAbsenteesData}
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" stroke="var(--text-secondary)" />
              <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" width={80} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="absent" name="Absent Days" fill="var(--danger)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mgr-card col-span-2">
          <h3 className="font-semibold mb-4">Complaints Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.complaintStatusData} cx="50%" cy="50%"
                innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" nameKey="name"
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {data.complaintStatusData?.map((_: any, i: number) => (
                  <Cell key={i} fill={i === 0 ? 'var(--danger)' : 'var(--success)'} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} formatter={(v, n) => [`${v} tickets`, n]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

        <div className="mgr-card">
          <h3 className="font-semibold mb-4">Absentee Report</h3>
          <table className="mgr-table">
            <thead><tr className="mgr-table-header">
              <th className="mgr-table-th">Name</th>
              <th className="mgr-table-th">Absent Days</th>
              <th className="mgr-table-th">Last Present</th>
            </tr></thead>
            <tbody>
              {data.absenteeReportData?.map((r: any) => (
                <tr key={r.id} className="mgr-table-row">
                  <td className="mgr-table-td">{r.name}</td>
                  <td className="mgr-table-td">{r.absentDays}</td>
                  <td className="mgr-table-td">{r.lastPresent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mgr-card">
          <h3 className="font-semibold mb-4">Enquiry Conversion Rate</h3>
          <table className="mgr-table">
            <thead><tr className="mgr-table-header">
              <th className="mgr-table-th">Month</th>
              <th className="mgr-table-th">New</th>
              <th className="mgr-table-th">Converted</th>
              <th className="mgr-table-th">Rate</th>
            </tr></thead>
            <tbody>
              {data.enquiryConversionData?.map((r: any) => (
                <tr key={r.id} className="mgr-table-row">
                  <td className="mgr-table-td">{r.month}</td>
                  <td className="mgr-table-td">{r.new}</td>
                  <td className="mgr-table-td">{r.converted}</td>
                  <td className="mgr-table-td">{Math.round((r.converted / r.new) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mgr-card">
          <h3 className="font-semibold mb-4">Seat Utilization Report (per shift)</h3>
          <table className="mgr-table">
            <thead><tr className="mgr-table-header">
              <th className="mgr-table-th">Shift</th>
              <th className="mgr-table-th">Utilization %</th>
              <th className="mgr-table-th">Occupancy</th>
            </tr></thead>
            <tbody>
              {data.seatUtilizationData?.map((r: any) => (
                <tr key={r.id} className="mgr-table-row">
                  <td className="mgr-table-td">{r.shift}</td>
                  <td className="mgr-table-td">{r.utilization}%</td>
                  <td className="mgr-table-td">{r.occupancy}/{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mgr-card">
          <h3 className="font-semibold mb-4">Locker Utilization Report</h3>
          <table className="mgr-table">
            <thead><tr className="mgr-table-header">
              <th className="mgr-table-th">Type</th>
              <th className="mgr-table-th">Utilization %</th>
              <th className="mgr-table-th">Available</th>
            </tr></thead>
            <tbody>
              {data.lockerUtilizationData?.map((r: any) => (
                <tr key={r.id} className="mgr-table-row">
                  <td className="mgr-table-td">{r.type}</td>
                  <td className="mgr-table-td">{r.utilization}%</td>
                  <td className="mgr-table-td">{r.available}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mgr-card lg:col-span-2">
          <h3 className="font-semibold mb-4">Pending Maintenance (Assets & Seats)</h3>
          <table className="mgr-table">
            <thead><tr className="mgr-table-header">
              <th className="mgr-table-th">Item</th>
              <th className="mgr-table-th">Issue</th>
              <th className="mgr-table-th">Reported</th>
              <th className="mgr-table-th">Status</th>
            </tr></thead>
            <tbody>
              {data.maintenanceData?.map((r: any) => (
                <tr key={r.id} className="mgr-table-row">
                  <td className="mgr-table-td">{r.item}</td>
                  <td className="mgr-table-td">{r.issue}</td>
                  <td className="mgr-table-td">{r.reported}</td>
                  <td className="mgr-table-td">
                    <span className={`mgr-badge ${
                      r.status === 'Pending' ? 'mgr-badge--warning' :
                      r.status === 'Resolved' ? 'mgr-badge--success' : 'mgr-badge--info'
                    }`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
