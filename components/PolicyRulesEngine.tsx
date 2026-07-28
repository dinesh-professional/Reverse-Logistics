'use client';

import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  ArrowRight,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function PolicyRulesEngine() {
  const [rules, setRules] = useState([
    {
      id: 'RULE-01',
      name: 'High-Risk Fraud Intercept Rule',
      condition: 'Risk Score > 80% OR Serial Mismatch',
      action: 'Route to Fraud Vault & Draft SAFE-T / SPF Claim',
      status: 'Active',
      enabled: true,
    },
    {
      id: 'RULE-02',
      name: 'Instant Auto-Refund Low Value Rule',
      condition: 'Item Value < $50 AND Customer Risk Score < 15%',
      action: 'Instant Refund & Restock WH-1 Direct',
      status: 'Active',
      enabled: true,
    },
    {
      id: 'RULE-03',
      name: 'Electronics Functional Test Quarantine',
      condition: 'Category == Electronics AND Return Reason == Defective',
      action: 'Route to Refurbish Center Hub B for Hardware Scan',
      status: 'Active',
      enabled: true,
    },
    {
      id: 'RULE-04',
      name: 'Apparel Reseller Swap Scan',
      condition: 'Visual Texture Match < 40%',
      action: 'Hold Refund & Alert Seller Dispute Desk',
      status: 'Active',
      enabled: true,
    },
  ]);

  const toggleRule = (id: string) => {
    setRules(prev =>
      prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
    );
  };

  return (
    <div className="w-full p-6 space-y-6 bg-[#FFFBF7]">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-orange-100 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FC8019]">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Policy Rules & Dynamic Routing Engine</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Define automated fraud thresholds, return windows, and dynamic warehouse destinations</p>
          </div>
        </div>

        <button className="px-3.5 py-2 bg-[#FC8019] hover:bg-[#E56F0D] text-white rounded-xl font-bold text-xs shadow-orange-glow transition flex items-center gap-1.5 cursor-pointer">
          <Plus className="w-4 h-4" /> Add Custom Policy Rule
        </button>
      </div>

      {/* Rules List Grid */}
      <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FC8019]" />
          Active Automated Decision Rules
        </h3>

        <div className="space-y-3">
          {rules.map((rule) => (
            <div 
              key={rule.id}
              className={`p-4 rounded-2xl border transition flex items-center justify-between ${
                rule.enabled ? 'bg-orange-50/40 border-orange-200' : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-orange-100 text-[#FC8019] font-mono font-bold text-[10px] border border-orange-200">
                    {rule.id}
                  </span>
                  <h4 className="text-xs font-black text-slate-900">{rule.name}</h4>
                </div>
                <div className="text-xs text-slate-600 font-medium flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-slate-400">If:</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-orange-200">{rule.condition}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FC8019]" />
                  <span className="text-slate-400">Then:</span>
                  <span className="font-extrabold text-[#FC8019] bg-white px-2 py-0.5 rounded border border-orange-300 shadow-xs">{rule.action}</span>
                </div>
              </div>

              <button
                onClick={() => toggleRule(rule.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-orange-200 hover:border-orange-300 text-xs font-bold transition cursor-pointer"
              >
                {rule.enabled ? (
                  <>
                    <ToggleRight className="w-5 h-5 text-[#FC8019]" />
                    <span className="text-[#FC8019] font-extrabold">Active</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-500">Disabled</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
