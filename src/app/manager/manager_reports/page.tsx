'use client';

import { useMemo, useEffect, useState } from 'react';
import { Users, CalendarCheck, UserPlus, Phone } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line,
} from 'recharts';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '../manager_reusable/gridTheme';
import { fetchApi } from '@/lib/api';

ModuleRegistry.registerModules([AllCommunityModule]);

const PIE_OCCUPANCY  = ['var(--chart-indigo)', 'var(--chart-green)', 'var(--chart-amber)', 'var(--chart-red)'];
const PIE_COMPLAINTS = ['var(--chart-red)', 'var(--chart-green)'];

const TOOLTIP_STYLE = {
  contentStyle: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '12px',
    color: 'var(--text-primary)',
  },
  labelStyle: { color: 'var(--text-secondary)' },
};
const AXIS_TICK = { fill: 'var(--text-secondary)', fontSize: 11 } as const;

const iconMap: Record<string, React.ElementType> = { Users, CalendarCheck, UserPlus, Phone };

function SmartIdCell({ value }: { value: string }) {
  return <span className="mgr-table-id">{value}</span>;
}
function ShiftBadgeCell({ value }: { value: string }) {
  return <span className="mgr-badge mgr-badge--info">{value}</span>;
}
function ShiftPrimaryCell({ value }: { value: string }) {
  return <span className="mgr-badge mgr-badge--primary">{value}</span>;
}
function DaysAbsentCell({ value }: { value: number }) {
  return <span className="mgr-text-danger">{value}</span>;
}
function LastPresentCell({ value }: { value: string }) {
  return <span className="mgr-text-secondary">{value}</span>;
}
function RateCell({ value }: { value: string }) {
  return <span className="mgr-text-success">{value}</span>;
}
function PctCell({ value }: { value: string }) {
  return <span className="mgr-text-success">{value}</span>;
}
function SecondaryCell({ value }: { value: string }) {
  return <span className="mgr-text-secondary">{value}</span>;
}
function PriorityCell({ value }: { value: string }) {
  const cls = value === 'High' ? 'mgr-badge--danger' : value === 'Medium' ? 'mgr-badge--warning' : 'mgr-badge--info';
  return <span className={`mgr-badge ${cls}`}>{value}</span>;
}

