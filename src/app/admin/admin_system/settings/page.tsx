'use client';
// RESPONSIBILITY: Entry page for the admin_system module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../admin_system_components/AdminSystemCard/AdminSystemCard';
import { Button } from '../admin_system_components/AdminSystemButton/AdminSystemButton';
import { Input } from '../admin_system_components/AdminSystemInput/AdminSystemInput';
import { Label } from '../admin_system_components/AdminSystemLabel/AdminSystemLabel';
import { Switch } from '../admin_system_components/AdminSystemSwitch/AdminSystemSwitch';
import {
  Settings, Palette, AlertCircle, Zap, CreditCard, Bell, Globe,
  Upload, Eye, EyeOff, Save, ChevronRight
} from 'lucide-react';

const CATEGORIES = [
  { id: 'branding',     label: 'Branding',         icon: Palette     },
  { id: 'late-fee',     label: 'Late Fee Rules',    icon: AlertCircle },
  { id: 'auto-suspend', label: 'Auto-Suspend Rules',icon: Zap         },
  { id: 'upi',          label: 'UPI / Payment',     icon: CreditCard  },
  { id: 'notifications',label: 'Notifications',     icon: Bell        },
  { id: 'general',      label: 'General',           icon: Globe       },
];

function readToken(token: string) {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

export default function SettingsPage() {
  const [active, setActive] = useState('branding');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    appName: 'Library OS',
    primaryColor: '',
    secondaryColor: '',
    gracePeriod: 5,
    penaltyPerDay: 50,
    enableLateFees: true,
    daysBefore: 10,
    enableAutoSuspend: true,
    enableAutoRestore: true,
    upiId: 'owner@upi',
    acceptCash: true,
    acceptUpi: true,
    acceptCard: false,
    acceptBank: false,
    apiKey: 'sk_live_********************',
  });

  /* Read color defaults from system.css tokens — no hardcoded hex in TSX */
  useEffect(() => {
    setForm(f => ({
      ...f,
      primaryColor:   readToken('--branding-primary-default'),
      secondaryColor: readToken('--branding-accent-default'),
    }));
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium tracking-wide mb-1">
          <span>System</span>
          <ChevronRight size={12} />
          <span>Settings</span>
        </div>
        <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
          <Settings size={28} className="text-primary" />
          Settings
        </h1>
        <p className="text-on-surface-variant mt-1 text-sm">Manage your library configuration and preferences.</p>
      </div>

      <div className="flex gap-6">
        {/* Left sidebar nav */}
        <aside className="w-52 shrink-0">
          <nav className="flex flex-col gap-1">
            {CATEGORIES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                id={`settings-nav-${id}`}
                onClick={() => setActive(id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 text-left ${
                  active === id
                    ? 'bg-primary/15 text-primary border border-primary/20'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right panel */}
        <div className="flex-1">
          {active === 'branding' && (
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>Customize how your library appears to users.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="logo-upload">Logo</Label>
                  <div
                    id="logo-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded-xl p-8 cursor-pointer hover:bg-surface-container-high transition-colors group"
                  >
                    <Upload size={24} className="text-on-surface-variant group-hover:text-primary transition-colors mb-2" />
                    <span className="text-sm text-on-surface-variant">Drop logo here or <span className="text-primary">browse</span></span>
                    <span className="text-xs text-on-surface-variant/60 mt-1">PNG, JPG up to 2MB</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-name">App Name</Label>
                  <Input id="app-name" value={form.appName} onChange={e => setForm(f => ({ ...f, appName: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" id="primary-color" value={form.primaryColor} onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))} className="h-10 w-12 rounded-lg border border-outline-variant bg-transparent cursor-pointer" />
                      <Input value={form.primaryColor} onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))} className="font-mono text-xs" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" id="secondary-color" value={form.secondaryColor} onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))} className="h-10 w-12 rounded-lg border border-outline-variant bg-transparent cursor-pointer" />
                      <Input value={form.secondaryColor} onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))} className="font-mono text-xs" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button id="save-branding-btn" onClick={handleSave} variant="primary">
                  <Save size={16} /> {saved ? '✓ Saved!' : '💾 Save Settings'}
                </Button>
              </CardFooter>
            </Card>
          )}

          {active === 'late-fee' && (
            <Card>
              <CardHeader>
                <CardTitle>Late Fee Rules</CardTitle>
                <CardDescription>Define penalty rules for overdue payments.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-high border border-outline-variant">
                  <div>
                    <p className="text-sm font-medium text-on-surface">Enable Late Fees</p>
                    <p className="text-xs text-on-surface-variant">Automatically apply penalties after due date</p>
                  </div>
                  <Switch id="enable-late-fees" checked={form.enableLateFees} onCheckedChange={v => setForm(f => ({ ...f, enableLateFees: v }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grace-period">Grace Period</Label>
                    <div className="flex items-center gap-2">
                      <Input id="grace-period" type="number" value={form.gracePeriod} onChange={e => setForm(f => ({ ...f, gracePeriod: +e.target.value }))} />
                      <span className="text-sm text-on-surface-variant whitespace-nowrap">days</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="penalty-per-day">Penalty Per Day</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-on-surface-variant">₹</span>
                      <Input id="penalty-per-day" type="number" value={form.penaltyPerDay} onChange={e => setForm(f => ({ ...f, penaltyPerDay: +e.target.value }))} />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button id="save-latefee-btn" onClick={handleSave} variant="primary">
                  <Save size={16} /> {saved ? '✓ Saved!' : '💾 Save Settings'}
                </Button>
              </CardFooter>
            </Card>
          )}

          {active === 'auto-suspend' && (
            <Card>
              <CardHeader>
                <CardTitle>Auto-Suspend Rules</CardTitle>
                <CardDescription>Configure automatic seat suspension for defaulters.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-high border border-outline-variant">
                  <div>
                    <p className="text-sm font-medium text-on-surface">Enable Auto-Suspend</p>
                    <p className="text-xs text-on-surface-variant">Suspend seats after payment overdue</p>
                  </div>
                  <Switch id="enable-auto-suspend" checked={form.enableAutoSuspend} onCheckedChange={v => setForm(f => ({ ...f, enableAutoSuspend: v }))} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-high border border-outline-variant">
                  <div>
                    <p className="text-sm font-medium text-on-surface">Auto-Restore on Payment</p>
                    <p className="text-xs text-on-surface-variant">Automatically restore when payment is received</p>
                  </div>
                  <Switch id="enable-auto-restore" checked={form.enableAutoRestore} onCheckedChange={v => setForm(f => ({ ...f, enableAutoRestore: v }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="days-before-suspend">Days Before Suspend</Label>
                  <div className="flex items-center gap-2">
                    <Input id="days-before-suspend" type="number" value={form.daysBefore} onChange={e => setForm(f => ({ ...f, daysBefore: +e.target.value }))} className="max-w-[120px]" />
                    <span className="text-sm text-on-surface-variant">days after due date</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button id="save-autosuspend-btn" onClick={handleSave} variant="primary">
                  <Save size={16} /> {saved ? '✓ Saved!' : '💾 Save Settings'}
                </Button>
              </CardFooter>
            </Card>
          )}

          {active === 'upi' && (
            <Card>
              <CardHeader>
                <CardTitle>UPI / Payment</CardTitle>
                <CardDescription>Configure payment methods accepted at your library.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="upi-qr">UPI QR Code</Label>
                  <div id="upi-qr" className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded-xl p-8 cursor-pointer hover:bg-surface-container-high transition-colors">
                    <Upload size={24} className="text-on-surface-variant mb-2" />
                    <span className="text-sm text-on-surface-variant">Upload QR Code image</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upi-id">UPI ID</Label>
                  <Input id="upi-id" placeholder="owner@upi" value={form.upiId} onChange={e => setForm(f => ({ ...f, upiId: e.target.value }))} />
                </div>
                <div className="space-y-3">
                  <Label>Accepted Payment Modes</Label>
                  {[
                    { key: 'acceptCash', label: '💵 Cash' },
                    { key: 'acceptUpi', label: '📱 UPI' },
                    { key: 'acceptCard', label: '💳 Card' },
                    { key: 'acceptBank', label: '🏦 Bank Transfer' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        id={`payment-${key}`}
                        checked={form[key as keyof typeof form] as boolean}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                        className="h-4 w-4 rounded border-outline-variant bg-surface-container-high accent-primary"
                      />
                      <span className="text-sm text-on-surface">{label}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button id="save-upi-btn" onClick={handleSave} variant="primary">
                  <Save size={16} /> {saved ? '✓ Saved!' : '💾 Save Settings'}
                </Button>
              </CardFooter>
            </Card>
          )}

          {active === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure SMS / WhatsApp API for automated alerts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="api-key">SMS / WhatsApp API Key</Label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type={showApiKey ? 'text' : 'password'}
                      value={form.apiKey}
                      onChange={e => setForm(f => ({ ...f, apiKey: e.target.value }))}
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <Button id="test-connection-btn" variant="ghost">🔌 Test Connection</Button>
              </CardContent>
              <CardFooter>
                <Button id="save-notifications-btn" onClick={handleSave} variant="primary">
                  <Save size={16} /> {saved ? '✓ Saved!' : '💾 Save Settings'}
                </Button>
              </CardFooter>
            </Card>
          )}

          {active === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>Basic library configuration.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="library-name">Library Name</Label>
                  <Input id="library-name" defaultValue="Library OS" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="library-timezone">Timezone</Label>
                  <Input id="library-timezone" defaultValue="Asia/Kolkata (IST)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="library-currency">Currency</Label>
                  <Input id="library-currency" defaultValue="INR (₹)" />
                </div>
              </CardContent>
              <CardFooter>
                <Button id="save-general-btn" onClick={handleSave} variant="primary">
                  <Save size={16} /> {saved ? '✓ Saved!' : '💾 Save Settings'}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
