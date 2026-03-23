'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Shield, Mail, Lock, User, Building, ArrowRight, Check } from 'lucide-react';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', company: '', email: '', password: '' });

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute top-1/3 right-1/3 w-[500px] h-[400px] bg-[#7C3AED]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#7C3AED] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield size={20} />
            </div>
            <span className="font-bold text-xl text-white">QuantumShield</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-white/40 text-sm">Start your free 14-day trial. No credit card required.</p>
        </div>

        <div className="bg-[#0D1121] border border-white/5 rounded-2xl p-8 space-y-4">
          {[
            { key: 'name', label: 'Full Name', icon: User, placeholder: 'Jane Smith', type: 'text' },
            { key: 'company', label: 'Company', icon: Building, placeholder: 'Acme Corp', type: 'text' },
            { key: 'email', label: 'Work Email', icon: Mail, placeholder: 'jane@acme.com', type: 'email' },
            { key: 'password', label: 'Password', icon: Lock, placeholder: '••••••••', type: 'password' },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-white/50 mb-1.5">{field.label}</label>
              <div className="relative">
                <field.icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#3B82F6]/50 transition-colors"
                />
              </div>
            </div>
          ))}

          <div className="space-y-2 text-xs text-white/40">
            {['Free 10 scans/month', '14-day trial of Pro features', 'No credit card required'].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <Check size={12} className="text-[#10B981]" />
                {f}
              </div>
            ))}
          </div>

          <Link href="/dashboard" className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] hover:opacity-90 py-3 rounded-xl font-semibold text-sm transition-all">
            Create Account
            <ArrowRight size={16} />
          </Link>

          <p className="text-center text-xs text-white/20">
            By signing up you agree to our{' '}
            <Link href="/terms" className="text-white/40 hover:text-white">Terms</Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-white/40 hover:text-white">Privacy Policy</Link>
          </p>
        </div>

        <p className="text-center text-sm text-white/30 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#3B82F6] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
