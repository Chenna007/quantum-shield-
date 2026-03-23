'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, Globe, ChevronRight, Check, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white font-['Space_Grotesk']">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0B0F1A]/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#3B82F6] to-[#7C3AED] rounded-lg flex items-center justify-center">
            <Shield size={16} />
          </div>
          <span className="font-bold text-lg tracking-tight">QuantumShield</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2">Sign In</Link>
          <Link href="/auth/signup" className="text-sm bg-[#3B82F6] hover:bg-[#2563EB] px-4 py-2 rounded-lg transition-colors font-medium">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-32 text-center min-h-[90vh] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg.jpg" 
            alt="Quantum Security Background" 
            className="w-full h-full object-cover opacity-20 scale-110 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1A] via-transparent to-[#0B0F1A]" />
        </div>

        {/* BG glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#3B82F6]/10 rounded-full blur-3xl opacity-50" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-2" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto z-10"
        >
          <div className="inline-flex items-center gap-2 bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-full px-4 py-2 text-sm text-[#A78BFA] mb-8">
            <Zap size={14} />
            Post-Quantum Cryptography Assessment Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
            Prepare Your Infrastructure
            <br />
            <span className="bg-gradient-to-r from-[#3B82F6] via-[#7C3AED] to-[#A78BFA] bg-clip-text text-transparent">
              for the Quantum Era
            </span>
          </h1>

          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Detect cryptography vulnerable to future quantum attacks. Protect your organization before the threat arrives with automated scanning and expert remediation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/scanner" className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#3B82F6]/25">
              Start Free Scan
              <ArrowRight size={20} />
            </Link>
            <Link href="/fix" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all">
              Request Security Fix
              <ChevronRight size={20} />
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-white/40">
            <div className="flex items-center gap-2"><Check size={14} className="text-[#10B981]" /> No credit card required</div>
            <div className="flex items-center gap-2"><Check size={14} className="text-[#10B981]" /> Free tier available</div>
            <div className="flex items-center gap-2"><Check size={14} className="text-[#10B981]" /> NIST PQC compliant</div>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/5 bg-white/[0.02] px-6 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '50,000+', label: 'Domains Scanned' },
            { value: '94%', label: 'Risk Detection Rate' },
            { value: '2,100+', label: 'Organizations Protected' },
            { value: '<2s', label: 'Average Scan Time' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-28 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Prepare</h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">A complete platform for quantum cryptography risk assessment and remediation</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Globe size={24} />,
              title: 'TLS Scanner',
              desc: 'Deep inspection of TLS handshakes, cipher suites, and certificate chains. Instant quantum risk classification.',
              color: '#3B82F6',
            },
            {
              icon: <Zap size={24} />,
              title: 'Risk Analysis Engine',
              desc: 'Classifies every algorithm: RSA, ECC, AES, and more — against NIST post-quantum standards.',
              color: '#7C3AED',
            },
            {
              icon: <Shield size={24} />,
              title: 'Expert Remediation',
              desc: 'Our team of quantum cryptographers can migrate your infrastructure to post-quantum algorithms.',
              color: '#10B981',
            },
            {
              icon: <Lock size={24} />,
              title: 'Continuous Monitoring',
              desc: 'Set-and-forget monitoring with automatic alerts when new vulnerabilities are discovered.',
              color: '#F59E0B',
            },
            {
              icon: <ChevronRight size={24} />,
              title: 'Compliance Reports',
              desc: 'Downloadable PDF and CSV reports ready for auditors, boards, and compliance teams.',
              color: '#EC4899',
            },
            {
              icon: <ArrowRight size={24} />,
              title: 'Migration Roadmap',
              desc: 'Step-by-step migration guides for every vulnerability, prioritized by risk level.',
              color: '#14B8A6',
            },
          ].map((f) => (
            <div key={f.title} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all hover:bg-white/[0.04] group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: f.color + '20', color: f.color }}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Risk Table */}
      <section className="px-6 py-20 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Quantum Risk Classification</h2>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-white/50 text-left">
                <tr>
                  <th className="px-6 py-4">Algorithm</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Quantum Risk</th>
                  <th className="px-6 py-4">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { algo: 'RSA-2048', type: 'Key Exchange / Sig', risk: 'CRITICAL', rec: 'Replace immediately', color: '#EF4444' },
                  { algo: 'ECDSA / ECDH', type: 'Key Exchange / Sig', risk: 'HIGH', rec: 'Plan migration', color: '#F97316' },
                  { algo: 'AES-128', type: 'Symmetric', risk: 'MEDIUM', rec: 'Upgrade to AES-256', color: '#F59E0B' },
                  { algo: 'AES-256', type: 'Symmetric', risk: 'LOW', rec: 'Monitor', color: '#10B981' },
                  { algo: 'CRYSTALS-Kyber', type: 'PQC Key Exchange', risk: 'SAFE', rec: 'Recommended', color: '#3B82F6' },
                  { algo: 'CRYSTALS-Dilithium', type: 'PQC Signature', risk: 'SAFE', rec: 'Recommended', color: '#3B82F6' },
                ].map((row) => (
                  <tr key={row.algo} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono font-medium">{row.algo}</td>
                    <td className="px-6 py-4 text-white/50">{row.type}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: row.color + '20', color: row.color }}>
                        {row.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/60">{row.rec}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-28 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Start Protecting Your Infrastructure Today</h2>
          <p className="text-white/50 text-lg mb-10">Quantum computers capable of breaking current encryption are 5–10 years away. The time to prepare is now.</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] px-10 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity">
            Create Free Account
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-[#3B82F6] to-[#7C3AED] rounded-lg flex items-center justify-center">
              <Shield size={14} />
            </div>
            <span className="font-bold">QuantumShield</span>
          </div>
          <p className="text-white/30 text-sm">© 2025 QuantumShield. Securing the Internet for the Quantum Era.</p>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
