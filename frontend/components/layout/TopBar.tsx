'use client';
import { Search, Bell, Settings } from 'lucide-react';
import Link from 'next/link';

export default function TopBar({ title = 'Dashboard' }: { title?: string }) {
  return (
    <header className="h-16 border-b border-white/5 bg-[#0B0F1A]/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 w-64">
          <Search size={14} className="text-white/30" />
          <input
            type="text"
            placeholder="Search domains, reports..."
            className="bg-transparent text-sm text-white/70 placeholder-white/20 outline-none flex-1"
          />
          <kbd className="text-[10px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">⌘K</kbd>
        </div>

        {/* Alerts */}
        <Link href="/alerts" className="relative w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
          <Bell size={16} className="text-white/60" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] rounded-full text-[9px] font-bold flex items-center justify-center">3</span>
        </Link>

        {/* Settings */}
        <Link href="/settings" className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
          <Settings size={16} className="text-white/60" />
        </Link>
      </div>
    </header>
  );
}
