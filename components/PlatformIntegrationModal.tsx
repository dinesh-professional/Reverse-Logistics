'use client';

import React, { useState } from 'react';
import { Shield, Zap, RefreshCw, CheckCircle2, Server, Key, Copy, AlertTriangle, ArrowRight, Play, Check } from 'lucide-react';
import { MarketplaceConfig, getMarketplaceConfig } from '../lib/platformIntegrations';

interface PlatformIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReturnIngested: () => void;
}

export default function PlatformIntegrationModal({
  isOpen,
  onClose,
  onReturnIngested,
}: PlatformIntegrationModalProps) {
  const [activeTab, setActiveTab] = useState<'credentials' | 'simulator'>('credentials');
  const [config, setConfig] = useState<MarketplaceConfig>(getMarketplaceConfig());
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Simulator State
  const [simulating, setSimulating] = useState<string | null>(null);
  const [simSuccessMsg, setSimSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(key);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Trigger Amazon Webhook Simulation
  const triggerAmazonSimulation = async () => {
    setSimulating('amazon');
    setSimSuccessMsg(null);
    try {
      const res = await fetch('/api/webhooks/amazon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-amz-sns-signature': 'sig_live_sp_api_valid_99812',
        },
        body: JSON.stringify({
          MarketplaceId: 'A21TJRUUN4KGV', // Amazon India
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
      if (data.success) {
        setSimSuccessMsg(`Amazon SP-API Webhook Processed! Return ${data.record.id} created with Risk Score ${data.record.riskScore}/100.`);
        onReturnIngested();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(null);
    }
  };

  // Trigger Flipkart Webhook Simulation
  const triggerFlipkartSimulation = async () => {
    setSimulating('flipkart');
    setSimSuccessMsg(null);
    try {
      const res = await fetch('/api/webhooks/flipkart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-flipkart-signature': 'sig_fk_v2_returns_valid_88190',
        },
        body: JSON.stringify({
          orderId: `OD${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
          trackingId: `FMPP-${Math.floor(1000000 + Math.random() * 9000000)}`,
          productTitle: 'OnePlus 12 (Emerald Green, 256GB)',
          imeiInvoice: '869201049281029',
          imeiScanned: '861029381029381',
          deliveryQcNotes: 'Tampered hologram box seal, non-matching serial number on outer carton',
          customerName: 'Rohan Joshi',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSimSuccessMsg(`Flipkart Seller API Webhook Processed! Return ${data.record.id} created with Risk Score ${data.record.riskScore}/100.`);
        onReturnIngested();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(null);
    }
  };

  // Trigger Meesho Webhook Simulation
  const triggerMeeshoSimulation = async () => {
    setSimulating('meesho');
    setSimSuccessMsg(null);
    try {
      const res = await fetch('/api/webhooks/meesho', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer meesho_supplier_token_live_33102',
        },
        body: JSON.stringify({
          subOrderId: `sub_ord_${Math.floor(10000000 + Math.random() * 90000000)}`,
          returnTrackingNumber: `M-RET-${Math.floor(10000 + Math.random() * 90000)}`,
          productName: 'Chanderi Cotton Dupatta & Kurta Set',
          pickupAgentQcMatch: false,
          visualSimilarityScore: 19,
          resellerBuyerClusterFlag: true,
          customerName: 'Meera Iyer',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSimSuccessMsg(`Meesho Supplier Hub Webhook Processed! Return ${data.record.id} created with Risk Score ${data.record.riskScore}/100.`);
        onReturnIngested();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FC8019]/20 border border-[#FC8019]/40 flex items-center justify-center text-[#FC8019]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                Live Marketplace API & Webhook Gateways
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-mono">
                  LIVE COMPATIBLE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Direct Integration Sync for Amazon India (SP-API), Flipkart Seller API & Meesho Supplier Hub
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('credentials')}
            className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'credentials'
                ? 'border-[#FC8019] text-[#FC8019]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-4 h-4" />
            Marketplace Credentials & Endpoints
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'simulator'
                ? 'border-[#FC8019] text-[#FC8019]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            Live Webhook Payload Simulator
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'credentials' ? (
            <div className="space-y-6">
              {/* Amazon SP-API Card */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/5 to-amber-500/0 border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-md">
                      amzn
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        Amazon Selling Partner API (SP-API)
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          ACTIVE SYNCHRONIZED
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500">Supports FBA/MFN Return Notifications & LPN Barcode Ingestion</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-mono text-[10px]">SELLER ID</span>
                    <span className="font-mono font-semibold text-slate-800">{config.amazon.sellerId}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-mono text-[10px]">SP-API CLIENT ID</span>
                    <span className="font-mono font-semibold text-slate-800">{config.amazon.spApiClientId}</span>
                  </div>
                </div>

                <div className="bg-slate-900 text-slate-200 p-3 rounded-lg flex items-center justify-between text-xs font-mono">
                  <div className="truncate mr-2">
                    <span className="text-slate-400 select-none">WEBHOOK URL: </span>
                    <span className="text-amber-400">{config.amazon.webhookUrl}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(config.amazon.webhookUrl, 'amzn')}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition flex items-center gap-1 shrink-0"
                  >
                    {copiedUrl === 'amzn' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl === 'amzn' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Flipkart Seller API Card */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-blue-500/5 to-blue-500/0 border border-blue-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                      FK
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        Flipkart Seller API (v2 / returns)
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          ACTIVE SYNCHRONIZED
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500">Supports Flipkart Delivery Agent Doorstep QC & IMEI Matching</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-mono text-[10px]">FLIPKART APP ID</span>
                    <span className="font-mono font-semibold text-slate-800">{config.flipkart.appId}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-mono text-[10px]">DELIVERY QC SYNC</span>
                    <span className="font-semibold text-emerald-600">ENABLED (Real-time agent notes)</span>
                  </div>
                </div>

                <div className="bg-slate-900 text-slate-200 p-3 rounded-lg flex items-center justify-between text-xs font-mono">
                  <div className="truncate mr-2">
                    <span className="text-slate-400 select-none">WEBHOOK URL: </span>
                    <span className="text-blue-400">{config.flipkart.webhookUrl}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(config.flipkart.webhookUrl, 'fk')}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition flex items-center gap-1 shrink-0"
                  >
                    {copiedUrl === 'fk' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl === 'fk' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Meesho Supplier API Card */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-pink-500/5 to-pink-500/0 border border-pink-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                      M
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        Meesho Supplier Hub API
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          ACTIVE SYNCHRONIZED
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500">Supports Meesho Doorstep Pickup Image AI Vision & Reseller Audit</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-mono text-[10px]">SUPPLIER ID</span>
                    <span className="font-mono font-semibold text-slate-800">{config.meesho.supplierId}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-mono text-[10px]">QC IMAGE VISION AI</span>
                    <span className="font-semibold text-pink-600">ACTIVE (Fabric & Product Matcher)</span>
                  </div>
                </div>

                <div className="bg-slate-900 text-slate-200 p-3 rounded-lg flex items-center justify-between text-xs font-mono">
                  <div className="truncate mr-2">
                    <span className="text-slate-400 select-none">WEBHOOK URL: </span>
                    <span className="text-pink-400">{config.meesho.webhookUrl}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(config.meesho.webhookUrl, 'msh')}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition flex items-center gap-1 shrink-0"
                  >
                    {copiedUrl === 'msh' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl === 'msh' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {simSuccessMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{simSuccessMsg}</span>
                  </div>
                </div>
              )}

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                <p className="font-semibold text-slate-800 mb-1">Live Webhook Simulator Instructions:</p>
                Click any of the platform triggers below to fire a live JSON payload to the respective API gateway (`/api/webhooks/*`). The AI fraud model will evaluate the return event in real-time!
              </div>

              {/* Simulation Action Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Amazon Simulator Button */}
                <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded uppercase">Amazon SP-API</span>
                      <span className="text-xs font-bold text-slate-800">Empty Box Swap</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Fires SP-API payload with iPad Pro return, LPN serial mismatch, and -360g weight deficit.
                    </p>
                  </div>

                  <button
                    onClick={triggerAmazonSimulation}
                    disabled={simulating !== null}
                    className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
                  >
                    {simulating === 'amazon' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Processing SP-API...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Fire Amazon Webhook
                      </>
                    )}
                  </button>
                </div>

                {/* Flipkart Simulator Button */}
                <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded uppercase">Flipkart API</span>
                      <span className="text-xs font-bold text-slate-800">IMEI Swap</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Fires Flipkart return payload with OnePlus 12 mobile phone IMEI mismatch & tampered seal notes.
                    </p>
                  </div>

                  <button
                    onClick={triggerFlipkartSimulation}
                    disabled={simulating !== null}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-50"
                  >
                    {simulating === 'flipkart' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Processing Flipkart API...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Fire Flipkart Webhook
                      </>
                    )}
                  </button>
                </div>

                {/* Meesho Simulator Button */}
                <div className="bg-white p-5 rounded-xl border border-pink-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-pink-100 text-pink-800 text-[10px] font-black rounded uppercase">Meesho Supplier</span>
                      <span className="text-xs font-bold text-slate-800">Wrong Fabric Swap</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Fires Meesho payload with Kurta set return, 19% image AI vision match & reseller cluster flag.
                    </p>
                  </div>

                  <button
                    onClick={triggerMeeshoSimulation}
                    disabled={simulating !== null}
                    className="w-full py-2.5 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-pink-600/20 disabled:opacity-50"
                  >
                    {simulating === 'meesho' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Processing Supplier Hub...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Fire Meesho Webhook
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition"
          >
            Close Integrations Hub
          </button>
        </div>

      </div>
    </div>
  );
}
