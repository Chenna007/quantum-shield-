'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Shield, AlertTriangle, Globe, Bug, TrendingUp, TrendingDown, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { scannerApi, reportsApi } from '@/lib/api';

const riskColor = (risk: string) => {
  const map: Record<string, string> = {
    CRITICAL: '#EF4444', HIGH: '#F97316', MEDIUM: '#F59E0B',
    LOW: '#10B981', SAFE: '#3B82F6',
  };
  return map[risk] || '#6B7280';
};

export default function DashboardPage() {
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [scansRes, statsRes] = await Promise.all([
          scannerApi.history(5),
          reportsApi.stats()
        ]);
        setRecentScans(scansRes.data);
        setStats(statsRes.data);
      } catch (e) {
        console.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <AppLayout title="Dashboard"><div className="p-8">Loading dashboard...</div></AppLayout>;

  // Calculate high-level metrics
  const totalScans = stats?.total_scans || 0;
  const avgScore = stats?.avg_risk_score || 0;
  const criticalCount = (stats?.by_risk_level?.CRITICAL || 0) + (stats?.by_risk_level?.HIGH || 0);
  const safeCount = (stats?.by_risk_level?.SAFE || 0) + (stats?.by_risk_level?.LOW || 0);

  return (
    <AppLayout title="Dashboard">
      {/* Welcome bar */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Overview</h2>
          <p className="text-white/40 text-sm mt-1">Last updated: just now · All systems monitoring</p>
        </div>
        <Link href="/scanner" className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
          New Scan
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Security Score',
            value: avgScore.toString(),
            suffix: '/100',
            icon: Shield,
            color: '#F59E0B',
            trend: 'Average across all scans',
            up: avgScore < 50,
          },
          {
            label: 'Quantum Risk Level',
            value: avgScore >= 65 ? 'HIGH' : avgScore >= 35 ? 'MEDIUM' : avgScore >= 10 ? 'LOW' : 'SAFE',
            suffix: '',
            icon: AlertTriangle,
            color: avgScore >= 65 ? '#EF4444' : '#10B981',
            trend: 'Overall risk',
            up: avgScore < 65,
          },
          {
            label: 'Scans Performed',
            value: totalScans.toString(),
            suffix: '',
            icon: Globe,
            color: '#10B981',
            trend: `${stats?.this_month || 0} this month`,
            up: true,
          },
          {
            label: 'Critical/High Risks',
            value: criticalCount.toString(),
            suffix: ' found',
            icon: Bug,
            color: '#7C3AED',
            trend: 'Requires attention',
            up: criticalCount === 0,
          },
        ].map((card) => (
          <div key={card.label} className="bg-[#0D1121] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.color + '15', color: card.color }}>
                <card.icon size={18} />
              </div>
              <div className={`flex items-center gap-1 text-xs ${card.up ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {card.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {card.value}<span className="text-lg text-white/40">{card.suffix}</span>
            </div>
            <div className="text-xs text-white/40">{card.label}</div>
            <div className={`text-xs mt-2 ${card.up ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{card.trend}</div>
          </div>
        ))}
      </div>

      {/* Risk Breakdown + Recent Scans */}
      <div className="grid xl:grid-cols-3 gap-6 mb-8">
        {/* Risk distribution */}
        <div className="bg-[#0D1121] border border-white/5 rounded-2xl p-6">
          <h3 className="font-semibold mb-6">Risk Distribution</h3>
          <div className="space-y-4">
            {[
              { label: 'CRITICAL', count: stats?.by_risk_level?.CRITICAL || 0, total: totalScans || 1, color: '#EF4444' },
              { label: 'HIGH', count: stats?.by_risk_level?.HIGH || 0, total: totalScans || 1, color: '#F97316' },
              { label: 'MEDIUM', count: stats?.by_risk_level?.MEDIUM || 0, total: totalScans || 1, color: '#F59E0B' },
              { label: 'LOW', count: stats?.by_risk_level?.LOW || 0, total: totalScans || 1, color: '#10B981' },
              { label: 'SAFE', count: stats?.by_risk_level?.SAFE || 0, total: totalScans || 1, color: '#3B82F6' },
            ].map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-white/60">{r.label}</span>
                  <span className="font-medium text-white">{r.count}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(r.count / r.total) * 100}%`, backgroundColor: r.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Scans */}
        <div className="xl:col-span-2 bg-[#0D1121] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Recent Scans</h3>
            <Link href="/reports" className="text-xs text-[#3B82F6] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentScans.map((scan, i) => (
              <div key={scan.domain + i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                    <Globe size={14} className="text-white/40" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white font-mono">{scan.domain}</div>
                    <div className="text-xs text-white/30">{scan.tls_version} · {scan.cipher_suite}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs px-2 py-1 rounded font-semibold" style={{ backgroundColor: riskColor(scan.risk_level) + '20', color: riskColor(scan.risk_level) }}>
                    {scan.risk_level}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-white/30 truncate w-24 justify-end">
                    <Clock size={10} />
                    {new Date(scan.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {criticalCount > 0 && (
        <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#EF4444]/10 rounded-xl flex items-center justify-center">
              <AlertTriangle size={18} className="text-[#EF4444]" />
            </div>
            <div>
              <div className="font-semibold text-[#EF4444]">Critical Risks Detected</div>
              <div className="text-sm text-white/40 mt-0.5">Found {criticalCount} domains with CRITICAL or HIGH quantum risk. Immediate action recommended.</div>
            </div>
          </div>
          <Link href="/reports" className="flex items-center gap-2 bg-[#EF4444] hover:bg-[#DC2626] px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors whitespace-nowrap">
            View Reports
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </AppLayout>
  );
}
