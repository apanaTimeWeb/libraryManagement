'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/superadmin/superadmin_system/reusable/Card';
import { Button } from '@/app/superadmin/superadmin_system/reusable/Button';
import { Input } from '@/app/superadmin/superadmin_system/reusable/Input';
import { Label } from '@/app/superadmin/superadmin_system/reusable/Label';
import { Switch } from '@/app/superadmin/superadmin_system/reusable/Switch';
import { Badge } from '@/app/superadmin/superadmin_system/reusable/Badge';
import { Progress } from '@/app/superadmin/superadmin_system/reusable/Progress';
import { Zap, ChevronRight } from 'lucide-react';

const ZONES = [
  { name: 'Zone A (Ground Floor)', occupancy: 78, capacity: 40, current: 31 },
  { name: 'Zone B (First Floor)', occupancy: 22, capacity: 35, current: 8 },
  { name: 'Zone C (Reading Hall)', occupancy: 91, capacity: 60, current: 55 },
  { name: 'Zone D (Silent Room)', occupancy: 15, capacity: 20, current: 3 },
];

const ALERT_LOG = [
  { date: '2026-04-10', shift: 'Evening', zone: 'Zone B', threshold: '30%', action: 'Advisory sent to manager' },
  { date: '2026-04-09', shift: 'Afternoon', zone: 'Zone D', threshold: '30%', action: 'AC shutdown suggested' },
  { date: '2026-04-07', shift: 'Morning', zone: 'Zone B', threshold: '30%', action: 'Advisory sent to manager' },
];

export default function PowerSavingPage() {
  const [threshold, setThreshold] = useState(30);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const getZoneStatus = (occ: number) => {
    if (occ < threshold) return { label: '⚡ Low — Consolidation Suggested', variant: 'warning' as const };
    return { label: '✅ Normal', variant: 'success' as const };
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium tracking-wide mb-1">
          <span>System</span>
          <ChevronRight size={12} />
          <span>Power Saving</span>
        </div>
        <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
          <Zap size={28} className="text-primary" />
          Power Saving Mode
        </h1>
        <p className="text-on-surface-variant mt-1 text-sm">Optimize energy usage based on real-time zone occupancy.</p>
      </div>

      {/* Config Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Set the occupancy threshold below which consolidation is suggested.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="power-threshold">Occupancy Threshold (%)</Label>
            <div className="flex items-center gap-3">
              <Input
                id="power-threshold"
                type="number"
                value={threshold}
                onChange={e => setThreshold(+e.target.value)}
                className="w-28"
                min={5}
                max={95}
              />
              <span className="text-sm text-on-surface-variant">
                If shift occupancy drops below <strong className="text-on-surface">{threshold}%</strong>, suggest consolidation.
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-high border border-outline-variant">
            <div>
              <p className="text-sm font-medium text-on-surface">Enable Power Saving Alerts</p>
              <p className="text-xs text-on-surface-variant">Send alerts when zones fall below threshold</p>
            </div>
            <Switch id="power-saving-toggle" checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
          </div>
        </CardContent>
        <CardFooter>
          <Button id="save-power-config-btn" variant="primary">💾 Save Configuration</Button>
        </CardFooter>
      </Card>

      {/* Zone Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {ZONES.map((zone: any) => {
          const status = getZoneStatus(zone.occupancy);
          const isLow = zone.occupancy < threshold;
          return (
            <Card key={zone.name} className={isLow ? 'border-tertiary/30' : ''}>
              <CardContent>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{zone.name}</p>
                    <p className="text-xs text-on-surface-variant">{zone.current} / {zone.capacity} seats occupied</p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-on-surface-variant">
                    <span>Occupancy</span>
                    <span className={isLow ? 'text-tertiary font-semibold' : 'text-green-400 font-semibold'}>{zone.occupancy}%</span>
                  </div>
                  <Progress value={zone.occupancy} barClassName={isLow ? 'bg-tertiary' : 'bg-green-500'} />
                </div>
                {isLow && (
                  <div className="mt-3 p-2.5 rounded-lg bg-tertiary/10 border border-tertiary/20 text-xs text-tertiary">
                    💡 Suggested: Move students to Zone A → Turn off {zone.name} AC
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alert Log */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Log</CardTitle>
          <CardDescription>History of power saving threshold breaches and actions taken.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant text-xs uppercase tracking-wide">
                  <th className="text-left py-3 pr-4">Date</th>
                  <th className="text-left py-3 pr-4">Shift</th>
                  <th className="text-left py-3 pr-4">Zone</th>
                  <th className="text-left py-3 pr-4">Threshold Breached</th>
                  <th className="text-left py-3">Action Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {ALERT_LOG.map((log: any) => (
                  <tr key={log.date + log.zone} className="hover:bg-surface-container-high transition-colors">
                    <td className="py-3 pr-4 text-on-surface-variant">{log.date}</td>
                    <td className="py-3 pr-4 text-on-surface">{log.shift}</td>
                    <td className="py-3 pr-4 text-on-surface">{log.zone}</td>
                    <td className="py-3 pr-4"><Badge variant="warning">&lt; {log.threshold}</Badge></td>
                    <td className="py-3 text-on-surface-variant">{log.action}</td>
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
