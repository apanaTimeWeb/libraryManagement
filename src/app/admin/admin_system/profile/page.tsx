'use client';
// RESPONSIBILITY: Entry page for the admin_system module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../admin_system_components/AdminSystemCard/AdminSystemCard';
import { Button } from '../admin_system_components/AdminSystemButton/AdminSystemButton';
import { Input } from '../admin_system_components/AdminSystemInput/AdminSystemInput';
import { Label } from '../admin_system_components/AdminSystemLabel/AdminSystemLabel';
import { Progress } from '../admin_system_components/AdminSystemProgress/AdminSystemProgress';
import { User, Lock, Camera, Eye, EyeOff, ChevronRight } from 'lucide-react';

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map: Record<number, { label: string; color: string }> = {
    0: { label: 'Very Weak', color: 'bg-error' },
    1: { label: 'Weak', color: 'bg-error' },
    2: { label: 'Fair', color: 'bg-tertiary' },
    3: { label: 'Good', color: 'bg-green-500' },
    4: { label: 'Strong', color: 'bg-green-400' },
  };
  return { score, ...map[score] };
}

export default function ProfilePage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPw, setNewPw] = useState('');
  const strength = getStrength(newPw);

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium tracking-wide mb-1">
          <span>System</span>
          <ChevronRight size={12} />
          <span>Profile</span>
        </div>
        <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
          <User size={28} className="text-primary" />
          My Profile
        </h1>
        <p className="text-on-surface-variant mt-1 text-sm">Manage your personal information and account security.</p>
      </div>

      <div className="max-w-[560px] mx-auto space-y-6">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your display name, email and phone.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="h-20 w-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary text-3xl font-bold select-none">
                  A
                </div>
                <button
                  id="change-photo-btn"
                  className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-name">Full Name <span className="text-error">*</span></Label>
              <Input id="profile-name" defaultValue="Admin User" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" type="email" defaultValue="admin@smartlibrary.in" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-phone">Phone <span className="text-error">*</span></Label>
              <Input id="profile-phone" type="tel" defaultValue="+91 98765 43210" />
            </div>
          </CardContent>
          <CardFooter>
            <Button id="update-profile-btn" variant="primary">💾 Update Profile</Button>
          </CardFooter>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={18} className="text-primary" />
              Change Password
            </CardTitle>
            <CardDescription>Update your account password regularly for security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input id="current-password" type={showCurrent ? 'text' : 'password'} placeholder="Enter current password" className="pr-12" />
                <button type="button" onClick={() => setShowCurrent(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input id="new-password" type={showNew ? 'text' : 'password'} placeholder="Min. 8 characters" value={newPw} onChange={e => setNewPw(e.target.value)} className="pr-12" />
                <button type="button" onClick={() => setShowNew(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {newPw && (
                <div className="space-y-1.5 mt-2">
                  <Progress value={strength.score} max={4} barClassName={strength.color} />
                  <p className={`text-xs font-medium ${strength.score >= 3 ? 'text-green-400' : strength.score === 2 ? 'text-tertiary' : 'text-error'}`}>
                    Password strength: {strength.label}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input id="confirm-password" type={showConfirm ? 'text' : 'password'} placeholder="Repeat new password" className="pr-12" />
                <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button id="change-password-btn" variant="primary">🔐 Change Password</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
