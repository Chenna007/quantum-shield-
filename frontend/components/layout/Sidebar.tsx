'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Search, Database, FileText,
  Bell, Wrench, CreditCard, Mail, Settings, Shield, LogOut
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/scanner', icon: Search, label: 'Scanner' },
  { href: '/dashboard/assets', icon: Database, label: 'Assets' },
  { href: '/reports', icon: FileText, label: 'Reports' },
  { href: '/alerts', icon: Bell, label: 'Alerts', badge: 3 },
  { href: '/fix', icon: Wrench, label: 'Fix My Security' },
  { href: '/pricing', icon: CreditCard, label: 'Pricing' },
  { href: '/contact', icon: Mail, label: 'Contact' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0D1121] border-r border-white/5 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-[#3B82F6] to-[#7C3AED] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield size={16} />
          </div>
          <div>
            <div className="font-bold text-sm text-white leading-none">QuantumShield</div>
            <div className="text-[10px] text-white/30 mt-0.5">Security Platform</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="text-[10px] font-semibold text-white/20 px-3 py-2 uppercase tracking-widest">Navigation</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#3B82F6] rounded-r" />
              )}
              <item.icon size={16} className={isActive ? 'text-[#3B82F6]' : 'group-hover:text-white/70'} />
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] flex items-center justify-center text-xs font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white leading-none">John Doe</div>
            <div className="text-xs text-white/30 mt-0.5 truncate">Pro Plan</div>
          </div>
          <LogOut size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
        </div>
      </div>
    </aside>
  );
}
