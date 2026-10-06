'use client';
// RESPONSIBILITY: Entry page for the admin_system module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../admin_system_components/AdminSystemCard/AdminSystemCard';
import { Button } from '../admin_system_components/AdminSystemButton/AdminSystemButton';
import { Badge } from '../admin_system_components/AdminSystemBadge/AdminSystemBadge';
import { Input } from '../admin_system_components/AdminSystemInput/AdminSystemInput';
import { Label } from '../admin_system_components/AdminSystemLabel/AdminSystemLabel';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../admin_system_components/AdminSystemSelect/AdminSystemSelect';
import { KpiCard } from '../admin_system_components/AdminSystemKpiCard/AdminSystemKpiCard';
import {
  MessageSquare, ChevronRight, Eye, EyeOff, Copy, CheckCircle,
  XCircle, Phone, Zap, BarChart3, Clock, Loader2
} from 'lucide-react';

const PROVIDERS = [
  { id: 'twilio',   label: 'Twilio',   logo: '🔵', requiresSecret: true  },
  { id: 'wati',     label: 'Wati',     logo: '🟢', requiresSecret: false },
  { id: 'aisensy',  label: 'AiSensy',  logo: '🟣', requiresSecret: false },
  { id: 'custom',   label: 'Custom',   logo: '⚙️', requiresSecret: true  },
];

interface MessageLog {
  id: string;
  to: string;
  type: string;
  status: 'delivered' | 'failed' | 'pending';
  sentAt: string;
  template: string;
}

const MESSAGE_LOGS: MessageLog[] = [
  { id: 'wl-001', to: '98****2310', type: 'Fee Receipt',      status: 'delivered', sentAt: '2026-04-12 10:45 AM', template: 'receipt_confirmation' },
  { id: 'wl-002', to: '97****8810', type: 'Renewal Reminder', status: 'delivered', sentAt: '2026-04-12 09:30 AM', template: 'renewal_alert' },
  { id: 'wl-003', to: '89****1230', type: 'Welcome Message',  status: 'delivered', sentAt: '2026-04-11 06:01 PM', template: 'welcome_new_student' },
  { id: 'wl-004', to: '73****5670', type: 'Fee Reminder',     status: 'failed',    sentAt: '2026-04-11 02:00 PM', template: 'fee_due_reminder' },
  { id: 'wl-005', to: '91****4430', type: 'Seat Vacancy',     status: 'delivered', sentAt: '2026-04-10 11:00 AM', template: 'waitlist_notify' },
  { id: 'wl-006', to: '98****0010', type: 'Fee Receipt',      status: 'delivered', sentAt: '2026-04-10 09:15 AM', template: 'receipt_confirmation' },
];

const STATUS_CFG = {
  delivered: { variant: 'success' as const, icon: CheckCircle },
  failed:    { variant: 'danger'  as const, icon: XCircle     },
  pending:   { variant: 'warning' as const, icon: Clock       },
};

type TestStatus = 'idle' | 'testing' | 'success' | 'error';

