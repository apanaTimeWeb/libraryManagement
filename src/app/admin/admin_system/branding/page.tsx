'use client';
// RESPONSIBILITY: Entry page for the admin_system module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../admin_system_components/AdminSystemCard/AdminSystemCard';
import { Button } from '../admin_system_components/AdminSystemButton/AdminSystemButton';
import { Input } from '../admin_system_components/AdminSystemInput/AdminSystemInput';
import { Label } from '../admin_system_components/AdminSystemLabel/AdminSystemLabel';
import { Palette, ChevronRight, Upload, RotateCcw, Save } from 'lucide-react';

function readToken(token: string) {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

export default function BrandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    libraryName: 'Library OS',
    tagline: 'Your Knowledge Hub',
    primaryColor: '',
    accentColor: '',
  });

  /* Read defaults from system.css tokens on mount — no hardcoded hex in TSX */
  useEffect(() => {
    setForm(f => ({
      ...f,
      primaryColor: readToken('--branding-primary-default'),
      accentColor:  readToken('--branding-accent-default'),
    }));
  }, []);

  /* Push user-chosen colors as CSS vars onto the preview container */
  useEffect(() => {
    if (!containerRef.current || !form.primaryColor) return;
    containerRef.current.style.setProperty('--preview-primary', form.primaryColor);
    containerRef.current.style.setProperty('--preview-accent',  form.accentColor);
  }, [form.primaryColor, form.accentColor]);

  const handleReset = () => setForm(f => ({
    ...f,
    primaryColor: readToken('--branding-primary-default'),
    accentColor:  readToken('--branding-accent-default'),
  }));

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium tracking-wide mb-1">
          <span>System</span><ChevronRight size={12} /><span>Branding</span>
        </div>
        <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
          <Palette size={28} className="text-primary" />
          Branding & White-Label
        </h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Customize your library's visual identity. Changes reflect across the entire app.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Left — Settings Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Branding Settings</CardTitle>
              <CardDescription>Configure logo, name, colors, and tagline.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Library Logo</Label>
                <div
                  id="branding-logo-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded-xl p-6 cursor-pointer hover:bg-surface-container-high transition-colors"
                >
                  <div className="h-16 w-16 rounded-xl flex items-center justify-center text-2xl font-bold mb-2 sys-preview-sidebar-bg">
                    📚
                  </div>
                  <button type="button" className="text-xs text-primary flex items-center gap-1">
                    <Upload size={12} /> Upload Logo (200×200px)
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branding-name">Library Name</Label>
                <Input id="branding-name" value={form.libraryName}
                  onChange={e => setForm(f => ({ ...f, libraryName: e.target.value }))} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branding-tagline">
                  App Tagline <span className="text-on-surface-variant/50 text-xs">(optional)</span>
                </Label>
                <Input id="branding-tagline" placeholder="Your tagline here..."
                  value={form.tagline}
                  onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} />
              </div>

              {/* Color pickers — native <input type="color"> requires value binding, swatch uses CSS class */}
              <div className="space-y-2">
                <Label htmlFor="branding-primary-color">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <input type="color" id="branding-primary-color" value={form.primaryColor}
                    onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                    className="h-10 w-12 rounded-lg border border-outline-variant bg-transparent cursor-pointer" />
                  <Input value={form.primaryColor}
                    onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                    className="font-mono text-xs" />
                  {/* swatch reads --preview-primary from container ref */}
                  <div className="h-10 w-10 rounded-lg shrink-0 sys-preview-swatch-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branding-accent-color">Secondary Accent Color</Label>
                <div className="flex items-center gap-2">
                  <input type="color" id="branding-accent-color" value={form.accentColor}
                    onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))}
                    className="h-10 w-12 rounded-lg border border-outline-variant bg-transparent cursor-pointer" />
                  <Input value={form.accentColor}
                    onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))}
                    className="font-mono text-xs" />
                  <div className="h-10 w-10 rounded-lg shrink-0 sys-preview-swatch-accent" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button id="save-branding-page-btn" variant="primary"><Save size={16} /> Save Branding</Button>
              <Button id="reset-branding-btn" variant="ghost" onClick={handleReset}><RotateCcw size={16} /> Reset to Default</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right — Live Preview: CSS vars set via ref.style.setProperty, children use classes only */}
        <div ref={containerRef} className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>See how your branding looks across different parts of the app.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Mini Sidebar Preview */}
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-2">Sidebar</p>
                <div className="sys-preview-sidebar-wrap sys-preview-sidebar-bg">
                  <div className="p-3 flex items-center gap-2 sys-preview-sidebar-bg">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center text-base font-bold sys-preview-icon">
                      📚
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface leading-tight">{form.libraryName || 'Library'}</p>
                      {form.tagline && <p className="text-[10px] text-on-surface-variant leading-tight truncate w-28">{form.tagline}</p>}
                    </div>
                  </div>
                  {['Dashboard', 'Students', 'Finance', 'Reports'].map((item, i) => (
                    <div key={item} className={`px-3 py-2 text-xs flex items-center gap-2 ${i === 0 ? 'sys-preview-nav-active font-semibold' : 'text-on-surface-variant'}`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'sys-preview-dot-active' : 'sys-preview-dot-inactive'}`} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Login Preview */}
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-2">Login Page</p>
                <div className="rounded-xl border border-outline-variant p-5 max-w-xs sys-preview-card-bg">
                  <div className="flex flex-col items-center mb-3 gap-1">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl font-bold sys-preview-icon">
                      📚
                    </div>
                    <p className="text-sm font-bold text-on-surface">{form.libraryName || 'Library'}</p>
                    {form.tagline && <p className="text-[10px] text-on-surface-variant">{form.tagline}</p>}
                  </div>
                  <div className="space-y-2">
                    <div className="h-7 rounded-lg bg-surface-container-highest" />
                    <div className="h-7 rounded-lg bg-surface-container-highest" />
                    <div className="sys-preview-login-btn">Login</div>
                  </div>
                </div>
              </div>

              {/* Mini ID Card Preview */}
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-2">Student ID Card</p>
                <div className="rounded-xl border border-outline-variant overflow-hidden max-w-xs">
                  <div className="sys-preview-id-header p-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center text-lg">📚</div>
                    <div>
                      <p className="sys-preview-id-title">{form.libraryName || 'Library'}</p>
                      <p className="sys-preview-id-subtitle">Student Identity Card</p>
                    </div>
                  </div>
                  <div className="p-3 flex items-center gap-3 sys-preview-card-bg">
                    <div className="h-12 w-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-xl">👤</div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">Rahul Sharma</p>
                      <p className="text-[10px] text-on-surface-variant">ID: #0042 | Morning Shift</p>
                      <p className="text-[10px] text-on-surface-variant">Valid till: June 2026</p>
                    </div>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
