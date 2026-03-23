'use client';
import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Search, Shield, AlertTriangle, Lock, Globe, ChevronRight, Download, RefreshCw, CheckCircle } from 'lucide-react';

type ScanResult = {
  domain: string;
  tls_version: string;
  cipher_suite: string;
  key_exchange: string;
  cert_signature: string;
  cert_expiry: string;
  quantum_risk_score: string;
  risk_level: string;
  recommendations: string[];
  details: { label: string; value: string; status: 'safe' | 'warning' | 'danger' | 'info' }[];
};

import { scannerApi } from '@/lib/api';

const riskConfig = {
  CRITICAL: { color: '#EF4444', bg: '#EF444420', label: 'Critical Risk', icon: AlertTriangle },
  HIGH: { color: '#F97316', bg: '#F9731620', label: 'High Risk', icon: AlertTriangle },
  MEDIUM: { color: '#F59E0B', bg: '#F59E0B20', label: 'Medium Risk', icon: Shield },
  LOW: { color: '#10B981', bg: '#10B98120', label: 'Low Risk', icon: Shield },
  SAFE: { color: '#3B82F6', bg: '#3B82F620', label: 'Safe', icon: CheckCircle },
};

const statusColors = {
  safe: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
};

export default function ScannerPage() {
  const [domain, setDomain] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');

  const runScan = async () => {
    if (!domain) return;
    const d = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    setScanning(true);
    setResult(null);
    setError('');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 90));
    }, 200);

    try {
      const response = await scannerApi.scan(d);
      const data = response.data;

      const r: ScanResult = {
        domain: data.domain,
        tls_version: data.tls_version || 'Unknown',
        cipher_suite: data.cipher_suite || 'Unknown',
        key_exchange: data.key_exchange || 'Unknown',
        cert_signature: data.cert_signature || 'Unknown',
        cert_expiry: data.cert_expiry || 'Unknown',
        quantum_risk_score: data.risk_score?.toString() || '0',
        risk_level: data.risk_level || 'UNKNOWN',
        recommendations: data.recommendations || [],
        details: data.details || [],
      };

      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setResult(r);
        setScanning(false);
      }, 300);
    } catch (err: any) {
      clearInterval(interval);
      if (err.response?.status === 401) {
        setError('Please log in to run scans.');
      } else if (err.response?.status === 429) {
        setError(err.response?.data?.detail || 'Scan limit reached. Please upgrade your plan.');
      } else {
        setError('Scan failed. Please check the domain and try again.');
      }
      setScanning(false);
    }
  };

  const cfg = result ? riskConfig[result.risk_level as keyof typeof riskConfig] : null;

  return (
    <AppLayout title="Domain Scanner">
      <div className="max-w-4xl">
        {/* Scanner Input */}
        <div className="bg-[#0D1121] border border-white/5 rounded-2xl p-8 mb-6">
          <h2 className="text-xl font-bold mb-2">Quantum TLS Scanner</h2>
          <p className="text-white/40 text-sm mb-6">Enter a domain to scan for quantum-vulnerable cryptography</p>

          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#3B82F6]/50 transition-colors">
              <Globe size={18} className="text-white/30" />
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runScan()}
                placeholder="example.com or https://example.com"
                className="flex-1 bg-transparent text-white placeholder-white/20 outline-none text-base font-mono"
              />
            </div>
            <button
              onClick={runScan}
              disabled={scanning || !domain}
              className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-all"
            >
              {scanning ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
              {scanning ? 'Scanning...' : 'Scan Domain'}
            </button>
          </div>

          {/* Progress */}
          {scanning && (
            <div className="mt-6">
              <div className="flex justify-between text-xs text-white/40 mb-2">
                <span>Analyzing TLS handshake and cryptography...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-white/30">
                {['DNS Lookup', 'TLS Handshake', 'Cert Analysis', 'Risk Scoring'].map((step, i) => (
                  <div key={step} className={`flex items-center gap-1 ${progress > i * 25 ? 'text-[#3B82F6]' : ''}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${progress > i * 25 ? 'bg-[#3B82F6]' : 'bg-white/20'}`} />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <div className="mt-4 text-[#EF4444] text-sm">{error}</div>}
        </div>

        {/* Results */}
        {result && cfg && (
          <div className="space-y-6">
            {/* Risk Score Header */}
            <div className="bg-[#0D1121] border rounded-2xl p-6" style={{ borderColor: cfg.color + '40' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: cfg.bg }}>
                    <cfg.icon size={28} style={{ color: cfg.color }} />
                  </div>
                  <div>
                    <div className="text-white/50 text-sm mb-1">Scan Result for</div>
                    <div className="text-xl font-bold font-mono text-white">{result.domain}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                      <span className="text-white/40 text-sm">Risk Score: <span className="text-white font-bold">{result.quantum_risk_score}/100</span></span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-sm transition-colors">
                  <Download size={14} />
                  Export PDF
                </button>
              </div>
            </div>

            {/* Details Grid */}
            <div className="bg-[#0D1121] border border-white/5 rounded-2xl p-6">
              <h3 className="font-semibold mb-5">Technical Details</h3>
              <div className="grid grid-cols-2 gap-3">
                {result.details.map((d) => (
                  <div key={d.label} className="flex items-center justify-between bg-white/[0.02] rounded-xl px-4 py-3 border border-white/5">
                    <span className="text-sm text-white/50">{d.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColors[d.status] }} />
                      <span className="text-sm font-mono font-medium text-white">{d.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-[#0D1121] border border-white/5 rounded-2xl p-6">
              <h3 className="font-semibold mb-5 flex items-center gap-2">
                <Lock size={16} className="text-[#7C3AED]" />
                Security Recommendations
              </h3>
              <div className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/[0.02] rounded-xl px-4 py-3 border border-white/5">
                    <div className="w-5 h-5 rounded-full bg-[#7C3AED]/20 text-[#7C3AED] text-xs flex items-center justify-center font-bold mt-0.5 shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm text-white/70">{rec}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-white/5 flex gap-3">
                <a href="/fix" className="flex-1 flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-3 rounded-xl text-sm font-semibold transition-colors">
                  Get Expert Fix
                  <ChevronRight size={16} />
                </a>
                <a href="/reports" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 rounded-xl text-sm font-medium transition-colors">
                  Save Report
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !scanning && (
          <div className="bg-[#0D1121] border border-white/5 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-[#3B82F6]" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Ready to Scan</h3>
            <p className="text-white/40 text-sm max-w-sm mx-auto">Enter a domain above to analyze its TLS configuration and detect quantum-vulnerable cryptography</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
