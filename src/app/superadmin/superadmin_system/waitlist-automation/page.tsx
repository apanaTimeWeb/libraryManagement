'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/superadmin/superadmin_system/reusable/Card';
import { Button } from '@/app/superadmin/superadmin_system/reusable/Button';
import { Input } from '@/app/superadmin/superadmin_system/reusable/Input';
import { Label } from '@/app/superadmin/superadmin_system/reusable/Label';
import { Switch } from '@/app/superadmin/superadmin_system/reusable/Switch';
import { Textarea } from '@/app/superadmin/superadmin_system/reusable/Textarea';
import { Badge } from '@/app/superadmin/superadmin_system/reusable/Badge';
import { ListOrdered, ChevronRight } from 'lucide-react';

const QUEUE = [
  { name: 'Rahul Sharma', shift: 'Morning', position: 1, avatar: 'R', joined: '2026-04-08' },
  { name: 'Priya Verma', shift: 'Afternoon', position: 2, avatar: 'P', joined: '2026-04-09' },
  { name: 'Amit Kumar', shift: 'Evening', position: 3, avatar: 'A', joined: '2026-04-10' },
  { name: 'Sneha Patel', shift: 'Morning', position: 4, avatar: 'S', joined: '2026-04-10' },
  { name: 'Rohan Das', shift: 'Afternoon', position: 5, avatar: 'R', joined: '2026-04-11' },
];

export default function WaitlistAutomationPage() {
  const [enabled, setEnabled] = useState(true);
  const [delay, setDelay] = useState(0);
  const [template, setTemplate] = useState(
    'Hello {name}! 🎉 A seat (Shift: {shift}) is now available at Library OS. Reply YES to confirm your booking within 30 minutes. — Library OS Team'
  );

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium tracking-wide mb-1">
          <span>System</span>
          <ChevronRight size={12} />
          <span>Waitlist Automation</span>
        </div>
        <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
          <ListOrdered size={28} className="text-primary" />
          Waitlist Automation
        </h1>
        <p className="text-on-surface-variant mt-1 text-sm">Automatically notify the next student in queue when a seat becomes available.</p>
      </div>

      {/* Status Toggle Card */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-2xl ${enabled ? 'bg-green-500/15' : 'bg-surface-container-highest'}`}>
                📋
              </div>
              <div>
                <p className="text-base font-semibold text-on-surface">Waitlist Auto-Notification</p>
                <p className="text-sm text-on-surface-variant mt-0.5">
                  {enabled
                    ? 'When a seat becomes free, automatically WhatsApp the next student in queue.'
                    : 'Auto-notification is OFF. Students must be notified manually.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={enabled ? 'success' : 'outline'}>{enabled ? 'Active' : 'Inactive'}</Badge>
              <Switch id="waitlist-auto-toggle" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Config */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Notification Configuration</CardTitle>
          <CardDescription>Customize message template and notification timing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="waitlist-template">Notification Message Template</Label>
            <Textarea
              id="waitlist-template"
              rows={4}
              value={template}
              onChange={e => setTemplate(e.target.value)}
            />
            <p className="text-xs text-on-surface-variant">Available variables: <code className="text-primary">{'{name}'}</code>, <code className="text-primary">{'{shift}'}</code>, <code className="text-primary">{'{seat}'}</code></p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="waitlist-delay">Notification Delay</Label>
            <div className="flex items-center gap-3">
              <Input
                id="waitlist-delay"
                type="number"
                value={delay}
                onChange={e => setDelay(+e.target.value)}
                className="w-28"
                min={0}
              />
              <span className="text-sm text-on-surface-variant">minutes after seat becomes available</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button id="save-waitlist-config-btn" variant="primary">💾 Save Config</Button>
        </CardFooter>
      </Card>

      {/* Queue Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Waitlist Queue</CardTitle>
          <CardDescription>First 5 students awaiting seat assignment.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {QUEUE.map((student: any) => (
              <div
                key={student.position}
                className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-high border border-outline-variant/50 hover:border-outline-variant transition-colors"
              >
                {/* Position */}
                <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                  #{student.position}
                </div>
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary font-bold text-sm shrink-0">
                  {student.avatar}
                </div>
                {/* Info */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-on-surface">{student.name}</p>
                  <p className="text-xs text-on-surface-variant">Joined waitlist: {student.joined}</p>
                </div>
                <Badge variant="outline">{student.shift}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
