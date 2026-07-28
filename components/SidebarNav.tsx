'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Smartphone, 
  Store, 
  ShieldAlert, 
  Sliders, 
  CheckCircle2,
  Activity,
  Lock
} from 'lucide-react';
import Logo from './Logo';

export type NavTab = 'overview' | 'returns' | 'customer_portal' | 'stores' | 'fraud_lab' | 'policy_rules';

interface SidebarNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedPlatform: string;
  flaggedCount: number;
  totalReturnsCount: number;
}

export default function SidebarNav({
  activeTab,
  setActiveTab,
  selectedPlatform,
  flaggedCount,
  totalReturnsCount,
}: SidebarNavProps) {
  const navItems = [
    {
      id: 'overview',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: null,
      description: 'Analytics & Financial KPIs',
    },
    {
      id: 'returns',
      label: 'Returns & Fraud Ops',
      icon: Package,
      badge: totalReturnsCount > 0 ? `${totalReturnsCount}` : null,
      badgeColor: 'bg-orange-100 text-[#FC8019] border border-orange-200',
      description: 'Live Ingestion & Dynamic Routing',
    },
    {
      id: 'customer_portal',
      label: 'Customer Return Portal',
      icon: Smartphone,
      badge: 'POV',
      badgeColor: 'bg-[#FC8019] text-white shadow-orange-glow',
      description: 'Customer Experience & Embed Builder',
    },
    {
      id: 'stores',
      label: 'Connected Stores & APIs',
      icon: Store,
      badge: '5 Active',
      badgeColor: 'bg-orange-100 text-orange-800 border border-orange-200',
      description: 'Shopify, Amazon & Flipkart Hub',
    },
    {
      id: 'fraud_lab',
      label: 'AI Fraud Inspection Lab',
      icon: ShieldAlert,
      badge: flaggedCount > 0 ? `${flaggedCount}` : null,
      badgeColor: 'bg-red-100 text-[#E23744] border border-red-200 animate-pulse',
      description: 'Vision Audit & Dispute Claims',
    },
    {
      id: 'policy_rules',
      label: 'Policy & Automation Rules',
      icon: Sliders,
      badge: null,
      description: 'Auto-Refund & Quarantine Limits',
    },
  ];

  return (
    <aside className="w-72 bg-white text-slate-800 flex flex-col h-full border-r border-orange-100 shrink-0 select-none shadow-xs z-20">
      
      {/* Brand Top Header */}
      <div className="p-4 border-b border-orange-100 flex items-center justify-between gap-2 bg-white">
        <Logo size="sm" />
        <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#FC8019] text-[9px] font-extrabold tracking-wider uppercase border border-orange-200 whitespace-nowrap shrink-0">
          ENTERPRISE
        </span>
      </div>

      {/* Active Store Indicator Card */}
      <div className="mx-3 mt-3.5 p-3 bg-gradient-to-r from-orange-50/80 to-amber-50/40 rounded-2xl border border-orange-200/80 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#FC8019] text-white flex items-center justify-center font-black text-xs shadow-orange-glow shrink-0">
            {selectedPlatform === 'amazon' ? 'AZ' : selectedPlatform === 'flipkart' ? 'FK' : selectedPlatform === 'meesho' ? 'MS' : 'HQ'}
          </div>
          <div className="truncate min-w-0">
            <div className="text-xs font-extrabold text-slate-900 truncate">
              {selectedPlatform === 'amazon' ? 'Amazon Seller Hub' : selectedPlatform === 'flipkart' ? 'Flipkart Commerce' : selectedPlatform === 'meesho' ? 'Meesho Supplier' : 'Global Merchant HQ'}
            </div>
            <div className="text-[10px] text-[#FC8019] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">Multi-Store Live Sync</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-2 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
          Core SaaS Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as NavTab)}
              className={`w-full text-left p-2.5 rounded-xl transition-all duration-200 flex items-center justify-between gap-2 group cursor-pointer ${
                isActive
                  ? 'bg-orange-50 text-[#FC8019] font-black border-l-4 border-[#FC8019] shadow-xs'
                  : 'hover:bg-orange-50/50 text-slate-600 hover:text-slate-900 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className={`p-1.5 rounded-lg shrink-0 transition ${
                  isActive ? 'bg-[#FC8019] text-white shadow-orange-glow' : 'bg-slate-100 text-slate-500 group-hover:text-[#FC8019] group-hover:bg-orange-100/60'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate min-w-0">
                  <div className="text-xs font-extrabold truncate leading-tight">{item.label}</div>
                  <div className="text-[10px] text-slate-400 truncate font-medium group-hover:text-slate-500">{item.description}</div>
                </div>
              </div>

              {item.badge && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold shrink-0 whitespace-nowrap ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Protection Footer */}
      <div className="p-3 border-t border-orange-100 bg-orange-50/30">
        <div className="p-3 bg-white rounded-xl border border-orange-200/80 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-bold flex items-center gap-1.5 truncate">
              <Activity className="w-3.5 h-3.5 text-[#FC8019] shrink-0" />
              <span className="truncate">Fraud AI Engine</span>
            </span>
            <span className="text-emerald-700 font-extrabold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium pt-1.5 border-t border-orange-100">
            <span>SOC2 Certified</span>
            <span className="flex items-center gap-1 text-slate-600 font-bold">
              <Lock className="w-2.5 h-2.5 text-[#FC8019] shrink-0" /> Encrypted
            </span>
          </div>
        </div>
      </div>

    </aside>
  );
}
