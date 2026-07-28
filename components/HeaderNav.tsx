'use client';

import React from 'react';
import { 
  Server, 
  ShieldAlert, 
  Smartphone, 
  Store,
  RefreshCw
} from 'lucide-react';
import { NavTab } from './SidebarNav';

interface HeaderNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  totalReturnsCount: number;
  flaggedCount: number;
  onRefreshData?: () => void;
}

export default function HeaderNav({
  activeTab,
  setActiveTab,
  selectedPlatform,
  setSelectedPlatform,
  totalReturnsCount,
  flaggedCount,
  onRefreshData,
}: HeaderNavProps) {
  
  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'overview':
        return { title: 'Overview & Analytics', desc: 'Real-time financial savings, return velocity, and AI fraud metrics.' };
      case 'returns':
        return { title: 'Returns & Operations Hub', desc: 'Multi-channel reverse logistics, automated routing, and fraud inspection.' };
      case 'customer_portal':
        return { title: 'Customer Return Portal (POV)', desc: 'Live interactive return portal preview and storefront embed builder.' };
      case 'stores':
        return { title: 'Connected Stores & APIs', desc: 'Integrate Shopify, Amazon SP-API, Flipkart, WooCommerce, and webhooks.' };
      case 'fraud_lab':
        return { title: 'AI Fraud Inspection Lab', desc: 'Neural vision scan, serial audit, weight verification, and claims.' };
      case 'policy_rules':
        return { title: 'Policy Rules & Routing', desc: 'Auto-approve thresholds, quarantine rules, and warehouse destinations.' };
      default:
        return { title: 'Reverse Logistics Platform', desc: 'AI-Powered return fraud detection platform.' };
    }
  };

  const currentInfo = getTabTitle(activeTab);

  return (
    <header className="min-h-16 py-3 px-6 bg-white border-b border-orange-100 flex flex-wrap items-center justify-between gap-4 z-20 shrink-0 shadow-xs">
      
      {/* Active Page Info (Left Section) */}
      <div className="flex-1 min-w-[200px] overflow-hidden pr-2">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-black text-slate-900 tracking-tight truncate">{currentInfo.title}</h1>
          <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-orange-50 text-[#FC8019] border border-orange-200 uppercase tracking-wider shrink-0 whitespace-nowrap hidden sm:inline-block">
            LIVE SYSTEM
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium truncate">{currentInfo.desc}</p>
      </div>

      {/* Global Controls & Actions (Right Section) */}
      <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
        
        {/* Global Store Selector Filter */}
        <div className="flex items-center bg-orange-50/70 p-1 rounded-xl border border-orange-200 text-xs">
          <Store className="w-3.5 h-3.5 ml-2 text-[#FC8019] shrink-0" />
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            aria-label="Select connected e-commerce store"
            className="bg-white text-slate-900 font-bold px-2 py-1 rounded-lg outline-none border border-orange-200 focus:border-[#FC8019] cursor-pointer text-xs transition max-w-[220px] md:max-w-[280px] truncate"
          >
            <option value="all">All Connected Stores (Shopify, Amazon, Flipkart, Woo)</option>
            <option value="amazon">Amazon Merchant Hub (SP-API)</option>
            <option value="flipkart">Flipkart Seller Center</option>
            <option value="meesho">Meesho Supplier Hub</option>
            <option value="direct">Shopify Direct Storefront</option>
          </select>
        </div>

        {/* Customer POV Quick Launch Button */}
        <button
          onClick={() => setActiveTab('customer_portal')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border shadow-orange-glow cursor-pointer whitespace-nowrap ${
            activeTab === 'customer_portal'
              ? 'bg-[#FC8019] text-white border-[#FC8019]'
              : 'bg-white hover:bg-orange-50 text-[#FC8019] border-orange-300'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 shrink-0" />
          <span>Test Customer POV</span>
        </button>

        {/* Webhooks Hub Quick Launch */}
        <button
          onClick={() => setActiveTab('stores')}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-800 shadow-xs cursor-pointer whitespace-nowrap hidden lg:flex"
        >
          <Server className="w-3.5 h-3.5 text-[#FC8019] shrink-0" />
          <span>API & Webhooks</span>
        </button>

        {/* Refresh Data Button */}
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            title="Refresh returns stream"
            className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FC8019] border border-orange-200 transition cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Flagged Alert Counter */}
        {flaggedCount > 0 && (
          <button 
            onClick={() => setActiveTab('fraud_lab')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-50 border border-red-200 text-[#E23744] font-extrabold text-xs hover:bg-red-100 transition animate-pulse cursor-pointer shrink-0 whitespace-nowrap"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#E23744] shrink-0" />
            <span>{flaggedCount} Flagged</span>
          </button>
        )}

      </div>
    </header>
  );
}
