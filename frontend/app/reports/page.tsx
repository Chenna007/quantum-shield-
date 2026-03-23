'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { FileText, Download, Filter, Search, Globe, Clock, AlertTriangle } from 'lucide-react';
import { reportsApi } from '@/lib/api';

const riskColors: Record<string, string> = {
  CRITICAL: '#EF4444', HIGH: '#F97316', MEDIUM: '#F59E0B', LOW: '#10B981', SAFE: '#3B82F6',
};

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [listRes, statsRes] = await Promise.all([
          reportsApi.list(50, 0),
          reportsApi.stats()
        ]);
        setReports(listRes.data.reports || []);
        setStats(statsRes.data);
      } catch (e) {
        console.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleExportPdf = async (scanId: string, domain: string) => {
    try {
      const res = await reportsApi.exportPdf(scanId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quantumshield-${domain}-report.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      alert("Failed to export PDF");
    }
  };

  if (loading) return <AppLayout title="Reports"><div className="p-8">Loading reports...</div></AppLayout>;

  return (
    <AppLayout title="Reports">
      <div className="max-w-5xl">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
              <Search size={14} className="text-white/30" />
              <input placeholder="Search reports..." className="bg-transparent text-sm text-white/70 placeholder-white/20 outline-none w-48" />
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Reports', value: stats?.total_scans?.toString() || '0', color: '#3B82F6' },
            { label: 'This Month', value: stats?.this_month?.toString() || '0', color: '#7C3AED' },
            { label: 'Critical Findings', value: ((stats?.by_risk_level?.CRITICAL || 0) + (stats?.by_risk_level?.HIGH || 0)).toString(), color: '#EF4444' },
            { label: 'Avg Risk Score', value: stats?.avg_risk_score?.toString() || '0', color: '#F59E0B' },
          ].map((s) => (
            <div key={s.label} className="bg-[#0D1121] border border-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-[#0D1121] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <FileText size={16} className="text-[#3B82F6]" />
            <span className="font-semibold">Scan Reports</span>
          </div>
          <table className="w-full text-sm">
            <thead className="text-white/30 text-xs border-b border-white/5">
              <tr>
                <th className="text-left px-6 py-3">Domain</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-left px-6 py-3">TLS</th>
                <th className="text-left px-6 py-3">Algorithm</th>
                <th className="text-left px-6 py-3">Risk Level</th>
                <th className="text-left px-6 py-3">Score</th>
                <th className="text-left px-6 py-3">Findings</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Globe size={13} className="text-white/30" />
                      <span className="font-mono">{r.domain}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/40">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(r.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-white/70">{r.tls_version || 'Unknown'}</td>
                  <td className="px-6 py-4 font-mono text-white/70">{r.cipher_suite || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: riskColors[r.risk_level] + '20', color: riskColors[r.risk_level] }}>
                      {r.risk_level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full w-16 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${r.risk_score}%`, backgroundColor: riskColors[r.risk_level] }} />
                      </div>
                      <span className="text-xs text-white/50">{r.risk_score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {r.risk_level === 'CRITICAL' || r.risk_level === 'HIGH' ? (
                      <div className="flex items-center gap-1 text-xs text-[#F97316]">
                        <AlertTriangle size={12} />
                        Requires Fix
                      </div>
                    ) : (
                      <span className="text-xs text-[#10B981]">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleExportPdf(r.id, r.domain)}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/40 hover:text-[#3B82F6]"
                      title="Export PDF"
                    >
                      <FileText size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
