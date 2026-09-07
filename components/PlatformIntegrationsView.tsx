'use client';

import React, { useState } from 'react';
import { Server, Zap, CheckCircle2, Copy, Play, Check } from 'lucide-react';

interface PlatformIntegrationsViewProps {
  onReturnIngested: () => void;
}

export default function PlatformIntegrationsView({ onReturnIngested }: PlatformIntegrationsViewProps) {
  const [activeTab, setActiveTab] = useState<'stores' | 'webhook_tester'>('stores');
  const [simulating, setSimulating] = useState<string | null>(null);
  const [logResponse, setLogResponse] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (text: string, key: string) => { navigator.clipboard.writeText(text); setCopiedKey(key); setTimeout(() => setCopiedKey(null), 2000); };

  const runAmazonSim = async () => {
    setSimulating('amazon'); setLogResponse(null);
    try { const res = await fetch('/api/webhooks/amazon', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ MarketplaceId: 'A21TJRUUN4KGV', AmazonOrderId: `408-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`, LPNNumber: `LPNIN${Math.floor(100000000 + Math.random() * 900000000)}`, ReturnReasonCode: 'DEFECTIVE_SWAP', ProductName: 'Apple iPad Pro 12.9" M2 (1TB)', ScannedWeightGrams: 320, CatalogWeightGrams: 680, SerialNoScanned: 'SN-DUMMY-99821', ExpectedSerialNo: 'SN-APPLE-ORIG-10029', CustomerName: 'Karan Malhotra' }) }); const data = await res.json(); setLogResponse(JSON.stringify(data, null, 2)); if (data.success) onReturnIngested(); } catch (err) { setLogResponse(String(err)); } finally { setSimulating(null); }
  };

  const runFlipkartSim = async () => {
    setSimulating('flipkart'); setLogResponse(null);
    try { const res = await fetch('/api/webhooks/flipkart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: `OD${Math.floor(10000000000000 + Math.random() * 90000000000000)}`, trackingId: `FMPP-${Math.floor(1000000 + Math.random() * 9000000)}`, productTitle: 'OnePlus 12 (Emerald Green, 256GB)', imeiInvoice: '869201049281029', imeiScanned: '861029381029381', deliveryQcNotes: 'Tampered hologram box seal', customerName: 'Rohan Joshi' }) }); const data = await res.json(); setLogResponse(JSON.stringify(data, null, 2)); if (data.success) onReturnIngested(); } catch (err) { setLogResponse(String(err)); } finally { setSimulating(null); }
  };

  const runMeeshoSim = async () => {
    setSimulating('meesho'); setLogResponse(null);
    try { const res = await fetch('/api/webhooks/meesho', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subOrderId: `sub_ord_${Math.floor(10000000 + Math.random() * 90000000)}`, returnTrackingNumber: `M-RET-${Math.floor(10000 + Math.random() * 90000)}`, productName: 'Chanderi Cotton Dupatta Set', pickupAgentQcMatch: false, visualSimilarityScore: 19, resellerBuyerClusterFlag: true, customerName: 'Ananya Deshmukh' }) }); const data = await res.json(); setLogResponse(JSON.stringify(data, null, 2)); if (data.success) onReturnIngested(); } catch (err) { setLogResponse(String(err)); } finally { setSimulating(null); }
  };

  const platforms = [
    { id: 'shopify', name: 'Shopify Plus Storefront', category: 'Direct E-Commerce', badge: 'Active Sync', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', apiKey: 'shpat_live_998124091823901', webhookUrl: 'https://api.reverselogistics.ai/v1/webhooks/shopify', status: 'Connected' },
    { id: 'amazon', name: 'Amazon Seller Central (SP-API)', category: 'Marketplace', badge: 'SAFE-T Auto-Claim', badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20', apiKey: 'amzn_sp_live_449018290123', webhookUrl: 'https://api.reverselogistics.ai/v1/webhooks/amazon', status: 'Connected' },
    { id: 'flipkart', name: 'Flipkart Seller Hub API', category: 'Marketplace', badge: 'SPF Claim Active', badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20', apiKey: 'fk_v2_live_109283019283', webhookUrl: 'https://api.reverselogistics.ai/v1/webhooks/flipkart', status: 'Connected' },
    { id: 'woocommerce', name: 'WooCommerce Storefront', category: 'Open Source', badge: 'Live Sync', badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20', apiKey: 'ck_wc_live_998129031823', webhookUrl: 'https://api.reverselogistics.ai/v1/webhooks/woocommerce', status: 'Connected' },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111119] p-5 rounded-2xl border border-purple-500/10 shadow-glass">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center text-purple-400"><Server className="w-5 h-5" /></div>
          <div>
            <h2 className="text-base font-black text-slate-100">Connected Stores & API Webhooks Hub</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Manage marketplace credentials, webhook subscriptions, and real-time payload testing</p>
          </div>
        </div>
        <div className="flex items-center bg-purple-500/5 p-1 rounded-xl border border-purple-500/10 text-xs">
          <button onClick={() => setActiveTab('stores')} className={`px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer ${activeTab === 'stores' ? 'bg-purple-600 text-white shadow-purple-glow' : 'text-slate-400 hover:text-purple-400'}`}>Connected Stores ({platforms.length})</button>
          <button onClick={() => setActiveTab('webhook_tester')} className={`px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer ${activeTab === 'webhook_tester' ? 'bg-purple-600 text-white shadow-purple-glow' : 'text-slate-400 hover:text-purple-400'}`}>Live Webhook Tester</button>
        </div>
      </div>

      {activeTab === 'stores' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((plat) => (
            <div key={plat.id} className="bg-[#111119] p-6 rounded-2xl border border-purple-500/10 shadow-glass space-y-4 hover:border-purple-500/25 transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-100">{plat.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${plat.badgeColor}`}>{plat.badge}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{plat.category}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-extrabold bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-purple-500/10">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">API Key / Token:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="password" readOnly value={plat.apiKey} className="flex-1 p-2 bg-purple-500/5 border border-purple-500/10 rounded-xl text-xs font-mono text-slate-300" />
                    <button onClick={() => copyText(plat.apiKey, `key_${plat.id}`)} className="p-2 bg-[#111119] hover:bg-purple-500/10 border border-purple-500/10 rounded-xl text-slate-400 transition cursor-pointer">
                      {copiedKey === `key_${plat.id}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Webhook Endpoint URL:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="text" readOnly value={plat.webhookUrl} className="flex-1 p-2 bg-purple-500/5 border border-purple-500/10 rounded-xl text-xs font-mono text-slate-300" />
                    <button onClick={() => copyText(plat.webhookUrl, `url_${plat.id}`)} className="p-2 bg-[#111119] hover:bg-purple-500/10 border border-purple-500/10 rounded-xl text-slate-400 transition cursor-pointer">
                      {copiedKey === `url_${plat.id}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#111119] p-6 rounded-2xl border border-purple-500/10 shadow-glass space-y-6">
          <div>
            <h3 className="text-sm font-black text-slate-100 flex items-center gap-2"><Zap className="w-4 h-4 text-purple-400" /> Simulate Real E-Commerce Return Webhooks</h3>
            <p className="text-xs text-slate-400 font-medium">Click any button below to fire an authentic JSON webhook event into the backend API stream</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={runAmazonSim} disabled={simulating !== null} className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 text-left transition cursor-pointer space-y-2 group">
              <div className="flex items-center justify-between"><span className="text-xs font-extrabold uppercase text-purple-400">Amazon SP-API</span><Play className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition" /></div>
              <div className="text-xs font-black text-slate-100">Simulate FBA Serial Swap</div>
              <p className="text-[11px] text-slate-400 font-medium">iPad Pro return with weight deficit & dummy serial</p>
            </button>
            <button onClick={runFlipkartSim} disabled={simulating !== null} className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 text-left transition cursor-pointer space-y-2 group">
              <div className="flex items-center justify-between"><span className="text-xs font-extrabold uppercase text-purple-400">Flipkart Seller Hub</span><Play className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition" /></div>
              <div className="text-xs font-black text-slate-100">Simulate Flipkart QC Scan</div>
              <p className="text-[11px] text-slate-400 font-medium">OnePlus 12 return with tampered IMEI hologram seal</p>
            </button>
            <button onClick={runMeeshoSim} disabled={simulating !== null} className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 text-left transition cursor-pointer space-y-2 group">
              <div className="flex items-center justify-between"><span className="text-xs font-extrabold uppercase text-purple-400">Meesho Supplier API</span><Play className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition" /></div>
              <div className="text-xs font-black text-slate-100">Simulate Fabric Texture Scan</div>
              <p className="text-[11px] text-slate-400 font-medium">Dupatta return with wrong fabric substitution</p>
            </button>
          </div>
          {logResponse && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase">Live Webhook Backend Response:</div>
              <pre className="p-4 bg-slate-900 text-purple-300 font-mono text-xs rounded-xl overflow-x-auto border border-purple-500/10">{logResponse}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}