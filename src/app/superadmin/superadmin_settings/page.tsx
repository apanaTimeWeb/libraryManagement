'use client';
import { useState } from 'react';
import { 
  Settings, Globe, Palette, Mail, MessageSquare, 
  Database, ShieldAlert, CheckCircle, Smartphone
} from 'lucide-react';

export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState('General');
  const [saved, setSaved] = useState(false);

  // State for all forms to make them functional
  const [generalConfig, setGeneralConfig] = useState({
    platformName: 'Library OS', supportEmail: 'support@nexus360.com', currency: 'INR (₹)', timezone: 'Asia/Kolkata'
  });
  
  const [apiConfig, setApiConfig] = useState({
    emailProvider: 'AWS SES', smsProvider: 'Twilio', whatsappKey: 'waba_live_99887766', telegramBotToken: 'bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11'
  });

  const [maintenance, setMaintenance] = useState({ enabled: false, message: 'We are upgrading our servers. Back in 10 mins!' });

  const tabs = [
    { name: 'General', icon: Globe },
    { name: 'Appearance', icon: Palette },
    { name: 'APIs & Integrations', icon: Mail },
    { name: 'Storage', icon: Database },
    { name: 'Maintenance Mode', icon: ShieldAlert },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="sa-page-animate">
      {saved && (
        <div className="sa-toast sa-toast--success">
          <CheckCircle size={16} /> Global settings saved successfully!
        </div>
      )}

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Library OS</span><span>/</span><span>Super Admin</span><span>/</span><span>System Settings</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title flex items-center gap-3">
            <Settings className="text-primary" size={28} /> System Settings
          </h1>
          <button onClick={handleSave} className="sa-btn-primary">
            <CheckCircle size={16} /> Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.name 
                ? 'bg-primary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon size={16} /> {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="sa-card p-6 h-[600px] overflow-y-auto">
        
        {activeTab === 'General' && (
          <div className="max-w-2xl space-y-8 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">General & Regional</h2>
              <p className="text-sm text-secondary mb-6">Global configuration applied to all newly registered libraries by default.</p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 col-span-2">
                  <label className="text-sm font-semibold text-white/80">Platform Name</label>
                  <input type="text" className="sa-input" value={generalConfig.platformName} onChange={e => setGeneralConfig(p => ({...p, platformName: e.target.value}))} />
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <label className="text-sm font-semibold text-white/80">Global Support Email</label>
                  <input type="email" className="sa-input" value={generalConfig.supportEmail} onChange={e => setGeneralConfig(p => ({...p, supportEmail: e.target.value}))} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Default Currency</label>
                  <select className="sa-input appearance-none bg-black/20" value={generalConfig.currency} onChange={e => setGeneralConfig(p => ({...p, currency: e.target.value}))}>
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>AED (د.إ)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/80">Default Timezone</label>
                  <select className="sa-input appearance-none bg-black/20" value={generalConfig.timezone} onChange={e => setGeneralConfig(p => ({...p, timezone: e.target.value}))}>
                    <option>Asia/Kolkata</option>
                    <option>UTC</option>
                    <option>America/New_York</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'APIs & Integrations' && (
          <div className="max-w-2xl space-y-8 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">Communication APIs</h2>
              <p className="text-sm text-secondary mb-6">Configure the gateways used for sending transactional emails, SMS, and WhatsApp messages.</p>
              
              <div className="space-y-6">
                <div className="p-5 border border-white/10 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="text-indigo-400" size={20} />
                    <h3 className="font-bold text-white">Email Provider</h3>
                  </div>
                  <select className="sa-input mb-4" value={apiConfig.emailProvider} onChange={e => setApiConfig(p => ({...p, emailProvider: e.target.value}))}>
                    <option>AWS SES</option>
                    <option>SendGrid</option>
                    <option>SMTP Custom</option>
                  </select>
                </div>
                
                <div className="p-5 border border-white/10 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Smartphone className="text-indigo-400" size={20} />
                    <h3 className="font-bold text-white">SMS Gateway</h3>
                  </div>
                  <select className="sa-input mb-4" value={apiConfig.smsProvider} onChange={e => setApiConfig(p => ({...p, smsProvider: e.target.value}))}>
                    <option>Twilio</option>
                    <option>Fast2SMS</option>
                    <option>Msg91</option>
                  </select>
                </div>

                <div className="p-5 border border-emerald-500/20 rounded-xl bg-emerald-500/5">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="text-emerald-400" size={20} />
                    <h3 className="font-bold text-white">WhatsApp Business API</h3>
                  </div>
                  <label className="text-xs text-white/60 block mb-1">API Token / Key</label>
                  <input type="password" placeholder="••••••••••••" className="sa-input" value={apiConfig.whatsappKey} onChange={e => setApiConfig(p => ({...p, whatsappKey: e.target.value}))} />
                </div>

                <div className="p-5 border border-blue-500/20 rounded-xl bg-blue-500/5">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="text-blue-400" size={20} />
                    <h3 className="font-bold text-white">Telegram Bot API (OTP & Alerts)</h3>
                  </div>
                  <label className="text-xs text-white/60 block mb-1">Telegram Bot Token</label>
                  <input type="password" placeholder="bot123456:ABC..." className="sa-input" value={apiConfig.telegramBotToken} onChange={e => setApiConfig(p => ({...p, telegramBotToken: e.target.value}))} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Maintenance Mode' && (
          <div className="max-w-2xl space-y-8 animate-fade-in">
            <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-xl">
              <div className="flex items-center gap-3 text-rose-500 mb-2">
                <ShieldAlert size={24} />
                <h3 className="font-bold text-lg">System Maintenance Mode</h3>
              </div>
              <p className="text-sm text-rose-200/80 mb-6">
                Enabling this will block all Library Admins and Students from logging in. Only SuperAdmins will have access to the platform.
              </p>
              
              <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg mb-6">
                <div>
                  <h4 className="text-sm font-bold text-white">Enable Maintenance</h4>
                  <p className="text-xs text-secondary mt-1">Platform is currently {maintenance.enabled ? 'OFFLINE' : 'ONLINE'}</p>
                </div>
                <button 
                  onClick={() => setMaintenance(p => ({...p, enabled: !p.enabled}))}
                  className={`w-14 h-7 rounded-full transition-colors relative ${maintenance.enabled ? 'bg-rose-500' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${maintenance.enabled ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>

              {maintenance.enabled && (
                <div className="flex flex-col gap-2 animate-fade-in">
                  <label className="text-sm font-semibold text-white/80">Message shown to users</label>
                  <textarea 
                    className="sa-input h-24 py-2 resize-none border-rose-500/30"
                    value={maintenance.message}
                    onChange={e => setMaintenance(p => ({...p, message: e.target.value}))}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab !== 'General' && activeTab !== 'APIs & Integrations' && activeTab !== 'Maintenance Mode' && (
          <div className="flex flex-col items-center justify-center h-full text-white/40 animate-fade-in">
            <Palette size={48} className="mb-4 opacity-30 text-primary" />
            <p className="text-lg font-medium">{activeTab}</p>
            <p className="text-sm mt-1 text-center max-w-sm">Global platform level configurations for {activeTab.toLowerCase()}.</p>
          </div>
        )}

      </div>
    </div>
  );
}