export default function ManagerReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('This Month');

  useEffect(() => {
    fetchApi(`/manager/manager_reports?range=${encodeURIComponent(dateRange)}`)
      .then(res => { setData(res); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [dateRange]);

  const absenteeCols = useMemo<any[]>(() => [
    { field: 'name',        headerName: 'NAME',         flex: 2, sortable: true },
    { field: 'smartId',     headerName: 'SMART ID',     flex: 1, cellRenderer: SmartIdCell },
    { field: 'shift',       headerName: 'SHIFT',        flex: 1, sortable: true, cellRenderer: ShiftBadgeCell },
    { field: 'daysAbsent',  headerName: 'ABSENT DAYS',  flex: 1, sortable: true, cellRenderer: DaysAbsentCell },
    { field: 'lastPresent', headerName: 'LAST PRESENT', flex: 1, cellRenderer: LastPresentCell },
  ], []);

  const conversionCols = useMemo<any[]>(() => [
    { field: 'month',     headerName: 'MONTH',         flex: 1, sortable: true },
    { field: 'newEnq',    headerName: 'NEW ENQUIRIES', flex: 1, sortable: true },
    { field: 'converted', headerName: 'CONVERTED',     flex: 1, sortable: true },
    { field: 'rate',      headerName: 'RATE',          flex: 1, cellRenderer: RateCell },
  ], []);

  const seatCols = useMemo<any[]>(() => [
    { field: 'shift',       headerName: 'SHIFT',        flex: 1, sortable: true, cellRenderer: ShiftPrimaryCell },
    { field: 'occupancy',   headerName: 'OCCUPANCY',    flex: 1, sortable: true },
    { field: 'avgDuration', headerName: 'AVG DURATION', flex: 1, cellRenderer: SecondaryCell },
  ], []);

  const lockerCols = useMemo<any[]>(() => [
    { field: 'type',     headerName: 'TYPE',     flex: 1, sortable: true },
    { field: 'occupied', headerName: 'OCCUPIED', flex: 1, sortable: true },
    { field: 'total',    headerName: 'TOTAL',    flex: 1 },
    { field: 'pct',      headerName: '%',        flex: 1, cellRenderer: PctCell },
  ], []);

  const maintenanceCols = useMemo<any[]>(() => [
    { field: 'item',     headerName: 'ITEM',     flex: 2, sortable: true },
    { field: 'location', headerName: 'LOCATION', flex: 2, cellRenderer: SecondaryCell },
    { field: 'reported', headerName: 'REPORTED', flex: 1, cellRenderer: SecondaryCell },
    { field: 'priority', headerName: 'PRIORITY', flex: 1, sortable: true, cellRenderer: PriorityCell },
  ], []);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!data)   return <div style={{ padding: 20 }}>Failed to load reports</div>;

  return (
    <div>
      <div className="mgr-page-header">
        <div>
          <p className="mgr-breadcrumb">Manager › Reports</p>
          <h1 className="mgr-page-title">Reports</h1>
          <p className="mgr-page-subtitle">Operational overview — finance reports blocked</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mgr-report-filters">
        <div className="mgr-filter-item">
          <label className="mgr-label">Date Range</label>
          <select className="mgr-select" value={dateRange} onChange={e => setDateRange(e.target.value)}>
            <option>This Week</option>
            <option>This Month</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        <div className="mgr-filter-item">
          <label className="mgr-label">Branch</label>
          <select className="mgr-select" disabled>
            <option>Main Branch (read-only)</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mgr-kpi-grid mgr-section-gap">
        {data.kpiCards?.map((kpi: any) => {
          const Icon = iconMap[kpi.icon];
          return (
            <div key={kpi.title} className="mgr-kpi-card">
              <div className="mgr-kpi-top-row">
                <div className={`mgr-kpi-icon ${kpi.iconClass}`}>{Icon && <Icon size={18} />}</div>
                {kpi.trend && <span className="mgr-trend-up">{kpi.trend}</span>}
              </div>
              <div>
                <p className="mgr-kpi-label">{kpi.title}</p>
                <p className="mgr-kpi-value">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts 2×2 */}
      <div className="mgr-chart-grid mgr-section-gap">

        <div className="mgr-chart-card">
          <h3 className="mgr-chart-title">Shift-wise Occupancy</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.occupancyData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                labelLine={false} label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {data.occupancyData?.map((_: any, i: number) => <Cell key={i} fill={PIE_OCCUPANCY[i % PIE_OCCUPANCY.length]} />)}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mgr-chart-card">
          <h3 className="mgr-chart-title">Student Growth Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.growthData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid stroke="var(--chart-grid-line)" />
              <XAxis dataKey="date" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="joined" stroke="var(--chart-indigo)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="exited"  stroke="var(--chart-red)"   strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mgr-chart-card">
          <h3 className="mgr-chart-title">Daily Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.attendanceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid stroke="var(--chart-grid-line)" />
              <XAxis dataKey="day" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="avg" fill="var(--chart-green)" name="Attendance %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mgr-chart-card">
          <h3 className="mgr-chart-title">Top Absentees (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.absenteesChartData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
              <CartesianGrid stroke="var(--chart-grid-line)" horizontal={false} />
              <XAxis type="number" tick={AXIS_TICK} />
              <YAxis dataKey="name" type="category" tick={AXIS_TICK} width={80} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="absences" fill="var(--chart-red)" name="Days Absent" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mgr-chart-card mgr-chart-full">
          <h3 className="mgr-chart-title">Complaints Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={data.complaintsData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                dataKey="value" labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {data.complaintsData?.map((_: any, i: number) => <Cell key={i} fill={PIE_COMPLAINTS[i % PIE_COMPLAINTS.length]} />)}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
      <div className="mgr-reports-table-grid">

        <div className="mgr-card">
          <div className="mgr-card-header"><h3 className="mgr-section-title">Absentee Report</h3></div>
          <div style={{ height: 280 }}>
            <AgGridReact theme={gridTheme} rowData={data.absenteeRows || []} columnDefs={absenteeCols}
              rowHeight={48} headerHeight={38} suppressMovableColumns suppressCellFocus
              defaultColDef={{ resizable: false }} />
          </div>
        </div>

        <div className="mgr-card">
          <div className="mgr-card-header"><h3 className="mgr-section-title">Enquiry Conversion Rate</h3></div>
          <div style={{ height: 280 }}>
            <AgGridReact theme={gridTheme} rowData={data.conversionRows || []} columnDefs={conversionCols}
              rowHeight={48} headerHeight={38} suppressMovableColumns suppressCellFocus
              defaultColDef={{ resizable: false }} />
          </div>
        </div>

        <div className="mgr-card">
          <div className="mgr-card-header"><h3 className="mgr-section-title">Seat Utilization Report</h3></div>
          <div style={{ height: 260 }}>
            <AgGridReact theme={gridTheme} rowData={data.seatRows || []} columnDefs={seatCols}
              rowHeight={48} headerHeight={38} suppressMovableColumns suppressCellFocus
              defaultColDef={{ resizable: false }} />
          </div>
        </div>

        <div className="mgr-card">
          <div className="mgr-card-header"><h3 className="mgr-section-title">Locker Utilization Report</h3></div>
          <div style={{ height: 228 }}>
            <AgGridReact theme={gridTheme} rowData={data.lockerRows || []} columnDefs={lockerCols}
              rowHeight={48} headerHeight={38} suppressMovableColumns suppressCellFocus
              defaultColDef={{ resizable: false }} />
          </div>
        </div>

        <div className="mgr-card mgr-reports-table-full">
          <div className="mgr-card-header"><h3 className="mgr-section-title">Pending Maintenance</h3></div>
          <div style={{ height: 260 }}>
            <AgGridReact theme={gridTheme} rowData={data.maintenanceRows || []} columnDefs={maintenanceCols}
              rowHeight={48} headerHeight={38} suppressMovableColumns suppressCellFocus
              defaultColDef={{ resizable: false }} />
          </div>
        </div>

      </div>
    </div>
  );
}
