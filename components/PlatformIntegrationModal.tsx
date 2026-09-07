'use client';

import React, { useState } from 'react';
import { Server, Zap, RefreshCw, CheckCircle2, Copy, Play, Check } from 'lucide-react';
import { MarketplaceConfig, getMarketplaceConfig } from '../lib/platformIntegrations';

interface PlatformIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReturnIngested: () => void;
}

export default function PlatformIntegrationModal({ isOpen, onClose, onReturnIngested }: PlatformIntegrationModalProps) {
  const [activeTab, setActiveTab] = useState<'credentials' | 'simulator'>('credentials');
  const [config] = useState<MarketplaceConfig>(getMarketplaceConfig());
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [simulating, setSimulating] = useState<string | null>(null);
  const [simSuccessMsg, setSimSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => { navigator.clipboard.writeText(text); setCopiedUrl(key); setTimeout(() => setCopiedUrl(null), 2000); };

  const triggerAmazonSimulation = async () => {
    setSimulating('amazon'); setSimSuccessMsg(null);
    try { const res = await fetch('/api/webhooks/amazon', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-amz-sns-signature': 'sig_valid' }, body: JSON.stringify({ MarketplaceId: 'A21TJRUUN4KGV', AmazonOrderId: `408-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`, LPNNumber: `LPNIN${Math.floor(100000000 + Math.random() * 900000000)}`, ReturnReasonCode: 'DEFECTIVE_SWAP', ProductName: 'Apple iPad Pro 12.9" M2 (1TB)', ScannedWeightGrams: 320, CatalogWeightGrams: 680, SerialNoScanned: 'SN-DUMMY-99821', ExpectedSerialNo: 'SN-APPLE-ORIG-10029', CustomerName: 'Karan Malhotra' }) }); const data = await res.json(); if (data.success) { setSimSuccessMsg(`Amazon SP-API Webhook Processed! Return ${data.record.id} created with Risk Score ${data.record.riskScore}/100.`); onReturnIngested(); } } catch (err) { console.error(err); } finally { setSimulating(null); }
  };

  const triggerFlipkartSimulation = async () => {
    setSimulating('flipkart'); setSimSuccessMsg(null);
    try { const res = await fetch('/api/webhooks/flipkart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: `OD${Math.floor(10000000000000 + Math.random() * 90000000000000)}`, trackingId: `FMPP-${Math.floor(1000000 + Math.random() * 9000000)}`, productTitle: 'OnePlus 12 (256GB)', imeiInvoice: '869201049281029', imeiScanned: '861029381029381', deliveryQcNotes: 'Tampered hologram seal', customerName: 'Rohan Joshi' }) }); const data = await res.json(); if (data.success) { setSimSuccessMsg(`Flipkart Seller API Webhook Processed! Return ${data.record.id} created with Risk Score ${data.record.riskScore}/100.`); onReturnIngested(); } } catch (err) { console.error(err); } finally { setSimulating(null); }
  };

  const triggerMeeshoSimulation = async () => {
    setSimulating('meesho'); setSimSuccessMsg(null);
    try { const res = await fetch('/api/webhooks/meesho', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer meesho_token' }, body: JSON.stringify({ subOrderId: `sub_ord_${Math.floor(10000000 + Math.random() * 90000000)}`, returnTrackingNumber: `M-RET-${Math.floor(10000 + Math.random() * 90000)}`, productName: 'Chanderi Cotton Dupatta Set', pickupAgentQcMatch: false, visualSimilarityScore: 19, resellerBuyerClusterFlag: true, customerName: 'Meera Iyer' }) }); const data = await res.json(); if (data.success) { setSimSuccessMsg(`Meesho Supplier Hub Webhook Processed! Return ${data.record.id} created with Risk Score ${data.record.riskScore}/100.`); onReturnIngested(); } } catch (err) { console.error(err); } finally { setSimulating(null); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08080F]/80 backdrop-blur-sm p-4">
      <div className="bg-[#111119] rounded-2xl shadow-2xl border border-purple-500/15 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400"><Server className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                Live Marketplace API & Webhook Gateways
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-mono">LIVE</span>
              </h2>
              <p className="text-xs text-slate-400">Amazon SP-API, Flipkart Seller API & Meesho Supplier Hub</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition">X</button>
        </div>

        <div className="flex border-b border-purple-500/10 bg-slate-900/50 px-6 pt-3 gap-4">
          <button onClick={() => setActiveTab('credentials')} className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition ${activeTab === 'credentials' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
            Marketplace Credentials
          </button>
          <button onClick={() => setActiveTab('simulator')} className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition ${activeTab === 'simulator' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
            Live Webhook Simulator
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'credentials' ? (
            <div className="space-y-6">
              {/* Amazon */}
              <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-md">amzn</div>
                  <div>
                    <h3 className="font-bold text-slate-100 flex items-center gap-2">Amazon Selling Partner API (SP-API) <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">ACTIVE</span></h3>
                    <p className="text-xs text-slate-400">FBA/MFN Return Notifications & LPN Barcode Ingestion</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#08080F] p-3 rounded-lg border border-purple-500/10"><span className="text-slate-500 block font-mono text-[10px]">SELLER ID</span><span className="font-mono font-semibold text-slate-300">{config.amazon.sellerId}</span></div>
                  <div className="bg-[#08080F] p-3 rounded-lg border border-purple-500/10"><span className="text-slate-500 block font-mono text-[10px]">SP-API CLIENT ID</span><span className="font-mono font-semibold text-slate-300">{config.amazon.spApiClientId}</span></div>
                </div>
                <div className="bg-slate-900 text-slate-200 p-3 rounded-lg flex items-center justify-between text-xs font-mono">
                  <div className="truncate mr-2"><span className="text-slate-500 select-none">WEBHOOK: </span><span className="text-purple-400">{config.amazon.webhookUrl}</span></div>
                  <button onClick={() => copyToClipboard(config.amazon.webhookUrl, 'amzn')} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition flex items-center gap-1 shrink-0">
                    {copiedUrl === 'amzn' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl === 'amzn' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Flipkart */}
              <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md">FK</div>
                  <div>
                    <h3 className="font-bold text-slate-100 flex items-center gap-2">Flipkart Seller API (v2) <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">ACTIVE</span></h3>
                    <p className="text-xs text-slate-400">Delivery Agent Doorstep QC & IMEI Matching</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#08080F] p-3 rounded-lg border border-purple-500/10"><span className="text-slate-500 block font-mono text-[10px]">APP ID</span><span className="font-mono font-semibold text-slate-300">{config.flipkart.appId}</span></div>
                  <div className="bg-[#08080F] p-3 rounded-lg border border-purple-500/10"><span className="text-slate-500 block font-mono text-[10px]">DELIVERY QC SYNC</span><span className="font-semibold text-emerald-400">ENABLED</span></div>
                </div>
                <div className="bg-slate-900 text-slate-200 p-3 rounded-lg flex items-center justify-between text-xs font-mono">
                  <div className="truncate mr-2"><span className="text-slate-500 select-none">WEBHOOK: </span><span className="text-blue-400">{config.flipkart.webhookUrl}</span></div>
                  <button onClick={() => copyToClipboard(config.flipkart.webhookUrl, 'fk')} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition flex items-center gap-1 shrink-0">
                    {copiedUrl === 'fk' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl === 'fk' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Meesho */}
              <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-600 text-white font-black text-xs flex items-center justify-center shadow-md">M</div>
                  <div>
                    <h3 className="font-bold text-slate-100 flex items-center gap-2">Meesho Supplier Hub API <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">ACTIVE</span></h3>
                    <p className="text-xs text-slate-400">Doorstep Pickup Image AI Vision & Reseller Audit</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#08080F] p-3 rounded-lg border border-purple-500/10"><span className="text-slate-500 block font-mono text-[10px]">SUPPLIER ID</span><span className="font-mono font-semibold text-slate-300">{config.meesho.supplierId}</span></div>
                  <div className="bg-[#08080F] p-3 rounded-lg border border-purple-500/10"><span className="text-slate-500 block font-mono text-[10px]">QC IMAGE VISION AI</span><span className="font-semibold text-pink-400">ACTIVE</span></div>
                </div>
                <div className="bg-slate-900 text-slate-200 p-3 rounded-lg flex items-center justify-between text-xs font-mono">
                  <div className="truncate mr-2"><span className="text-slate-500 select-none">WEBHOOK: </span><span className="text-pink-400">{config.meesho.webhookUrl}</span></div>
                  <button onClick={() => copyToClipboard(config.meesho.webhookUrl, 'msh')} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition flex items-center gap-1 shrink-0">
                    {copiedUrl === 'msh' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl === 'msh' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {simSuccessMsg && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" /><span>{simSuccessMsg}</span>
                </div>
              )}
              <div className="p-4 bg-slate-900 border border-purple-500/10 rounded-xl text-xs text-slate-400">
                <p className="font-semibold text-slate-300 mb-1">Live Webhook Simulator:</p>
                Click any trigger below to fire a live JSON payload to the API gateway. The AI fraud model evaluates in real-time!
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#111119] p-5 rounded-xl border border-purple-500/10 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2"><span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-black rounded uppercase border border-amber-500/20">Amazon SP-API</span><span className="text-xs font-bold text-slate-200">Empty Box Swap</span></div>
                    <p className="text-xs text-slate-400">iPad Pro return, LPN serial mismatch, -360g weight deficit.</p>
                  </div>
                  <button onClick={triggerAmazonSimulation} disabled={simulating !== null} className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50">
                    {simulating === 'amazon' ? (<><RefreshCw className="w-4 h-4 animate-spin" />Processing...</>) : (<><Play className="w-3.5 h-3.5 fill-current" />Fire Amazon Webhook</>)}
                  </button>
                </div>
                <div className="bg-[#111119] p-5 rounded-xl border border-purple-500/10 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2"><span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded uppercase border border-blue-500/20">Flipkart API</span><span className="text-xs font-bold text-slate-200">IMEI Swap</span></div>
                    <p className="text-xs text-slate-400">OnePlus 12 IMEI mismatch & tampered seal notes.</p>
                  </div>
                  <button onClick={triggerFlipkartSimulation} disabled={simulating !== null} className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50">
                    {simulating === 'flipkart' ? (<><RefreshCw className="w-4 h-4 animate-spin" />Processing...</>) : (<><Play className="w-3.5 h-3.5 fill-current" />Fire Flipkart Webhook</>)}
                  </button>
                </div>
                <div className="bg-[#111119] p-5 rounded-xl border border-purple-500/10 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2"><span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 text-[10px] font-black rounded uppercase border border-pink-500/20">Meesho</span><span className="text-xs font-bold text-slate-200">Wrong Fabric Swap</span></div>
                    <p className="text-xs text-slate-400">Kurta set, 19% AI vision match & reseller cluster flag.</p>
                  </div>
                  <button onClick={triggerMeeshoSimulation} disabled={simulating !== null} className="w-full py-2.5 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50">
                    {simulating === 'meesho' ? (<><RefreshCw className="w-4 h-4 animate-spin" />Processing...</>) : (<><Play className="w-3.5 h-3.5 fill-current" />Fire Meesho Webhook</>)}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-900 border-t border-purple-500/10 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition">Close Integrations Hub</button>
        </div>

      </div>
    </div>
  );
}