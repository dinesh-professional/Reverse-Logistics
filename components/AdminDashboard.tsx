'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  IndianRupee, 
  Package, 
  Search, 
  SlidersHorizontal, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  Boxes
} from 'lucide-react';

export interface ReturnRecord {
  id: string;
  customerName: string;
  productName: string;
  category: string;
  platform: 'amazon' | 'flipkart' | 'meesho' | 'direct';
  marketplaceOrderId: string;
  lpnOrTrackId: string;
  status: 'In-Transit' | 'Flagged' | 'Cleared' | 'Under Audit';
  riskScore: number;
  fraudReason?: string;
  expectedImage: string;
  scannedImage: string;
  routing: string;
  date: string;
  platformRiskFactors?: string[];
  claimStatus?: 'Not Filed' | 'SAFE-T Drafted' | 'SPF Claimed' | 'Meesho Dispute Active' | 'Reimbursed';
  claimId?: string;
}

interface AdminDashboardProps {
  returnsList: ReturnRecord[];
  onSelectReturnForInspection: (record: ReturnRecord) => void;
  onUpdateRouting: (id: string, routing: string) => void;
}

export default function AdminDashboard({
  returnsList,
  onSelectReturnForInspection,
  onUpdateRouting
}: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Flagged' | 'In-Transit' | 'Cleared'>('All');

  const filteredReturns = returnsList.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.marketplaceOrderId && item.marketplaceOrderId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.lpnOrTrackId && item.lpnOrTrackId.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedFilter === 'Flagged') return matchesSearch && item.status === 'Flagged';
    if (selectedFilter === 'In-Transit') return matchesSearch && item.status === 'In-Transit';
    if (selectedFilter === 'Cleared') return matchesSearch && item.status === 'Cleared';
    return matchesSearch;
  });

  const totalCount = returnsList.length;
  const flaggedCount = returnsList.filter(r => r.status === 'Flagged').length;
  const highRiskPercent = Math.round((flaggedCount / (totalCount || 1)) * 100);

  const getPlatformBadge = (platform: ReturnRecord['platform']) => {
    switch (platform) {
      case 'amazon':
        return <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-extrabold text-[9px] uppercase tracking-wider whitespace-nowrap inline-block">AMAZON SP-API</span>;
      case 'flipkart':
        return <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-extrabold text-[9px] uppercase tracking-wider whitespace-nowrap inline-block">FLIPKART API</span>;
      case 'meesho':
        return <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-extrabold text-[9px] uppercase tracking-wider whitespace-nowrap inline-block">MEESHO HUB</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-700/50 text-slate-300 border border-slate-600 font-bold text-[9px] uppercase whitespace-nowrap inline-block">DIRECT STORE</span>;
    }
  };

  return (
    <div className="w-full space-y-6 text-xs">
      
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111119] p-5 rounded-2xl border border-purple-500/10 shadow-glass">
        <div>
          <h2 className="text-base font-black text-slate-100 flex items-center gap-2">
            Operations & AI Fraud Command Hub
          </h2>
          <p className="text-slate-400 text-xs font-medium mt-0.5">Multi-Platform Live Automated Reverse Logistics & Risk Intelligence</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search ID, Order, LPN or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl bg-purple-500/5 border border-purple-500/15 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:bg-[#111119] w-64 md:w-72 transition-all"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/15 cursor-pointer">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-[#111119] p-5 rounded-2xl border border-purple-500/10 shadow-glass hover:border-purple-500/30 hover:shadow-purple-glow transition-all space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 font-bold text-xs">Total Returns Processing</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center text-purple-400 shrink-0">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-black text-slate-100">{totalCount * 1250 + 42}</span>
            <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-0.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" /> Multi-Platform
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium pt-2 border-t border-purple-500/5">Amazon, Flipkart & Meesho synced</p>
        </div>

        <div className="bg-[#111119] p-5 rounded-2xl border border-purple-500/10 shadow-glass hover:border-rose-500/30 hover:shadow-red-glow transition-all space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 font-bold text-xs">Fraud Flag Rate</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-black text-rose-400">{highRiskPercent}%</span>
            <span className="text-rose-400 font-extrabold text-[11px] bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              {flaggedCount} High-Risk
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium pt-2 border-t border-purple-500/5">Auto-filing SAFE-T & SPF claims</p>
        </div>

        <div className="bg-[#111119] p-5 rounded-2xl border border-purple-500/10 shadow-glass hover:border-emerald-500/30 hover:shadow-green-glow transition-all space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 font-bold text-xs">Net Fraud Savings</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-black text-slate-100">₹1.84 Cr</span>
            <span className="text-emerald-400 font-bold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              YTD Savings
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium pt-2 border-t border-purple-500/5">Automated seller claim reimbursements</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <div className="lg:col-span-3 bg-[#111119] rounded-2xl border border-purple-500/10 shadow-glass flex flex-col">
          
          <div className="p-4 border-b border-purple-500/10 flex flex-wrap items-center justify-between gap-3 bg-purple-500/5">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-purple-400 shrink-0" />
              <h3 className="font-extrabold text-slate-100 text-sm">Returns Queue & Action Hub</h3>
            </div>

            <div className="flex items-center bg-[#111119] p-1 rounded-xl border border-purple-500/15">
              {(['All', 'Flagged', 'In-Transit', 'Cleared'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setSelectedFilter(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedFilter === tab
                      ? tab === 'Flagged'
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-purple-600 text-white shadow-purple-glow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto p-3">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-purple-500/10 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3">Platform & ID</th>
                  <th className="py-3 px-3">Order / LPN Track</th>
                  <th className="py-3 px-3">Customer & Item</th>
                  <th className="py-3 px-3">Risk Score</th>
                  <th className="py-3 px-3">Status & Claim</th>
                  <th className="py-3 px-3">Routing Hub</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/5">
                {filteredReturns.map((item) => {
                  const isHighRisk = item.riskScore >= 75;
                  const isMedRisk = item.riskScore >= 40 && item.riskScore < 75;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-purple-500/5 transition-colors duration-150 group ${
                        item.status === 'Flagged' ? 'bg-rose-500/5' : ''
                      }`}
                    >
                      <td className="py-3.5 px-3 align-top whitespace-nowrap">
                        <div className="mb-1">{getPlatformBadge(item.platform)}</div>
                        <div className="font-mono text-purple-400 font-black text-xs leading-normal mt-1">{item.id}</div>
                        <div className="text-[10px] text-slate-500 font-sans mt-0.5">{item.date}</div>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-xs align-top whitespace-nowrap">
                        <div className="font-bold text-slate-200 leading-normal">{item.marketplaceOrderId || 'N/A'}</div>
                        <div className="text-[11px] text-slate-500 font-sans mt-1">{item.lpnOrTrackId || 'N/A'}</div>
                      </td>

                      <td className="py-3.5 px-3 align-top max-w-[220px]">
                        <div className="font-bold text-slate-200 group-hover:text-purple-400 transition-colors leading-snug truncate">
                          {item.productName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium mt-1 truncate">{item.customerName}</div>
                      </td>

                      <td className="py-3.5 px-3 align-top whitespace-nowrap">
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="w-12 bg-slate-800 border border-slate-700 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isHighRisk ? 'bg-rose-500' : isMedRisk ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${item.riskScore}%` }}
                            />
                          </div>
                          <span
                            className={`font-mono font-black text-xs ${
                              isHighRisk ? 'text-rose-400' : isMedRisk ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {item.riskScore}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 align-top whitespace-nowrap space-y-1.5">
                        <div>
                          {item.status === 'Flagged' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                              Flagged Fraud
                            </span>
                          )}
                          {item.status === 'In-Transit' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3 shrink-0" />
                              In-Transit
                            </span>
                          )}
                          {item.status === 'Cleared' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit">
                              <CheckCircle className="w-3 h-3 shrink-0" />
                              Fast-Tracked
                            </span>
                          )}
                        </div>

                        {item.claimStatus && item.claimStatus !== 'Not Filed' && (
                          <span className="px-2 py-0.5 bg-slate-800 text-amber-400 rounded text-[9px] font-mono font-bold inline-block border border-slate-700">
                            {item.claimStatus}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 align-top whitespace-nowrap">
                        <select
                          value={item.routing}
                          onChange={(e) => onUpdateRouting(item.id, e.target.value)}
                          aria-label="Select warehouse routing hub"
                          className="bg-[#111119] border border-purple-500/15 rounded-lg text-xs text-slate-200 p-1.5 focus:border-purple-500 focus:outline-none shadow-xs font-bold"
                        >
                          <option value="Refurbish Center Hub B">Refurbish Hub B</option>
                          <option value="Restock WH-1">Restock WH-1</option>
                          <option value="Recycle Unit 4">Recycle Unit 4</option>
                          <option value="Fraud Vault (FBA Hold)">Fraud Vault (FBA Hold)</option>
                          <option value="Supplier Dispute Warehouse">Supplier Dispute WH</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-3 align-top text-right whitespace-nowrap">
                        {item.status === 'Flagged' ? (
                          <button
                            onClick={() => onSelectReturnForInspection(item)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                            Audit & Claim
                          </button>
                        ) : (
                          <button
                            onClick={() => onSelectReturnForInspection(item)}
                            className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-bold text-xs border border-purple-500/15 transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            Inspect
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          
          <div className="bg-[#111119] p-5 rounded-2xl border border-purple-500/10 flex flex-col items-center justify-center relative shadow-glass text-center space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              High Risk Interception
            </span>
            
            <div className="relative w-32 h-32 my-1">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="52" fill="none" stroke="#1E1630" strokeWidth="8" />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="8"
                  strokeDasharray="326"
                  strokeDashoffset={326 - (326 * highRiskPercent) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span className="text-2xl font-black text-rose-400">{highRiskPercent}%</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase mt-1">FLAGGED</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 font-medium">
              Amazon LPN, Flipkart IMEI & Meesho Vision
            </p>
          </div>

          <div className="bg-[#111119] p-5 rounded-2xl border border-purple-500/10 flex flex-col items-center justify-center relative shadow-glass text-center space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Low Risk Cleared
            </span>
            
            <div className="relative w-32 h-32 my-1">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="52" fill="none" stroke="#1E1630" strokeWidth="8" />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="8"
                  strokeDasharray="326"
                  strokeDashoffset={326 - (326 * 85) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span className="text-2xl font-black text-emerald-400">85%</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase mt-1">AUTO-REFUND</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 font-medium">
              Fast-tracked across all sellers
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}