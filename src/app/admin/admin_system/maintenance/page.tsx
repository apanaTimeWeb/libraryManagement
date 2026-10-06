'use client';
// RESPONSIBILITY: Entry page for the admin_system module.
// DATA FLOW: Next.js Router -> Page -> Components

import { KpiCard } from '../admin_system_components/AdminSystemKpiCard/AdminSystemKpiCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../admin_system_components/AdminSystemCard/AdminSystemCard';
import { Badge } from '../admin_system_components/AdminSystemBadge/AdminSystemBadge';
import { Button } from '../admin_system_components/AdminSystemButton/AdminSystemButton';
import { Wrench, Package, Lock, ChevronRight } from 'lucide-react';

const SEATS = [
  { id: 'S-01', status: 'Needs Attention', lastMaint: '2026-01-12', daysSince: 89 },
  { id: 'S-07', status: 'OK', lastMaint: '2026-03-20', daysSince: 22 },
  { id: 'S-14', status: 'Needs Attention', lastMaint: '2025-12-31', daysSince: 101 },
  { id: 'S-22', status: 'OK', lastMaint: '2026-04-01', daysSince: 10 },
];

const ASSETS = [
  { name: 'AC Unit - Zone A', qty: 1, status: 'Overdue', lastServiced: '2025-11-15', nextDue: '2026-02-15', daysOverdue: 55 },
  { name: 'Ceiling Fan (Batch)', qty: 8, status: 'Due Soon', lastServiced: '2026-02-01', nextDue: '2026-04-20', daysOverdue: -9 },
  { name: 'CCTV System', qty: 4, status: 'OK', lastServiced: '2026-03-10', nextDue: '2026-06-10', daysOverdue: -60 },
];

const LOCKERS = [
  { id: 'L-03', status: 'Issue Reported', lastIssue: 'Lock jammed — 2026-04-08' },
  { id: 'L-11', status: 'OK', lastIssue: 'None' },
  { id: 'L-19', status: 'Issue Reported', lastIssue: 'Door hinge broken — 2026-04-06' },
];

export default function MaintenancePage() {
  const seatsNeedingAttention = SEATS.filter(s => s.status === 'Needs Attention').length;
  const assetsOverdue = ASSETS.filter(a => a.daysOverdue > 0).length;
  const lockerIssues = LOCKERS.filter(l => l.status === 'Issue Reported').length;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium tracking-wide mb-1">
          <span>System</span>
          <ChevronRight size={12} />
          <span>Maintenance</span>
        </div>
        <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
          <Wrench size={28} className="text-primary" />
          Maintenance Dashboard
        </h1>
        <p className="text-on-surface-variant mt-1 text-sm">Track and manage maintenance for seats, assets, and lockers.</p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KpiCard title="Seats Needing Attention" value={seatsNeedingAttention} icon="🪑" trend="down" trendLabel="Action required" />
        <KpiCard title="Assets Overdue" value={assetsOverdue} icon="⚙️" trend="down" trendLabel="Service overdue" />
        <KpiCard title="Locker Issues" value={lockerIssues} icon="🔒" trend="down" trendLabel="Reported issues" />
      </div>

      {/* Section 1 — Seats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wrench size={18} className="text-primary" /> Seats</CardTitle>
          <CardDescription>Seat maintenance status and last service log.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant text-xs uppercase tracking-wide">
                  <th className="text-left py-3 pr-4">Seat #</th>
                  <th className="text-left py-3 pr-4">Status</th>
                  <th className="text-left py-3 pr-4">Last Maintenance</th>
                  <th className="text-left py-3 pr-4">Days Since</th>
                  <th className="text-left py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {SEATS.map(seat => (
                  <tr key={seat.id} className="hover:bg-surface-container-high transition-colors">
                    <td className="py-3 pr-4 font-mono font-medium text-on-surface">{seat.id}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={seat.status === 'OK' ? 'success' : 'danger'}>{seat.status}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-on-surface-variant">{seat.lastMaint}</td>
                    <td className="py-3 pr-4">
                      <span className={seat.daysSince > 30 ? 'text-error font-semibold' : 'text-on-surface-variant'}>
                        {seat.daysSince}d
                      </span>
                    </td>
                    <td className="py-3">
                      <Button id={`log-seat-maint-${seat.id}`} variant="ghost" size="sm">🔧 Log Maintenance</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Section 2 — Assets */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Package size={18} className="text-primary" /> Assets</CardTitle>
          <CardDescription>Equipment and inventory maintenance tracking.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant text-xs uppercase tracking-wide">
                  <th className="text-left py-3 pr-4">Asset</th>
                  <th className="text-center py-3 pr-4">Qty</th>
                  <th className="text-left py-3 pr-4">Status</th>
                  <th className="text-left py-3 pr-4">Last Serviced</th>
                  <th className="text-left py-3 pr-4">Next Due</th>
                  <th className="text-left py-3 pr-4">Days Overdue</th>
                  <th className="text-left py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {ASSETS.map(asset => (
                  <tr key={asset.name} className="hover:bg-surface-container-high transition-colors">
                    <td className="py-3 pr-4 font-medium text-on-surface">{asset.name}</td>
                    <td className="py-3 pr-4 text-center text-on-surface-variant">{asset.qty}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={asset.status === 'OK' ? 'success' : asset.status === 'Due Soon' ? 'warning' : 'danger'}>
                        {asset.status}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-on-surface-variant">{asset.lastServiced}</td>
                    <td className="py-3 pr-4 text-on-surface-variant">{asset.nextDue}</td>
                    <td className="py-3 pr-4">
                      {asset.daysOverdue > 0 ? (
                        <Badge variant="danger">+{asset.daysOverdue}d overdue</Badge>
                      ) : (
                        <span className="text-on-surface-variant text-xs">{Math.abs(asset.daysOverdue)}d left</span>
                      )}
                    </td>
                    <td className="py-3">
                      <Button id={`log-asset-service-${asset.name}`} variant="ghost" size="sm">📝 Log Service</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Section 3 — Lockers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock size={18} className="text-primary" /> Lockers</CardTitle>
          <CardDescription>Locker issue reports and status updates.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant text-xs uppercase tracking-wide">
                  <th className="text-left py-3 pr-4">Locker #</th>
                  <th className="text-left py-3 pr-4">Status</th>
                  <th className="text-left py-3 pr-4">Last Reported Issue</th>
                  <th className="text-left py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {LOCKERS.map(locker => (
                  <tr key={locker.id} className="hover:bg-surface-container-high transition-colors">
                    <td className="py-3 pr-4 font-mono font-medium text-on-surface">{locker.id}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={locker.status === 'OK' ? 'success' : 'danger'}>{locker.status}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-on-surface-variant">{locker.lastIssue}</td>
                    <td className="py-3">
                      <Button id={`update-locker-${locker.id}`} variant="ghost" size="sm">✏️ Update Status</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
