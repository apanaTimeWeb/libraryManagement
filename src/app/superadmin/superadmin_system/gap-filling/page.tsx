'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/superadmin/superadmin_system/reusable/Card';
import { Button } from '@/app/superadmin/superadmin_system/reusable/Button';
import { Input } from '@/app/superadmin/superadmin_system/reusable/Input';
import { Label } from '@/app/superadmin/superadmin_system/reusable/Label';
import { Badge } from '@/app/superadmin/superadmin_system/reusable/Badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/superadmin/superadmin_system/reusable/Select';
import { GitBranch, ChevronRight, Zap } from 'lucide-react';

const SEAT_GAPS = [
  { seat: 'S-03', booked: [{ start: 0, end: 25 }, { start: 70, end: 100 }], gap: { start: 25, end: 70,  label: '10AM – 2PM', hours: 4  } },
  { seat: 'S-07', booked: [{ start: 0, end: 45 }],                          gap: { start: 45, end: 100, label: '12PM – 6PM', hours: 6  } },
  { seat: 'S-12', booked: [{ start: 30, end: 60 }, { start: 80, end: 100 }],gap: { start: 60, end: 80,  label: '2PM – 4PM',  hours: 2  } },
  { seat: 'S-15', booked: [{ start: 0, end: 15 }],                          gap: { start: 15, end: 100, label: '8AM – 6PM',  hours: 10 } },
];

export default function GapFillingPage() {
  const [analyzed, setAnalyzed] = useState(false);
  const [fromDate, setFromDate] = useState('2026-04-11');
  const [toDate,   setToDate]   = useState('2026-04-18');
  const [shift,    setShift]    = useState('all');
  const [assigned, setAssigned] = useState<string[]>([]);

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium tracking-wide mb-1">
          <span>System</span><ChevronRight size={12} /><span>Gap Filling</span>
        </div>
        <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
          <GitBranch size={28} className="text-primary" />
          Gap Filling Algorithm
        </h1>
        <p className="text-on-surface-variant mt-1 text-sm">Visualize empty time slots and monetize unused seat capacity.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Analysis Controls</CardTitle>
          <CardDescription>Select a date range and shift to identify available seat gaps.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="gap-from-date">From Date</Label>
              <Input id="gap-from-date" type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-44" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gap-to-date">To Date</Label>
              <Input id="gap-to-date" type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-44" />
            </div>
            <div className="space-y-2 w-44">
              <Label htmlFor="gap-shift-select">Shift</Label>
              <Select value={shift} onValueChange={setShift}>
                <SelectTrigger id="gap-shift-select"><SelectValue placeholder="All shifts" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shifts</SelectItem>
                  <SelectItem value="morning">Morning (6AM–12PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12PM–6PM)</SelectItem>
                  <SelectItem value="evening">Evening (6PM–10PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button id="run-gap-analysis-btn" onClick={() => setAnalyzed(true)} variant="primary" size="md">
              🔍 Run Gap Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {analyzed ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-on-surface">Gap Analysis Results</h2>
            <Badge variant="primary">{SEAT_GAPS.length} seats analyzed</Badge>
          </div>
          {SEAT_GAPS.map((seat: any) => (
            <Card key={seat.seat}>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-14 shrink-0">
                    <span className="text-sm font-mono font-bold text-on-surface">{seat.seat}</span>
                  </div>
                  {/* Time bar — left/width are computed values, style is correct here */}
                  <div className="flex-1 relative h-8 rounded-lg overflow-hidden bg-surface-container-highest">
                    {seat.booked.map((b: any, i: number) => (
                      <div key={i} className="absolute top-0 h-full bg-primary/70 flex items-center justify-center"
                        style={{ left: `${b.start}%`, width: `${b.end - b.start}%` }}>
                        <span className="text-xs text-on-primary font-medium truncate px-1">Booked</span>
                      </div>
                    ))}
                    <div className="absolute top-0 h-full bg-tertiary/30 border border-dashed border-tertiary/60 flex items-center justify-center animate-pulse"
                      style={{ left: `${seat.gap.start}%`, width: `${seat.gap.end - seat.gap.start}%` }}>
                      <span className="text-xs text-tertiary font-medium truncate px-1">🕳️ Gap</span>
                    </div>
                  </div>
                  <div className="w-64 shrink-0 flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-on-surface">{seat.gap.label}</p>
                      <p className="text-xs text-on-surface-variant">💡 {seat.gap.hours}hrs available</p>
                    </div>
                    {assigned.includes(seat.seat) ? (
                      <Badge variant="success">✅ Assigned</Badge>
                    ) : (
                      <Button id={`quick-assign-${seat.seat}`} variant="secondary" size="sm"
                        onClick={() => setAssigned(p => [...p, seat.seat])}>
                        <Zap size={14} /> Quick Assign
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 flex flex-col items-center justify-center gap-3 text-center">
            <div className="text-5xl">🔍</div>
            <p className="text-on-surface font-medium">Run an analysis to see seat gaps</p>
            <p className="text-sm text-on-surface-variant">Select a date range and click "Run Gap Analysis" to visualize available slots.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
