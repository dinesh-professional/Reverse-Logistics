'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ArrowLeft, 
  RefreshCw, 
  Sparkles, 
  HelpCircle, 
  Scan
} from 'lucide-react';
import Logo from './Logo';

export interface ReturnItem {
  id: string;
  name: string;
  price: string;
  image: string;
  reason: string;
  status: 'pending_scan' | 'scanning' | 'verified' | 'flagged';
  fraudRisk: number;
  platform?: 'amazon' | 'flipkart' | 'meesho' | 'direct';
}

interface CustomerMobileAppProps {
  onReturnSubmitted?: (item: ReturnItem) => void;
}

export default function CustomerMobileApp({ onReturnSubmitted }: CustomerMobileAppProps) {
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [selectedPlatform, setSelectedPlatform] = useState<'amazon' | 'flipkart' | 'meesho' | 'direct'>('amazon');
  const [scanStep, setScanStep] = useState<number>(1);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [activeAngle, setActiveAngle] = useState<number>(1);

  const mockProducts = [
    {
      id: 'RT-994',
      name: 'Sony WH-1000XM5 ANC Headset',
      price: '₹24,990',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      reason: 'Defective audio in left cup',
    },
    {
      id: 'RT-995',
      name: 'Apple Watch Ultra 2 Titanium',
      price: '₹89,900',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80',
      reason: 'Changed my mind',
    },
    {
      id: 'RT-996',
      name: 'Logitech MX Master 3S Mouse',
      price: '₹9,995',
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80',
      reason: 'Wrong color received',
    }
  ];

  const handleStartScan = () => {
    setScanStep(2);
  };

  const handleSimulateAIScan = async () => {
    setIsScanning(true);
    try {
      // Call AI verification API route
      await fetch('/api/verify-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: mockProducts[selectedProduct].id,
          angleStep: activeAngle,
          platform: selectedPlatform,
        }),
      });

      if (activeAngle < 3) {
        setActiveAngle(prev => prev + 1);
        setIsScanning(false);
      } else {
        setIsScanning(false);
        setScanStep(3);

        const currentProd = mockProducts[selectedProduct];
        if (onReturnSubmitted) {
          onReturnSubmitted({
            id: currentProd.id,
            name: currentProd.name,
            price: currentProd.price,
            image: currentProd.image,
            reason: currentProd.reason,
            status: 'verified',
            fraudRisk: 14,
            platform: selectedPlatform,
          });
        }
      }
    } catch (err) {
      console.error('Error during AI Vision verification API call:', err);
      setIsScanning(false);
    }
  };

  const resetFlow = () => {
    setScanStep(1);
    setActiveAngle(1);
    setIsScanning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full relative">
      {/* Mobile Device Frame Container (Sleek White Device) */}
      <div className="w-[360px] h-[740px] bg-white rounded-[44px] p-3 shadow-2xl border-[7px] border-slate-300 flex flex-col relative overflow-hidden ring-1 ring-slate-200">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-full z-50 flex items-center justify-between px-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
          <div className="w-2 h-2 rounded-full bg-[#FC8019] animate-pulse" />
        </div>

        {/* Mobile App Header */}
        <div className="bg-white pt-7 pb-3 px-4 border-b border-slate-100 flex items-center justify-between z-40 shrink-0">
          <div className="flex items-center gap-2">
            {scanStep > 1 && (
              <button onClick={() => setScanStep(scanStep - 1)} className="p-1 text-slate-500 hover:text-slate-900 rounded-lg">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-1.5">
              <Logo size="sm" iconOnly />
              <div>
                <h2 className="text-xs font-extrabold text-slate-900 leading-tight">
                  Easy Returns
                </h2>
                <p className="text-[9px] text-slate-500 font-medium">Step {scanStep} of 3</p>
              </div>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-700">
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile App Main Body */}
        <div className="flex-1 overflow-y-auto p-3.5 bg-slate-50 space-y-3 relative text-xs">
          
          {/* Step 1: Select Item & Marketplace Platform */}
          {scanStep === 1 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3 bg-orange-50/80 rounded-2xl border border-orange-200">
                <div className="flex items-center gap-2 text-[#FC8019] font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#FC8019]" />
                  <span>Instant Multi-Platform AI Refund</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Select your purchase marketplace (Amazon, Flipkart, or Meesho) and scan 3 photo angles.
                </p>
              </div>

              {/* Platform Selector Tabs */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Marketplace Order Source:</span>
                <div className="grid grid-cols-3 gap-1 bg-slate-200 p-1 rounded-xl font-bold text-[10px]">
                  <button
                    onClick={() => setSelectedPlatform('amazon')}
                    className={`py-1 rounded-lg transition ${selectedPlatform === 'amazon' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600'}`}
                  >
                    Amazon
                  </button>
                  <button
                    onClick={() => setSelectedPlatform('flipkart')}
                    className={`py-1 rounded-lg transition ${selectedPlatform === 'flipkart' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'}`}
                  >
                    Flipkart
                  </button>
                  <button
                    onClick={() => setSelectedPlatform('meesho')}
                    className={`py-1 rounded-lg transition ${selectedPlatform === 'meesho' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-600'}`}
                  >
                    Meesho
                  </button>
                </div>
              </div>

              <div className="text-[11px] font-bold text-slate-500 px-1 uppercase tracking-wider pt-1">
                Select Item to Return
              </div>

              {mockProducts.map((prod, idx) => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 flex gap-3 items-center ${
                    selectedProduct === idx
                      ? 'bg-white border-[#FC8019] shadow-orange-glow'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={prod.image} alt={prod.name} className="w-14 h-14 object-cover rounded-lg bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 truncate text-xs">{prod.name}</h3>
                    <p className="text-[11px] text-[#FC8019] font-extrabold mt-0.5">{prod.price}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-1">Reason: {prod.reason}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedProduct === idx ? 'border-[#FC8019] bg-[#FC8019]' : 'border-slate-300'
                  }`}>
                    {selectedProduct === idx && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              ))}

              <button
                onClick={handleStartScan}
                className="w-full mt-4 py-2.5 rounded-xl bg-[#FC8019] hover:bg-[#E56F0D] text-white font-extrabold text-xs shadow-orange-glow transition-all flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Start {selectedPlatform.toUpperCase()} Photo Scan (3 Angles)
              </button>
            </div>
          )}

          {/* Step 2: Interactive Camera Scan Viewport */}
          {scanStep === 2 && (
            <div className="space-y-3 animate-fadeIn flex flex-col h-full">
              <div className="flex items-center justify-between text-slate-700 px-1 font-semibold">
                <span>Angle {activeAngle} of 3 ({selectedPlatform.toUpperCase()})</span>
                <span className="text-[10px] text-[#FC8019] bg-orange-100 px-2 py-0.5 rounded border border-orange-200 font-bold">
                  {activeAngle === 1 ? 'Front View' : activeAngle === 2 ? 'Serial Label' : 'Accessories'}
                </span>
              </div>

              {/* Camera Scanner Viewport */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-[#FC8019]/60 bg-slate-900 shadow-md group">
                <img
                  src={mockProducts[selectedProduct].image}
                  alt="Scanning product"
                  className="w-full h-full object-cover opacity-85"
                />

                {/* Radar Scan Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FC8019]/30 via-transparent to-[#60B246]/30 animate-scan-radar pointer-events-none" />

                {/* AI Target Bounding Boxes */}
                <div className="absolute inset-4 border border-dashed border-[#FC8019] rounded-xl pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between items-start text-[9px] font-mono bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded text-[#FC8019] border border-[#FC8019]/40">
                    <span>STATUS: {isScanning ? 'EXTRACTING MATRIX...' : 'LOCK ON ITEM'}</span>
                    <span>CONF: 98.6%</span>
                  </div>

                  {/* Highlight Box */}
                  <div className="w-20 h-16 border-2 border-[#60B246] rounded bg-[#60B246]/20 self-center flex items-center justify-center text-[9px] font-bold text-[#60B246] backdrop-blur-xs">
                    MATCH: OK
                  </div>

                  <div className="flex justify-between items-end text-[9px] font-mono text-white bg-slate-900/80 px-2 py-1 rounded">
                    <span>SKU: {mockProducts[selectedProduct].id}</span>
                    <span className="text-[#60B246]">OCR: VALID</span>
                  </div>
                </div>

                {isScanning && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center flex-col gap-2">
                    <RefreshCw className="w-6 h-6 text-[#FC8019] animate-spin" />
                    <span className="text-white font-bold text-[11px]">Analyzing AI Vision API...</span>
                  </div>
                )}
              </div>

              {/* Angle Selector Dots */}
              <div className="flex justify-center gap-2 my-1">
                {[1, 2, 3].map(step => (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeAngle >= step ? 'w-6 bg-[#FC8019]' : 'w-2 bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleSimulateAIScan}
                disabled={isScanning}
                className="w-full py-2.5 rounded-xl bg-[#FC8019] hover:bg-[#E56F0D] text-white font-extrabold text-xs shadow-orange-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Scan className="w-4 h-4" />
                {isScanning ? 'Processing Angle API...' : `Capture Angle ${activeAngle}`}
              </button>
            </div>
          )}

          {/* Step 3: Verified & Pickup Scheduled */}
          {scanStep === 3 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#60B246] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">AI Verification Passed!</h3>
                <p className="text-[11px] text-slate-600">
                  Instant refund of <span className="text-[#60B246] font-bold">{mockProducts[selectedProduct].price}</span> pre-approved on {selectedPlatform.toUpperCase()}.
                </p>
              </div>

              {/* Pickup Schedule Box */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2.5 shadow-sm">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Truck className="w-4 h-4 text-[#FC8019]" />
                  <span>{selectedPlatform.toUpperCase()} Partner Courier Pickup</span>
                </div>
                
                {/* Timeline Progress */}
                <div className="space-y-2 pl-2 border-l-2 border-slate-200">
                  <div className="relative pl-3">
                    <div className="absolute -left-[11px] top-1 w-2.5 h-2.5 rounded-full bg-[#FC8019] ring-4 ring-orange-100" />
                    <p className="font-bold text-slate-900">AI Photo Scan Approved</p>
                    <p className="text-[10px] text-slate-500">Today, 11:42 AM</p>
                  </div>
                  <div className="relative pl-3">
                    <div className="absolute -left-[11px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <p className="font-semibold text-slate-700">Logistics Executive Assigned</p>
                    <p className="text-[10px] text-slate-500">Tomorrow, 10:00 AM</p>
                  </div>
                </div>
              </div>

              <button
                onClick={resetFlow}
                className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Test Another Return
              </button>
            </div>
          )}

        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="bg-white border-t border-slate-200 px-4 py-2 flex justify-around text-slate-500 z-40 shrink-0">
          <button className="flex flex-col items-center gap-0.5 text-[#FC8019] font-bold">
            <Scan className="w-4 h-4" />
            <span className="text-[9px]">Return</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 hover:text-slate-900 font-medium">
            <Truck className="w-4 h-4" />
            <span className="text-[9px]">Pickup</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 hover:text-slate-900 font-medium">
            <Clock className="w-4 h-4" />
            <span className="text-[9px]">History</span>
          </button>
        </div>

      </div>
    </div>
  );
}