export default function WhatsAppIntegrationPage() {
  const [provider,    setProvider]    = useState('wati');
  const [apiKey,      setApiKey]      = useState('sk_live_wt_********************');
  const [apiSecret,   setApiSecret]   = useState('');
  const [senderPhone, setSenderPhone] = useState('+91 9000000000');
  const [showApiKey,  setShowApiKey]  = useState(false);
  const [showSecret,  setShowSecret]  = useState(false);
  const [testStatus,  setTestStatus]  = useState<TestStatus>('idle');
  const [copiedUrl,   setCopiedUrl]   = useState(false);

  const webhookUrl = 'https://api.smartlibrary360.com/webhooks/whatsapp/inbound';

  const selectedProvider = PROVIDERS.find(p => p.id === provider)!;

  const deliveredCount = MESSAGE_LOGS.filter(l => l.status === 'delivered').length;
  const failedCount    = MESSAGE_LOGS.filter(l => l.status === 'failed').length;
  const pendingCount   = MESSAGE_LOGS.filter(l => l.status === 'pending').length;
  const deliveryRate   = Math.round((deliveredCount / MESSAGE_LOGS.length) * 100);

  const handleTestConnection = () => {
    setTestStatus('testing');
    setTimeout(() => {
      setTestStatus(Math.random() > 0.2 ? 'success' : 'error');
    }, 2000);
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl).catch(() => {});
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium tracking-wide mb-1">
          <span>System</span><ChevronRight size={12} /><span>WhatsApp Integration</span>
        </div>
        <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
          <MessageSquare size={28} className="text-primary" />
          WhatsApp Integration
        </h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Connect a WhatsApp Business API provider to send automated receipts, reminders, and alerts.
        </p>
      </div>

      {/* Connection Status Banner */}
      <div className={`flex items-center gap-4 p-4 rounded-2xl border mb-8 ${
        testStatus === 'success'
          ? 'bg-green-500/10 border-green-500/25'
          : testStatus === 'error'
          ? 'bg-error-container/10 border-error/20'
          : 'bg-surface-container border-outline-variant'
      }`}>
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl ${
          testStatus === 'success' ? 'bg-green-500/20' :
          testStatus === 'error'  ? 'bg-error-container/30' :
          'bg-surface-container-high'
        }`}>
          {testStatus === 'success' ? '✅' : testStatus === 'error' ? '❌' : '📡'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <p className="text-base font-semibold text-on-surface">
              {testStatus === 'success' ? 'WhatsApp Connected'  :
               testStatus === 'error'  ? 'Connection Failed'   :
               testStatus === 'testing'? 'Testing connection...' :
               'WhatsApp Not Tested'}
            </p>
            <Badge variant={testStatus === 'success' ? 'success' : testStatus === 'error' ? 'danger' : 'outline'}>
              {testStatus === 'success' ? 'Connected' : testStatus === 'error' ? 'Disconnected' : 'Unknown'}
            </Badge>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {testStatus === 'success'
              ? `Provider: ${selectedProvider.label} · Test message sent to ${senderPhone}`
              : testStatus === 'error'
              ? 'Check your API key and try again. Ensure the number is registered on WhatsApp Business.'
              : 'Click "Test Connection" to verify your WhatsApp setup.'}
          </p>
        </div>
        {testStatus !== 'testing' && (
          <p className="text-xs text-on-surface-variant">
            {testStatus === 'success' ? 'Last tested: just now' : ''}
          </p>
        )}
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <KpiCard title="Sent This Month"  value={MESSAGE_LOGS.length} icon="📤"  subtitle="All messages"      />
        <KpiCard title="Delivered"        value={deliveredCount}      icon="✅"  trend="up" trendLabel={`${deliveryRate}% rate`} />
        <KpiCard title="Failed"           value={failedCount}         icon="❌"  trend={failedCount > 0 ? 'down' : 'neutral'} trendLabel="Failed deliveries" />
        <KpiCard title="Est. Cost"        value="₹18.50"              icon="💸"  subtitle="~₹0.18 per msg"   />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Integration Config Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap size={18} className="text-primary" /> API Configuration
            </CardTitle>
            <CardDescription>Connect your WhatsApp Business API provider.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Provider selector */}
            <div className="space-y-2">
              <Label>API Provider</Label>
              <div className="grid grid-cols-2 gap-2">
                {PROVIDERS.map(p => (
                  <button
                    key={p.id}
                    id={`provider-${p.id}`}
                    onClick={() => setProvider(p.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                      provider === p.id
                        ? 'border-primary/40 bg-primary/10 text-primary'
                        : 'border-outline-variant hover:border-primary/25 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="text-xl">{p.logo}</span>
                    <span className="text-sm font-semibold">{p.label}</span>
                    {provider === p.id && <CheckCircle size={14} className="ml-auto text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp-api-key">API Key</Label>
              <div className="relative">
                <Input
                  id="whatsapp-api-key"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* API Secret (conditional) */}
            {selectedProvider.requiresSecret && (
              <div className="space-y-2">
                <Label htmlFor="whatsapp-api-secret">API Secret</Label>
                <div className="relative">
                  <Input
                    id="whatsapp-api-secret"
                    type={showSecret ? 'text' : 'password'}
                    value={apiSecret}
                    onChange={e => setApiSecret(e.target.value)}
                    placeholder="Enter your API secret"
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  >
                    {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* Sender Phone */}
            <div className="space-y-2">
              <Label htmlFor="sender-phone">Sender WhatsApp Number</Label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <Input
                  id="sender-phone"
                  type="tel"
                  value={senderPhone}
                  onChange={e => setSenderPhone(e.target.value)}
                  placeholder="+91 9000000000"
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-on-surface-variant">Must be your registered WhatsApp Business number</p>
            </div>

            {/* Webhook URL (read-only) */}
            <div className="space-y-2">
              <Label>Inbound Webhook URL</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-surface-container-highest border border-outline-variant text-xs font-mono text-on-surface-variant truncate">
                  {webhookUrl}
                </div>
                <Button
                  id="copy-webhook-btn"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyWebhook}
                >
                  {copiedUrl ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
                </Button>
              </div>
              <p className="text-xs text-on-surface-variant">Paste this URL in your provider's webhook settings to receive inbound messages.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              id="test-whatsapp-connection-btn"
              variant="ghost"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
            >
              {testStatus === 'testing'
                ? <><Loader2 size={16} className="animate-spin" /> Testing...</>
                : '🔌 Test Connection'}
            </Button>
            <Button id="save-whatsapp-config-btn" variant="primary">
              💾 Save Configuration
            </Button>
          </CardFooter>
        </Card>

        {/* Trigger Events */}
        <Card>
          <CardHeader>
            <CardTitle>Auto-Trigger Events</CardTitle>
            <CardDescription>Messages sent automatically when these events occur.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: 'trigger-welcome',  label: 'Welcome Message',      desc: 'When a new student is admitted',             enabled: true  },
                { id: 'trigger-receipt',  label: 'Fee Receipt',           desc: 'When a payment is recorded',                 enabled: true  },
                { id: 'trigger-renewal',  label: 'Renewal Reminder',      desc: '3 days before subscription expires',         enabled: true  },
                { id: 'trigger-due',      label: 'Fee Due Alert',         desc: 'On due date + 1 day if unpaid',              enabled: true  },
                { id: 'trigger-suspend',  label: 'Auto-Suspend Notice',   desc: 'When seat is auto-suspended',                enabled: false },
                { id: 'trigger-waitlist', label: 'Waitlist Notification', desc: 'When seat becomes available for waitlisted', enabled: true  },
                { id: 'trigger-absentee', label: 'Absentee Alert',        desc: 'When student absent for 3+ days',            enabled: false },
              ].map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high border border-outline-variant/50">
                  <div>
                    <p className="text-sm font-medium text-on-surface">{event.label}</p>
                    <p className="text-xs text-on-surface-variant">{event.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={event.enabled ? 'success' : 'outline'}>
                      {event.enabled ? 'ON' : 'OFF'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" /> Recent Message Logs
          </CardTitle>
          <CardDescription>Last 30 days of outbound WhatsApp messages.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant text-xs uppercase tracking-wide">
                  <th className="text-left py-3 pr-4">Recipient</th>
                  <th className="text-left py-3 pr-4">Message Type</th>
                  <th className="text-left py-3 pr-4">Template</th>
                  <th className="text-left py-3 pr-4">Status</th>
                  <th className="text-left py-3">Sent At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {MESSAGE_LOGS.map(log => {
                  const cfg  = STATUS_CFG[log.status];
                  const Icon = cfg.icon;
                  return (
                    <tr key={log.id} className="hover:bg-surface-container-high transition-colors">
                      <td className="py-3 pr-4 font-mono text-sm text-on-surface">{log.to}</td>
                      <td className="py-3 pr-4 text-on-surface">{log.type}</td>
                      <td className="py-3 pr-4">
                        <code className="text-xs text-on-surface-variant bg-surface-container-highest px-1.5 py-0.5 rounded">
                          {log.template}
                        </code>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={cfg.variant}>
                          <Icon size={10} /> {log.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-xs text-on-surface-variant">{log.sentAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
