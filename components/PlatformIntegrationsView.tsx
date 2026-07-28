'use client';

import React, { useState } from 'react';
import { 
  Store, 
  Server, 
  Zap, 
  CheckCircle2, 
  Copy, 
  Play, 
  Check
} from 'lucide-react';

interface PlatformIntegrationsViewProps {
  onReturnIngested: () => void;
}

export default function PlatformIntegrationsView({ onReturnIngested }: PlatformIntegrationsViewProps) {
  const [activeTab, setActiveTab] = useState<'stores' | 'webhook_tester'>('stores');
  const [simulating, setSimulating] = useState<string | null>(null);
  const [logResponse, setLogResponse] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Webhook Test Trigger: Amazon SP-API
  const runAmazonSim = async () => {
    setSimulating('amazon');
    setLogResponse(null);
    try {
      const res = await fetch('/api/webhooks/amazon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          MarketplaceId: 'A21TJRUUN4KGV',
          AmazonOrderId: `408-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`,
          LPNNumber: `LPNIN${Math.floor(100000000 + Math.random() * 900000000)}`,
          ReturnReasonCode: 'DEFECTIVE_SWAP',
          ProductName: 'Apple iPad Pro 12.9" M2 (1TB)',
          ScannedWeightGrams: 320,
          CatalogWeightGrams: 680,
          SerialNoScanned: 'SN-DUMMY-99821',
          ExpectedSerialNo: 'SN-APPLE-ORIG-10029',
          CustomerName: 'Karan Malhotra',
        }),
      });
      const data = await res.json();
      setLogResponse(JSON.stringify(data, null, 2));
      if (data.success) {
        onReturnIngested();
      }
    } catch (err) {
      setLogResponse(String(err));
    } finally {
      setSimulating(null);
    }
  };

  // Webhook Test Trigger: Flipkart API
  const runFlipkartSim = async () => {
    setSimulating('flipkart');
    setLogResponse(null);
    try {
      const res = await fetch('/api/webhooks/flipkart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: `OD${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
          trackingId: `FMPP-${Math.floor(1000000 + Math.random() * 9000000)}`,
          productTitle: 'OnePlus 12 (Emerald Green, 256GB)',
          imeiInvoice: '869201049281029',
          imeiScanned: '861029381029381',
          deliveryQcNotes: 'Tampered hologram box seal, non-matching serial number',
          customerName: 'Rohan Joshi',
        }),
      });
      const data = await res.json();
      setLogResponse(JSON.stringify(data, null, 2));
      if (data.success) {
        onReturnIngested();
      }
    } catch (err) {
      setLogResponse(String(err));
    } finally {
      setSimulating(null);
    }
  };

  // Webhook Test Trigger: Meesho API
  const runMeeshoSim = async () => {
    setSimulating('meesho');
    setLogResponse(null);
    try {
      const res = await fetch('/api/webhooks/meesho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subOrderId: `sub_ord_${Math.floor(10000000 + Math.random() * 90000000)}`,
          returnTrackingNumber: `M-RET-${Math.floor(10000 + Math.random() * 90000)}`,
          productName: 'Chanderi Cotton Dupatta & Kurta Set',
          pickupAgentQcMatch: false,
          visualSimilarityScore: 19,
          resellerBuyerClusterFlag: true,
          customerName: 'Ananya Deshmukh',
        }),
      });
      const data = await res.json();
      setLogResponse(JSON.stringify(data, null, 2));
      if (data.success) {
        onReturnIngested();
      }
    } catch (err) {
      setLogResponse(String(err));
    } finally {
      setSimulating(null);
    }
  };

  const platforms = [
    {
      id: 'shopify',
      name: 'Shopify Plus Storefront App',
      category: 'Direct E-Commerce Storefront',
      badge: 'Active Sync',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      apiKey: 'shpat_live_998124091823901',
      webhookUrl: 'https://api.reverselogistics.ai/v1/webhooks/shopify',
      status: 'Connected • 24ms ping',
    },
    {
      id: 'amazon',
      name: 'Amazon Seller Central (SP-API)',
      category: 'Marketplace Integration',
      badge: 'SAFE-T Auto-Claim',
      badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
      apiKey: 'amzn_sp_live_449018290123',
      webhookUrl: 'https://api.reverselogistics.ai/v1/webhooks/amazon',
      status: 'Connected • FBA & MFN Synced',
    },
    {
      id: 'flipkart',
      name: 'Flipkart Seller Hub API',
      category: 'Marketplace Integration',
      badge: 'SPF Claim Active',
      badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
      apiKey: 'fk_v2_live_109283019283',
      webhookUrl: 'https://api.reverselogistics.ai/v1/webhooks/flipkart',
      status: 'Connected • QC Agent Scan',
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce Storefront Plugin',
      category: 'Open Source E-Commerce',
      badge: 'Live Sync',
      badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
      apiKey: 'ck_wc_live_998129031823',
      webhookUrl: 'https://api.reverselogistics.ai/v1/webhooks/woocommerce',
      status: 'Connected • Rest API v3',
    },
  ];

  return (
    <div className="w-full space-y-6 bg-[#FFFBF7]">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-orange-100 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FC8019]">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Connected E-Commerce Stores & API Webhooks Hub</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Manage marketplace credentials, webhook subscriptions, and real-time payload testing</p>
          </div>
        </div>

        <div className="flex items-center bg-orange-50/80 p-1 rounded-xl border border-orange-200 text-xs">
          <button
            onClick={() => setActiveTab('stores')}
            className={`px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer ${
              activeTab === 'stores' ? 'bg-[#FC8019] text-white shadow-orange-glow' : 'text-slate-700 hover:text-[#FC8019]'
            }`}
          >
            Connected Stores ({platforms.length})
          </button>
          <button
            onClick={() => setActiveTab('webhook_tester')}
            className={`px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer ${
              activeTab === 'webhook_tester' ? 'bg-[#FC8019] text-white shadow-orange-glow' : 'text-slate-700 hover:text-[#FC8019]'
            }`}
          >
            ⚡ Live Webhook Tester
          </button>
        </div>
      </div>

      {activeTab === 'stores' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((plat) => (
            <div key={plat.id} className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs space-y-4 hover:border-orange-300 transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">{plat.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${plat.badgeColor}`}>
                      {plat.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{plat.category}</p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-orange-100">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Production API Key / Token:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="password"
                      readOnly
                      value={plat.apiKey}
                      className="flex-1 p-2 bg-orange-50/50 border border-orange-200 rounded-xl text-xs font-mono text-slate-800"
                    />
                    <button
                      onClick={() => copyText(plat.apiKey, `key_${plat.id}`)}
                      className="p-2 bg-white hover:bg-orange-50 border border-orange-200 rounded-xl text-slate-700 transition cursor-pointer"
                    >
                      {copiedKey === `key_${plat.id}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Webhook Endpoint URL:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      readOnly
                      value={plat.webhookUrl}
                      className="flex-1 p-2 bg-orange-50/50 border border-orange-200 rounded-xl text-xs font-mono text-slate-800"
                    />
                    <button
                      onClick={() => copyText(plat.webhookUrl, `url_${plat.id}`)}
                      className="p-2 bg-white hover:bg-orange-50 border border-orange-200 rounded-xl text-slate-700 transition cursor-pointer"
                    >
                      {copiedKey === `url_${plat.id}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIVE WEBHOOK PAYLOAD TESTER */
        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FC8019]" />
              Simulate Real E-Commerce Return Webhook Callbacks
            </h3>
            <p className="text-xs text-slate-500 font-medium">Click any button below to fire an authentic JSON webhook event into the backend API stream</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <button
              onClick={runAmazonSim}
              disabled={simulating !== null}
              className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 hover:bg-orange-100/80 text-left transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-[#FC8019]">Amazon SP-API</span>
                <Play className="w-4 h-4 text-[#FC8019] group-hover:translate-x-0.5 transition" />
              </div>
              <div className="text-xs font-black text-slate-900">Simulate FBA Serial Swap Webhook</div>
              <p className="text-[11px] text-slate-600 font-medium">Sends iPad Pro return with weight deficit & dummy serial number</p>
            </button>

            <button
              onClick={runFlipkartSim}
              disabled={simulating !== null}
              className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 hover:bg-orange-100/80 text-left transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-[#FC8019]">Flipkart Seller Hub</span>
                <Play className="w-4 h-4 text-[#FC8019] group-hover:translate-x-0.5 transition" />
              </div>
              <div className="text-xs font-black text-slate-900">Simulate Flipkart QC Agent Scan</div>
              <p className="text-[11px] text-slate-600 font-medium">Sends OnePlus 12 return with tampered IMEI hologram seal</p>
            </button>

            <button
              onClick={runMeeshoSim}
              disabled={simulating !== null}
              className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 hover:bg-orange-100/80 text-left transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-[#FC8019]">Meesho Supplier API</span>
                <Play className="w-4 h-4 text-[#FC8019] group-hover:translate-x-0.5 transition" />
              </div>
              <div className="text-xs font-black text-slate-900">Simulate Fabric Texture Scan</div>
              <p className="text-[11px] text-slate-600 font-medium">Sends Dupatta return with wrong synthetic fabric substitution</p>
            </button>

          </div>

          {logResponse && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase">Live Webhook Backend Response Payload:</div>
              <pre className="p-4 bg-slate-950 text-orange-300 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800">
                {logResponse}
              </pre>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
