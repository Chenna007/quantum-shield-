'use client';
import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { User, Bell, CreditCard, Shield, Key, Save } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'api', icon: Key, label: 'API Keys' },
  ];

  return (
    <AppLayout title="Settings">
      <div className="max-w-4xl flex gap-6">
        {/* Sidebar */}
        <div className="w-48 space-y-1 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-[#0D1121] border border-white/5 rounded-2xl p-7 space-y-5">
              <h3 className="font-semibold text-lg">Profile Settings</h3>
              <div className="flex items-center gap-4 pb-5 border-b border-white/5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] flex items-center justify-center text-xl font-bold">JD</div>
                <div>
                  <button className="text-sm text-[#3B82F6] hover:underline">Change avatar</button>
                  <div className="text-xs text-white/30 mt-0.5">JPG, PNG up to 2MB</div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: 'John Doe' },
                  { label: 'Company', value: 'Acme Corporation' },
                  { label: 'Email', value: 'john@acme.com' },
                  { label: 'Role', value: 'Security Engineer' },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs text-white/40 mb-1.5">{f.label}</label>
                    <input defaultValue={f.value} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#3B82F6]/50 transition-colors" />
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
                <Save size={14} /> Save Changes
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-[#0D1121] border border-white/5 rounded-2xl p-7 space-y-5">
              <h3 className="font-semibold text-lg">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'Critical risk alerts', desc: 'Immediately notify on CRITICAL findings', on: true },
                  { label: 'High risk alerts', desc: 'Notify when HIGH risk vulnerabilities detected', on: true },
                  { label: 'Scan completion', desc: 'Email when scans finish', on: false },
                  { label: 'Weekly digest', desc: 'Weekly summary of your security posture', on: true },
                  { label: 'New features', desc: 'Product updates and new capabilities', on: false },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{n.label}</div>
                      <div className="text-xs text-white/40">{n.desc}</div>
                    </div>
                    <button className={`w-11 h-6 rounded-full transition-all relative ${n.on ? 'bg-[#3B82F6]' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${n.on ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-[#0D1121] border border-white/5 rounded-2xl p-7 space-y-5">
              <h3 className="font-semibold text-lg">Billing & Subscription</h3>
              <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#A78BFA]">Professional Plan</div>
                    <div className="text-sm text-white/40 mt-1">$199/month · Next billing Jan 31, 2025</div>
                  </div>
                  <button className="text-sm text-[#3B82F6] hover:underline">Manage</button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['100 scans used', '8 of 10 alerts', 'Pro features'].map((u) => (
                  <div key={u} className="bg-white/[0.02] rounded-xl p-3 text-sm text-white/50 text-center">{u}</div>
                ))}
              </div>
              <button className="text-sm text-[#EF4444] hover:underline">Cancel subscription</button>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="bg-[#0D1121] border border-white/5 rounded-2xl p-7 space-y-5">
              <h3 className="font-semibold text-lg">API Keys</h3>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Production Key</div>
                  <div className="text-xs text-[#10B981]">Active</div>
                </div>
                <div className="font-mono text-xs text-white/40 bg-white/5 rounded-lg px-3 py-2">
                  qs_live_••••••••••••••••••••••••••••••••
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="text-xs text-[#3B82F6] hover:underline">Show</button>
                  <span className="text-white/20">·</span>
                  <button className="text-xs text-[#3B82F6] hover:underline">Rotate</button>
                  <span className="text-white/20">·</span>
                  <button className="text-xs text-[#EF4444] hover:underline">Revoke</button>
                </div>
              </div>
              <button className="text-sm text-[#3B82F6] hover:underline">+ Generate new API key</button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-[#0D1121] border border-white/5 rounded-2xl p-7 space-y-5">
              <h3 className="font-semibold text-lg">Security Settings</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Change Password</h4>
                  {['Current Password', 'New Password', 'Confirm Password'].map((f) => (
                    <div key={f} className="mb-3">
                      <label className="block text-xs text-white/40 mb-1.5">{f}</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#3B82F6]/50 transition-colors" />
                    </div>
                  ))}
                  <button className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
                    <Save size={14} /> Update Password
                  </button>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <h4 className="text-sm font-medium mb-3">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between bg-white/[0.02] rounded-xl p-4">
                    <div>
                      <div className="text-sm">Authenticator App</div>
                      <div className="text-xs text-white/40">Use Google Authenticator or similar</div>
                    </div>
                    <button className="text-xs bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-3 py-1.5 rounded-lg">Enable</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
