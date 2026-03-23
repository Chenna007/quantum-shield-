'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { AlertTriangle, CheckCircle, Info, Bell, Clock, Globe } from 'lucide-react';
import { alertsApi } from '@/lib/api';

const alertConfig = {
  CRITICAL: { color: '#EF4444', bg: '#EF444410', icon: AlertTriangle, label: 'Critical' },
  HIGH: { color: '#F97316', bg: '#F9731610', icon: AlertTriangle, label: 'High' },
  MEDIUM: { color: '#F59E0B', bg: '#F59E0B10', icon: Info, label: 'Medium' },
  INFO: { color: '#3B82F6', bg: '#3B82F610', icon: Info, label: 'Info' },
  SAFE: { color: '#10B981', bg: '#10B98110', icon: CheckCircle, label: 'Safe' },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await alertsApi.list(false);
        setAlerts(res.data || []);
      } catch (e) {
        console.error("Failed to load alerts");
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await alertsApi.markAllRead();
      setAlerts(alerts.map(a => ({ ...a, is_read: true })));
    } catch {
      alert("Failed to mark all as read");
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await alertsApi.markRead(id);
      setAlerts(alerts.map(a => a.id === id ? { ...a, is_read: true } : a));
    } catch {
      // ignore
    }
  };

  const unreadCount = alerts.filter(a => !a.is_read).length;
  const criticalCount = alerts.filter(a => a.alert_type === 'CRITICAL' && !a.is_read).length;
  const highCount = alerts.filter(a => a.alert_type === 'HIGH' && !a.is_read).length;

  if (loading) return <AppLayout title="Alerts"><div className="p-8">Loading alerts...</div></AppLayout>;

  return (
    <AppLayout title="Alerts">
      <div className="max-w-3xl">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Unread', value: unreadCount, color: '#EF4444' },
            { label: 'Critical', value: criticalCount, color: '#EF4444' },
            { label: 'High', value: highCount, color: '#F97316' },
            { label: 'Total Alerts', value: alerts.length, color: '#3B82F6' },
          ].map((s) => (
            <div key={s.label} className="bg-[#0D1121] border border-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Alert List */}
        <div className="bg-[#0D1121] border border-white/5 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-2 font-semibold">
              <Bell size={16} className="text-[#3B82F6]" />
              All Alerts
            </div>
            <button onClick={handleMarkAllRead} className="text-xs text-[#3B82F6] hover:underline">Mark all as read</button>
          </div>

          <div className="divide-y divide-white/5">
            {alerts.length === 0 ? (
              <div className="px-6 py-8 text-center text-white/40">No alerts found.</div>
            ) : alerts.map((alert) => {
              const cfg = alertConfig[alert.alert_type as keyof typeof alertConfig] || alertConfig.INFO;
              return (
                <div key={alert.id} className={`flex items-start gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02] ${!alert.is_read ? 'bg-white/[0.01]' : ''}`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: cfg.bg }}>
                    <cfg.icon size={16} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-white/30 truncate max-w-[200px]">
                        <Globe size={10} />
                        <span className="font-mono truncate">{alert.domain}</span>
                      </div>
                      {!alert.is_read && (
                        <span className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full" />
                      )}
                    </div>
                    <div className="font-medium text-sm text-white mb-1">{alert.title}</div>
                    <div className="text-xs text-white/40 leading-relaxed">{alert.description}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-white/25 whitespace-nowrap">
                      <Clock size={10} />
                      {new Date(alert.created_at).toLocaleDateString()}
                    </div>
                    {!alert.is_read && (
                      <button onClick={() => handleMarkRead(alert.id)} className="text-[10px] text-[#3B82F6] hover:underline">
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
