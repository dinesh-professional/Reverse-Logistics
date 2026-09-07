'use client';

import React from 'react';
import { 
  LayoutDashboard, Package, Smartphone, Store, ShieldAlert, Sliders,
  CheckCircle2, Activity, Lock, Menu, X
} from 'lucide-react';
import Logo from './Logo';

export type NavTab = 'overview' | 'returns' | 'customer_portal' | 'stores' | 'fraud_lab' | 'policy_rules';

interface HeaderNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  onRefreshData: () => void;
}

const navItems: { id: NavTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'returns', label: 'Returns', icon: Package },
  { id: 'customer_portal', label: 'Portal', icon: Smartphone },
  { id: 'stores', label: 'Stores', icon: Store },
  { id: 'fraud_lab', label: 'Fraud Lab', icon: ShieldAlert },
  { id: 'policy_rules', label: 'Rules', icon: Sliders },
];

export default function HeaderNav({
  activeTab,
  setActiveTab,
  selectedPlatform,
  setSelectedPlatform,
  onRefreshData,
}: HeaderNavProps) {
  return (
    <header className="w-full glass-header px-4 sm:px-8 py-3 shrink-0">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-3">

        {/* Top row: Logo + Platform selector + Refresh */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Logo size="lg" />
            <div className="h-8 w-px bg-purple-500/10 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Platform</span>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="rounded-lg bg-purple-500/10 border border-purple-500/15 px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-purple-500 hover:bg-purple-500/15 transition-colors cursor-pointer"
              >
                <option value="all">All Platforms</option>
                <option value="amazon">Amazon SP-API</option>
                <option value="flipkart">Flipkart Seller</option>
                <option value="meesho">Meesho Supplier</option>
                <option value="direct">Direct Store</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px]">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-500 font-bold">AI Engine</span>
              <span className="text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Live</span>
            </div>
            <div className="h-5 w-px bg-purple-500/10" />
            <span className="text-[10px] text-slate-600 font-bold hidden lg:flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-purple-400" /> SOC2
            </span>
            <button
              onClick={onRefreshData}
              className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/15 cursor-pointer transition-colors"
              aria-label="Refresh data"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom row: Nav tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-0.5 -mb-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                    : 'text-slate-500 hover:text-purple-300 hover:bg-purple-500/5 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
}