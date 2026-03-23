'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Database, Shield, Globe, Lock, AlertTriangle, Plus, Search, MoreVertical, ExternalLink } from 'lucide-react';
import { assetsApi } from '@/lib/api';

const riskColors: Record<string, string> = {
  CRITICAL: '#EF4444', HIGH: '#F97316', MEDIUM: '#F59E0B', LOW: '#10B981', SAFE: '#3B82F6',
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssets() {
      try {
        const res = await assetsApi.list();
        setAssets(res.data || []);
      } catch (e) {
        console.error("Failed to load assets");
      } finally {
        setLoading(false);
      }
    }
    loadAssets();
  }, []);

  if (loading) return <AppLayout title="Assets"><div className="p-8">Loading assets...</div></AppLayout>;

  return (
    <AppLayout title="Assets Management">
      <div className="max-w-6xl">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Protected Assets</h2>
            <p className="text-white/40 text-sm mt-1">Monitor and manage your organization's digital attack surface</p>
          </div>
          <button className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] px-4 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20">
            <Plus size={18} />
            Add New Asset
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-[#3B82F6]/50 transition-colors">
            <Search size={18} className="text-white/30" />
            <input placeholder="Search assets by domain, IP, or tag..." className="bg-transparent text-sm text-white placeholder-white/20 outline-none w-full" />
          </div>
          <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white/70 outline-none">
            <option>All Risk Levels</option>
            <option>Critical</option>
            <option>High</option>
            <option>Safe</option>
          </select>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div key={asset.id} className="bg-[#0D1121] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: riskColors[asset.risk_level] + '15', color: riskColors[asset.risk_level] }}>
                  {asset.type === 'domain' ? <Globe size={24} /> : <Database size={24} />}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider" style={{ backgroundColor: riskColors[asset.risk_level] + '20', color: riskColors[asset.risk_level] }}>
                    {asset.risk_level}
                  </span>
                  <button className="text-white/20 hover:text-white transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg truncate">{asset.name}</h3>
                  <ExternalLink size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
                </div>
                <div className="text-xs text-white/40 font-mono italic">{asset.address}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Last Scan</div>
                  <div className="text-xs text-white/70">{new Date(asset.last_scan).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Vulnerabilities</div>
                  <div className={`text-xs font-bold ${asset.vulnerabilities > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                    {asset.vulnerabilities > 0 ? `${asset.vulnerabilities} Issues` : 'Clean'}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="text-white/40">Quantum Readiness</span>
                  <span className="text-white/70 font-bold">{asset.readiness}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] rounded-full transition-all duration-500" 
                    style={{ width: `${asset.readiness}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
