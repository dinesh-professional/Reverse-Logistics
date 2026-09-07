'use client';

import React, { useState } from 'react';
import { Smartphone, CheckCircle2, Camera, Sparkles, QrCode, ArrowLeft, ShieldCheck, Store, Copy, Code, Check, RefreshCw, PackageCheck } from 'lucide-react';
import Logo from './Logo';

export interface CustomerReturnPortalProps {
  onReturnSubmitted: (newReturnRecord: any) => void;
}

export default function CustomerReturnPortal({ onReturnSubmitted }: CustomerReturnPortalProps) {
  const [activeTab, setActiveTab] = useState<'customer_flow' | 'widget_embed'>('customer_flow');
  const [selectedStore, setSelectedStore] = useState<string>('shopify');
  const [orderId, setOrderId] = useState<string>('WEB-981273');
  const [email, setEmail] = useState<string>('customer@example.com');
  const [step, setStep] = useState<number>(1);
  const [selectedReason, setSelectedReason] = useState<string>('Defective / Damaged');
  const [userNotes, setUserNotes] = useState<string>('');
  const [uploadedImage] = useState<string>('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80');
  const [isAiScanning, setIsAiScanning] = useState<boolean>(false);
  const [aiScanResult, setAiScanResult] = useState<{ matchScore: number; status: 'verified' | 'flagged' } | null>(null);
  const [generatedReturnRecord, setGeneratedReturnRecord] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const storeOrders: Record<string, { orderId: string; storeName: string; item: string; price: string; image: string }> = {
    shopify: { orderId: 'WEB-981273', storeName: 'Acme Luxury Fashion (Shopify)', item: 'Keychron Q1 Pro Mechanical Keyboard', price: '$199.00', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80' },
    amazon: { orderId: '408-9821948-1102934', storeName: 'Amazon Merchant (FBA)', item: 'Apple Watch Ultra 2 (Titanium 49mm)', price: '$799.00', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80' },
    flipkart: { orderId: 'OD309281928371192', storeName: 'TechZone Electronics (Flipkart)', item: 'Samsung Galaxy S24 Ultra (512GB)', price: '$1,299.00', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80' },
    woocommerce: { orderId: 'WOO-88190', storeName: 'AudioHub (WooCommerce)', item: 'Sony WH-1000XM5 Headset', price: '$399.00', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
  };

  const currentOrder = storeOrders[selectedStore] || storeOrders.shopify;

  const handleLookupOrder = (e: React.FormEvent) => { e.preventDefault(); setStep(2); };

  const handleRunAiScan = async () => {
    setIsAiScanning(true);
    setAiScanResult(null);
    try { await fetch('/api/verify-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: currentOrder.item, reason: selectedReason, platform: selectedStore }) }); } catch (err) { console.error(err); }
    setTimeout(() => { setIsAiScanning(false); setAiScanResult({ matchScore: 94, status: 'verified' }); }, 1200);
  };

  const handleSubmitReturn = async () => {
    try {
      const payload = { customerName: 'Verified Customer Session', productName: currentOrder.item, category: 'Electronics', platform: selectedStore === 'shopify' ? 'direct' : selectedStore, marketplaceOrderId: orderId || currentOrder.orderId, reason: selectedReason, image: uploadedImage, fraudRisk: aiScanResult?.status === 'flagged' ? 88 : 14, routing: selectedStore === 'amazon' ? 'Refurbish Center Hub B' : 'Restock WH-1' };
      const res = await fetch('/api/returns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (json.success) { setGeneratedReturnRecord(json.data); onReturnSubmitted(json.data); setStep(4); }
    } catch (err) { console.error('Failed submitting customer return:', err); }
  };

  const embedScriptCode = `<script src="https://cdn.reverselogistics.ai/v1/widget.js" data-store-id="STORE-KEY-99821" data-theme="purple" async></script>`;
  const copyEmbedCode = () => { navigator.clipboard.writeText(embedScriptCode); setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); };

  return (
    <div className="w-full space-y-6">
      
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111119] p-4 rounded-2xl border border-purple-500/10 shadow-glass shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center text-purple-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-100">Customer Return Experience Portal</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Test end-customer return submissions & manage merchant storefront embeds</p>
          </div>
        </div>
        <div className="flex items-center bg-purple-500/5 p-1 rounded-xl border border-purple-500/10 text-xs">
          <button onClick={() => setActiveTab('customer_flow')} className={`px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer ${activeTab === 'customer_flow' ? 'bg-purple-600 text-white shadow-purple-glow' : 'text-slate-400 hover:text-purple-400'}`}>Customer POV Experience</button>
          <button onClick={() => setActiveTab('widget_embed')} className={`px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer ${activeTab === 'widget_embed' ? 'bg-purple-600 text-white shadow-purple-glow' : 'text-slate-400 hover:text-purple-400'}`}>Merchant Embed Builder</button>
        </div>
      </div>

      {activeTab === 'customer_flow' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[380px] bg-[#111119] rounded-[36px] border-[6px] border-slate-800 shadow-xl p-4 flex flex-col relative overflow-hidden ring-1 ring-purple-500/10">
              
              <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-between px-3">
                <div className="w-2 h-2 rounded-full bg-slate-700" />
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              </div>

              <div className="pb-3 mb-3 border-b border-purple-500/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Logo size="sm" iconOnly />
                  <div>
                    <div className="text-xs font-black text-slate-100">Easy Returns</div>
                    <div className="text-[9px] text-slate-500 font-bold">Step {step} of 4</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-extrabold text-[9px] border border-purple-500/15">{currentOrder.storeName.split(' ')[0]} Store</span>
              </div>

              {step === 1 && (
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="text-center pt-1">
                      <h3 className="text-sm font-black text-slate-100">Initiate Item Return</h3>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">Enter your order details to start your return</p>
                    </div>
                    <form onSubmit={handleLookupOrder} className="space-y-3 pt-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Select Connected Store:</label>
                        <select value={selectedStore} onChange={(e) => { setSelectedStore(e.target.value); setOrderId(storeOrders[e.target.value]?.orderId || 'WEB-981273'); }} className="w-full mt-1 p-2 rounded-xl bg-purple-500/5 border border-purple-500/15 text-xs font-bold text-slate-200 outline-none focus:border-purple-500">
                          <option value="shopify">Shopify Store (Acme Fashion)</option>
                          <option value="amazon">Amazon Merchant Store (FBA)</option>
                          <option value="flipkart">Flipkart Store (TechZone)</option>
                          <option value="woocommerce">WooCommerce Storefront</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Order ID Number:</label>
                        <input type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-purple-500/5 border border-purple-500/15 text-xs font-bold text-slate-200 outline-none focus:border-purple-500" placeholder="e.g. WEB-981273" required />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Email or Mobile Number:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-purple-500/5 border border-purple-500/15 text-xs font-bold text-slate-200 outline-none focus:border-purple-500" required />
                      </div>
                      <button type="submit" className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-xs shadow-purple-glow transition flex items-center justify-center gap-1.5 cursor-pointer mt-2">Lookup Purchased Order &rarr;</button>
                    </form>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-[10px] text-slate-400 text-center font-bold">Secured by ReverseLogistics.AI Real-Time Fraud Engine</div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 flex-1 flex flex-col justify-between text-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <button onClick={() => setStep(1)} className="text-[10px] text-purple-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"><ArrowLeft className="w-3 h-3" /> Back</button>
                      <span className="text-[10px] font-bold text-slate-500">Order: {currentOrder.orderId}</span>
                    </div>
                    <div className="p-3 bg-purple-500/5 rounded-2xl border border-purple-500/10 flex gap-3 items-center">
                      <img src={currentOrder.image} alt="Product" className="w-14 h-14 rounded-xl object-cover border border-purple-500/10 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-200 leading-tight">{currentOrder.item}</div>
                        <div className="text-[11px] text-purple-400 font-black mt-0.5">{currentOrder.price}</div>
                        <div className="text-[9px] text-slate-500 font-medium">Eligible for return (30 days)</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Reason for Return:</label>
                      <select value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)} className="w-full p-2 rounded-xl bg-purple-500/5 border border-purple-500/15 text-xs font-bold text-slate-200">
                        <option value="Defective / Damaged">Defective / Damaged Item</option>
                        <option value="Wrong Item Received">Received Wrong Item</option>
                        <option value="Size / Model Mismatch">Size / Model Mismatch</option>
                        <option value="No Longer Needed">No Longer Needed</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Additional Comments:</label>
                      <textarea value={userNotes} onChange={(e) => setUserNotes(e.target.value)} rows={2} placeholder="Describe issue..." className="w-full p-2 rounded-xl bg-purple-500/5 border border-purple-500/15 text-xs text-slate-200" />
                    </div>
                  </div>
                  <button onClick={() => setStep(3)} className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-xs shadow-purple-glow transition flex items-center justify-center gap-1.5 cursor-pointer">Proceed to AI Vision Scan &rarr;</button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 flex-1 flex flex-col justify-between text-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <button onClick={() => setStep(2)} className="text-[10px] text-purple-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"><ArrowLeft className="w-3 h-3" /> Back</button>
                      <span className="text-[10px] font-bold text-purple-400 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Vision Active</span>
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-slate-100">Upload / Take Product Photo</h4>
                      <p className="text-[10px] text-slate-500">Neural Vision compares serial, tags, and condition</p>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-purple-500/30 bg-slate-900 text-white h-44 flex items-center justify-center">
                      <img src={uploadedImage} alt="Return Scan" className="w-full h-full object-cover opacity-80" />
                      {isAiScanning && (
                        <div className="absolute inset-0 bg-[#08080F]/80 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                          <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
                          <span className="text-xs font-bold text-purple-200">Scanning Serial & Tag Integrity...</span>
                        </div>
                      )}
                      {!isAiScanning && !aiScanResult && (
                        <button onClick={handleRunAiScan} className="absolute inset-0 bg-[#08080F]/50 hover:bg-[#08080F]/40 flex flex-col items-center justify-center text-white transition cursor-pointer">
                          <Camera className="w-8 h-8 text-purple-400 mb-1" />
                          <span className="text-xs font-bold">Click to Run AI Vision Scan</span>
                        </button>
                      )}
                      {aiScanResult && (
                        <div className="absolute bottom-2 left-2 right-2 p-2 bg-purple-600 backdrop-blur-md rounded-xl text-white text-center font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-purple-glow">
                          <CheckCircle2 className="w-4 h-4" /> AI Verified ({aiScanResult.matchScore}% Match)
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={handleSubmitReturn} disabled={!aiScanResult} className={`w-full py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 ${aiScanResult ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-glow cursor-pointer' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>Submit Return & Generate Label &rarr;</button>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 flex-1 flex flex-col justify-between text-xs">
                  <div className="space-y-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto"><CheckCircle2 className="w-7 h-7" /></div>
                    <div>
                      <h4 className="text-sm font-black text-slate-100">Return Authorized!</h4>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">Tracking ID: {generatedReturnRecord?.lpnOrTrackId || 'LPNIN982104'}</p>
                    </div>
                    <div className="p-4 bg-purple-500/5 border border-purple-500/10 text-slate-200 rounded-2xl space-y-2">
                      <div className="text-[10px] text-purple-400 uppercase font-black tracking-wider">Drop-off Return Label QR</div>
                      <div className="bg-[#111119] p-2 rounded-xl w-32 h-32 mx-auto flex items-center justify-center border border-purple-500/10">
                        <QrCode className="w-28 h-28 text-slate-300" />
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono font-bold">DESTINATION: {generatedReturnRecord?.routing || 'Restock WH-1'}</div>
                    </div>
                  </div>
                  <button onClick={() => { setStep(1); setAiScanResult(null); }} className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition cursor-pointer">Test Another Customer Return</button>
                </div>
              )}

            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#111119] p-6 rounded-2xl border border-purple-500/10 shadow-glass space-y-4">
              <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                <Store className="w-5 h-5 text-purple-400" />
                How the Customer Return Experience Works
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                When merchants integrate <strong className="text-slate-200">ReverseLogistics.AI</strong> into their e-commerce storefront, end-customers use this return portal to initiate returns cleanly.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 space-y-1.5">
                  <div className="font-extrabold text-slate-200 text-xs flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-purple-400" /> Pre-Shipment AI Verification</div>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Customers take photo of the item. Neural models analyze tags, serial numbers, and physical condition.</p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 space-y-1.5">
                  <div className="font-extrabold text-slate-200 text-xs flex items-center gap-1.5"><PackageCheck className="w-4 h-4 text-emerald-400" /> Automated Smart Routing</div>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Legitimate returns are routed to fulfillment centers for instant restock, while high-risk returns are quarantined.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#111119] p-6 rounded-2xl border border-purple-500/10 shadow-glass space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-100 flex items-center gap-2"><Code className="w-5 h-5 text-purple-400" /> Storefront Return Widget Embed Code</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Copy and paste this script tag into your Shopify, WooCommerce, or HTML site theme</p>
          </div>
          <div className="relative bg-slate-900 p-4 rounded-xl text-purple-300 font-mono text-xs overflow-x-auto border border-purple-500/10">
            <button onClick={copyEmbedCode} className="absolute top-3 right-3 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-purple-glow">
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