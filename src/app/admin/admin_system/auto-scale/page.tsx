'use client';
// RESPONSIBILITY: Entry page for the admin_system module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';
import { KpiCard } from '../admin_system_components/AdminSystemKpiCard/AdminSystemKpiCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../admin_system_components/AdminSystemCard/AdminSystemCard';
import { Button } from '../admin_system_components/AdminSystemButton/AdminSystemButton';
import { Input } from '../admin_system_components/AdminSystemInput/AdminSystemInput';
import { Label } from '../admin_system_components/AdminSystemLabel/AdminSystemLabel';
import { Switch } from '../admin_system_components/AdminSystemSwitch/AdminSystemSwitch';
import { Badge } from '../admin_system_components/AdminSystemBadge/AdminSystemBadge';
import { BarChart3, ChevronRight, Zap, ArrowRight } from 'lucide-react';

export default function AutoScalePage() {
  const [seatThreshold, setSeatThreshold] = useState(90);
  const [lockerThreshold, setLockerThreshold] = useState(85);
  const [alertEnabled, setAlertEnabled] = useState(true);

  const seatOccupancy = 94;
  const lockerOccupancy = 38;

  const getSeatRecommendation = () => {
    if (seatOccupancy > seatThreshold)
      return { color: 'danger', msg: `🔴 System suggests adding more seats. Current utilization: ${seatOccupancy}%`, action: '➕ Add Seats', link: '/seat-management' };
    if (seatOccupancy < 40)
      return { color: 'warning', msg: `🟡 Low occupancy detected. Consider Power Saving mode.`, action: '⚡ Power Saving →', link: '/system/power-saving' };
    return { color: 'success', msg: `🟢 Seat occupancy is healthy at ${seatOccupancy}%.`, action: null, link: null };
  };

  const getLockerRecommendation = () => {
    if (lockerOccupancy < 40)
      return { color: 'warning', msg: `🟡 Lockers have low usage (${lockerOccupancy}%). Consider offering locker promotions.`, action: null, link: null };
    if (lockerOccupancy > lockerThreshold)
      return { color: 'danger', msg: `🔴 Locker capacity near limit. Consider adding locker units.`, action: '➕ Manage Lockers', link: '/locker-matrix' };
    return { color: 'success', msg: `🟢 Locker utilization looks good at ${lockerOccupancy}%.`, action: null, link: null };
  };

  const seatRec = getSeatRecommendation();
  const lockerRec = getLockerRecommendation();

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium tracking-wide mb-1">
          <span>System</span>
          <ChevronRight size={12} />
          <span>Auto-Scale</span>
        </div>
        <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
          <BarChart3 size={28} className="text-primary" />
          Auto-Scale Intelligence
        </h1>
        <p className="text-on-surface-variant mt-1 text-sm">Smart capacity monitoring with automated recommendations for scaling your library.</p>
      </div>

      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <KpiCard title="Total Seats" value={120} icon="🪑" subtitle="Across all zones" />
        <KpiCard title="Total Lockers" value={60} icon="🔒" subtitle="All branches" />
        <KpiCard title="Avg Occupancy (30d)" value="68%" icon="📈" trend="up" trendLabel="+4% vs last month" />
        <KpiCard title="Peak Day" value="Apr 8" icon="🏆" subtitle="94% occupancy" />
      </div>

      {/* Threshold Config */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Alert Thresholds</CardTitle>
          <CardDescription>Configure occupancy levels that trigger scaling recommendations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="seat-alert-threshold">Seat Alert Threshold (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="seat-alert-threshold"
                  type="number"
                  value={seatThreshold}
                  onChange={e => setSeatThreshold(+e.target.value)}
                  min={50}
                  max={99}
                  className="w-28"
                />
                <span className="text-sm text-on-surface-variant">e.g., "90" → alert at 90% full</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="locker-alert-threshold">Locker Alert Threshold (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="locker-alert-threshold"
                  type="number"
                  value={lockerThreshold}
                  onChange={e => setLockerThreshold(+e.target.value)}
                  min={50}
                  max={99}
                  className="w-28"
                />
                <span className="text-sm text-on-surface-variant">e.g., "85" → alert at 85% full</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-high border border-outline-variant">
            <div>
              <p className="text-sm font-medium text-on-surface">Alert me when occupancy exceeds threshold</p>
              <p className="text-xs text-on-surface-variant">Receive in-app notifications and dashboard badges</p>
            </div>
            <Switch id="auto-scale-alert-toggle" checked={alertEnabled} onCheckedChange={setAlertEnabled} />
          </div>
        </CardContent>
        <CardFooter>
          <Button id="save-autoscale-thresholds-btn" variant="primary">💾 Save Thresholds</Button>
        </CardFooter>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap size={18} className="text-primary" />
            Smart Recommendations
          </CardTitle>
          <CardDescription>AI-driven suggestions based on current occupancy data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Seat Recommendation */}
          <div className={`p-4 rounded-xl border ${
            seatRec.color === 'danger' ? 'bg-error-container/10 border-error/20' :
            seatRec.color === 'warning' ? 'bg-tertiary/10 border-tertiary/20' :
            'bg-green-500/10 border-green-500/20'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Badge variant={seatRec.color === 'danger' ? 'danger' : seatRec.color === 'warning' ? 'warning' : 'success'}>
                  Seats
                </Badge>
                <p className="text-sm text-on-surface">{seatRec.msg}</p>
              </div>
              {seatRec.action && (
                <Button id="seat-rec-action-btn" variant="secondary" size="sm">
                  {seatRec.action} <ArrowRight size={14} />
                </Button>
              )}
            </div>
          </div>

          {/* Locker Recommendation */}
          <div className={`p-4 rounded-xl border ${
            lockerRec.color === 'danger' ? 'bg-error-container/10 border-error/20' :
            lockerRec.color === 'warning' ? 'bg-tertiary/10 border-tertiary/20' :
            'bg-green-500/10 border-green-500/20'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Badge variant={lockerRec.color === 'danger' ? 'danger' : lockerRec.color === 'warning' ? 'warning' : 'success'}>
                  Lockers
                </Badge>
                <p className="text-sm text-on-surface">{lockerRec.msg}</p>
              </div>
              {lockerRec.action && (
                <Button id="locker-rec-action-btn" variant="secondary" size="sm">
                  {lockerRec.action} <ArrowRight size={14} />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
