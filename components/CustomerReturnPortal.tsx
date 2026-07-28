'use client';

import React, { useState } from 'react';
import { 
  Smartphone, 
  CheckCircle2, 
  Camera, 
  Sparkles, 
  QrCode, 
  ArrowLeft, 
  ShieldCheck, 
  Store, 
  Copy, 
  Code, 
  Check, 
  RefreshCw,
  PackageCheck,
  Building2,
  Tag
} from 'lucide-react';
import Logo from './Logo';

export interface CustomerReturnPortalProps {
  onReturnSubmitted: (newReturnRecord: any) => void;
}

export default function CustomerReturnPortal({ onReturnSubmitted }: CustomerReturnPortalProps) {
  const [activeTab, setActiveTab] = useState<'customer_flow' | 'widget_embed'>('customer_flow');
  
  // Customer Flow State
  const [selectedStore, setSelectedStore] = useState<string>('shopify');
  const [orderId, setOrderId] = useState<string>('WEB-981273');
  const [email, setEmail] = useState<string>('customer@example.com');
  const [step, setStep] = useState<number>(1);
  const [selectedReason, setSelectedReason] = useState<string>('Defective / Damaged');
  const [userNotes, setUserNotes] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string>('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80');
  const [isAiScanning, setIsAiScanning] = useState<boolean>(false);
  const [aiScanResult, setAiScanResult] = useState<{ matchScore: number; status: 'verified' | 'flagged' } | null>(null);
  const [generatedReturnRecord, setGeneratedReturnRecord] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Sample order catalog data per store
  const storeOrders: Record<string, { orderId: string; storeName: string; item: string; price: string; image: string }> = {
    shopify: {
      orderId: 'WEB-981273',
      storeName: 'Acme Luxury Fashion (Shopify Storefront)',
      item: 'Keychron Q1 Pro Mechanical Keyboard',
      price: '$199.00',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    },
    amazon: {
      orderId: '408-9821948-1102934',
      storeName: 'Amazon Merchant Storefront (FBA)',
      item: 'Apple Watch Ultra 2 (Titanium 49mm)',
      price: '$799.00',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
    },
    flipkart: {
      orderId: 'OD309281928371192',
      storeName: 'TechZone Electronics (Flipkart API)',
      item: 'Samsung Galaxy S24 Ultra (512GB)',
      price: '$1,299.00',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
    },
    woocommerce: {
      orderId: 'WOO-88190',
      storeName: 'AudioHub Store (WooCommerce Store)',
      item: 'Sony WH-1000XM5 Noise Cancelling Headset',
      price: '$399.00',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    },
  };

  const currentOrder = storeOrders[selectedStore] || storeOrders.shopify;

  const handleLookupOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleRunAiScan = async () => {
    setIsAiScanning(true);
    setAiScanResult(null);

    try {
      await fetch('/api/verify-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: currentOrder.item,
          reason: selectedReason,
          platform: selectedStore,
        }),
      });
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setIsAiScanning(false);
      setAiScanResult({ matchScore: 94, status: 'verified' });
    }, 1200);
  };

  const handleSubmitReturn = async () => {
    try {
      const payload = {
        customerName: 'Verified Customer Session',
        productName: currentOrder.item,
        category: 'Electronics',
        platform: selectedStore === 'shopify' ? 'direct' : selectedStore,
        marketplaceOrderId: orderId || currentOrder.orderId,
        reason: selectedReason,
        image: uploadedImage,
        fraudRisk: aiScanResult?.status === 'flagged' ? 88 : 14,
        routing: selectedStore === 'amazon' ? 'Refurbish Center Hub B' : 'Restock WH-1',
      };

      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setGeneratedReturnRecord(json.data);
        onReturnSubmitted(json.data);
        setStep(4);
      }
    } catch (err) {
      console.error('Failed submitting customer return:', err);
    }
  };

  const embedScriptCode = `<script 
  src="https://cdn.reverselogistics.ai/v1/widget.js" 
  data-store-id="STORE-KEY-99821" 
  data-theme="orange"
  async
></script>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full space-y-6 bg-[#FFFBF7]">
      
      {/* Top Header Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-orange-100 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FC8019]">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Customer Return Experience Portal</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Test end-customer return submissions & manage merchant storefront embeds</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-orange-50/80 p-1 rounded-xl border border-orange-200 text-xs">
          <button
            onClick={() => setActiveTab('customer_flow')}
            className={`px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer ${
              activeTab === 'customer_flow'
                ? 'bg-[#FC8019] text-white shadow-orange-glow'
                : 'text-slate-700 hover:text-[#FC8019]'
            }`}
          >
            📱 Customer POV Experience
          </button>
          <button
            onClick={() => setActiveTab('widget_embed')}
            className={`px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer ${
              activeTab === 'widget_embed'
                ? 'bg-[#FC8019] text-white shadow-orange-glow'
                : 'text-slate-700 hover:text-[#FC8019]'
            }`}
          >
            ⚙️ Merchant Embed Builder
          </button>
        </div>
      </div>

      {activeTab === 'customer_flow' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Responsive Phone Frame (POV) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[380px] bg-white rounded-[36px] border-[6px] border-slate-900 shadow-xl p-4 flex flex-col relative overflow-hidden ring-1 ring-slate-200">
              
              {/* Phone Speaker Notch */}
              <div className="w-28 h-4 bg-slate-900 rounded-full mx-auto mb-3 flex items-center justify-between px-3">
                <div className="w-2 h-2 rounded-full bg-slate-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#FC8019] animate-pulse" />
              </div>

              {/* Portal Header */}
              <div className="pb-3 mb-3 border-b border-orange-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Logo size="sm" iconOnly />
                  <div>
                    <div className="text-xs font-black text-slate-900">Easy Returns</div>
                    <div className="text-[9px] text-slate-500 font-bold">Step {step} of 4</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-orange-50 text-[#FC8019] font-extrabold text-[9px] border border-orange-200">
                  {currentOrder.storeName.split(' ')[0]} Store
                </span>
              </div>

              {/* STEP 1: ORDER LOOKUP */}
              {step === 1 && (
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="text-center pt-1">
                      <h3 className="text-sm font-black text-slate-900">Initiate Item Return</h3>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">Enter your order details to start your hassle-free return</p>
                    </div>

                    <form onSubmit={handleLookupOrder} className="space-y-3 pt-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 uppercase">Select Connected Store:</label>
                        <select
                          value={selectedStore}
                          onChange={(e) => {
                            setSelectedStore(e.target.value);
                            setOrderId(storeOrders[e.target.value]?.orderId || 'WEB-981273');
                          }}
                          className="w-full mt-1 p-2 rounded-xl bg-orange-50/50 border border-orange-200 text-xs font-bold text-slate-900 outline-none focus:border-[#FC8019]"
                        >
                          <option value="shopify">Shopify Store (Acme Fashion)</option>
                          <option value="amazon">Amazon Merchant Store (FBA)</option>
                          <option value="flipkart">Flipkart Store (TechZone)</option>
                          <option value="woocommerce">WooCommerce Storefront</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-700 uppercase">Order ID Number:</label>
                        <input
                          type="text"
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                          className="w-full mt-1 p-2 rounded-xl bg-orange-50/50 border border-orange-200 text-xs font-bold text-slate-900 outline-none focus:border-[#FC8019]"
                          placeholder="e.g. WEB-981273"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-700 uppercase">Email or Mobile Number:</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full mt-1 p-2 rounded-xl bg-orange-50/50 border border-orange-200 text-xs font-bold text-slate-900 outline-none focus:border-[#FC8019]"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#FC8019] hover:bg-[#E56F0D] text-white rounded-xl font-black text-xs shadow-orange-glow transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                      >
                        Lookup Purchased Order &rarr;
                      </button>
                    </form>
                  </div>

                  <div className="p-2.5 rounded-xl bg-orange-50/60 border border-orange-200 text-[10px] text-slate-600 text-center font-bold">
                    🔒 Secured by ReverseLogistics.AI Real-Time Fraud Engine
                  </div>
                </div>
              )}

              {/* STEP 2: SELECT ITEMS & REASON */}
              {step === 2 && (
                <div className="space-y-4 flex-1 flex flex-col justify-between text-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <button onClick={() => setStep(1)} className="text-[10px] text-[#FC8019] hover:underline font-bold flex items-center gap-1 cursor-pointer">
                        <ArrowLeft className="w-3 h-3" /> Back
                      </button>
                      <span className="text-[10px] font-bold text-slate-500">Order: {currentOrder.orderId}</span>
                    </div>

                    <div className="p-3 bg-orange-50/50 rounded-2xl border border-orange-200 flex gap-3 items-center">
                      <img src={currentOrder.image} alt="Product" className="w-14 h-14 rounded-xl object-cover border border-orange-200 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">{currentOrder.item}</div>
                        <div className="text-[11px] text-[#FC8019] font-black mt-0.5">{currentOrder.price}</div>
                        <div className="text-[9px] text-slate-500 font-medium">Eligible for return (30 days window)</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-700 uppercase">Reason for Return:</label>
                      <select
                        value={selectedReason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="w-full p-2 rounded-xl bg-orange-50/50 border border-orange-200 text-xs font-bold text-slate-900"
                      >
                        <option value="Defective / Damaged">Defective / Damaged Item</option>
                        <option value="Wrong Item Received">Received Wrong Item / Empty Box</option>
                        <option value="Size / Model Mismatch">Size / Model Mismatch</option>
                        <option value="No Longer Needed">No Longer Needed / Changed Mind</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-700 uppercase">Additional Comments:</label>
                      <textarea
                        value={userNotes}
                        onChange={(e) => setUserNotes(e.target.value)}
                        rows={2}
                        placeholder="Describe issue (e.g. Left earpiece produces statics)..."
                        className="w-full p-2 rounded-xl bg-orange-50/50 border border-orange-200 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(3)}
                    className="w-full py-2.5 bg-[#FC8019] hover:bg-[#E56F0D] text-white rounded-xl font-black text-xs shadow-orange-glow transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Proceed to AI Vision Scan &rarr;
                  </button>
                </div>
              )}

              {/* STEP 3: AI VISION SCAN */}
              {step === 3 && (
                <div className="space-y-4 flex-1 flex flex-col justify-between text-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <button onClick={() => setStep(2)} className="text-[10px] text-[#FC8019] hover:underline font-bold flex items-center gap-1 cursor-pointer">
                        <ArrowLeft className="w-3 h-3" /> Back
                      </button>
                      <span className="text-[10px] font-bold text-[#FC8019] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Vision Active
                      </span>
                    </div>

                    <div className="text-center">
                      <h4 className="font-bold text-slate-900">Upload / Take Product Photo</h4>
                      <p className="text-[10px] text-slate-500">Neural Vision compares serial number, tags, and item condition</p>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-orange-300 bg-slate-900 text-white h-44 flex items-center justify-center">
                      <img src={uploadedImage} alt="Return Scan" className="w-full h-full object-cover opacity-80" />
                      
                      {isAiScanning && (
                        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                          <RefreshCw className="w-6 h-6 text-[#FC8019] animate-spin" />
                          <span className="text-xs font-bold text-orange-200">Scanning Serial & Tag Integrity...</span>
                        </div>
                      )}

                      {!isAiScanning && !aiScanResult && (
                        <button
                          onClick={handleRunAiScan}
                          className="absolute inset-0 bg-slate-950/50 hover:bg-slate-950/40 flex flex-col items-center justify-center text-white transition cursor-pointer"
                        >
                          <Camera className="w-8 h-8 text-[#FC8019] mb-1" />
                          <span className="text-xs font-bold">Click to Run AI Vision Scan</span>
                        </button>
                      )}

                      {aiScanResult && (
                        <div className="absolute bottom-2 left-2 right-2 p-2 bg-[#FC8019] backdrop-blur-md rounded-xl text-white text-center font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-orange-glow">
                          <CheckCircle2 className="w-4 h-4" /> AI Verified ({aiScanResult.matchScore}% Match Confidence)
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitReturn}
                    disabled={!aiScanResult}
                    className={`w-full py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
                      aiScanResult
                        ? 'bg-[#FC8019] hover:bg-[#E56F0D] text-white shadow-orange-glow cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Submit Return & Generate Label &rarr;
                  </button>
                </div>
              )}

              {/* STEP 4: GENERATED QR RETURN LABEL */}
              {step === 4 && (
                <div className="space-y-4 flex-1 flex flex-col justify-between text-xs">
                  <div className="space-y-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-orange-100 border border-orange-300 text-[#FC8019] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Return Authorized!</h4>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">Tracking ID: {generatedReturnRecord?.lpnOrTrackId || 'LPNIN982104'}</p>
                    </div>

                    <div className="p-4 bg-orange-50 border border-orange-200 text-slate-900 rounded-2xl space-y-2">
                      <div className="text-[10px] text-[#FC8019] uppercase font-black tracking-wider">Drop-off Return Label QR</div>
                      <div className="bg-white p-2 rounded-xl w-32 h-32 mx-auto flex items-center justify-center border border-orange-200">
                        <QrCode className="w-28 h-28 text-slate-900" />
                      </div>
                      <div className="text-[10px] text-slate-700 font-mono font-bold">
                        DESTINATION: {generatedReturnRecord?.routing || 'Restock WH-1'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setStep(1);
                      setAiScanResult(null);
                    }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    Test Another Customer Return
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Portal Context */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-[#FC8019]" />
                How the Customer Return Experience Works
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                When merchants integrate <strong>ReverseLogistics.AI</strong> into their e-commerce storefront (Shopify, Amazon SP-API, Flipkart, or WooCommerce), end-customers use this return portal to initiate returns cleanly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200 space-y-1.5">
                  <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#FC8019]" /> Pre-Shipment AI Verification
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    Customers take photo of the item prior to drop-off. Neural models analyze tags, serial numbers, and physical condition.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200 space-y-1.5">
                  <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-emerald-600" /> Automated Smart Routing
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    Legitimate returns are routed directly to local fulfillment centers for instant restock, while high-risk returns are quarantined.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* MERCHANT STOREFRONT EMBED BUILDER TAB */
        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Code className="w-5 h-5 text-[#FC8019]" />
              Storefront Return Widget Embed Code
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Copy and paste this script tag into your Shopify, WooCommerce, or HTML site theme</p>
          </div>

          <div className="relative bg-slate-950 p-4 rounded-xl text-orange-300 font-mono text-xs overflow-x-auto border border-slate-800">
            <button
              onClick={copyEmbedCode}
              className="absolute top-3 right-3 px-3 py-1.5 bg-[#FC8019] hover:bg-[#E56F0D] text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-orange-glow"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied Snippet!' : 'Copy Code'}</span>
            </button>
            <pre>{embedScriptCode}</pre>
          </div>
        </div>
      )}

    </div>
  );
}
