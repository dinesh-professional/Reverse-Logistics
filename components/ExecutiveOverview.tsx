'use client';

import React from 'react';
import { 
  ShieldAlert, 
  Package, 
  DollarSign, 
  ArrowUpRight, 
  Sparkles, 
  Zap, 
  Boxes,
  ShoppingBag,
  AlertTriangle
} from 'lucide-react';
import { ReturnRecord } from './AdminDashboard';
import { NavTab } from './SidebarNav';

interface ExecutiveOverviewProps {
  returnsList: ReturnRecord[];
  onNavigateTab: (tab: NavTab) => void;
  onSelectReturn: (record: ReturnRecord) => void;
}

export default function ExecutiveOverview({
  returnsList,
  onNavigateTab,
  onSelectReturn,
}: ExecutiveOverviewProps) {
  const totalCount = returnsList.length;
  const flaggedList = returnsList.filter(r => r.status === 'Flagged');
  const flaggedCount = flaggedList.length;
  const clearedCount = returnsList.filter(r => r.status === 'Cleared').length;
  const autoApprovedRate = totalCount > 0 ? Math.round((clearedCount / totalCount) * 100) : 17;
  
  // Calculate simulated fraud savings
  const estimatedSavings = flaggedCount * 34500 + 128500;

  return (
    <div className="w-full space-y-6 bg-[#FFFBF7]">
      
      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Fraud Saved */}
        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-xs relative overflow-hidden group hover:border-orange-300 hover:shadow-orange-glow transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Fraud Loss Intercepted</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FC8019] shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
              ₹{estimatedSavings.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-emerald-700 font-extrabold text-xs flex items-center bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +24% YTD
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Prevented via AI</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-orange-50 font-medium">
            Serial & Weight Verification Active
          </p>
        </div>

        {/* Metric 2: Returns Volume */}
        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-xs relative overflow-hidden group hover:border-orange-300 hover:shadow-orange-glow transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Processed Returns Volume</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FC8019] shrink-0">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
              {totalCount * 84 + 142}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-slate-700 font-bold text-xs bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                5 Channels Connected
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-orange-50 font-medium">
            Synced Amazon, Shopify, Flipkart & Woo
          </p>
        </div>

        {/* Metric 3: High Risk Interceptions */}
        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-xs relative overflow-hidden group hover:border-red-300 hover:shadow-red-glow transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">High Risk Intercepts</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#E23744] shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-black text-[#E23744] leading-tight">{flaggedCount}</span>
              <span className="text-[#E23744] font-extrabold text-base">Cases</span>
            </div>
            <div className="mt-2">
              <span className="text-[#E23744] font-extrabold text-xs bg-red-50 px-2 py-0.5 rounded border border-red-200 inline-block">
                Quarantined in Fraud Vault
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-orange-50 font-medium">
            Auto-generated SAFE-T & SPF Claims
          </p>
        </div>

        {/* Metric 4: Automation Accuracy */}
        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-xs relative overflow-hidden group hover:border-emerald-300 hover:shadow-green-glow transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">AI Instant Approval Rate</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
              {autoApprovedRate}%
            </div>
            <div className="mt-2">
              <span className="text-emerald-700 font-extrabold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                Auto-Routed to Restock
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-orange-50 font-medium">
            99.4% AI Vision model confidence score
          </p>
        </div>

      </div>

      {/* Main Content Grid: Visual Breakdown & Live Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Risk Distribution & Channel Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Channel Multi-Store Ingestion Stats */}
          <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#FC8019] shrink-0" />
                  Connected E-Commerce Channel Performance
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Reverse logistics stream breakdown by storefront</p>
              </div>
              <button 
                onClick={() => onNavigateTab('stores')}
                className="text-xs font-extrabold text-[#FC8019] hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                Manage Stores & Webhooks &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
              
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/90 flex flex-col justify-between space-y-2">
                <div className="text-[10px] font-extrabold uppercase text-amber-900 tracking-wider">Amazon SP-API</div>
                <div className="text-xl font-black text-slate-900">42% Vol</div>
                <div className="text-[10px] text-slate-600 font-bold bg-white px-2 py-0.5 rounded border border-orange-200 w-fit">SAFE-T Auto-Claim Active</div>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/90 flex flex-col justify-between space-y-2">
                <div className="text-[10px] font-extrabold uppercase text-amber-900 tracking-wider">Flipkart Seller</div>
                <div className="text-xl font-black text-slate-900">31% Vol</div>
                <div className="text-[10px] text-slate-600 font-bold bg-white px-2 py-0.5 rounded border border-orange-200 w-fit">SPF Dispute Integration</div>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/90 flex flex-col justify-between space-y-2">
                <div className="text-[10px] font-extrabold uppercase text-amber-900 tracking-wider">Meesho Hub</div>
                <div className="text-xl font-black text-slate-900">18% Vol</div>
                <div className="text-[10px] text-slate-600 font-bold bg-white px-2 py-0.5 rounded border border-orange-200 w-fit">Reseller Risk Scan</div>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/90 flex flex-col justify-between space-y-2">
                <div className="text-[10px] font-extrabold uppercase text-amber-900 tracking-wider">Shopify Direct</div>
                <div className="text-xl font-black text-slate-900">9% Vol</div>
                <div className="text-[10px] text-slate-600 font-bold bg-white px-2 py-0.5 rounded border border-orange-200 w-fit">Custom Return Portal</div>
              </div>

            </div>
          </div>

          {/* Smart Warehouse Dynamic Routing Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-[#FC8019] shrink-0" />
              Automated Reverse Logistics Routing Destination Distribution
            </h3>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Warehouse Restock (Grade A - Direct Resale)</span>
                  <span className="font-extrabold text-slate-900">54% of Volume</span>
                </div>
                <div className="w-full h-3 bg-orange-50 rounded-full overflow-hidden border border-orange-100 p-0.5">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '54%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Refurbish & Repair Hub B (Grade B)</span>
                  <span className="font-extrabold text-slate-900">28% of Volume</span>
                </div>
                <div className="w-full h-3 bg-orange-50 rounded-full overflow-hidden border border-orange-100 p-0.5">
                  <div className="h-full bg-[#FC8019] rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Fraud Vault Intercept (Under Dispute / Quarantined)</span>
                  <span className="font-extrabold text-[#E23744]">12% of Volume</span>
                </div>
                <div className="w-full h-3 bg-orange-50 rounded-full overflow-hidden border border-orange-100 p-0.5">
                  <div className="h-full bg-[#E23744] rounded-full" style={{ width: '12%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>B2B Liquidation / Auction (Grade C/D)</span>
                  <span className="font-extrabold text-slate-900">6% of Volume</span>
                </div>
                <div className="w-full h-3 bg-orange-50 rounded-full overflow-hidden border border-orange-100 p-0.5">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '6%' }} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Flagged Alert Feed & Actions */}
        <div className="space-y-6">
          
          {/* Action Callout: Test Customer Return Experience */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FC8019] via-orange-500 to-amber-600 text-white shadow-orange-glow relative overflow-hidden border border-orange-400 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-white/90 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 shrink-0" /> Customer Point of View
            </div>
            <h4 className="text-base font-black text-white leading-tight">Interactive Customer Return Portal</h4>
            <p className="text-xs text-orange-50 font-medium leading-relaxed">
              Experience how buyers return items from connected stores, complete AI image scanning, and get instant QR return labels.
            </p>
            <button
              onClick={() => onNavigateTab('customer_portal')}
              className="w-full py-3 px-4 bg-white text-[#FC8019] hover:bg-orange-50 rounded-xl text-xs font-black transition shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              Open Customer Portal POV &rarr;
            </button>
          </div>

          {/* Live High-Risk Intercept Feed */}
          <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#E23744] shrink-0" />
                Active Flagged Audit Queue
              </h4>
              <button 
                onClick={() => onNavigateTab('fraud_lab')}
                className="text-[11px] font-extrabold text-[#E23744] hover:underline cursor-pointer"
              >
                Inspect All ({flaggedCount})
              </button>
            </div>

            <div className="space-y-2.5 pt-1">
              {flaggedList.slice(0, 3).map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onSelectReturn(item)}
                  className="p-3.5 rounded-xl bg-orange-50/40 border border-orange-200/80 hover:border-[#E23744] hover:bg-red-50/40 transition cursor-pointer flex items-center justify-between gap-2"
                >
                  <div className="space-y-0.5 truncate pr-2 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{item.productName}</div>
                    <div className="text-[10px] text-slate-500 font-medium truncate">{item.customerName} • {item.id}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-100 text-[#E23744] border border-red-200 whitespace-nowrap">
                      {item.riskScore}% Risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
