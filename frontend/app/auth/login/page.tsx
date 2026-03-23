'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#7C3AED] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield size={20} />
            </div>
            <span className="font-bold text-xl text-white">QuantumShield</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-white/40 text-sm">Sign in to your security dashboard</p>
        </div>

        {/* Form */}
        <div className="bg-[#0D1121] border border-white/5 rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#3B82F6]/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-medium text-white/50">Password</label>
              <Link href="/auth/forgot" className="text-xs text-[#3B82F6] hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#3B82F6]/50 transition-colors"
              />
              <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full bg-[#3B82F6] hover:bg-[#2563EB] py-3 rounded-xl font-semibold text-sm transition-all"
          >
            Sign In
            <ArrowRight size={16} />
          </Link>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative text-center">
              <span className="bg-[#0D1121] px-3 text-xs text-white/30">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {['Google', 'GitHub'].map((p) => (
              <button key={p} className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-2.5 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all">
                {p}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-white/30 mt-6">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-[#3B82F6] hover:underline">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}
