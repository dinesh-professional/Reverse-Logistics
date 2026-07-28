'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  Ban, 
  CheckCircle2, 
  FileText, 
  Scan,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { ReturnRecord } from './AdminDashboard';
import { generateSellerClaimDocument, ClaimDocument } from '../lib/platformIntegrations';

interface FraudInspectionModalProps {
  record: ReturnRecord | null;
  onClose: () => void;
  onDecision: (id: string, action: 'reject' | 'approve' | 'audit' | 'file_claim', routing?: string, claimDetails?: { claimStatus: ReturnRecord['claimStatus']; claimId: string }) => void;
}

export default function FraudInspectionModal({
  record,
  onClose,
  onDecision
}: FraudInspectionModalProps) {
  const [showClaimDoc, setShowClaimDoc] = useState(false);
  const [copiedClaim, setCopiedClaim] = useState(false);

  if (!record) return null;

  const claimDoc: ClaimDocument = generateSellerClaimDocument(record);

  const handleCopyClaim = () => {
    navigator.clipboard.writeText(claimDoc.formalNoticeText);
    setCopiedClaim(true);
    setTimeout(() => setCopiedClaim(false), 2000);
  };

  const handleGenerateAndSubmitClaim = () => {
    onDecision(record.id, 'file_claim', undefined, {
      claimStatus: claimDoc.claimType === 'Amazon SAFE-T Claim' ? 'SAFE-T Drafted' :
                   claimDoc.claimType === 'Flipkart SPF Claim' ? 'SPF Claimed' : 'Meesho Dispute Active',
      claimId: claimDoc.claimId,
    });
    setShowClaimDoc(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      
      {/* Modal Dialog Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl border border-orange-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900">
        
        {/* Modal Top Bar */}
        <div className="bg-orange-50/50 px-6 py-4 border-b border-orange-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-[#E23744] shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-black text-slate-900">AI Fraud Discrepancy & Seller Claim Inspection</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-100 text-[#E23744] border border-red-200 whitespace-nowrap">
                  ID: {record.id}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#FC8019] text-white uppercase whitespace-nowrap">
                  {record.platform}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Customer: {record.customerName} • Order ID: {record.marketplaceOrderId} • Track/LPN: {record.lpnOrTrackId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-xl bg-white text-slate-500 hover:text-slate-900 hover:bg-orange-100 border border-orange-200 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs bg-[#FFFBF7]">
          
          {/* Alert Reason Banner */}
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#E23744] shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-extrabold text-red-900 text-sm flex flex-wrap items-center justify-between gap-2">
                <span>Primary Fraud Alert Identified by Multi-Platform Vision AI</span>
                <span className="text-xs font-mono font-bold text-[#E23744] bg-red-100 px-2 py-0.5 rounded border border-red-200">
                  Risk Score: {record.riskScore}/100
                </span>
              </h4>
              <p className="text-red-800 mt-1 leading-relaxed font-medium">
                {record.fraudReason || 'Mismatched Serial Number & Weight Deficit detected during customer scan.'}
              </p>

              {/* Platform Specific Risk Signals */}
              {record.platformRiskFactors && record.platformRiskFactors.length > 0 && (
                <div className="mt-3 pt-3 border-t border-red-200/80 space-y-1">
                  <span className="font-bold text-red-950 text-[11px] block uppercase tracking-wider">
                    {record.platform.toUpperCase()} AUDIT EVIDENCE SIGNALS:
                  </span>
                  <ul className="list-disc list-inside text-red-900 space-y-0.5 font-medium">
                    {record.platformRiskFactors.map((factor, idx) => (
                      <li key={idx}>{factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Visual Product Image Inspection Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Catalog Master Image */}
            <div className="bg-white p-4 rounded-2xl border border-orange-200 space-y-2">
              <div className="flex items-center justify-between text-slate-700 font-bold">
                <span className="flex items-center gap-1.5 text-xs text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Catalog Warehouse Master Image
                </span>
                <span className="text-[10px] text-slate-400 font-mono">ORIGINAL CATALOG</span>
              </div>
              <div className="h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <img src={record.expectedImage} alt="Expected Product" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Customer Return Scan Image */}
            <div className="bg-white p-4 rounded-2xl border border-red-200 space-y-2">
              <div className="flex items-center justify-between text-slate-700 font-bold">
                <span className="flex items-center gap-1.5 text-xs text-[#E23744]">
                  <Scan className="w-4 h-4 text-[#E23744]" /> Customer Scan / Courier QC Photo
                </span>
                <span className="text-[10px] text-[#E23744] font-mono font-bold">SUSPECTED SWAP</span>
              </div>
              <div className="h-48 rounded-xl overflow-hidden bg-slate-100 border border-red-200 relative">
                <img src={record.scannedImage} alt="Scanned Return" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 right-2 bg-red-900/90 text-white p-2 rounded-lg text-[10px] font-mono font-bold text-center">
                  ⚠️ SERIAL SCAN MISMATCH: 42% Visual Match Score
                </div>
              </div>
            </div>

          </div>

          {/* Seller Protection Claim Section */}
          {showClaimDoc && (
            <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#FC8019]" />
                  {claimDoc.claimType} Legal Audit Evidence Record
                </h4>
                <button
                  onClick={handleCopyClaim}
                  className="px-3 py-1 bg-white hover:bg-orange-100 border border-orange-200 text-[#FC8019] rounded-lg font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedClaim ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedClaim ? 'Copied Notice!' : 'Copy Notice Text'}</span>
                </button>
              </div>

              <pre className="p-3 bg-white border border-orange-200 rounded-xl font-mono text-[11px] text-slate-800 whitespace-pre-wrap">
                {claimDoc.formalNoticeText}
              </pre>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-white px-6 py-4 border-t border-orange-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateAndSubmitClaim}
              className="px-4 py-2 rounded-xl bg-[#FC8019] hover:bg-[#E56F0D] text-white font-extrabold text-xs shadow-orange-glow transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              File {record.platform.toUpperCase()} Seller Protection Claim
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onDecision(record.id, 'reject', 'Fraud Vault');
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-[#E23744] hover:bg-[#C92A36] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Ban className="w-4 h-4" />
              Reject & Move to Fraud Vault
            </button>

            <button
              onClick={() => {
                onDecision(record.id, 'approve', 'Restock WH-1');
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Clear & Restock
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
